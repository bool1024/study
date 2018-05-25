#### 日期、字符串互转
```
//字符串转日期
String dateStr = "2018-05-24";
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
try{
    Date parse = format.parse(dateStr);
}catch (ParseException e){
     e.printStackTrace();
}
//日期转字符串
Date date = new Date();
String strDate = format.format(date);
```

#### 日期加减
```
//计算明天的日期(可以填写负数)
Calendar calendar = Calendar.getInstance();
calendar.setTime(new Date());
calendar.add(Calendar.DAY_OF_YEAR, 1);
Date tomorrow = calendar.getTime();
```
日期月份减1：`calendar.add(Calendar.MONTH, -1);`  
返回月末最后一天（这个月有多少天），输出结果为31
```
Date parse = format.parse("2018-05-25-01");   //获取日期字符串后需要在后面拼接上"-01"
calendar.setTime(parse);
int last = calendar.getActualMaximum(Calendar.DATE);
System.out.println(String.valueOf(last));
```
判断是否是月末：`if(calendar.get(Calendar.DATE) == calendar.getActualMaximum(Calendar.DAY_OF_MONTH))`  

#### 日期比较
1. 把字符串格式的日期转换成长整形，然后比较大小（trim函数只去掉首尾的空格）
```
String begin = "2018-05-25 10:34:45";
String finish = "2018-05-24 09:08:24";
long start = Long.valueOf(begin.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", ""));
long end = Long.valueOf(finish.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", ""));
if(start > end)
```
2. 直接进行字符串比较（大于返回1，小于返回-1，等于返回0）
```
String begin = "2018-05-25 10:34:45";
String finish = "2018-05-24 09:08:24";
System.out.println(begin.compareTo(finish));
```
<font color=red>注意：必须保证字符串日期格式一致。如果以一个日期格式为2018-01-01，单另一个日期格式是2018-1-1时，直接使用字符串比较就会存在问题。</font>
3. 用SimpleDateFormat转换成日期型再判断
```
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String begin = "2018-05-25 10:34:45";
String finish = "2018-05-24 09:08:24";
try{
    Date start = format.parse(begin);
    Date end = format.parse(finish);
}catch (ParseException e){
    e.printStackTrace();
}
```
	- 直接比较`if(start.before(end))`
	- 用date.getTime()返回long相加减或者直接比较或者用compareTo
	- 转换成字符串，然后字符串比较

#### 判断日期是星期几
```
Calendar calendar = Calendar.getInstance();
calendar.setTime(date);
int weekOfDay = calendar.get(Calendar.DAY_OF_WEEK); //星期一到星期天对应2345671
```
