//人工查验作业
var checkwork = (function ($) {
    'use strict';
    //判断手机支不支持touchstart方法
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    //获取报关单打开的状态
    var entryState = -1;
    //判断页面是否只读
    var readOnly = false;
    var defaultOption = {
        flowTop: 0.7,
        flowLeft: 0,
        flowPosition: "fixed",
        cygchjlStr: "查验过程记录不能为空\n",

        fzhhStr: "封志号不能为空\n",
        fzhhNumStr: "封志号必须是数字\n",
        fzhhLengthStr: "封志号不能超过限定长度\n",

        fzhhjchjgStr: "封志号检查结果不能为空\n",

        shjdxfshyStr: "实际开拆方式1不能为空\n",

        shjdxfsheStr: "实际开拆方式2不能为空\n",

        shjbmStr: "实际编码不能为空\n",
        shjbmNumStr: "实际编码必须是数字\n",
        shjbmLengthStr: "实际编码不能超过限定长度\n",
        shibmResultStr: "实际编码和申报编码比对是相符\n",

        shjpmStr: "实际品名不能为空\n",
        shjpmLengthStr: "实际品名不能超过限定长度\n",
        shjpmResultStr: "实际品名和申报品名比对是相符\n",

        shjggStr: "实际规格不能为空\n",
        shjggLengthStr: "实际规格不能超过限定长度\n",
        shjggResultStr: "实际规格和申报规格比对是相符\n",

        shjychdStr: "实际原产地不能为空\n",
        shjychdResultStr: "实际原产地与申报原产地比对是相符\n",

        shjdwStr: "实际单位不能为空\n",
        shjdwResultStr: "实际单位和申报单位比对是相符\n",

        shjshlStr: "实际数量不能为空\n",
        shjshlLengthStr: "实际数量不能超过限定长度\n",
        shjshlNumStr: "实际数量必须是数字\n",
        shjshlResultStr: "实际数量与申报数量比对是相符\n",

        shjbzhStr: "实际币制不能为空\n",
        shjbzhResultStr: "实际币制与申报币制比对是相符\n",

        shjhzhStr: "实际货值不能为空\n",
        shjhzhLengthStr: "实际货值不能超过限定长度\n",
        shjhzhNumStr: "实际货值必须是数字\n",
        shjhzhResultStr: "实际货值与申报货值比对是相符\n",
        generateMaxLength: 1200
    };
    var isNull = function (validateStr) {
        if (!validateStr || validateStr.length == 0) {
            return true;
        } else {
            return false;
        }
    };
    var isFloat = function (validateStr) {
        if (/^\d+(\.\d+)?$/.test(validateStr)) {
            return true;
        } else {
            return false;
        }
    };
    var isNumber = function (validateStr) {
        if (/(^[0-9]\d*$)/.test(validateStr)) {
            return true;
        } else {
            return false;
        }
    };
    //validateStr表示将要验证是否为空的变量，nullStr变量为空时候的提示
    //bool表示该变量是否已经验证完成，true表示已经验证完成，false表示还没有验证
    var validateNull = function (validateStr, nullStr, bool) {
        var warnObj = null;
        if (!bool) {
            if (isNull(validateStr)) {
                warnObj = {};
                warnObj["nullStr"] = nullStr;
                warnObj["bool"] = true;
            }
        }
        return warnObj;
    };
    //货物对比，申报，实际，对比结果，空提醒，对比提醒，boolbool表示该变量是否已经验证完成，true表示已经验证完成，false表示还没有验证,type表示是提交还是保存
    var validateNullNew = function (oldStr, validateStr, result, nullStr, resultStr, bool, type) {
        var warnObj = null;
        if (!bool) {
            if (isNull(validateStr)) {
                if (type === "submit") {
                    warnObj = {};
                    warnObj["warnStr"] = nullStr;
                    warnObj["bool"] = true;
                }
            } else {
                if (!result) {   //如果结果不相符
                    if (oldStr == validateStr) {  //申报和实际是相等的
                        warnObj = {};
                        warnObj["warnStr"] = resultStr;
                        warnObj["bool"] = true;
                    }
                }
            }
        }
        return warnObj;
    };
    //验证变量是否是整数字符串,type表示是提交还是保存
    var validateNumAndNull = function (validateStr, numStr, bool, type) {
        var warnObj = null;
        if (!bool) {
            if ((type === "submit" && isNull(validateStr)) || !isNumber(validateStr)) {
                warnObj = {};
                warnObj["numStr"] = numStr;
                warnObj["bool"] = true;
            }
        }
        return warnObj;
    };
    //货物对比，申报，实际，对比结果，空提醒，对比提醒，boolbool表示该变量是否已经验证完成，true表示已经验证完成，false表示还没有验证,
    //type表示是提交还是保存
    var validateNumAndNullNew = function (oldStr, validateStr, result, numStr, resultStr, bool, type) {
        var warnObj = null;
        if (!bool) {
            if ((type === "submit" && isNull(validateStr)) || !isNumber(validateStr)) {
                warnObj = {};
                warnObj["warnStr"] = numStr;
                warnObj["bool"] = true;
            } else {
                if (!result) {   //如果结果不相符
                    if (oldStr == validateStr) {  //申报和实际是相等的
                        warnObj = {};
                        warnObj["warnStr"] = resultStr;
                        warnObj["bool"] = true;
                    }
                }
            }
        }
        return warnObj;
    }
    //验证变量是否数字字符串
    var validateDigitAndNull = function (validateStr, numStr, bool) {
        var warnObj = null;
        if (!bool) {
            if (isNull(validateStr) || isNaN(validateStr)) {
                warnObj = {};
                warnObj["numStr"] = numStr;
                warnObj["bool"] = true;
            }
        }
        return warnObj;
    };
    //验证字节是否超过限定长度
    var validateBitLength = function (value, warnStr, maxLength, bool) {
        var warnObj = null;
        var lengthBool = false;
        if (!bool) {
            if (value) {
                while (value.replace(/[^\x00-\xff]/g, '**').length > maxLength) {
                    value = value.slice(0, -1);
                    lengthBool = true;
                }
                if (lengthBool) {
                    warnObj = {};
                    warnObj["warnStr"] = warnStr;
                    warnObj["bool"] = true;
                }
            }
        }
        return warnObj;
    };
    //验证字符是否超过限定长度
    var validateStrLength = function (value, warnStr, maxLength, bool) {
        var warnObj = null;
        if (!bool) {
            if (value.length > maxLength) {
                warnObj = {};
                warnObj["warnStr"] = warnStr;
                warnObj["bool"] = true;
            }
        }
        return warnObj;
    };
    //货物验证变量是否数字字符串
    var validateDigitAndNullNew = function (oldStr, validateStr, result, numStr, resultStr, bool) {
        var warnObj = null;
        if (!bool) {
            if (isNull(validateStr) || isNaN(validateStr)) {
                warnObj = {};
                warnObj["warnStr"] = numStr;
                warnObj["bool"] = true;
            } else {
                if (!result) {   //如果结果不相符
                    if (oldStr == validateStr) {  //申报和实际是相等的
                        warnObj = {};
                        warnObj["warnStr"] = resultStr;
                        warnObj["bool"] = true;
                    }
                }
            }
        }
        return warnObj;
    }
    //验证比对结果是否正确
    var validateResultMatch = function (oldTxt, validateStr, result, resultStr, bool) {
        var warnObj = null;
        if (!bool) {
            //如果状态是不相符
            if (!result) {
                if (oldTxt == validateStr) {
                    warnObj = {};
                    warnObj["warnStr"] = resultStr;
                    warnObj["bool"] = true;
                }
            }
        }
        return warnObj;
    }
    //验证提交的数据
    var validateData = function (type) {
        var str = '';
        var haveConts = $("#checkworkPage .containersTab").attr("haveConts");
        //改变提醒的数据
        var changeWarnData = function (obj) {
            var getWarnStr = function () {
                if (obj && obj["warnStr"]) {
                    return obj["warnStr"];
                }
                return '';
            };
            var getWarnBool = function () {
                if (obj && obj["bool"]) {
                    return obj["bool"];
                }
                return false;
            };
            return {
                getWarnStr: getWarnStr,
                getWarnBool: getWarnBool
            }
        }
        //集装箱模块数据的验证
        var containerValidate = function (type) {
            var valStr = '';
            var newSealNoBool = false;
            var sealNoResultBool = false;
            var realHollowArea1Bool = false;
            var realHollowArea2Bool = false;
            $(".containerItem").each(function () {
                var NewSealNo = $(this).find(".conRightCon:eq(" + 2 + ")").data("currentCode");
                var SealNoResult = $(this).find(".conRightCon:eq(" + 3 + ")").data("currentCode");
                var RealHollowArea1 = $(this).find(".conRightCon:eq(" + 4 + ")").data("currentCode");
                var RealHollowArea2 = $(this).find(".conRightCon:eq(" + 5 + ")").data("currentCode");
                var newSealNoObj = validateNull(NewSealNo, defaultOption.fzhhStr, newSealNoBool);
                var sealNoResultObj = validateNull(SealNoResult, defaultOption.fzhhjchjgStr)
                var realHollowArea1Obj = validateNull(RealHollowArea1, defaultOption.shjdxfshyStr);
                var realHollowArea2Obj = validateNull(RealHollowArea2, defaultOption.shjdxfsheStr);
                //if (newSealNoObj) {  //封志号不做判断
                //    newSealNoBool = newSealNoObj["bool"];
                //    valStr += newSealNoObj["nullStr"];
                //}
                if (sealNoResultObj) {
                    newSealNoBool = sealNoResultObj["bool"];
                    valStr += sealNoResultObj["numStr"];
                }
                if (realHollowArea1Obj) {
                    realHollowArea1Bool = realHollowArea1Obj["bool"];
                    valStr += realHollowArea1Obj["nullStr"];
                }
                if (realHollowArea2Obj) {
                    realHollowArea2Bool = realHollowArea2Obj["bool"];
                    valStr += realHollowArea2Obj["nullStr"];
                }
            });
            return valStr;
        };
        //货物模块数据验证
        var goodsValidate = function (type) {
            var valStr = '';
            var goodInfos = goods.getCommitData();
            var RealCodeTsBool = false;
            var RealGNameBool = false;
            var RealGModelBool = false;
            var RealOriginCountryBool = false;
            var RealGUnitBool = false;
            var RealQty1Bool = false;
            var RealTradeCurrBool = false;
            var RealTradeTotalBool = false;
            //判断货物中字段长度限制的值
            var RealCodeTsLengthBool = false;
            var RealGNameLengthBool = false;
            var RealGModelLengthBool = false;
            var RealOriginCountryLengthBool = false;
            var RealGUnitLengthBool = false;
            var RealQty1LengthBool = false;
            var RealTradeCurrLengthBool = false;
            var RealTradeTotalLengthBool = false;
            for (var i = 0; i < goodInfos.length; i++) {
                var index = i + 1
                var goodObj = goodInfos[i];
                var theGoodStr = "货物-" + goodObj.GName + ":\n";
                var warnStr = "";
                var RealCodeTsObj = validateNumAndNullNew(goodObj.CodeTs, goodObj.RealCodeTs, goodObj.CodeTsResult, defaultOption.shjbmNumStr, defaultOption.shibmResultStr, RealCodeTsBool, type);

                var RealGNameObj = validateNullNew(goodObj.GName, goodObj.RealGName, goodObj.GNameResult, defaultOption.shjpmStr, defaultOption.shjpmResultStr, RealGNameBool, type);
                var RealGModelObj = validateResultMatch(goodObj.GModel, goodObj.RealGModel, goodObj.GModelResult, defaultOption.shjggResultStr, RealGModelBool, type);
                var RealOriginCountryObj = validateNullNew(goodObj.OriginCountry, goodObj.RealOriginCountry, goodObj.OriginCountryResult, defaultOption.shjychdStr, defaultOption.shjychdResultStr, RealOriginCountryBool, type);
                var RealGUnitObj = validateNullNew(goodObj.GUnit, goodObj.RealGUnit, goodObj.GUnitResult, defaultOption.shjdwStr, defaultOption.shjdwResultStr, RealGUnitBool, type);
                var RealQty1Obj = validateDigitAndNullNew(goodObj.Qty1, goodObj.RealQty1, goodObj.Qty1Result, defaultOption.shjshlNumStr, defaultOption.shjshlResultStr, RealQty1Bool, type);
                var RealTradeCurrObj = validateNullNew(goodObj.TradeCurr, goodObj.RealTradeCurr, goodObj.TradeCurrResult, defaultOption.shjbzhStr, defaultOption.shjbzhResultStr, RealTradeCurrBool, type);
                var RealTradeTotalObj = validateDigitAndNullNew(goodObj.TradeTotal, goodObj.RealTradeTotal, goodObj.TradeTotalResult, defaultOption.shjhzhNumStr, defaultOption.shjhzhResultStr, RealTradeTotalBool, type);

                RealCodeTsBool = changeWarnData(RealCodeTsObj).getWarnBool();
                warnStr += changeWarnData(RealCodeTsObj).getWarnStr();

                RealGNameBool = changeWarnData(RealGNameObj).getWarnBool();
                warnStr += changeWarnData(RealGNameObj).getWarnStr();

                RealGModelBool = changeWarnData(RealGModelObj).getWarnBool();
                warnStr += changeWarnData(RealGModelObj).getWarnStr();

                RealOriginCountryBool = changeWarnData(RealOriginCountryObj).getWarnBool();
                warnStr += changeWarnData(RealOriginCountryObj).getWarnStr();

                RealGUnitBool = changeWarnData(RealGUnitObj).getWarnBool();
                warnStr += changeWarnData(RealGUnitObj).getWarnStr();

                RealQty1Bool = changeWarnData(RealQty1Obj).getWarnBool();
                warnStr += changeWarnData(RealQty1Obj).getWarnStr();

                RealTradeCurrBool = changeWarnData(RealTradeCurrObj).getWarnBool();
                warnStr += changeWarnData(RealTradeCurrObj).getWarnStr();

                RealTradeTotalBool = changeWarnData(RealTradeTotalObj).getWarnBool();
                warnStr += changeWarnData(RealTradeTotalObj).getWarnStr();
                //编码长度限制
                var RealCodeTsLengthObj = validateStrLength(goodObj.RealCodeTs, defaultOption.shjbmLengthStr, 16, RealCodeTsLengthBool);
                //品名长度限制
                var RealGNameLengthObj = validateBitLength(goodObj.RealGName, defaultOption.shjpmLengthStr, 255, RealGNameLengthBool);
                //规格长度限制
                var RealGModelLengthObj = validateBitLength(goodObj.RealGModel, defaultOption.shjggLengthStr, 255, RealGModelLengthBool);
                //数量长度限制
                var RealQty1LengthObj = validateStrLength(goodObj.RealQty1, defaultOption.shjshlLengthStr, 13, RealQty1LengthBool);
                //币值长度限制
                var RealTradeCurrLengthObj = validateStrLength(goodObj.RealTradeTotal, defaultOption.shjhzhLengthStr, 14, RealTradeTotalLengthBool);
                //编码长度限制对象
                RealCodeTsLengthBool = changeWarnData(RealCodeTsLengthObj).getWarnBool();
                warnStr += changeWarnData(RealCodeTsLengthObj).getWarnStr();
                //品名长度限制对象
                RealGNameLengthBool = changeWarnData(RealGNameLengthObj).getWarnBool();
                warnStr += changeWarnData(RealGNameLengthObj).getWarnStr();
                //规格长度限制对象
                RealGModelLengthBool = changeWarnData(RealGModelLengthObj).getWarnBool();
                warnStr += changeWarnData(RealGModelLengthObj).getWarnStr();
                //数量长度限制对象
                RealQty1LengthBool = changeWarnData(RealQty1LengthObj).getWarnBool();
                warnStr += changeWarnData(RealQty1LengthObj).getWarnStr();
                //货值长度限制对象
                RealTradeCurrLengthBool = changeWarnData(RealTradeCurrLengthObj).getWarnBool();
                warnStr += changeWarnData(RealTradeCurrLengthObj).getWarnStr();
                if (warnStr.length != 0) {    //如果有错误信息
                    valStr += theGoodStr;
                    valStr += warnStr;
                }
            }
            return valStr;
        };
        //记录模块数据验证
        var recordValidate = function (type) {
            var valStr = '';
            //保存的时候对数据进行验证
            //获取查验过程记录对应jquery对象
            var $textarea = $(".record_con4").find(".generateTxt");
            //获取查验过程记录的值
            var ManChkNotes = $textarea.val();
            if (ManChkNotes.replace(/[^\x00-\xff]/g, '**').length > defaultOption.generateMaxLength) {
                valStr += "查验过程记录超过限制长度\n";
            }
            if (type === "submit") {
                //提交是需要判断的数据
                var now = new Date();
                //var examTimeStr = $(".rowDataTime").find(".leftTxt").html();
                //var examDateTime = '';
                var checkDateMilliseconds = 0;
                var ExamAddr = records.getCommitData()["ExamAddr"];
                var WrapTypeResult = records.getCommitData()["WrapTypeResult"];
                var bill = records.getCommitData()["Bill"];
                var ExamProcIdea = records.getCommitData()["ExamProcIdea"];
                var ExamResult = records.getCommitData()["ExamResult"];
                //if (examTimeStr.length > 0) {
                //    examDateTime = util.strToDate(examTimeStr, " ", "-", ":");
                //    checkDateMilliseconds = examDateTime.getTime();
                //    var nowMilliseconds = now.getTime();
                //    if (checkDateMilliseconds > nowMilliseconds) {
                //        valStr += "查验时间不能比当前时间晚\n";
                //    }
                //} else {
                //    valStr += "查验时间不能为空\n";
                //}
                if (!ExamAddr || ExamAddr.length == 0) {
                    valStr += "查验地点不能为空\n";
                }
                if (!WrapTypeResult || WrapTypeResult.length == 0) {
                    valStr += "货物包装不能为空\n";
                }
                if (!bill || bill.length == 0) {
                    valStr += "随附单据清单不能为空\n";
                }
                if (!ExamProcIdea || ExamProcIdea.length == 0) {
                    valStr += "处理意见不能为空\n";
                }
                if (!ExamResult || ExamResult.length == 0) {
                    valStr += "查验结果不能为空\n";
                }
                if ($("#orderText").length > 0) {
                    if (isNull($("#orderText").val()))
                        valStr += defaultOption.cygchjlStr;
                }
            }
            return valStr;
        };
        //如果是集装箱信息则需要验证集装箱提交的数据
        str += (haveConts == 1) ? containerValidate(type) : "";
        str += goodsValidate(type);
        str += recordValidate(type);
        if (str.length == 0) {
            //验证通过，判断是否有正在上传中照片
            var allPhoto = sencePhoto.getCommitData();
            return !allPhoto.isUploading;
        } else {
            util.toast(str.substr(0, str.length - 1));
            return false;
        }
    };
    var _EntryID = null;
    //单证是否有掏箱作业单 0:没有 1:有
    var loadData = function () {
        entryState = checkList.getEntryState();
        //readOnly = checkList.isReadOnly();
        var _dtd = $.Deferred();
        messages.emptyData();
        containers.emptyData();
        goods.emptyArray();
        records.emptyObj();
        var EntryID = $("#checkwork_head .titleBottom").html();
        _EntryID = EntryID;
        //var _processState = checkList.getCheckItem()["ProcessState"];
        //获取报关单查验记录单号
        var ExamRecID = checkList.getCheckItem()["ExamNo"];

        //是否需要开始查验
        if (entryState == 0) {
            $(".startCheckBtn").removeClass("none");
            $(".bottomBtnCon").addClass("none");
            $(".bottomWarnInfoCon").addClass("none");
            $(".photoBtnCon").removeClass("none");
        } else if (entryState == 1 || entryState == 3 || entryState == 5 || entryState == 7) {
            $(".bottomWarnInfoCon").removeClass("none");
            $(".startCheckBtn").addClass("none");
            $(".bottomBtnCon").addClass("none");
            $(".photoBtnCon").addClass("none");
        } else if (entryState == 2 || entryState == 4) {
            $(".bottomWarnInfoCon").addClass("none");
            $(".startCheckBtn").addClass("none");
            $(".bottomBtnCon").removeClass("none");
            $(".photoBtnCon").removeClass("none");
        } else if (entryState == 6) {
            $(".bottomWarnInfoCon").removeClass("none");
            $(".bottomWarnInfoCon .bottomWarnInfo").html("该报关单已经查验了");
            $(".startCheckBtn").addClass("none");
            $(".bottomBtnCon").addClass("none");
            $(".photoBtnCon").addClass("none");

        }
        $(".page").addClass("none");
        $("#checkworkPage").removeClass("none");
        $(".tab_item").data("refresh", true);
        $("#entryMesgPage").data("refresh", true);
        sencePhoto.clearData();
        //$("#checkwork_userName").html(util.getUserInfo.getUser().DisPlayName);
        $("#checkworkPage .top_UserName").html(util.getUserInfo.getUser().DisPlayName);
        messages.loadData(_dtd);
        haveFlowLog();
        return _dtd;
    };

    //保存方法
    var Save = function (type, selectedUser) {
        var allData = getSubmitAndSaveData(type, selectedUser);
        console.info(allData);
        if (allData == null) { //不能完整获取数据，比如有正在上传的照片
            return;
        }
        var successCallBack = function (data) {
            $("#fullBg").addClass("none");
            if (data.Status == 1) {
                util.toast("操作成功");
                //保存成功将已上传的图片状态该为已经保存
                $(".uploadedFlag").text("已保存").removeClass("uploadedFlag").addClass("saveFlag");
            } else {
                if (data.ErrorType == 0) {
                    util.toast("服务器异常，请稍后重试。");
                } else {
                    util.toast(data.Data);
                }
            }
        };
        var errorCallBack = function (data) {
            $("#fullBg").addClass("none");
            util.toast(util.getOption("errorStr"));
            console.log(JSON.stringify(data));
        };
        util.post(allData, true, successCallBack, errorCallBack, "form");
    };
    //提交方法
    var Submit = function (type, selectedUser, bool) {
        var allData = getSubmitAndSaveData(type, selectedUser, bool);
        if (allData == null) { //不能完整获取数据，比如有正在上传的照片
            return;
        }
        var needCheck = function (data) {
            if (data.ErrorExpandInfo && data.ErrorExpandInfo.ExpandType == "GoodsCheck") {
                GoodsCheckError(data);
            } else if (!data.ErrorExpandInfo || !data.ErrorExpandInfo.ExpandType != "GoodsCheck") {
                $("#fullBg").addClass("none");
                util.toast(data.Data);
            }
        };
        var GoodsCheckError = function (data) {
            $("#fullBg").addClass("none");
            var option = {};
            option["code"] = data.ErrorExpandInfo.ExpandType;
            option["txt"] = data.ErrorExpandInfo.ExpandContent;
            dialog.showDialog9(option, "提示", selectedUser);
        };
        var successNeedNotCheck = function () {
            backPage();
        };
        var backPage = function () {
            util.toast("操作成功");
            $("#fullBg").addClass("none");
            history.back(-1);
            //history.length = 0;
            checkList.refreshData();
        };
        var successCallBack = function (data) {
            if (data.Status == 1) {
                successNeedNotCheck();
                //报关单提交成功，删除本地文件夹
                util.deleteFile(_EntryID);
                util.deleteClock();
            } else {
                needCheck(data);
            }
        };
        var errorCallBack = function (data) {
            $("#fullBg").addClass("none");
            util.toast(util.getOption("errorStr"));
            console.log(JSON.stringify(data));
        };
        util.post(allData, true, successCallBack, errorCallBack, "form");
    };
    //判断是否有流程日志
    var haveFlowLog = function () {
        $(".flowlogCon").addClass("none");
        if (_EntryID) {
            var resourceId = checkList.getCheckItem()["ID"];
            var sendData = dataStructure.workflowData("SysManager.WFConfigRepository", [resourceId], "GetWorkFlowLog");
            var successBack = function (data) {
                if (data.Status == 1) {
                    if (data.Data.length == 0) {
                    } else {
                        $(".flowlogCon").removeClass("none");
                        dialog.showDialog8(data.Data, "流程日志");
                    }
                } else {
                    util.toast(data.Data);
                }
            };
            var errorBack = function (data) {
                util.toast(util.getOption("errorStr"));
                console.log(JSON.stringify(data));
            };
            util.post(sendData, true, successBack, errorBack, "method");
        } else {
            util.toast("报关单号不能为空");
        }
    };
    //获取保存和提交的数据，若不能正常获取则返回null
    var getSubmitAndSaveData = function (type, selectedUser, bool) {
        $("#fullBg").removeClass("none");
        var entryId = _EntryID;
        var id = checkList.getCheckItem()["ID"];

        var goodInfos = goods.getCommitData();
        var containersInfo = containers.getCommitData();
        var recordInfo = records.getCommitData();
        console.info(containersInfo);
        //基本参数
        var allData = {
            BizName: "H2000.BizRskExamHeadRelRepository",
            MethodName: type,
            ExtInfo: "",
            AppId: "0000000001",
            AppSecret: "A08BCCX615ED43BW",
            ModuleId: "00000000010000000001",
            JsonEntityData: '',
            JsonWorkFlowInfo: '',
            RelationDataInfoList: []
        };
        var jsonData = {
            ExamRecID: recordInfo.ExamRecID,
            FormID: recordInfo.FormID,
            ExamModeCodeResult: recordInfo.ExamModeCodeResult,
            WrapTypeResult: recordInfo.WrapTypeResult,
            WrapOtherTxt: recordInfo.WrapOtherTxt,
            ExamResult: recordInfo.ExamResult,
            ExamProcIdea: recordInfo.ExamProcIdea,
            ExamProcCode: recordInfo.ExamProcCode,
            ManChkNotes: recordInfo.ManChkNotes,
            ExamAddr: recordInfo.ExamAddr,
            ExamTime: recordInfo.ExamTime,
            NoteS: recordInfo.NoteS,
            Remark: recordInfo.Remark,
            ID: id,
            SubmitAnyWay: bool
        };
        allData.JsonEntityData = JSON.stringify(jsonData);

        //提交时候选择的环节及对应处理人
        var approveInfo = {
            ResourceID: id,
            Device: "mobile",
            CurrentActivityCode: 'FillPaper',
            SelectedActivity: {
                Code: 'KeApprove',
                Resource: []
            },
            ApproveOpinion: 'Agree',
            ApproveContent: ''
        };
        for (var i = 0, selectLength = selectedUser.length; i < selectLength; i++) {
            var cont = {
                ResourceType: 'USER',
                ID: selectedUser[i]
            };
            approveInfo.SelectedActivity.Resource.push(cont);
        }
        allData.JsonWorkFlowInfo = JSON.stringify(approveInfo);

        if (recordInfo.Bill != null) {
            for (var i = 0, billLength = recordInfo.Bill.length; i < billLength; i++) {
                var cont = {
                    BizName: "H2000.BizRskExamAttachedBillRepository",
                    JsonEntityData: ""
                };
                cont.JsonEntityData = JSON.stringify({
                    BillType: recordInfo.Bill[i].BillType,
                    BillNum: recordInfo.Bill[i].BillNum,
                    EntryID: recordInfo.FormID,
                    ExamRecID: recordInfo.ExamRecID
                });
                allData.RelationDataInfoList.push(cont);
            }
        }
        for (var i = 0, containerLength = containersInfo.length; i < containerLength; i++) {
            var cont = {
                BizName: "H2000.BizRskExamListContainerRepository",
                JsonEntityData: ""
            };
            cont.JsonEntityData = JSON.stringify({
                ExamRecID: containersInfo[i].ExamRecID,
                ContainerID: containersInfo[i].ContainerID,
                ContainerIDResult: containersInfo[i].ContainerIDResult,
                SealNoResult: containersInfo[i].SealNoResult,
                NewSealNo: containersInfo[i].NewSealNo,
                ContaResult: containersInfo[i].ContaResult,
                ContainerRemark: containersInfo[i].ContainerRemark,
                RealHollowArea1: containersInfo[i].RealHollowArea1,
                RealHollowArea2: containersInfo[i].RealHollowArea2
            });
            allData.RelationDataInfoList.push(cont);
        }
        for (var i = 0, goodLength = goodInfos.length; i < goodLength; i++) {
            var cont = {
                BizName: "H2000.BizRskExamListRelRepository",
                JsonEntityData: ""
            };
            cont.JsonEntityData = JSON.stringify({
                GNo: goodInfos[i].GNo,
                ExamRecID: goodInfos[i].ExamRecID,
                RealCodeTs: goodInfos[i].RealCodeTs,
                RealGName: goodInfos[i].RealGName,
                RealGModel: goodInfos[i].RealGModel,
                RealOriginCountry: goodInfos[i].RealOriginCountry,
                RealGUnit: goodInfos[i].RealGUnit,
                RealQty1: goodInfos[i].RealQty1,
                RealTradeCurr: goodInfos[i].RealTradeCurr,
                RealTradeTotal: goodInfos[i].RealTradeTotal,
                ExamModeCodeResultList: goodInfos[i].ExamModeCodeResultList
            });
            allData.RelationDataInfoList.push(cont);
        }

        //照片处理
        var allPhoto = sencePhoto.getCommitData();
        if (allPhoto.isUploading) {
            $("#fullBg").addClass("none");
            return null;
        } else {
            for (var i = 0, photoLength = allPhoto.data.length; i < photoLength; i++) {
                var cont = {
                    BizName: "IDP.Sys.MaterialRepository",
                    JsonEntityData: ""
                };
                cont.JsonEntityData = JSON.stringify(allPhoto.data[i]);
                allData.RelationDataInfoList.push(cont);
            }
        }
        return allData;
    };
    var eventInitialize = function () {
        //设置滚动高度
        var index = 0;
        var setScrollHeight = function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var tabConHeight = $("#tabCon").outerHeight();
            var footHeight = $("#foot1").outerHeight();
            var scrollHeight = (winHeight - headHeight - tabConHeight - footHeight);
            //$(".checkwork .content").height(scrollHeight);
           $(".checkwork .content").css({ "min-height": scrollHeight});
        };
        //作业滑动切换页面
        //$("#checkworkPage").swipe({
        //    swipeLeft: function (event, direction, distance, duration,
		//					fingerCount, fingerData) {
        //        util.stopBubble(event);
        //        index++;
        //        tapItemShow();
        //    },
        //    swipeRight: function (event, direction, distance, duration,
        //            fingerCount, fingerData) {
        //        util.stopBubble(event);
        //        index--;
        //        tapItemShow();
        //    },
        //    threshold: 100
        //});
        var tapItemShow = function () {
            if (index < 0) {
                index = 0;
            } else if (index > 3) {
                index = 3;
            } else {
                var $tab = $(".tab:eq(" + index + ")");
                if (!$tab.children(".tabCommon").hasClass("tab_current")) {
                    $("#checkworkPage .content").scrollTop(0);
                    //$(window).scrollTop(0);
                }
                $(".tab .tabCommon").removeClass("tab_current");
                $(".tab_item").addClass("none");
                $tab.children(".tabCommon").addClass("tab_current");
                switch (index) {
                    case 0:
                        if ($(".tab_item:eq(" + index + ")").data("refresh")) {
                            //messages.loadData();
                        }
                        break;
                    case 1:
                        if ($(".tab_item:eq(" + index + ")").data("refresh")) {
                            //containers.loadData();
                        }
                        break;
                    case 2:
                        if ($(".tab_item:eq(" + index + ")").data("refresh")) {
                            //goods.loadData();
                        }
                        break;
                    case 3:
                        if ($(".tab_item:eq(" + index + ")").data("refresh")) {
                            //records.loadData();
                        }
                        break;
                }
                $(".tab_item:eq(" + index + ")").removeClass("none");
            }
        };
        //上方tab切换卡按钮点击事件
        $(".tab").off("click");
        $(".tab").on("click", function () {
            index = $(this).index(".tab");
            tapItemShow();
        });
        //信息按钮的点击事件
        var entryBillBtnBind = function () {
            $("#checkworkPage").on("click", ".entryBillBtn", function (event) {
                $(this).css("background-color", "#fffde5");
                setTimeout(function () {
                    $(".entryBillBtn").css("background-color", "#fff");
                }, util.getOption("timer1"))
                var index = $(event.currentTarget).index();
                switch (index) {
                    case 0:
                        //报关单信息点击
                        setTimeout(function () {
                            var EntryID = $("#checkwork_head .titleBottom").html();
                            entryMesg.loadData(EntryID);
                        }, util.getOption("timer2"));
                        break;
                    case 1:
                        //掏箱单信息点击
                        setTimeout(function () {
                            var contaShow = messages.getMessageObj().CHYZHL["ContaShow"];
                            if (contaShow && contaShow == 1) {
                                unstuffing.loadData();
                            } else {
                                util.toast("该报关单没有掏箱作业记录!");
                            }
                        }, util.getOption("timer2"));
                        break;
                    case 2:
                        //随附单
                        setTimeout(function () {
                            attachedDoc.loadData();
                        }, util.getOption("timer2"));
                        break;
                }
            });
        };
        //流程日志按钮的点击时间
        $("body").on("click", ".flowlogCon", function () {
            history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog6", mask: "fullBg" }, "", "index.html?page=page12");
            var index = 6;
            var $dialog = $("#processLogDialog");
            var height = $dialog.data("height");
            dialog.showDialog($dialog, 0.75, height, "");
        });
        //退出按钮点击事件
        $("#checkworkPage .exitBtn").unbind("click");
        $("#checkworkPage .exitBtn").bind("click", function () {
            window.exitCurrentCheck();
        });
        setScrollHeight();
        entryBillBtnBind();
        containers.eventInitialize();
        records.eventInitialize();

        $("#btnSave").unbind("click");
        $("#btnSubmit").unbind("click");
        $("#btnCheck").unbind("click");

        //开始查验,网络请求时显示正在请求数据...
        $("#btnCheck").bind("click", function () {
            //需要进行掏箱作业
            var $that = $(this);
            $that.addClass("checkBtn_c");
            setTimeout(function () {
                $that.removeClass("checkBtn_c");
                var contaCount = messages.getMessageObj().CHYZHL["ContaCount"];
                var _resourceId = checkList.getCheckItem()["ID"];
                var data = dataStructure.choiceData("ExamProcess.RskExamApplyListRepository", [_resourceId], "StartExamAction", util.getOption("moduleId"));
                var successCallback = function (data) {
                    if (data.Status == 1) {
                        if (contaCount == 1) {
                            util.toast("本单证需要进行掏箱作业，请先在H2010系统中录入掏箱结果！");
                        }
                        if (data.Data) {
                            var dateTime = data.Data;
                            $(".checkStartTime").html(dateTime);
                            checkList.setReadOnly(false);
                            $("input,textarea").prop("readonly", false);
                            //var dateTimeArrays = data.Data.split(/\s+/);
                            //if(dateTimeArrays.length >1){
                            //    var dates = dateTimeArrays[0];
                            //    var times = dateTimeArrays[1];
                            //    var datesArray = dates.split("/");
                            //    var timesArray = times.split(":");
                            //    if (datesArray.length > 2 && timesArray.length > 1) {
                            //        var year = datesArray[0] ? datesArray[0] : '';
                            //        var month = (datesArray[1] && datesArray[1].length > 1) ? datesArray[1] : "0" + datesArray[1] ? datesArray[1] : '';
                            //        var day = (datesArray[2] && datesArray[2].length > 1) ? datesArray[2] : "0" + datesArray[2] ? datesArray[2] : '';
                            //        var hour = (timesArray[0] && timesArray[0].length > 1) ? timesArray[0] : "0" + timesArray[0] ? timesArray[0] : '';
                            //        var minute = (timesArray[1] && timesArray[1].length > 1) ? timesArray[1] : "0" + timesArray[1] ? timesArray[1] : '';
                            //        var second = (timesArray[2] && timesArray[2].length > 1) ? timesArray[2] : "0" + timesArray[2] ? timesArray[2] : '';
                            //        $(".checkStartTime").html(year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second);
                            //    } else {

                            //    }
                            //} else {

                            //}
                        } else {
                            util.toast("还没有设置开始查验时间");
                        }
                        checkList.changeStatus(_EntryID, 1);
                        $(".startCheckBtn").addClass("none");
                        $(".bottomWarnInfoCon").addClass("none");
                        $(".bottomBtnCon").removeClass("none");
                        $(".photoBtnCon").removeClass("none");
                    } else {
                        util.toast(data.Data);
                    }
                    $("#btnCheck").removeClass("none");
                    $("#btnChecking").addClass("none");
                };
                var errorCallback = function (data) {
                    util.toast(util.getOption("errorStr"));
                    console.log(JSON.stringify(data));
                    $("#btnCheck").removeClass("none");
                    $("#btnChecking").addClass("none");
                };
                util.post(data, true, successCallback, errorCallback, "Method");
                $("#btnCheck").addClass("none");
                $("#btnChecking").removeClass("none");
            }, util.getOption("timer1"));
        });

        //保存
        $("#btnSave").bind("click", function () {
            //点击保存时候，有卡顿情况，所以先显示加载图标，延迟执行save方法。
            //如果是只读的点击保存按钮无效
            if (!checkList.isReadOnly()) {
                var $that = $(this);
                $that.addClass("saveBtn_c");
                setTimeout(function () {
                    $that.removeClass("saveBtn_c");
                    if (!checkList.isReadOnly()) {
                        var bool = validateData("save");
                        if (bool) {
                            $("#fullBg").removeClass("none");
                            util.toast("正在处理数据...");
                            setTimeout(function () { Save("Save", []) }, 100);
                        }
                    }
                }, util.getOption("timer1"));
            }
        });
        //提交选择下一环节处理人
        $("#btnSubmit").bind("click", function () {
            //如果只读则提交按钮无效
            if (!checkList.isReadOnly()) {
                var $that = $(this);
                $that.addClass("submitBtn_c");
                setTimeout(function () {
                    $that.removeClass("submitBtn_c");
                    var bool = validateData("submit");
                    if (bool) {
                        //var index = 8;
                        var ExamProcIdea = records.getCommitData()["ExamProcIdea"];
                        var ExamResult = records.getCommitData()["ExamResult"];
                        console.log(ExamResult + "======" + ExamProcIdea);
                        var callBack = function () {
                            var $dialog = $("#selectMemberDialog");
                            if ($dialog.find(".mutipleChoiceRowCon").length == 0) {
                                util.toast("流程错误!");
                            } else {
                                history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog8", mask: "fullBg" }, "", "index.html?page=page14");
                                dialog.showDialog($dialog, 0.75, "620", "40 0");
                            }
                        }
                        callBack();
                        //if (ExamResult == 1 && ExamProcIdea == 0) {
                        //    dialog.showDialog11("查验结果与处理意见逻辑不符，是否提交？", "提示", callBack, null);
                        //} else {
                        //    callBack();
                        //}

                    }
                }, util.getOption("timer1"));
            }
        });
        //设置流程日志按钮的位置
        var setFlowPosition = function () {
            var winHeight = window.innerHeight;
            var top = winHeight * defaultOption.flowTop;
            $(".flowlogCon").css({ "position": defaultOption.flowPosition, "top": top, "left": defaultOption.flowLeft });
        }
        setFlowPosition();
    };
    return {
        loadData: loadData,
        eventInitialize: eventInitialize,
        Submit: Submit,
        Save: Save
    };
})(jQuery);