var http = require('http');
var urlTool = require('url');
var querystring = require('querystring');
var jade = require('jade');
var fs = require('fs');
var validator = require('./validator')

var users = {};

http.createServer(function(req, res) {
    switch(req.url){
        case '/validator.js':
            sendFile(res, 'validator.js', 'text/javascript');
            break;
        case '/signup.js':
            sendFile(res, 'signup.js', 'text/javascript');
            break;
        case '/style.css':
            senFile(res, 'style.css', 'text/css');
            break;
        default:
            req.method === "POST" ? registUser(req, res) : sendHtml(req, res);
    }
}).listen(8124);

console.log("Signup server is listening 8124");

function sendFile(res, filepath, mime) {
    res.writeHead(200, {
        "Content-Type": mime
    });
    res.end(fs.readFileSync(filepath));
}

function registUser(req, res) {
    req.on('data', function(chunk) {
        try {
            var user = parseUser(chunk.toString());
            cheackUser(user);
            user[user.username] = user;
            res.writeHead(301, {
                Location: '?username=' + user.username
            });
            res.end();
        } catch(error) {
            console.warn("regist error ", error);
            showSignup(res, user, error.message);
        }
        
    });
}

function cheackUser(user) {
    var errorMessages = [];
    for(var key in user) {
        if (!validator.isFieldValid(key, user[key]))
            errorMessages.push(validator.form[key].errorMessage);
        if(!validator.isAttrValueUnique(users, user, key))
            errorMessages.push(
                "key: " + key + "is not unique by value: " + user[key]
            );
    }
    if(errorMessages.length > 0)
        throw new Error(errorMessages.join('<br />'));
}

function parseUser(message) {
    params = message.match(/username=(.+)&sid=(.+)&phone=(.+)&email=(.+)/);
    var user = {
        username: params[1],
        sid: params[2],
        phone: params[3],
        email: params[4]
    }
    console.log("user parsed is: ", user);
    return user;
}

function sendHtml(req, res) {
    var username = parseUsername(req);
    if (!username || !isRegistUser(username)) {
        showSignup(res, {username: username}, null);
    } else {
        showDetail(res, users[username]);
    }
}

function parseUsername(req) {
    return querystring.parse(urlTool.parse(req, url).query).username;
}

function isRegistUser(username) {
    return !!users[username];
}

function showSignup(res, user, error) {
    showHtml(res, 'signup.jade', {user: user, error: error});
}

function showDetail(res, user) {
    showHtml(res, 'detail.jade', user);
}

function showHtml(res, template, data) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(jade.renderFile(template, data));
}