/*
    张楚明:18342125
    user.js
*/

var bcrypt = require("bcryptjs");
var validtor = require("../others/javascripts/validator");
var debug = require("debug")("signin:user");
var _ = require("lodash");

module.exports = function(db) {
    var users = db.collection("users");

    return {
        //find user
        findUser: function(username, password) {
            return users.findOne({username: username}).then(function(user) {
                if(!user)
                    return Promise.reject("用户不存在");
                else
                    return bcrypt.compareSync(password, user.password) ? user : Promise.reject('wrong password');
            });
        },

        //password加密
        createUser: function(user) {
            console.log("creating");
            var iteration = 10;
            return bcrypt.hash(user.password, iteration).then(function(hash) {
                user.password = hash;
                console.log("created");
                return users.insert(user);
            };
        },

        //whether the user has been registed
        checkUser: function(user) {
            var formatErrors = validator.findFormatErrors(user);
            return new Promise(function(resolve, reject) {
                formatErrors ? reject(formatErrors) : resolve(user);
            }).then(function() {
                return users.findOne(getQueryForUniqueInAttrs(user)).then(function(existedUser) {
                    return existedUser ? Promise.reject("用户已被注册") : Promise.resolve(user);
                });
            });
        }
    }
}

function getQueryForUniqueInAttrs(user) {
    return {
        $or: _.toPairs(_.omit(user, "password")).map(pairToObject)
    }
}

function pairToObject(pair) {
    obj = {};
    obj[pair[0]] = pair[1];
    return obj;
}