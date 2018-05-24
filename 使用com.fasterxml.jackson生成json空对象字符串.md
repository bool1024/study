##### 目标json样式
```
{"name":"akio","obj":{}}
```

##### 相关Java类
```
public class User implements Serializable {
    private String name;
    private Object obj = new Object();

    //getter/setter
}
```

##### 使用net.sf.json生成目标json字符串
```
public static void main(String[] args) throws Exception {
    User user = new User();
    user.setName("akio");
    JSONObject json = JSONObject.fromObject(user);
    System.out.println(json.toString());
}
```

##### 使用com.fasterxml.jackson生成目标json字符串
```
public static void main(String[] args) throws Exception {
    User user = new User();
    user.setName("akio");
    ObjectMapper mapper = new ObjectMapper();
    String jsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(user);
    System.out.println(jsonString);
}
```

##### 运行结果报错
Exception in thread "main" com.fasterxml.jackson.databind.JsonMappingException: No serializer found for class java.lang.Object and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) ) (through reference chain: cn.akioyuan.nulljsonobject.User["obj"])
    at com.fasterxml.jackson.databind.JsonMappingException.from(JsonMappingException.java:269)
....  

根据提示，添加相应配置信息后，可生成空的json对象
```
ObjectMapper mapper = new ObjectMapper();
mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);//设置为false
```

##### gradle dependencies
```
"net.sf.json-lib:json-lib:2.4:jdk15",
"com.fasterxml.jackson.core:jackson-core:2.7.4",
"com.fasterxml.jackson.core:jackson-databind:2.7.4",
```
