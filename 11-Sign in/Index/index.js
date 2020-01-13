/*
    张楚明:18342125
    index.js
*/

var express = require('express');
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store')(session);

module.exports = function(db) {
    var userManager = require("../User/user")(db);

    //get signin page
    router.get("/signin", function(req, res, next) {
        res.render("signin", {title: "Sign In"});
    });

    router.post("/signin", function(req, res, next) {
        userManager.findUser(req.body.username, req.body.password)
            .then(function(user) {
                console.log("session opr");
                req.session.user = user;
            })
            .then(function(user) {
                console.log("redirect");
                res.redirect("/detail");
            })
            .catch(function(error) {
                console.log('登录时错误');
                console.log(error);
                res.render('signin', { title: 'Sign In', error: '用户名或密码错误' });
            });
    });

    //signout and return to signin page
    router.get('/signout', function(req, res, next) {
        console.log('out');
        req.session.destroy();
        res.redirect('/signin');
    });

    //return signup page
    router.get('/regist', function(req, res, next) {
        res.render('signup', { title: 'Sign Up', user: {}});
    });
    router.post('/regist', function(req, res, next) {
        var user = req.body;
        userManager.checkUser(user)
            .then(userManager.createUser(user))
            .then(function() {
                console.log('session');
                req.session.user = user;
            })
            .then(function() {
                console.log('redirect');
                res.redirect('/detail');
            })
            .catch(function(error) {
                console.log('error');
                console.log(error);
                res.render('signup', { title: 'Sign Up', user: user, error: error });
            });
    });

    router.all('*', function(req, res, next) {
        req.session.user ? next() : res.redirect('/signin');
    });
    
    //return detail page
    router.get('/detail', function(req, res, next) {
        res.render('detail', { title: 'Detail', user: req.session.user });
    });
    
    return router;
}