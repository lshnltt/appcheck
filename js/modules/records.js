//记录模块
var records = (function ($) {
    'use strict';
    //判断手机支不支持touchstart方法
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    var recordObj = {};
    var attBillData = {};
    //判断是否只读
    var readOnly = false;
    var isNull = function (value) {
        var bool = false;
        if (value == null || value == "" || typeof (value) == undefined) {
            bool = true;
        }
        return bool;
    }
    var doNull = function (value) {
        var v = value;
        if (value == null || typeof (value) == undefined || value == "点击添加") {
            v = "";
        }
        return v;
    }
    //生成查验过程记录
    var makeExamModeResult = function () {
        var containerArray = containers.getCommitData();
        var messageData = messages.getComData().Data;
        //集装箱（包括重封号）
        var resultStr = "";
        var sealNoStr = "";
        var length = containerArray.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                if (containerArray[i].ContaResult != 0) {
                    if (resultStr.length == 0) {
                        resultStr = "核对" + containerArray[i].ContainerID + "箱（厢）体/车体" + doNull($(".containerItem").eq(i).find(".leftTxt").eq(3).text());
                    } else {
                        resultStr += "，核对" + containerArray[i].ContainerID + "箱（厢）体/车体" + doNull($(".containerItem").eq(i).find(".leftTxt").eq(3).text());
                    }
                }
                if (!isNull(containerArray[i].NewSealNo)) {
                    if (sealNoStr.length == 0) {
                        sealNoStr = "集装箱" + containerArray[i].ContainerID + "，重封号" + containerArray[i].NewSealNo;
                    } else {
                        sealNoStr += "；集装箱" + containerArray[i].ContainerID + "，重封号" + containerArray[i].NewSealNo;
                    }
                }
            }
            if (resultStr.length == 0) {
                resultStr = "核对箱（厢）体/车体" + doNull($(".containerItem").eq(0).find(".leftTxt").eq(3).text());
            }
        }
        //货物
        var goodsArray = goods.getCommitData();
        var goodInfo = "";
        var errorStr = "";
        var errorGno = "";
        var errStr = "";
        var goodsBool = false;
        for (var i = 0, goodsLength = goodsArray.length; i < goodsLength; i++) {
            var _status = $(".tab_item").eq(2).find(".goodsItem").eq(i).find(".statusBtn");
            var _leftTitleTxt = $(".tab_item").eq(2).find(".goodsItem").eq(i).find(".leftTitleTxt");
            var _realInput = $(".tab_item").eq(2).find(".goodsItem").eq(i).find(".goods_realInputCon");
            var endError = "";
            for (var j = 0, statusLength = _status.length; j < statusLength; j++) {
                if (_status.eq(j).hasClass("redIcon")) {
                    var realTxt = doNull(_realInput.eq(j).find(".leftTxt").text());
                    if (_realInput.eq(j).find(".realInputCon").length > 0) {
                        realTxt = $.trim(_realInput.eq(j).find(".realFieldCommon").val());
                    }
                    if (endError.length == 0) {
                        endError = doNull(_leftTitleTxt.eq(j + 1).text()) + "实际为" + realTxt;
                    } else {
                        endError += "、" + doNull(_leftTitleTxt.eq(j + 1).text()) + "实际为" + realTxt;
                    }
                    goodsBool = true;
                }
            }
            if (endError.length > 0) {
                errorStr += endError + "与申报不符";
            }
            if (goodsBool) {
                errorGno = "第" + (i + 1) + "项商品";
                if (errorStr.length > 0) {
                    if (errStr.length == 0) {
                        errStr = errorGno + "" + errorStr;
                    } else {
                        errStr += "；" + errorGno + "" + errorStr;
                    }
                    errorStr = "";
                }
            } else {
                if (i <= 4) {
                    if (i == 0) {
                        goodInfo += doNull(goodsArray[i].GName);
                    } else {
                        goodInfo += "、" + doNull(goodsArray[i].GName);
                        if (i == 4 && goodsArray.length > 5) {
                            goodInfo += "等";
                        }
                    }
                }
            }
        }

        //货物包装
        var wapStr = "";
        if (wapStr.length == 0) {
            wapStr = doNull($(".record_con2").find(".conRightCon").eq(2).find(".leftTxt").text());
        }
        //随附单据
        var goodsStr = "";
        var option = $(".record_con2").find(".conRightCon").eq(3).data("option");
        for (var prop in option) {
            var count = option[prop]["count"];
            var txt = option[prop]["txt"];
            if (doNull(count) > 0) {
                if (goodsStr.length == 0) {
                    goodsStr = txt + count + "份";
                } else {
                    goodsStr += "，" + txt + count + "份";
                }
            }

        }
        var processStr = "按照查验指令实施查验： \n";
        if (resultStr.length > 0) {
            processStr += "1、" + resultStr + "。\n";
        }

        if (wapStr.length > 0) {
            processStr += "2、货物为" + wapStr + "包装，";
        } else {
            processStr += "2、";
        }
        if (goodsBool) {
            processStr += "经查验货物";
            processStr += "，" + errStr;
        } else {
            if (messageData.ExamTypeChs == "彻底查验" || messageData.ExamTypeChs == "外形查验") {
                goodInfo += "，" + messageData.ExamTypeChs;
            } else {
                goodInfo += "，抽查   件";
            }
            goodInfo += "，" + messageData.ExamModeCodeName.replace(/，/ig, "、") + "与申报相符";
            processStr += "查验货物为" + goodInfo;
        }
        processStr += "。\n";

        var index = 4;
        if (goodsStr.length > 0) {
            processStr += "3、查验现场提交单据：" + goodsStr + "。\n";
        } else {
            index = 3;
        }

        if (sealNoStr.length > 0) {
            processStr += index  + "、" + sealNoStr + "。\n";
        }

        $("#orderText").val(processStr);
    }
    //更改查验数据时改变查验过程记录
    //    var instantModeResult = function () {
    //        if (!$(".containersTab").data("refresh") && !$(".goodsTab").data("refresh") && !$(".recordsTab").data("refresh")) {
    //            makeExamModeResult();
    //        }
    //    }
    var changeClass = function (elemt, type) {
        if (type == 1) {
            elemt.find(".rightInputCon").removeClass("con_grayTxt");
            elemt.find(".rightInputCon").addClass("con_blueTxt");
            elemt.find(".rightFrontCommon").removeClass("grayFront");
            elemt.find(".rightFrontCommon").addClass("blueFront");
        } else {
            elemt.find(".rightInputCon").removeClass("con_blueTxt");
            elemt.find(".rightInputCon").addClass("con_grayTxt");
            elemt.find(".rightFrontCommon").removeClass("blueFront");
            elemt.find(".rightFrontCommon").addClass("grayFront");
        }
    }
    //显示查验要求结果
    var showPage = function (recordObj) {
        $(".record_con3").find("div.leftTitleCon").nextAll().remove();
        if (recordObj.ExamModeCodeName != null) {
            var examModeCodeName = recordObj.ExamModeCodeName.split("，");
            var examModeCodeResult = recordObj.ExamModeCodeResultName.split(",");
            for (var i = 0, codeNameLength = examModeCodeName.length; i < codeNameLength; i++) {
                var _line2 = $("<div>").addClass("line3 ml40 mr40");
                var _rowCommon1 = $("<div>").addClass("rowCommon1");
                var _contTxtComm = $("<div>").addClass("contTxtComm fl").text(examModeCodeName[i]);
                var _conRightCon = $("<div>").addClass("rightOperCon conRightCon fr");
                var _cb = $("<div>").addClass("cb");
                _rowCommon1.append(_contTxtComm).append(_conRightCon).append(_cb);
                $(".record_con3").append(_line2).append(_rowCommon1);
                var ModeData = { "title": _contTxtComm.text() };
                if (examModeCodeName[i] != "取样送检") {
                    util.setChoice(convertCode("EXAM_CODE_OTHER"), 0, examModeCodeResult[i], $(".record_con3").find(".conRightCon").eq(i), true, false);
                    ModeData.typeCode = "EXAM_CODE_OTHER";
                } else {
                    util.setChoice(convertCode("EXAM_CODE_GET"), 0, examModeCodeResult[i], $(".record_con3").find(".conRightCon").eq(i), true, false);
                    ModeData.typeCode = "EXAM_CODE_GET";
                }
                _conRightCon.data(ModeData);
            }
        }
        $("#checkworkPage .recordsTab").data("refresh", false);
    };
    //随附单据
    var getAttBill = function () {
        console.info("5")
        var dtd = $.Deferred();
        changeClass($(".record_con2").find(".conRightCon").eq(3), 2);
        $(".record_con2").find(".conRightCon").eq(3).find(".rightInputCon").html("点击添加");
        var option = {};
        var entryId = $("#checkwork_head").find(".titleBottom").text();
        var examNo = checkList.getCheckItem()["ExamNo"];
        var data = dataStructure.choiceData("SysManager.BizSysDictionaryDataRepository", [entryId, examNo], "GetAttBill", util.getOption("moduleId"));
        var errorCallBack = function (data) {
            util.toast(util.getOption("errorStr"));
            dtd.reject();
        };
        var successCallBack = function (data) {
            attBillData = data;
            if (data.Status == 1) {
                var html = "";
                for (var i = 0, dataLength = data.Data.length; i < dataLength; i++) {
                    if (!isNull(data.Data[i][1].split(":")[1]) && data.Data[i][1].split(":")[1] != 0) {
                        if (html.length == 0) {
                            html += data.Data[i][0] + "×" + data.Data[i][1].split(":")[1];
                        } else {
                            html += "，" + data.Data[i][0] + "×" + data.Data[i][1].split(":")[1];
                        }
                    }
                    var code = data.Data[i][1].split(":")[0];
                    option[code] = { "code": data.Data[i][1].split(":")[0], "txt": data.Data[i][0], "count": data.Data[i][1].split(":")[1] };
                }

                if (html.length > 0) {
                    changeClass($(".record_con2").find(".conRightCon").eq(3), 1);
                    $(".record_con2").find(".conRightCon").eq(3).find(".rightInputCon").html(html);
                }
                $(".record_con2").find(".conRightCon").eq(3).data({ "title": $(".record_con2").find(".contTxtComm").eq(3).text(), "type": 6, "option": option });
                dtd.resolve();
            } else {
                util.toast(data.Data);
                dtd.reject();
            }
        }
        util.post(data, true, successCallBack, errorCallBack, "list");
        return dtd.promise();
    };
    //查验地点
    var getChkGround = function () {
        var dtd = $.Deferred();
        var allRepository = [];
        var data = dataStructure.choiceData("H2000.BizChkGroundRepository", ["1=1", null]);
        var errorCallBack = function (data) {
            util.toast(util.defaultOption.errorStr);
            dtd.reject();
        };
        var successCallBack = function (data) {
            if (data.Status == 1) {
                for (var i = 0, dataLength = data.Data.length; i < dataLength; i++) {
                    allRepository.push({ "ItemCode": data.Data[i][0], "ItemName": data.Data[i][1] });
                }
                util.setChoice(allRepository, 0, recordObj.ExamAddr, $(".record_con2").find(".conRightCon").eq(1), true, true);
                $(".record_con2").find(".conRightCon").eq(1).data({ "title": $(".record_con2").find(".contTxtComm").eq(1).text(), "currentCode": recordObj.ExamAddr });
                dtd.resolve();
            } else {
                util.toast(data.Data);
                dtd.reject();
            }
        }
        util.post(data, true, successCallBack, errorCallBack, "list");
        return dtd.promise();
    }
    //包装种类
    var getWrapType = function () {
        console.info("7");
        var dtd = $.Deferred();
        var allRepository = [];
        var data = dataStructure.choiceData("H2000.BizWrapRepository", ["1=1", null]);
        var errorCallBack = function (data) {
            util.toast(util.defaultOption.errorStr);
            dtd.reject();
        };
        var successCallBack = function (data) {
            if (data.Status == 1) {
                for (var i = 0, dataLength = data.Data.length; i < dataLength; i++) {
                    allRepository.push({ "ItemCode": data.Data[i][0], "ItemName": data.Data[i][1] });
                }
                $(".record_con2").find(".conRightCon").eq(2).data({ "title": $(".record_con2").find(".contTxtComm").eq(2).text() })
                    .attr("hasInput", true).attr("WrapOtherTxt", recordObj.WrapOtherTxt);
                util.setChoice(allRepository, 0, recordObj.WrapTypeResult, $(".record_con2").find(".conRightCon").eq(2), false, false);
                dtd.resolve();
            } else {
                util.toast(data.Data);
                dtd.reject();
            }
        }
        util.post(data, true, successCallBack, errorCallBack, "list");
        return dtd.promise();
    }
    //字典数据
    var convertCode = function (typeCode) {
        var data = Dictionary.dataRepository.getByTypeCode(typeCode);
        return data;
    }


    //页面加载
    var loadData = function () {
        //readOnly = checkList.isReadOnly();
        var dtd = $.Deferred();
        $("#fullBg").removeClass("none");
        var comData = messages.getComData();
        var entryId = $("#checkwork_head").find(".titleBottom").text();
        if (comData && comData.Status == 1) {
            recordObj["ExamTime"] = messages.getMessageObj().CHYZHL.ExamTime;            //查验时间
            recordObj["ExamAddr"] = comData.Data.ExamAddr;                               //查验地点
            recordObj["WrapTypeResult"] = comData.Data.WrapTypeResult;                   //货物包装
            recordObj["WrapOtherTxt"] = comData.Data.WrapOtherTxt;                       //其他货物包装显示
            recordObj["ExamModeCodeName"] = comData.Data.ExamModeCodeName;               //查验要求
            recordObj["ExamModeCodeResultName"] = comData.Data.ExamModeCodeResultName;   //查验要求处理结果
            recordObj["ManChkNotes"] = comData.Data.ManChkNotes;                         //查验过程记录
            recordObj["ExamResult"] = comData.Data.ExamResult;                           //查验结果
            recordObj["ExamProcIdea"] = comData.Data.ExamProcIdea;                       //处理意见
            recordObj["OtherRequire"] = comData.Data.OtherRequire;                       //其他情况
            recordObj["ExamEr2"] = comData.Data.ExamEr2;                                 //陪同查验人员
            recordObj["Remark"] = comData.Data.Remark;
        }
        console.log(recordObj);
        $("#photoNum").html(sencePhoto.getPicCountsByID(entryId));
        $(".rowDataTime").data("currentCode", recordObj["ExamTime"]);
        //查验开始时间设置
        $(".checkStartTime").html(recordObj["ExamTime"] ? recordObj["ExamTime"] : '');
        showPage(recordObj);
        $("#orderText").val(recordObj.ManChkNotes);
        $("#orderText").prop("readonly", checkList.isReadOnly() ? true : false);
        //if (isNull(recordObj.ExamResult)) {
        //    recordObj.ExamResult = "0";
        //}
        //if (isNull(recordObj.ExamProcIdea)) {
        //    recordObj.ExamProcIdea = "0";
        //}
        $(".record_con5").find(".conRightCon").eq(0).data({ "title": $(".record_con5").find(".contTxtComm").eq(0).text(), "currentCode": recordObj.ExamResult });
        $(".record_con5").find(".conRightCon").eq(1).data({ "title": $(".record_con5").find(".contTxtComm").eq(1).text(), "type": 2, "currentCode": recordObj.ExamProcIdea });
        util.setChoice(convertCode("EXAM_RESULT"), 0, recordObj.ExamResult, $(".record_con5").find(".conRightCon").eq(0), true, true, true);
        util.setChoice(convertCode("EXAM_PROC_IDEA"), 0, recordObj.ExamProcIdea, $(".record_con5").find(".conRightCon").eq(1), true, true, true);
        var note = "";
        if (recordObj.Remark && recordObj.Remark.length > 0) {
            changeClass($(".record_con5").find(".conRightCon").eq(2), 1);
            note = recordObj.Remark;
            $(".record_con5").find(".conRightCon").eq(2).find(".rightInputCon").text(recordObj.Remark);
        } else {
            changeClass($(".record_con5").find(".conRightCon").eq(2), 2);
        }
        $(".record_con5").find(".conRightCon").eq(2).data({ "title": $(".record_con5").find(".contTxtComm").eq(2).text(), "currentCode": note, "type": 5 });
        $.when(getAttBill(), getChkGround(), getWrapType()).always(function () { $("#fullBg").addClass("none"); });
        return dtd;
    };
    //绑定页面元素触发事件
    var eventInitialize = function () {

        $("#createOrder").click(function (event) {
            event.preventDefault();
            if (!checkList.isReadOnly()) {
                var $that = $(this);
                $that.addClass("generateOneKey_c");
                setTimeout(function () {
                    $that.removeClass("generateOneKey_c");
                    if ($(".containersTab").data("refresh")) {
                        util.toast("请先查验集装箱");
                    } else if ($(".goodsTab").data("refresh")) {
                        util.toast("请先查验货物");
                    } else {
                        if ($.trim($("#orderText").val()).length > 0) {
                            showDialog10();
                        } else {
                            makeExamModeResult();
                            util.toast("一键生成成功");
                        }
                    }
                }, util.getOption("timer1"));
            }
        });
        //一键生成记录中提示用户是否覆盖原有查验过程记录
        var showDialog10 = function () {
            history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog9", mask: "fullBg" }, "", "index.html?page=page14");
            var $dialog = $("#generateDialog");
            dialog.showDialog($dialog, 0.8, 60);
            $dialog.removeClass("none");
            $dialog.find(".dialogRedBtn").unbind("click");
            $dialog.find(".dialogRedBtn").bind("click", function (e) {
                e.preventDefault();
                var isClicked = $dialog.data("isClicked");
                if (!isClicked) {
                    $dialog.data("isClicked", true);
                    //继续提交的时候SubmitAnyWay传递false
                    history.back();
                    makeExamModeResult();
                    util.toast("一键生成成功");
                }
            });
        }
        //照片点击
        $(".record_con1").click(function (event) {
            event.preventDefault();
            $(this).addClass("newGrayBg");
            setTimeout(function () {
                $(".record_con1").removeClass("newGrayBg");
                var entryId = $("#checkwork_head").find(".titleBottom").text();
                sencePhoto.initView(entryId);
            }, util.getOption("timer2"));
        });

        $(".recordsTab").on("click", ".rowCommon1", function (event) {
            event.preventDefault();
            if (!checkList.isReadOnly()) {
                var that = this;
                $(that).addClass("newRowCommon");
                setTimeout(function () {
                    $(".rowCommon1").removeClass("newRowCommon");
                }, util.getOption("timer1"));
                //获取右边点击按钮
                var $conRightCon = $(that).find(".conRightCon");
                var title = $conRightCon.data("title");
                var type = $conRightCon.data("type");
                var option = $conRightCon.data("option");
                var codeType = $conRightCon.data("codeType");
                var currentCode = $conRightCon.data("currentCode");
                console.log(option);
                switch (type) {
                    case 0:
                        setTimeout(function () {
                            dialog.showDialog0(option, $conRightCon);
                        }, util.getOption("timer2"));
                        break;
                    case 1:
                        break;
                    case 2:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            if (isNull(option)) {
                                util.toast("数据获取失败");
                                util.setChoice(convertCode(codeType), 0, currentCode, $conRightCon, true);
                            } else {
                                if ($(that).hasClass("checkPlaceCon")) {
                                    dialog.showDialog2(option, title, $conRightCon, true);
                                } else {
                                    dialog.showDialog2(option, title, $conRightCon, false);
                                }
                            }
                        }, util.getOption("timer2"));
                        break;
                    case 3:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            if (isNull(option)) {
                                util.toast("数据获取失败");
                                util.setChoice(convertCode(codeType), 0, currentCode, $conRightCon, false);
                            } else {
                                dialog.showDialog3(option, title, $conRightCon, true);
                            }
                        }, util.getOption("timer2"));
                        break;
                    case 4:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            dialog.showDialog4(title, $conRightCon);
                        }, util.getOption("timer2"));
                        break;
                    case 5:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            dialog.showDialog5(title, $conRightCon, 200);
                        }, util.getOption("timer2"));
                        break;
                    case 6:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            if (isNull(option)) {
                                util.toast("数据获取失败");
                                getAttBill();
                            } else {
                                dialog.showDialog6(option, title, $conRightCon, 500);
                            }
                        }, util.getOption("timer2"));
                        break;
                }
            }
        });
    };
    //从后台获取数据
    var _getData = function () {

    };
    var getCommitData = function () {
        var comData = messages.getComData();
        var commitData = {};
        commitData.FormID = doNull($("#checkwork_head").find(".titleBottom").text());
        commitData.ExamRecID = checkList.getCheckItem()["ExamNo"];
        //查验开始时间
        commitData.ExamTime = doNull($(".checkStartTime").html());
        commitData.ExamAddr = $(".record_con2").find(".conRightCon").eq(1).data("currentCode");
        commitData.WrapTypeResult = $(".record_con2").find(".conRightCon").eq(2).data("currentCode");
        commitData.WrapOtherTxt = $(".record_con2").find(".conRightCon").eq(2).attr("WrapOtherTxt");
        var option = $(".record_con2").find(".conRightCon").eq(3).data("option");
        var Bill = [];
        for (var prop in option) {
            var count = option[prop]["count"];
            var code = option[prop]["code"];
            var data = {};
            data.BillType = code;
            data.BillNum = count;
            Bill.push(data);
        }
        commitData.Bill = Bill;
        var _conRightCon = $(".record_con3").find(".conRightCon");
        var codeRe = "";
        for (var i = 0, rightConLength = _conRightCon.length; i < rightConLength; i++) {
            if (codeRe.length == 0) {
                codeRe += _conRightCon.eq(i).data("currentCode");
            } else {
                codeRe += "," + _conRightCon.eq(i).data("currentCode");
            }
        }
        if (codeRe.length == 0) {
            commitData.ExamModeCodeResult = "0";
        } else {
            commitData.ExamModeCodeResult = codeRe;
        }
        if (!recordObj.hasOwnProperty("ExamModeCodeResultName")) {
            commitData.ExamModeCodeResult = messages.getComData().Data.ExamModeCodeResultName;
        }
        commitData.ManChkNotes = doNull($(".record_con4").find(".generateTxt").val());
        commitData.ExamResult = $(".record_con5").find(".conRightCon").eq(0).data("currentCode");
        commitData.ExamProcIdea = $(".record_con5").find(".conRightCon").eq(1).data("currentCode");
        if (commitData.ExamProcIdea == 0) {
            commitData.ExamProcCode = "02";
        } else {
            commitData.ExamProcCode = null;
        }
        commitData.Remark = $(".record_con5").find(".conRightCon").eq(2).data("currentCode");
        return commitData;
    };
    var getMessageObj = function () {
        return messageObj;
    }
    var emptyObj = function () {
        var recordObj = {};
        $("#orderText").val("");
        $(".record_con5").find(".conRightCon").eq(2).find(".rightInputCon").text("点击添加");
    }

    return {
        loadData: loadData,
        getCommitData: getCommitData,
        getMessageObj: getMessageObj,
        emptyObj: emptyObj,
        eventInitialize: eventInitialize
    };
})(jQuery);