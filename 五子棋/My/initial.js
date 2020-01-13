var chessboard = JSON.parse(JSON.stringify(cchessboard));
var debug = cdebug;

var boardsize = cboardsize;
var depth = cdepth;
var maxdepth = cmaxdepth;

var historys = [];
var turn = 0;       //黑棋:0    白起:1

var calculating = false;
var started = false;
var finished = false;

var timebit = 50;
var timecom = [0, 0, 0, 0];
var timeusr = [0, 0, 0, 0];
var interval = setInterval("console.log('wait')", 999999999);

var musics = new Array();
musics[0]=new Audio("audio/a1.mp3");
musics[1]=new Audio("audio/a2.mp3");
musics[2]=new Audio("audio/a3.mp3");