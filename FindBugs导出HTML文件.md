步骤：
1. 将findbugs.jar以及findbugs-ant.jar放入到findbugs插件目录下的lib目录内（示例：D:\tools\eclipse\plugins\edu.umd.cs.findbugs.plugin.eclipse_3.0.0.20140706-2cfb468\lib）
2. 将build.xml放入项目根目录下（项目名下面，src目录上面）
3. 修改build.xml中的value值为findbugs插件目录（示例：D:\tools\eclipse\plugins\edu.umd.cs.findbugs.plugin.eclipse_3.0.0.20140706-2cfb468）
4. 修改build.xml中的outputFile值为输出文件的路径以及名称
5. 运行ant脚本即可
