/*
 @ Author：前端老徐
 @ Name：Selenium自动化-发周报功能
 @ Date：2018/03/01
 @ Weibo:http://weibo.com/qdlaoxu
 @ GitHub:https://github.com/waihaolaoxu/autotest
 @ Blog:http://www.loveqiao.com/
*/

var colors = require('colors'); 
var fs = require('fs');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

//启动浏览器
const driver = new webdriver.Builder().forBrowser('chrome').build();//firefox|chrome
// driver.manage().window().maximize(); //将浏览器设置为最大化的状态

//本地数据读取
var work_week = require('../data/week.js');

function Fn(){
	this.driver=driver;
	this.By=By;
	this.until=until;
}
Fn.prototype={
	each:function(data,callback){
		for(var x in data){
			callback(x,data[x]);
		}
	},
	sendData:function(opt){
		var _self=this;
		driver.get(opt.url).then(function(){
			/**
			 * 登录操作
			 */
			var loginBtn = driver.wait(until.elementLocated(By.xpath(opt.btnXpath)));//等待提交按钮加载完毕
			_self.each(opt.input,function(i,d){
				var obj=driver.findElement(By.xpath(d.xpath));
				obj.clear();
				obj.sendKeys(d.val);
			});
			loginBtn.click();
			
			/**
			 * 发送周报
			 */
			driver.sleep(2000);
			driver.executeScript(function(){
				$('.things-items .ng-hide').removeClass('ng-hide');
			});
			driver.sleep(1500);

			//==========新建动态==============
			var head = work_week.name + new Date().toLocaleString() + " 周报";
			var content = [head];
			_self.each(work_week.current,function(i,d){
				content.push(d.module+'--'+d.item);
			});
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-layout-content-body"]/div/div/div[2]/div/ul/li[1]/div[4]/a[1]'))).click();//新建动态
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[1]/textarea'))).sendKeys(content.join('\n'));//添加动态

			//==========同步事事号==============
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[6]/a'))).click();//同步到其他事事号动态
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/form/input[1]'))).sendKeys('技术部工作周报 ');//筛选事事号
			driver.sleep(1000);
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-thingslist-scrollable"]/div/div[1]/div/div/div'))).click();//选择事事号
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();//确定
			
			//==========选择工作表==============
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[3]/a'))).click();//选择工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div/div[1]/div[1]/div/form/input'))).sendKeys('周报');//筛选工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div/div[1]/div[2]/div/div[1]/div/ul/li[2]'))).click();//选择工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();//确定工作表


			_self.each(work_week.current,function(i,d){ //增加记录（本周工作)
				if(work_week.current.length-1>i){
					driver.wait(until.elementLocated(By.xpath('//*[@id="es-worktable-fill"]/div/div[4]/div/div[2]/div[6]/button'))).click();
				}
				var index = Number(i)+1;
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[3]/div/input')).sendKeys(d.module);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[4]/div/div[1]/textarea')).sendKeys(d.item);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[6]/div/input')).sendKeys(d.start);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[7]/div/input')).sendKeys(d.end);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[8]/div/select'));  //是否完成
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[9]/div/div[1]/textarea')).sendKeys('-');
				
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[8]/div/span[1]/span[1]/span/ul/li/input')).click();
				driver.findElement(By.xpath('//*[@id="es-body"]/span[2]/span/span/ul/li['+(d.complete?1:2)+']')).click();
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[8]/div/span[1]/span[1]/span/ul/li/input')).click();

				driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e30899"]/table/tbody/tr['+index+']/td[5]/div/button[2]'))).click();
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div[2]/div[1]/div/div[1]/input'))).sendKeys(d.person);
				driver.sleep(1500); // 非常非常重要
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div[2]/div[1]/div/div[4]/ul[2]/li'))).click();
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();
			}); 

			_self.each(work_week.plan,function(i,d){ //增加记录（下周计划）
				if(work_week.plan.length-1>i){
					driver.wait(until.elementLocated(By.xpath('//*[@id="es-worktable-fill"]/div/div[4]/div/div[3]/div[6]/button'))).click();
				}
				var index = Number(i)+1;
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[2]/div/input')).sendKeys(d.plan_date);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[3]/div/input')).sendKeys(d.module);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[4]/div/div[1]/textarea')).sendKeys(d.item);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[6]/div/input')).sendKeys(d.start);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[7]/div/input')).sendKeys(d.end);
				driver.findElement(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[9]/div/div[1]/textarea')).sendKeys('-');

				driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754f75d332d5391e3089a"]/table/tbody/tr['+index+']/td[5]/div/button[2]'))).click();
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div[2]/div[1]/div/div[1]/input'))).sendKeys(d.person);
				driver.sleep(1500);// 非常非常重要
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div[2]/div[1]/div/div[4]/ul[2]/li'))).click();
				driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();
			});
			

			//==========终极提交==============
			// driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[7]/button[3]'))).click();//提交工作报告

		});
	}
}

module.exports = Fn;