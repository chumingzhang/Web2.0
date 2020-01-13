/*
	张楚明 18342125
	signin.js
*/

var http = require('http');
var fs = require('fs');
var path = require('path');

var store = [];		//服务器储存各个用户信息

//创建服务器
var server = http.createServer(function(request, response) {
	console.log(request.url);
	console.log(request.method);

	if (request.url === '/')
		Response(response, './index.html');
	else if (request.method === "POST" && request.url === "/signin") {
		var receive = '';
		request.on('data', function(data) {
			receive += data;
		});
		request.on('end', function() {
			var result = {};
			result.error = '';
			result.data = '';
			var parse_data = JSON.parse(receive);
			var repeat = [];
			//判断有无重复，具体是哪一个信息重复
			for(var i = 0; i < store.length; ++i) {
				if(store[i].username == parse_data.username) {
					repeat.push('用户名');
					result.error = 'username';
					break;
				}
				if (store[i].usernumber === parse_data.usernumber) {
					repeat.push('学号');
					result.error = 'usernumber';
					break;
				}
				if (store[i].userphone === parse_data.userphone) {
					repeat.push('电话');
					result.error = 'userphone';
					break;
				}
				if (store[i].useremail === parse_data.useremail) {
					repeat.push('邮箱');
					result.error = 'useremail';
					break;
				}
			}
			//如果没有重复
			if (repeat.length === 0)	{
				store.push(parse_data);
				render_detail(parse_data, function(err, data) {
					result.data = data;
					result.error = '';
					response.end(JSON.stringify(result));
				});
			} else {	//如果有重复
				result.data = '';
				response.end(JSON.stringify(result));
			}
		})
	}
	//如果用户传入的是reset
	else if (request.url === '/reset') {
		store = [];
		var result = {};
		result.success = true;
		response.writeHead(200, {
			"Content-Type": "application/json"
		});
		response.end(JSON.stringify(result));
	}
	//如果用户在url输入栏加入 "?username=abc"
	else if (request.url.match(/^\/\?username=(.*)$/) != null) {
		var name = request.url.match(/^\/\?username=(.*)$/)[1];
		var find = -1;
		for(var i = 0; i < store.length; ++i) {
			if(store[i].username === name) {
				find = i;
				break;
			}
		}
		if (find !== -1) {
			render_detail(store[find], function(err, data) {
				if(err) {
					console.log(err);
				}
				response.writeHead(200, {
					"Content-Type": "text/html"
				});
				response.end(data);
			});
		} else {
			response.statusCode = 301;
			response.setHeader("Location", "/");
			response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			response.setHeader("Expires", "0");
			response.end();
		}
	}
	else Response(response, '.' + request.url);
});
server.listen(8000);
console.log("8000 server is listening");

//读取文件
var Response = function(response, filePath) {
	fs.readFile(filePath, function(err, data) {
		if(err) {
			response.writeHead(404, {
				"Content-type": "text/plain"
			});
			response.end('404 file is not found!');
		}
		var fName = path.extname(filePath).substring(1);	// 获得文件扩展名
		if(fName != "css" && fName != "html" && fName != "js") {
			response.writeHead(200, {
				"Content-type": "image/" + fName;
			});
			response.edn(data);
		} else {
			response.writeHead(200, {
				"Content-type": "text/" + fName;
			});
			response.end(data.toString('utf-8'));
		}
	});
};

//用于显示detail.html的内容
function render_detail(parse_data, callback) {
	fs.readFile(path.join(__dirname, '', 'detail.html'), 'utf-8', function(err, data) {
		if (err) {
			callback(err, null);
		} else {
			data = data.replace('_username', parse_data.username);
			data = data.replace('_usernumber', parse_data.usernumber);
			data = data.replace('_userphone', parse_data.userphone);
			data = data.replace('_useremail', parse_data.useremail);
			callback(null, data);
		}
	})
}