### 一.如何进入JDK源码中进行调试

如果在debug调试时，不能进入JDK源码，可能是Eclipse默认使用的JRE，需要做如下调整  
依次选择【Windows】->【Preference】->【Java】->【Installed JREs】  
若使用的是JRE，则需要替换成JDK，因为JRE是不支持调试的。  
替换或新建一个Installed JREs环境。此时JDK的jar文件都会默认选择JDK目录下的src.zip作为source，如果没有，需要手动添加上。  

最后在package或者project列表中选中右键项目，选择Properties->Build Path，选择刚刚添加的JDK：add Library->JRE system library->alternate jre，最后要去除默认的JRE引用。这样在debug调试的时候，可以进入到jdk源码中了。

### 二.如果在JDK源码调试时显示当前的局部变量值
在步骤一中，只能进入jdk源码中进行调试，但是无法查看当前jdk源码中的变量值。首先我们要明白JDK source为什么在debug的时候无法观察局部变量，因为在jdk中，sun对rt.jar中的类编译时，去除了调试信息，这样在eclipse中就不能看到局部变量的值。这样，如果在debug的时候查看局部变量，就必须自己编译相应的源码使之拥有调试信息。方法如下：
1. 新建c:/jdk/jdk_src以及c:/jdk/jdk_debug目录，将%JAVA_HOME%/Jdk/jre/lib/rt.jar复制到c:/jdk目录下，解压%JAVA_HOME%/jdk/src.zip文件到c:/jdk/jdk_src目录下，保留java、javax、org目录，其他的都可以删除（开发几乎不涉及其他包，若需要调试其他包，则可以保留相应目录）
2. 打开命令行，进入到c:/jdk目录，执行dir /B /S /X jdk_src\*.java > filelist.txt（列出我们刚刚解压出来的所有java文件的绝对路径清单）
3. 重新编译我们需要的源码，加入调试信息。命令行进入c:/jdk目录，运行javac -J-Xms16m -J-Xmx1024m -sourcepath jdk_src -cp rt.jar -d jdk_debug -g @filelist.txt >> log.txt 2>&1（编译刚刚在jdk_src目录下filelist中的java类到jdk_debug目录下，并把输出日志打在log.txt文件中。这里需要注意，我们需要用当前版本的jdk去编译，不要跨版本编译，eg：1.7去编译1.8的jdk）
4. 命令行进入jdk_debug目录，执行jar cf0 rt_debug.jar *打包该目录下的文件到rt_debug.jar
5. 进入Eclipse->Window->Preferences->Java->Installed JREs，选中我们需要调试的jre环境，点击edit，然后点击Add External JARs，选择我们刚才编译的rt_debug.jar包，并移动到最上面，选中我们选择的rt_debug.jar，点击右边的Source Attachment，选择External location，选择%JAVA_HOME%/jdk/src.zip文件，保存即可  

注意：第3步中可能没有生成class文件，那是因为编译失败，打开log.txt文件，找到错误的类，删除即可。
