1. 下载Java反编译工具JD-GUI 0.3.6以上版本（注意：必须是0.3.6以上版本）  
下载地址：http://jd.benow.ca/

2. 设置反编译输出选项  
菜单->Help->Preferences，勾选Realign line numbers

3. JD-GUI打开需要调试的jar包，将反编译的源码导出到一个zip文件中  
菜单->File->Sava All Sources

4. Eclipse中导入反编译后的zip包，即可按照正常的源代码设置断点调试了   
项目右键->Import->Archive File

注：导入zip包后，提示语法错误不用考虑，不影响调试

