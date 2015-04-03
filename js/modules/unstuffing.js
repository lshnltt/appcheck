//掏箱作业单
var unstuffing = (function ($) {
    'use strict';
    var $unstuffingLeft;
    var $unstuffingRight;
    var $content;
    //掏箱作业结果
    var unstuffRecod = {
    };
    var eventInitialize = function () {
        $content = $("#unsfuffingPage .content");
        $unstuffingLeft = $("<div>").addClass("otherMesgLeftCommon unstuffingLeftCommon");
        $unstuffingRight = $("<div>").addClass("otherMesgRightCommon unstuffingRightCommon");
        var setScrollHeight = function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var scrollHeight = (winHeight - headHeight);
            $(".unstuffing .content").height(scrollHeight);
        };
        setScrollHeight();
    };
    //页面加载数据填充
    
    var showPage = function () {
        //显示掏箱作业单页面
        $("#fullBg").addClass("none");//加载数据页面隐藏
        console.log("掏箱作业单显示");
        $content.append($unstuffingLeft).append($unstuffingRight);
        for (var prop in unstuffRecod) {
            var ContaID = unstuffRecod[prop]["ContaID"];
            var HollowArea1 = unstuffRecod[prop]["HollowArea1"];
            var HollowArea2 = unstuffRecod[prop]["HollowArea2"];
            var ChkSeal = unstuffRecod[prop]["ChkSeal"];
            switch (ChkSeal) {
                case 1: ChkSeal = "封志相符"; break;
                case 2: ChkSeal = "封志不符"; break;
                case 3: ChkSeal = "无封志"; break;
                default:
                    break;
            }

            var ChkTrunk = unstuffRecod[prop]["ChkTrunk"];
            var ChkContaID = unstuffRecod[prop]["ChkContaID"];
            var ExamResult = unstuffRecod[prop]["ExamResult"];

            var $line2 = $("<div>").addClass("line2");
            var $leftcon1 = $("<div>").addClass("unstuffingResultLeft").addClass("unstuffingResultCommon").html("掏箱结果:");
            var $leftcon2 = $("<div>").addClass("unstuffingLeft").html("集装箱号");
            var $leftcon3 = $("<div>").addClass("unstuffingLeft").html("掏箱区域1");
            var $leftcon4 = $("<div>").addClass("unstuffingLeft").html("掏箱区域2");
            var $leftcon5 = $("<div>").addClass("unstuffingLeft").html("核对封志");
            var $leftcon6 = $("<div>").addClass("unstuffingLeft").html("检查箱体");
            var $leftcon7 = $("<div>").addClass("unstuffingLeft").html("核对箱号");
            var $leftcon8 = $("<div>").addClass("unstuffingLeft").html("掏箱货物结果");
            
            ExamResult = Dictionary.dataRepository.getCodeNameByCode("MAC_EXAM_RESULT_TX", ExamResult);
            var HollowArea1 = Dictionary.dataRepository.getCodeNameByCode("CONT_CHK_TYPE", HollowArea1);
            var HollowArea2 = Dictionary.dataRepository.getCodeNameByCode("CONT_CHK_TYPE2", HollowArea2);
            var ChkSeal = Dictionary.dataRepository.getCodeNameByCode("CHK_SEAL_TX", ChkSeal);
            var ChkTrunk = Dictionary.dataRepository.getCodeNameByCode("CHK_TRUNK", ChkTrunk);
            var ChkContaID = Dictionary.dataRepository.getCodeNameByCode("CHK_CONTA_ID_TX", ChkContaID);

            var $rightcon1 = $("<div>").addClass("unstuffingResultRight ").addClass("unstuffingResultCommon").html(_setData(ExamResult, "&nbsp;"));
            var $rightcon2 = $("<div>").addClass("unstuffingRight").html(_setData(ContaID,"&nbsp;"));
            var $rightcon3 = $("<div>").addClass("unstuffingRight").html(_setData(HollowArea1, "&nbsp;"));
            var $rightcon4 = $("<div>").addClass("unstuffingRight").html(_setData(HollowArea2, "&nbsp;"));
            var $rightcon5 = $("<div>").addClass("unstuffingRight").html(_setData(ChkSeal, "&nbsp;"));
            var $rightcon6 = $("<div>").addClass("unstuffingRight").html(_setData(ChkTrunk, "&nbsp;"));
            var $rightcon7 = $("<div>").addClass("unstuffingRight").html(_setData(ChkContaID, "&nbsp;"));
            var $rightcon8 = $("<div>").addClass("unstuffingRight").html(_setData(ExamResult, "&nbsp;"));
            $unstuffingLeft.append($leftcon1)
                .append($leftcon2).append($("<div>").addClass("line2"))
                .append($leftcon3).append($("<div>").addClass("line2"))
                .append($leftcon4).append($("<div>").addClass("line2"))
                .append($leftcon5).append($("<div>").addClass("line2"))
                .append($leftcon6).append($("<div>").addClass("line2"))
                .append($leftcon7).append($("<div>").addClass("line2"))
                .append($leftcon8).append($("<div>").addClass("line2"))
            $unstuffingRight.append($rightcon1)
                .append($rightcon2).append($("<div>").addClass("line2"))
                .append($rightcon3).append($("<div>").addClass("line2"))
                .append($rightcon4).append($("<div>").addClass("line2"))
                .append($rightcon5).append($("<div>").addClass("line2"))
                .append($rightcon6).append($("<div>").addClass("line2"))
                .append($rightcon7).append($("<div>").addClass("line2"))
                .append($rightcon8).append($("<div>").addClass("line2"))
        }
        return {
            showPage: showPage
        };
    }
    var loadData = function () {
        history.pushState({ page: "page3" }, "", location.href.split("?")[0] + "?page=page3");
        _loadData();
    };
    var _loadData = function () {
        $(".page").addClass("none");
        $("#unsfuffingPage").removeClass("none");
        //history.pushState({ page: "page3" }, "", location.href.split("?")[0] + "?page=page3");
        $("#fullBg").removeClass("none");//加载数据页面显示
        $("#unstuffing_userName").html("");
        $("#unstuffing_userName").html(util.getUserInfo.getUser().DisPlayName);
        $content.empty();//清空掏箱作业页面
        var EntryID = $("#checkwork_head .titleBottom").html();
        var ExamRecID = checkList.getCheckItem()["ExamNo"];
        var RskNo = checkList.getCheckItem()["RskNo"];
        var data = dataStructure.formData(util.getOption("moduleId"), "H2000.BizExamContaHeadRepository", JSON.stringify({ "FormID": EntryID, "ExamRecID": ExamRecID, "RskNo": RskNo }));
        var successCallBack = function (data) {
            if (data.Status == "1") {
                $unstuffingLeft.empty();
                $unstuffingRight.empty();
                var startTime = _setData(util.dtJsonFormat(data.Data["ExamBTime"], "yyyy-MM-dd HH:mm"), "&nbsp;");
                var endTime = _setData(util.dtJsonFormat(data.Data["ExamETime"], "yyyy-MM-dd HH:mm"), "&nbsp;");
                var checkMember1 = _setData(data.Data["ExamEr1"], "&nbsp;");
                var checkMember2 = _setData(data.Data["ExamEr2"], "&nbsp;");
                var $left1 = $("<div>").addClass("unstuffingLeft").html("掏箱开始时间");
                var $left2 = $("<div>").addClass("unstuffingLeft").html("掏箱结束时间");
                var $left3 = $("<div>").addClass("unstuffingLeft").html("监卸人");

                var $right1 = $("<div>").addClass("unstuffingRight").html(startTime + "");
                var $right2 = $("<div>").addClass("unstuffingRight").html(endTime + "");
                var $right3 = $("<div>").addClass("unstuffingRight").html(checkMember1 + " " + checkMember2);

                $unstuffingLeft.append($left1).append($("<div>").addClass("line2"))
                    .append($left2).append($("<div>").addClass("line2"))
                    .append($left3).append($("<div>").addClass("line2"));
                $unstuffingRight.append($right1).append($("<div>").addClass("line2"))
                    .append($right2).append($("<div>").addClass("line2"))
                    .append($right3).append($("<div>").addClass("line2"))

                loadunstuff(ExamRecID);
            } else {
                console.log("掏箱作业单表头获取失败:" + JSON.stringify(data));
                util.serverFailure($content, function () {
                    _loadData();
                }, "数据请求失败")
            }
        };
        var errorCallBack = function (data) {
            util.toast(util.getOption("errorStr"));
            console.log("掏箱作业单表头获取失败:" + JSON.stringify(data));
            util.loadFailure($content, function () {
                loadData();
            })
        };
        util.post(data, true, successCallBack, errorCallBack, "form");
    };
    //掏箱记录结果获取
    var loadunstuff = function (ExamRecID) {
        var data = dataStructure.listData(util.getOption("moduleId"), 'H2000.BizExamContaListRepository', 1, 10, [{ column: "EXAM_REC_ID", symbol: "=", value: ExamRecID }], "", "");
        var successCallBack = function (data) {
            if (data.Status == 1) {
                //清空对象数组
                unstuffRecod = {};
                var rows = data.Data.Rows;
                for (var i = 0, rowLength = rows.length; i < rowLength; i++) {
                    var cell = rows[i].Cell;
                    var record = {};
                    record["ContaID"] = _setData(cell.ContaID);
                    record["HollowArea1"] = _setData(cell.HollowArea1);
                    record["HollowArea2"] = _setData(cell.HollowArea2);
                    record["ChkSeal"] = _setData(cell.ChkSeal);
                    record["ChkTrunk"] = _setData(cell.ChkTrunk);
                    record["ChkContaID"] = _setData(cell.ChkContaID);
                    record["ExamResult"] = _setData(cell.ExamResult);
                    unstuffRecod[cell.ContaID] = record;
                }
            } else {
                console.log("掏箱作业单表体获取失败:" + JSON.stringify(data));
                util.serverFailure($content, function () {
                    loadData();
                }, "数据请求失败")
            }
            showPage();
        };
        var errorCallBack = function (data) {
            util.toast(util.getOption("errorStr"));
            console.log("掏箱作业单表体获取失败:" + JSON.stringify(data));
            util.loadFailure($content, function () {
                loadData();
            });
        };
        util.post(data, true, successCallBack, errorCallBack, "list");
    }
    //设置字段的默认数据
    var _setData = function (val,defaultData) {
        var value = (val && val.length > 0) ? val : defaultData ? defaultData : "";
        return value;
    };
    return {
        loadData: loadData,
        eventInitialize: eventInitialize
    };
})(jQuery);