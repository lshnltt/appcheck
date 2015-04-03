//信息模块
var messages = (function ($) {
    'use strict';
    var comData;
    //判断手机支不支持touchstart方法
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    var page = 1;
    var pageSize = 9999;
    var messageObj = {
        //布控指令信息
        BKZHL: {
        },
        //查验指令信息.massagesTab
        CHYZHL: {
        },
        //机检查验信息
        JJCHY: {
        },
        //提运单信息
        TYD: []
    };
    //布控指令页面显示
    var depCtrlInst = (function () {
        var showPage = function () {
            var $tabItem = $("#checkworkPage .massagesTab");
            var RskNo = _setData(messageObj.BKZHL["RskNo"]);
            var RskSrc = _setData(messageObj.BKZHL["RskSrcName"]);
            var RskCustoms = _setData(messageObj.BKZHL["RskCustomsName"]);
            var RskDep = _setData(messageObj.BKZHL["RskDep"]);
            var InOpID = _setData(messageObj.BKZHL["InOpID"]);
            var InputDate = _setData(messageObj.BKZHL["InputDate"]);
            var RskReason = _setData(messageObj.BKZHL["RskReason"]);
            var depCtrlRequest = _setData(messageObj.BKZHL["RskRequestStr"]);
            var processmode = _setData(messageObj.BKZHL["RskProcTypeStr"]);
            var remark = _setData(messageObj.BKZHL["NoteS"]);
            var contacter = _setData(messageObj.BKZHL["Contacter"]);
            var contacterTel = _setData(messageObj.BKZHL["ContacterTel"]);
            var SecurityInfo = _setData(messageObj.CHYZHL["SecurityInfo"]);
            var OtherRequire = _setData(messageObj.CHYZHL["OtherRequire"]);
            var NoteS = _setData(messageObj.CHYZHL["NoteS"]);
            var $moduleCon_1 = $tabItem.find("#deployModuleCon");
            $moduleCon_1.addClass("none");
            var $moduleCon_2 = $tabItem.find("#checkModuleCon");
            var $detail_1 = $moduleCon_1.find("#deployModule_deployNum");
            var $detail_2 = $moduleCon_1.find("#deplyModule_deploySource");
            var $detail_3 = $moduleCon_1.find("#deplyModule_deployCustom");
            var $detail_4 = $moduleCon_1.find("#deployModule_deployDept");
            var $detail_5 = $moduleCon_1.find("#deployModule_deployPerson");
            var $detail_6 = $moduleCon_1.find("#deployModule_deployDate");
            var $detail_7 = $moduleCon_1.find("#deployModule_deployReason");
            var $detail_8 = $moduleCon_1.find("#deployModule_deployRequire");
            var $detail_9 = $moduleCon_1.find("#deployModule_deployProcessMode");
            var $detail_10 = $moduleCon_1.find("#deployModule_deployRemark");
            var $detail_11 = $moduleCon_2.find("#checkModule_checkLinkMan");
            var $detail_12 = $moduleCon_2.find("#checkModule_checkPhone");
            var $detail_13 = $moduleCon_2.find("#checkModule_safeWarn");
            var $detail_14 = $moduleCon_2.find("#checkModule_otherSpecialRequire");
            var $detail_15 = $moduleCon_2.find("#checkModule_checkNotes");
            if (!contacter) {
                contacter = "";
            }
            if (!contacterTel) {
                contacterTel = "";
            }
            $detail_1.html(RskNo);
            $detail_2.html(RskSrc);
            $detail_3.html(RskCustoms);
            $detail_4.html(RskDep);
            $detail_5.html(InOpID);
            $detail_6.html(InputDate);
            $detail_7.html(RskReason);
            $detail_8.html(depCtrlRequest);
            $detail_9.html(processmode);
            $detail_10.html(remark);
            $detail_11.html(contacter);
            $detail_12.html(contacterTel);
            $detail_13.html(SecurityInfo);
            $detail_14.html(OtherRequire);
            $detail_15.html(NoteS);
            $moduleCon_1.removeClass("none");
            $tabItem.data("refresh", false);
        };
        return {
            showPage: showPage
        };
    })();
    //查验指令页面显示
    var checkInst = (function () {
        var showPage = function () {
            var $tabItem = $("#checkworkPage .massagesTab");
            var $moduleCon = $tabItem.find("#checkModuleCon");
            var $moduleRecordIdCon = $tabItem.find("#checkRecordIdCon");
            var ExamRecID = _setData(messageObj.CHYZHL["ExamRecID"]);
            $moduleRecordIdCon.find(".checkRecordId:eq(0)").html(ExamRecID);
            $moduleCon.addClass("none");
            var ExamModeCodeName = _setData(messageObj.CHYZHL["ExamModeCodeName"]);
            var ExamModeChs = _setData(messageObj.CHYZHL["ExamModeChs"]);
            var ExamAssign = _setData(messageObj.CHYZHL["ExamAssign"]);
            var ExamTypeChs = _setData(messageObj.CHYZHL["ExamTypeChs"]);
            var ExamTime = _setData(messageObj.CHYZHL["ExamDateTime"]);
            var $detail_1 = $moduleCon.find("#checkModule_checkRequire");
            var $detail_2 = $moduleCon.find("#checkModule_checkMode");
            //var $detail_3 = $moduleCon.find(".rightDetail:eq(2)");
            //var $detail_4 = $moduleCon.find(".rightDetail:eq(3)");
            $detail_1.html(ExamModeCodeName);
            $detail_2.html(ExamModeChs + "：" + ExamTypeChs);
            //$detail_3.html(ExamAssign);
            //$detail_4.html(ExamTime);
            $moduleCon.removeClass("none");
            $tabItem.data("refresh", false);
        };
        return {
            showPage: showPage
        };
    })();
    //机检查验指令页面显示
    var machineCheckInst = (function () {
        var showPage = function () {
            var $tabItem = $("#checkworkPage .massagesTab");
            var $moduleCon = $tabItem.find("#mCheckModuleCon");
            $moduleCon.addClass("none");
            var ExamModeCodeResult = _setData(messageObj.JJCHY["ExamModeCodeResult"]);
            var ExamModeCodeName = _setData(messageObj.JJCHY["ExamModeCodeName"]);
            var MacChkNotes = _setData(messageObj.JJCHY["MacChkNotes"]);
            var MacExamResult = _setData(messageObj.JJCHY["MacExamResult"]);
            var MackResultName = _setData(messageObj.JJCHY["MacResultName"]);
            var MacExamProcIdea = _setData(messageObj.JJCHY["MacExamProcIdea"]);
            var MacIdeaName = _setData(messageObj.JJCHY["MacIdeaName"]);
            var MacExamEr1 = _setData(messageObj.JJCHY["MacExamEr1"]);
            var MacTime = _setData(messageObj.JJCHY["MacTime"]);
            var $detail_1 = $moduleCon.find("#mCheckModule_mCheckRecord");
            var $detail_2 = $moduleCon.find("#mCheckModule_mCheckResult");
            var $detail_3 = $moduleCon.find("#mCheckModule_mCheckAdvice");
            var $detail_4 = $moduleCon.find("#mCheckModule_mCheckPerson");
            var $detail_5 = $moduleCon.find("#mCheckModule_mCheckTime");
            $detail_1.html(MacChkNotes);
            $detail_2.html(MackResultName);
            $detail_3.html(MacIdeaName);
            $detail_4.html(MacExamEr1);
            $detail_5.html(MacTime);
            $moduleCon.removeClass("none");
            $tabItem.data("refresh", false);
        };
        return {
            showPage: showPage
        };
    })();
    //提运单信息页面显示
    var wayBillPage = (function () {
        var showPage = function () {
            var $wayBillModuleCon = $("#checkworkPage #wayBillModuleCon");
            var $messageItemCon = $wayBillModuleCon.find(".messageItemCon");
            $messageItemCon.empty();
            var billNo = messageObj.CHYZHL["BillNo"];
            if (billNo) {
                var $messageItem = $("<div>").addClass("messageItem");
                var $leftTitle = $("<div>").addClass("leftTitle fc8c f26 tr").html("提运单号");
                var $rightDetail = $("<div>").addClass("rightDetail fc47 f32 tl").html(billNo);
                $messageItem.append($leftTitle).append($rightDetail).append($cb);
                if (messageObj.TYD.length > 0) {
                    var $cb = $("<div>").addClass("cb");
                    var $messageItem1 = $("<div>").addClass("messageItem");
                    var $leftTitle1 = $("<div>").addClass("leftTitle fc8c fcc555  f32 tc goodsNo").html("货物序号");
                    var $rightDetail1 = $("<div>").addClass("rightDetail fc47 fcc555  f32 tc goodsDescription").html("货物描述");
                    var $rightMarks = $("<div>").addClass("rightDetail fc47 fcc555  f32 tc goodsMarks").html("唛头");
                    var $cb1 = $("<div>").addClass("cb");
                    $messageItem1.append($leftTitle1).append($rightDetail1).append($rightMarks).append($cb1);
                    $messageItemCon.append($messageItem).append($("<div>").addClass("line2"))
                        .append($messageItem1).append($("<div>").addClass("line2"));
                } else {
                    $messageItem.append($leftTitle).append($rightDetail);
                    $messageItemCon.append($messageItem);
                }
            }
            $.each(messageObj.TYD, function (i, item) {
                var wayBillAndGoodObj = item;
                var cell = item.Cell;
                //提运单号
                var billNum = cell.BillNo;
                //货物序号
                var GNo = cell.GNo || "";
                //货物描述
                var GoodsMemo = cell.GoodsMemo || "";
                //唛头
                var goodsMark = cell.MarkContr || "";
                var $messageItem1 = $("<div>").addClass("messageItem");
                var $leftTitle = $("<div>").addClass("leftTitle fc8c f26 tc goodsNo").html(GNo);
                var $rightDetail = $("<div>").addClass("rightDetail fc47 f32 tl goodsDescription").html(GoodsMemo);
                var $rightMarks = $("<div>").addClass("rightDetail fc47 f32 tl goodsMarks").html(goodsMark);
                var $cb = $("<div>").addClass("cb");
                var $line2 = $("<div>").addClass("line2");
                $messageItem1.append($leftTitle).append($rightDetail).append($rightMarks).append($cb);
                $messageItemCon.append($messageItem1).append($line2);
            });
        };
        return {
            showPage:showPage
        };
    })();
    //页面加载
    var loadData = function (dtd) {
        history.pushState({ page: "page1" }, "", "index.html?page=page1");
        $(".tab .tabCommon").removeClass("tab_current");
        $(".tab:eq(" + 0 + ") .tabCommon").addClass("tab_current");
        $(".tab_item").addClass("none");
        var $tabItem = $("#checkworkPage .massagesTab");
        $tabItem.find("#deployModuleCon").addClass("none");
        $tabItem.find("#checkModuleCon").addClass("none");
        $tabItem.find("#mCheckModuleCon").addClass("none");
        $tabItem.removeClass("none");
        _init();
        var EntryID = $("#checkwork_head .titleBottom").html();
        var examNo = checkList.getCheckItem()["ExamNo"];
        sencePhoto.getPicCountsByID(EntryID); //获取报关单照片
        $("#fullBg").removeClass("none");
        //获取布控指令的数据
        var getBKZHL = function () {
            $("#deployModuleCon .messageItemCon").addClass("none");
            $("#deployModuleCon .downSelectIcon").removeClass("upSelectIcon");
            console.info("1");
            var _dtd = $.Deferred();
            var RskNo = checkList.getCheckItem()["RskNo"];
            var data = dataStructure.formData(util.getOption("moduleId"), "H2000.BizRskInstrAttrRelRepository", JSON.stringify({ "RskNo": RskNo }));
            var successCallBack = function (data) {
                if (data.Status == "1") {
                    //转换时间
                    var time = util.dtJsonFormat(data.Data.InputDate, "yyyy-MM-dd HH:mm:ss");
                    var item = messageObj.BKZHL;
                    //布控指令号
                    item["RskNo"] = data.Data.RskNo;
                    //布控来源
                    item["RskSrc"] = data.Data.RskSrc;
                    //布控关别
                    item["RskCustoms"] = data.Data.RskCustoms;
                    //布控部门
                    item["RskDep"] = data.Data.RskDep;
                    //布控人
                    item["InOpID"] = data.Data.InOpID;
                    //布控日期
                    item["InputDate"] = time;
                    //布控理由
                    item["RskReason"] = data.Data.RskReason;
                    //布控要求
                    item["RskRequestStr"] = data.Data.RskRequestStr;
                    //处理方式
                    item["RskProcTypeStr"] = data.Data.RskProcTypeStr;
                    //备注
                    item["NoteS"] = data.Data.NoteS;
                    //联系人
                    item["Contacter"] = data.Data.Contacter;
                    //联系电话
                    item["ContacterTel"] = data.Data.ContacterTel;
                    var objArray = [];
                    var rskCustomsObj = {
                        "BizName": "H2000.BizCustomsRepository",
                        "Value": data.Data.RskCustoms
                    };
                    var rskSrcObj = {
                        "BizName": "H2000.BizRskSrcRelRepository",
                        "Value": "40"
                    };
                    objArray.push(rskCustomsObj);
                    objArray.push(rskSrcObj);
                    var sendData = dataStructure.choiceData("IDP.Sys.AC", [JSON.stringify(objArray)], "GetACData", util.getOption("moduleId"));
                    var successBack = function (data) {
                        if (data.Status == 1) {
                            var getData = data.Data;
                            if (data.Data && data.Data.length) {
                                if (getData[0][1]) {
                                    item["RskCustomsName"] = getData[0][1];
                                } else {
                                    item["RskCustomsName"] = '';
                                }
                                if (getData[1]) {
                                    item["RskSrcName"] = getData[1][1];
                                } else {
                                    item["RskSrcName"] = '';
                                }
                            }
                            //depCtrlInst.showPage();
                        } else {
                            util.toast(data.Data);
                        }
                        _dtd.resolve();
                    };
                    var errorBack = function (data) {
                        util.toast(util.getOption("errorStr"));
                        console.log(JSON.stringify(data));
                        _dtd.resolve();
                    };
                    util.post(sendData, true, successBack, errorBack, "method");

                } else {
                    util.toast(data.Data);
                    _dtd.resolve();
                    //dtd.reject();
                }
                return _dtd;
            };
            var errorCallBack = function (data) {
                util.toast(util.getOption("errorStr"));
                console.log(JSON.stringify(data));
                //dtd.reject();
                dtd.resolve();
            };
            util.post(data, true, successCallBack, errorCallBack, "form");
        };
        //获取查验指令和机检查验记录的数据
        var getCHYZHL = function () {
            console.info("2");
            //var dtd = $.Deferred();
            var data = dataStructure.formData(util.getOption("moduleId"), "H2000.BizRskExamHeadRelRepository", JSON.stringify({ "ExamRecID": examNo, "FormID": EntryID }));
            var successCallBack = function (data) {
                comData = data;
                if (data.Status == "1") {
                    var time1 = util.dtJsonFormat(data.Data.ExamTime, "yyyy-MM-dd HH:mm:ss");
                    var time2 = util.dtJsonFormat(data.Data.MacTime, "yyyy-MM-dd HH:mm:ss");
                    //查验要求对象
                    var item1 = messageObj.CHYZHL;
                    //机检查验对象
                    var item2 = messageObj.JJCHY;
                    //运单号
                    var BillNo = data.Data.BillNo;
                    //运输方式
                    var TrafMode = data.Data.TrafMode;
                    //运输工具名称
                    var TrafName = data.Data.TrafName;
                    //货物运输批次号
                    //进出境口岸代码
                    //var transpostObj = {};
                    //transpostObj["BillNo"] = BillNo;
                    //transpostObj["TrafMode"] = TrafMode;
                    //transpostObj["TrafName"] = TrafName;
                    //getTYD(transpostObj);
                    item1["BillNo"] = BillNo;
                    //查验要求
                    item1["ExamModeCodeName"] = data.Data.ExamModeCodeName;
                    //查验方式
                    item1["ExamModeChs"] = data.Data.ExamModeChs;
                    item1["ExamTypeChs"] = data.Data.ExamTypeChs;
                    //查验指派人
                    item1["ExamAssign"] = data.Data.ExamAssign;
                    //选查时间
                    item1["ExamTime"] = time1;
                    //是否有掏箱作业记录
                    item1["ContaCount"] = data.Data.ContaCount;
                    //是否显示掏箱作业页面 
                    item1["ContaShow"] = data.Data.ContaShow;
                    //安全提示
                    item1["SecurityInfo"] = data.Data.SecurityInfo;
                    //其他特殊要求
                    item1["OtherRequire"] = data.Data.OtherRequire;
                    //备注
                    item1["NoteS"] = data.Data.NoteS;
                    //查验记录单号
                    item1["ExamRecID"] = data.Data.ExamRecID;
                    //机检查验
                    //查验要求处理结果
                    item2["ExamModeCodeResult"] = data.Data.ExamModeCodeResult;
                    //机检查验记录
                    item2["MacChkNotes"] = data.Data.MacChkNotes;
                    //查验结果
                    item2["MacExamResult"] = data.Data.MacExamResult;
                    //处理意见
                    item2["MacExamProcIdea"] = data.Data.MacExamProcIdea;
                    //查验人员
                    item2["MacExamEr1"] = data.Data.MacExamEr1;
                    //查验时间
                    item2["MacTime"] = time2;
                    getTYD();
                    var resultData = convertCode("MAC_EXAM_RESULT");
                    var ideaData = convertCode("MAC_EXAM_PROC_IDEA");
                    var resultName = '';
                    var ideaName = '';
                    for (var i in resultData) {
                        if (resultData[i]["ItemCode"] == item2["MacExamResult"]) {
                            resultName = resultData[i]["ItemName"];
                            break;
                        }
                    }
                    for (var j in ideaData) {
                        if (ideaData[j]["ItemCode"] == item2["MacExamProcIdea"]) {
                            ideaName = ideaData[j]["ItemName"];
                            break;
                        }
                    }
                    item2["MacResultName"] = resultName;
                    item2["MacIdeaName"] = ideaName;
                    checkInst.showPage();
                    if (item2["MacExamResult"] && item2["MacExamResult"].length > 0) {
                        machineCheckInst.showPage();
                    }
                    item2["leftContainers"] = data.Data.leftContainers;
                    dtd.resolve();
                } else {
                    util.toast(data.Data);
                    //dtd.reject();
                    dtd.resolve();
                }

            };
            var errorCallBack = function (data) {
                util.toast(util.getOption("errorStr"));
                console.log(JSON.stringify(data));
                //dtd.reject();
                dtd.resolve();
            };
            util.post(data, true, successCallBack, errorCallBack, "form");
        };
        //获取提运单
        var getTYD = function () {
            $("#wayBillModuleCon .messageItemCon").addClass("none");
            $("#wayBillModuleCon .downSelectIcon").removeClass("upSelectIcon");
            var data = dataStructure.listData(util.getOption("moduleId"), "Manifest.BizManifestGoodsRepository", page, pageSize,
                [{ "column": "ENTRY_ID", "symbol": "=", "value": EntryID }],"","",[]);
            var successBack = function (data) {
                if (data.Status == "1") {
                    if (data.Data) {
                        console.info(data.Data);
                        var Waybills = data.Data.Rows || [];
                        messageObj.TYD = Waybills;
                        //var billNo = (Waybills[0] && Waybills[0].Cell) ? Waybills[0].Cell.BillNo : "";
                        wayBillPage.showPage();
                    } else {
                        util.toast(JSON.stringify(data));
                    }
                } else {
                    util.toast(JSON.stringify(data));
                }
            };
            var errorBack = function (data) {
                util.toast(util.getOption("errorStr"));
                console.log(JSON.stringify(data));
            };
            util.post(data, true, successBack, errorBack, "list");
        };
        $.when(getBKZHL()).done(function () {
            getCHYZHL();
        }).always(function () { $("#fullBg").addClass("none"); });
    };
    var _init = function () {
        var initPage = function () {
            var $tabItem = $("#checkworkPage .massagesTab");
            var $moduleCon_1 = $tabItem.find("#deployModuleCon");
            var $moduleCon_2 = $tabItem.find("#checkModuleCon");
            var $moduleCon_3 = $tabItem.find("#mCheckModuleCon");
            $moduleCon_1.find(".rightDetail").html("");
            $moduleCon_2.find(".rightDetail").html("");
            $moduleCon_3.find(".rightDetail").html("");
        };
        var eventInitialize = function () {
            $("#deployModuleCon .messageTitleCon,#wayBillModuleCon .messageTitleCon").unbind("click");
            $("#deployModuleCon .messageTitleCon,#wayBillModuleCon .messageTitleCon").bind("click", function () {
                //获取布控指令是隐藏还是显示的
                var showFlag = $(this).siblings(".messageItemCon").data("showFlag");
                if (!showFlag) {    
                    //如果布控指令是隐藏的则显示起来
                    $(this).siblings(".messageItemCon").removeClass("none").data("showFlag", true);
                    $(this).find(".downSelectIcon").addClass("upSelectIcon");
                } else {
                    $(this).siblings(".messageItemCon").addClass("none").data("showFlag", false);
                    $(this).find(".downSelectIcon").removeClass("upSelectIcon");
                }
            });
        };
        initPage();
        eventInitialize();
    }
    var getComData = function () {
        return comData;
    }
    var getMessageObj = function () {
        return messageObj;
    };
    var convertCode = function (typeCode) {
        var data = Dictionary.dataRepository.getByTypeCode(typeCode);
        return data;
    };
    var emptyData = function () {
        messageObj = {
            //布控指令信息
            BKZHL: {
            },
            //查验指令信息
            CHYZHL: {
            },
            //机检查验信息
            JJCHY: {
            },
            TYD: []
        };
    };
    var _setData = function (val) {
        var value = (val && val.length > 0) ? val : "";
        return value;
    };
    return {
        loadData: loadData,
        getComData: getComData,
        getMessageObj: getMessageObj,
        emptyData: emptyData
    }
})(jQuery);