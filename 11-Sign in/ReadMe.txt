运行方式（确保电脑已经安装node.js，express，mongodb等相关组件）：
1.打开终端/命令行。

2.进入作业文件夹目录/SignIn

3.启动Mongodb数据库应用
​	mongod --dbpath ./data

4.在同目录下启动Express DEBUG工具对Express框架下项目进行调试检查
​	DEBUG=signin:* npm start

5.收到服务器启动信息后，在浏览器地址栏输入localhost:8000/register