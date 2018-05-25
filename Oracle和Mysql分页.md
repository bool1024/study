### 分页在开发中很常见，但是Oracle和MySQL的分页方法不同的。

#### MySQL：
客户端通过传递start（页码），limit（每页显示的条数）两个参数去分页查询数据库表中的数据，MySQL数据库提供了分页的函数limit m,n

查询第1条到第10条的sql语句为：`select * from table_name limit 0,10;`，对应的需求就是查询第一页的数据：`select * from table limit (1-1)*10,10;`  
查询第10条到第20条的sql语句为：`select * from table_name limit 10,20;`，对应的需求就是查询第一页的数据：`select * from table limit (2-1)*10,10;`  
查询第20条到第30条的sql语句为：`select * from table_name limit 20,30;`，对应的需求就是查询第一页的数据：`select * from table limit (3-1)*10,10;`

**通过上面的分析，可以得出分页sql格式是：`select * from table limit (start-1)*limit,limit; `其中start是页码，limit是每页显示的条数。**


#### Oracle子查询
`select * from (select A.*, rownum rn from (select * from table) A where rownum <=40) where rn >=21;`  
其中最内层的查询`select * from table`表示不进行翻页的原始查询语句。`rownum <= 40`和`rn>=21`控制分页查询的每页的范围  
上面给出的这个Oracle分页查询语句，在大多数情况下拥有较高的效率。分页的目的就是控制输出结果集大小，将结果尽快返回。在上面的分页查询语句中，这种考虑主要体现在`where rownum <= 40`这句上。  
选择第21到40条记录存在两种方法，一种是上面例子中展示的在查询的第二层通过`rownum <= 40`来控制最大值，在查询的最外层控制最小值。而另一种方式是去掉查询第二层的`where rownum <= 40`语句，在查询的最外层控制分页的最小值和最大值。查询语句如下：
```
select * from (select A.*, rownum rn from (select * from table) A) where rn between 21 and 40
```
对比这两种写法，绝大多数的情况下，第一个查询的效率比第二个高得多。  
这是由于CBO 优化模式下，Oracle可以将外层的查询条件推到内层查询中，以提高内层查询的执行效率。对于第一个查询语句，第二层的查询条件WHERE ROWNUM <= 40就可以被Oracle推入到内层查询中，这样Oracle查询的结果一旦超过了ROWNUM限制条件，就终止查询将结果返回了。  
而第二个查询语句，由于查询条件BETWEEN 21 AND 40是存在于查询的第三层，而Oracle无法将第三层的查询条件推到最内层（即使推到最内层也没有意义，因为最内层查询不知道RN代表什么）。因此，对于第二个查询语句，Oracle最内层返回给中间层的是所有满足条件的数据，而中间层返回给最外层的也是所有数据。数据的过滤在最外层完成，显然这个效率要比第一个查询低得多。  
