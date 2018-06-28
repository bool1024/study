Spring MVC提供<mvc:resources>来设置静态资源，但是增加该设置如果采用通配符的方式增加拦截器的话仍然会被拦截器拦截，可采用如下方案进行解决：

##### 方案一、拦截器中增加对静态资源不进行过滤（涉及spring-mvc.xml）
```
<mvc:resources location="/" mapping="/**/*.js"/>  
<mvc:resources location="/" mapping="/**/*.css"/>  
<mvc:resources location="/assets/" mapping="/assets/**/*"/>  
<mvc:resources location="/images/" mapping="/images/*" cache-period="360000"/>

<mvc:interceptors>
	<mvc:interceptor>
		<mvc:mapping path="/**/*"/>
		<mvc:exclude-mapping path="/**/fonts/*"/>
		<mvc:exclude-mapping path="/**/*.css"/>
		<mvc:exclude-mapping path="/**/*.js"/>
		<mvc:exclude-mapping path="/**/*.png"/>
		<mvc:exclude-mapping path="/**/*.gif"/>
		<mvc:exclude-mapping path="/**/*.jpg"/>
		<mvc:exclude-mapping path="/**/*.jpeg"/>
		<mvc:exclude-mapping path="/**/*login*"/>
		<mvc:exclude-mapping path="/**/*Login*"/>
		<bean class="com.luwei.console.mg.interceptor.VisitInterceptor"/>
	</mvc:interceptor>
</mvc:interceptors>
```

##### 方案二、使用默认的静态资源处理servlet处理静态资源（涉及spring-mvc.xml，web.xml）
在spring-mvc.xml中启动默认servlet
```
<mvc:default-servlet-handler />
```
在web.xml中增加对静态资源的处理
```
<servlet-mapping>    
	<servlet-name>default</servlet-name>    
	<url-pattern>*.js</url-pattern>    
	<url-pattern>*.css</url-pattern>    
	<url-pattern>/assets/*"</url-pattern>    
	<url-pattern>/images/*</url-pattern>    
</servlet-mapping> 
```
但是当前的设置在Spring的DispatcherServlet的前面

##### 方案三、修改Spring的全局拦截设置为*.do的拦截（涉及web.xml）
```
<servlet>
	<servlet-name>SpringMVC</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<init-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:spring-mvc.xml</param-value>
	</init-param>
	<load-on-startup>1</load-on-startup>
	<async-supported>true</async-supported>
</servlet>
<servlet-mapping>
	<servlet-name>SpringMVC</servlet-name>
	<url-pattern>*.do</url-pattern>
</servlet-mapping>
```
这样设置，Spring就会只针对以“*.do”结尾的请求进行处理，不再维护静态资源 


针对这三种方案的优劣分析：

第一种方案配置比较臃肿，多个拦截器时增加文件行数，不推荐使用；第二种方案使用默认的Servlet进行资源文件的访问，Spring拦截所有请求，然后再将资源文件交由默认的Sevlet进行处理，性能上少有损耗；第三种方案Spring只是处理以'.do'结尾的访问，性能上更加高效，但是再访问路径上必须都以'.do'结尾，URL不太文雅；

综上所述，推荐使用第二和第三中方案
