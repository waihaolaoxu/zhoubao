/*
 @ Author：前端老徐
 @ Name：Selenium自动化发送周报日报
 @ Date：2018/03/01
 @ Weibo:http://weibo.com/qdlaoxu
 @ GitHub:https://github.com/waihaolaoxu/autotest
 @ Blog:http://www.loveqiao.com/
*/
var utils;
var argv = process.argv.splice(2);
if(argv[0]==='week'){
	utils = require('./utils/week.js');
}else{
	utils = require('./utils/day.js');
}
var fn = new utils();
var driver = fn.driver;
var until = fn.until;

//登陆
fn.sendData({
	url:'http://ething.123eblog.com/#/',// 登陆地址
	input:[
		{
			xpath:'//*[@id="es-body"]/div[1]/div/div[2]/form/div[1]/div[2]/input',
			val:''
		},{
			xpath:'//*[@id="password"]',
			val:''
		}
	],
	btnXpath:'//*[@id="es-body"]/div[1]/div/div[2]/form/div[4]/button'
});