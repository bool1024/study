##### access：
```
select top (n) * from table;
```

##### db2:
```
select * from table fetch first n rows only;
```

##### mysql:
```
select * from table limit 10;
```

##### sql server:
```
前n条:select top (n) * from table;
后n条:select top (n) * from table order by id desc;
```

##### oracle:
```
select * from table where rownum <=n;
```
