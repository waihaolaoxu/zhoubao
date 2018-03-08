/*
 @ Author：前端老徐
 @ Name：Selenium自动化-发日报功能
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
var work_day = fs.readFileSync('./data/day.txt').toString();

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
			// driver.sleep(1000);//在等待1s
			_self.each(opt.input,function(i,d){
				var obj=driver.findElement(By.xpath(d.xpath));
				obj.clear();
				obj.sendKeys(d.val);
			});
			loginBtn.click();
			
			/**
			 * 发送日报
			 */
			driver.sleep(2000);
			driver.executeScript(function(){
				$('.things-items .ng-hide').removeClass('ng-hide');
			});
			driver.sleep(1000);

			//==========新建动态==============
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-layout-content-body"]/div/div/div[2]/div/ul/li[1]/div[4]/a[1]'))).click();//新建动态
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[1]/textarea'))).sendKeys(work_day);//添加动态
			
			//==========选择工作表==============
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[3]/a'))).click();//选择工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div/div[1]/div[1]/div/form/input'))).sendKeys('日报');//筛选工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div/div[1]/div[2]/div/div[1]/div/ul/li[2]'))).click();//选择工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();//确定工作表
			driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754ca5d332d5391e30762"]/table/tbody/tr/td[1]/span[1]'))).click();//删除明日计划
			driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754ca5d332d5391e30761"]/table/tbody/tr/td[3]/div/div[1]/textarea'))).sendKeys('-');//当前工作计划
			driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754ca5d332d5391e30761"]/table/tbody/tr/td[4]/div/div[1]/textarea'))).sendKeys(work_day);//当日工作总结
			driver.wait(until.elementLocated(By.xpath('//*[@id="grouptable_5a3754ca5d332d5391e30761"]/table/tbody/tr/td[6]/div/div[1]/textarea'))).sendKeys('-');//下一步工作计划
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/worktable-fill/form/div[2]/div/button'))).click();//提交
			
			//==========同步事事号==============
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[6]/a'))).click();//同步到其他事事号动态
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/form/input[1]'))).sendKeys('技术部工作日报 ');//筛选事事号
			driver.sleep(1000);
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-thingslist-scrollable"]/div/div[1]/div/div/div'))).click();//选择事事号
			driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[3]/button[2]'))).click();//确定

			//==========终极提交==============
			// driver.wait(until.elementLocated(By.xpath('//*[@id="es-body"]/div[1]/div/div/div[2]/div/form/div[3]/div[7]/button[3]'))).click();//提交工作报告

		});
	}
}

module.exports = Fn;