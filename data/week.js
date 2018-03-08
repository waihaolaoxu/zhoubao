/**
 * 周报数据
 * data.current  本周工作
 * data.plan     下周计划
 */
var data = {
    name:"张三",
    current:[{
        module:"大数据",
        item:"用户画像",
        person:"徐世龙",
        start:"20180224",
        end:"20180301",
        complete:true
    },{
        module:"大数据2",
        item:"用户画像2",
        person:"史伟华",
        start:"20180224",
        end:"20180301",
        complete:false
    },{
        module:"大数据3",
        item:"用户画像3",
        person:"严浩韦",
        start:"20180224",
        end:"20180301",
        complete:true
    }],
    plan:[{
        plan_date:"20180224",
        module:"大数据",
        item:"用户画像",
        person:"徐世龙",
        start:"20180224",
        end:"20180301",
    },{
        plan_date:"20180224",
        module:"大数据2",
        item:"用户画像2",
        person:"史伟华",
        start:"20180224",
        end:"20180301",
    }]
}
module.exports = data;