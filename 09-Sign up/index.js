/*
	张楚明 18342125
	index.js
*/

//页面加载完成后
$(function() {
	//点击后清空input
	$("#reset").click(function() {
		var xmlhttp;
		clear_error();
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open('GET', '/reset');	//发送请求
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var result = JSON.parse(xmlhttp.response);
				if(result.success == true)
					alert("重置成功");
			}
		}
		xmlhttp.send(null);
	});

	$("submit").click(function (e) {
		e.preventDefault();
		//如果信息有错则返回
		if(!validate_name($("#username").val()) || !validate_number($("#usernumber").val()) || !validate_phone($("#userphone").val()) || !validate_email($("#useremail").val()))
			return;
		//对于合法的输入， 则发出/signin的请求
		var xmlhttp;
		var fd = {
			username: $('#username').val(),
			usernumber: $('#usernumber').val(),
			userphone: $('#userphone').val(),
			useremail: $('#useremail').val()
		};
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open('POST', '/signin');
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				var result = JSON.parse(xmlhttp.response);
				if (result.error == '') {
					document.getElementsByTagName('html')[0].innerHTML = result.data;
				} else {
					error_alert(result.error);
				}
			}
		}
		xmlhttp.send(JSON.stringify(fd));
	});

	//blur失去焦点
	$('#form div input').blur(function() {
		if(this.name == "username") {
			if(!validate_name($("#"+this.name).val())) {
				$(".error_message").eq(0).text("用户名6~18位英文字母、数字或下划线，必须以英文字母开头");
			} else {
				$(".error_message").eq(0).text("");
			}
		}
		else if(this.name == "usernumber") {
			if(!validate_number($("#"+this.name).val())) {
				$(".error_message").eq(1).text("学号8位数字，不能以0开头");
			} else {
				$(".error_message").eq(1).text("");
			}
		}
		else if(this.name == "userphone") {
			if(!validate_phone($("#"+this.name).val())) {
				$(".error_message").eq(2).text("电话11位数字，不能以0开头");
			} else {
				$(".error_message").eq(2).text("");
			}
		}
		else if(this.name == "useremail") {
			if(!validate_email($("#"+this.name).val())) {
				$(".error_message").eq(3).text("邮箱格式应为:***@***.com");
			} else {
				$(".error_message").eq(3).text("");
			}
		}
	});
});

// 用户名6~18位英文字母、数字或下划线，必须以英文字母开头
function validate_name(name) {
	return /^[a-zA-Z][a-zA-Z_0-9]{5,17}$/.test(name);
}

// 学号8位数字，不能以0开头
function validate_number(number) {
	return /^[1-9][0-9]{7}$/.test(number);
}

// 电话11位数字，不能以0开头
function validate_phone(phone) {
	return /^[1-9]\d{10}$/.test(phone);
}

// 邮箱按照课程讲义中的规则校验
function validate_email(email) {
	return /^[a-zA-Z_0-9\-]+@(([a-zA-Z_0-9\-])+\.)+[a-zA-Z]{2,4}$/.test(email);
}

// 校验发现错误时，要在界面上提示具体出错的原因
// 用户名、学号、电话、邮箱均不可重复，重复时要在界面上显示具体重复的内容


function clear_error() {
	$(".error_message").each(function(i) {
		$(this).text("");
	})
}

function error_alert(s) {
	if (s == 'username')
		alert("该用户名已被注册！");
	else if (s == 'usernumber')
		alert("该学号已被注册！");
	else if (s == 'userphone')
		alert("该电话已被注册！");
	else if (s == 'useremail')
		alert("该邮箱已被注册！");
}