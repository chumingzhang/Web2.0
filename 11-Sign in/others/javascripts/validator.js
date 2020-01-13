/*
    张楚明:18342125
    validator.js
*/

var validator = {
	//output the error message
	form: {
		username: {
			status: false,
			errorMsg: '用户名6~18位英文字母、数字或下划线，必须以英文字母开头'
		},
		password: { 
			status: false,
			errorMsg: '密码为6~12位数字、大小写字母、中划线、下划线'
		},
		confirmPassword: {
			status: false,
			errorMsg: '两次输入密码不一致'
		},
		sid: {
			status: false,
			errorMsg: '学号8位数字，不能以0开头'
		},
		phone: {
			status: false,
			errorMsg: '电话11位数字，不能以0开头'
		},
		email: {
			status: false,
			errorMsg: '邮箱格式应为:***@***.com'
		}
	},

	//whether valid
	findFormatErrors: function(user) {
		var errorMessages = [];
		for (var key in user) {
				if (!validator.isFieldValid(key, user[key])) errorMessages.push(validator.form[key].errorMsg);
			}
		errorMessages.length > 0 ? new Error(errorMessages.join('<br />')) : null;
	},

	isUsernameValid: function (username) {
		return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
	},

	isPasswordValid: function (password) {
		this.password = password;
		return this.form.password.status = /^[a-zA-Z0-9_\-]{6,12}$/.test(password);
	},

	isConfirmPasswordValid: function(confirmPassword) {
		return this.form.confirmPassword.status = (this.password == confirmPassword);
	},

	isSidValid: function (sid) {
		return this.form.sid.status = /^[1-9]\d{7}$/.test(sid);
	},

	isPhoneValid: function (phone) {
		return this.form.phone.status = /^[1-9]\d{10}$/.test(phone);
	},

	isEmailValid: function (email) {
		return this.form.email.status = /^[a-zA-Z0-9_\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/.test(email);
	},

	isFieldValid: function (fieldname, value) {
		var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
		return this['is' + CapFiledname + 'Valid'](value);
	},

	isFormValid: function () {
		return this.form.username.status && this.form.password.status && (this.form.confirmPassword.status || typeof window !== 'object') &&
					 this.form.sid.status && this.form.phone.status && this.form.email.status;
	},

	getErrorMsg: function (fieldname) {
		return this.form[fieldname].errorMsg;
	},

	isAttrValueUnique: function (registered, user, attr) {
		for (var key in registered) {
			if (registered.hasOwnProperty(key) && registered[key][attr] == user[attr]) return false;
		}
		return true;
	}
}

// share with the server
if (typeof module == 'object') {
	module.exports = validator;
}