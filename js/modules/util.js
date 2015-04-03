var util = (function ($) {
    'use strict';
    var defaultOption = {
        errorStr: "数据获取失败",
        timer1: 200, //第一个定时器，延迟执行时间
        timer2: 200, //第二个定时器，延迟执行时间
        moduleId: '000100020001',
        entryModuleId: '000100990001'
    };
    var getOption = function (attr) {
        return defaultOption[attr];
    };
    var _request = function (params, jsonData, successCallback, errorCallback, dataType, type) {
        var str = JSON.stringify(params);
        var user = JSON.stringify(util.getUserInfo.getUser());
        str = BASE64.encoder(str);
        user = BASE64.encoder(user);
        if (ServerConfig.debug) {
            $.ajax({
                type: type,
                url: "http://" + ServerConfig.server + ServerConfig.url + "dataType=" + dataType + "&device=mobile&token=" + user,
                data: "data=" + encodeURIComponent(str),
                success: successCallback,
                error: errorCallback,
                jsonp: "callbackfunc",
                dataType: "jsonp"
            });
        } else {
            var data = [{ "data": encodeURI(str) }];
            var _url = ServerConfig.url + "dataType=" + dataType + "&device=mobile&token=" + user;
            if (type == "get") {
                HGRequest.get(ServerConfig.server, _url, data, jsonData, successCallback, errorCallback);
            } else {
                HGRequest.post(ServerConfig.server, _url, data, jsonData, successCallback, errorCallback);
            }
        }
    }
    var get = function (params, jsonData, successCallback, errorCallback, dataType) {
        _request(params, jsonData, successCallback, errorCallback, dataType, "get");
    };
    var post = function (params, jsonData, successCallback, errorCallback, dataType) {
        _request(params, jsonData, successCallback, errorCallback, dataType, "post");
    };
    //提示框
    var toast = function (str) {
        if (ServerConfig.debug) {
            console.log(str);
        } else {
            console.log("HGUtil.toast: " + JSON.stringify(str));
            HGUtil.toast(str, 27, 4000, 80, 0, 140);
        }
    };

    //获取用户信息，返回用户信息对象
    var getUserInfo = (function ($) {
        var _userInfo = null;
        var init = function () {
            if (!ServerConfig.debug) {
                var successCallback = function (_u) {
                    _userInfo = {};
                    _userInfo.ID = _u.guid;
                    _userInfo.LogName = _u.usercode;
                    _userInfo.DisPlayName = _u.username;
                    _userInfo.DepName = "";
                    $.holdReady(false);
                };
                var errorCallback = function (str) { alert("获取用户信息异常"); };
                HGUser.getUserInfo(successCallback, errorCallback);
            } else {
                _userInfo = {
                    //"ID": "c211f5af-8e20-47fe-b8cd-fef3ff9291df",
                    //"LogName": "3107850",
                    //"DisPlayName": "楼鑫刚",
                    //"DepName": "宁波海关"
                    //"ID": "a537c2d1-000e-44a8-bd68-c407bbde9402",
                    //"LogName": "123560",
                    //"DisPlayName": "吴晓峰",
                    //"DepName": "北京海关",
                    //"ID": "2da6f351-d09c-4ef3-a6dd-fbe6b276e280",
                    //"LogName": "123660",
                    //"DisPlayName": "魏天怡",
                    //"DepName":"北京海关"
                    //"ID": "1f904d96-c2c5-8baa-451f-f6ced4b62a01",
                    //"LogName": "0130300",
                    //"DisPlayName": "测试人员5",
                    //"DepName": "北京海关"
                    "ID": "F4EA6FF5-23AE-A92E-4979-8483B6B32C43",
                    "LogName": "0129290",
                    "DisPlayName": "测试人员4",
                    "DepName": "北京海关"
                };
                $.holdReady(false);
            }
            $.holdReady(false);
        };
        var getUser = function () {
            if (_userInfo == null) {
                init();
                return {};
            } else {
                return _userInfo;
            }
        };
        return {
            getUser: getUser,
            init: init
        }
    })(jQuery);

    //日期转换方法
    var _dtFormat = function (dt, formatStr) {
        var str = typeof formatStr === "string" && formatStr.length > 0 ? formatStr : "yyyy-MM-dd HH:mm:ss";
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, dt.getFullYear());
        str = str.replace(/yy|YY/, (dt.getYear() % 100) > 9 ? (dt.getYear() % 100).toString() : '0' + (dt.getYear() % 100));
        str = str.replace(/MM/, (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1).toString() : '0' + (dt.getMonth() + 1));
        str = str.replace(/M/g, (dt.getMonth() + 1));
        str = str.replace(/w|W/g, Week[dt.getDay()]);
        str = str.replace(/dd|DD/, dt.getDate() > 9 ? dt.getDate().toString() : '0' + dt.getDate());
        str = str.replace(/d|D/g, dt.getDate());
        str = str.replace(/hh|HH/, dt.getHours() > 9 ? dt.getHours().toString() : '0' + dt.getHours());
        str = str.replace(/h|H/g, dt.getHours());
        str = str.replace(/mm/, dt.getMinutes() > 9 ? dt.getMinutes().toString() : '0' + dt.getMinutes());
        str = str.replace(/m/g, dt.getMinutes());
        str = str.replace(/ss|SS/, dt.getSeconds() > 9 ? dt.getSeconds().toString() : '0' + dt.getSeconds());
        str = str.replace(/s|S/g, dt.getSeconds());
        return str;
    };
    var dtJsonFormat = function (value, formatStr) {
        if (value) {
            var dt = eval('new ' + (value.replace(/\//g, '')));
            return _dtFormat(dt, formatStr);
        }
        else
            return '';
    };
    var deleteClock = function () {
        var entryId = $("#checkworkPage").find(".titleBottom").html();
        var resourceId = checkList.getCheckItem()["ID"];
        var sendData = dataStructure.choiceData("SysManager.BizAppLockerRepository", [resourceId], "DeleteLock", getOption("moduleId"));
        var successBack = function (data) {
            if (data.Status == 1) {
                //toast("操作成功");
            } else {
                toast(data.Data);
            }
        };
        var errorBack = function (data) {
            toast(defaultOption.errorStr);
        };
        post(sendData, true, successBack, errorBack, "Method");
    };
    window.onpopstate = function (event) {
        console.info("window.onpopstate: " + JSON.stringify(event.state));
        if (event) {
            var obj = event.state;
            $(".dialog").data("isClicked", false);
            $("#fullBg").addClass("none");
            if (obj) {
                var page = obj["page"];
                if (obj.hasOwnProperty("dialog")) {
                    var dialog = obj["dialog"];
                    //var mask = obj["mask"];
                    //$(".page").addClass("none");
                    //$(".dialog").addClass("none");
                    //$(".checkwork").removeClass("none");
                    //$("." + dialog).removeClass("none");
                    //$("." + mask).removeClass("none");
                    if (obj.hasOwnProperty("previousPage")) {
                        $(".page").addClass("none");
                        $(".dialog").addClass("none");
                        $(".bgCommon").addClass("none");
                        var preIdsArray = obj["previousPage"];
                        for (var i = 0, len = preIdsArray.length; i < len; i++) {
                            var previousPage = preIdsArray[i];
                            $(previousPage).removeClass("none");
                        }
                        if ($(dialog).hasClass("datetimeDialog")) {
                            $.datetimeShow();
                        } else {
                            $(dialog).removeClass("none");
                            //$(mask).removeClass("none");
                        }
                    }
                } else {
                    $(".page").addClass("none");
                    $("." + page).removeClass("none");
                    $(".dialog").addClass("none");
                    $(".fullBg").addClass("none");
                    $(".datatimePage").addClass("none");
                    $(".dwo").addClass("none");

                }
            } else {
                $(".page").addClass("none");
                $("#checkListPage").removeClass("none"); //显示列表页
                var entryId = $("#checkworkPage").find(".titleBottom").html();
                if (entryId && entryId.length > 0) {
                    deleteClock();
                }
            }
        };
    };
    //没有数据下设置对应的元素显示默认的样式
    var _noDataDefault = function (parentElem) {
        parentElem.append(
                            $("<div>").addClass("newSealNo leftTxt conFieldTxt con_grayTxt fl").html("点击添加")
                            ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon grayFront fr"));
    };
    //设置只有currentCode没有获取到数据字典时对应元素的样式
    var _setOnlyHaveCurrent = function (parentElem, txt) {
        parentElem.append(
                        $("<div>").addClass("newSealNo leftTxt conFieldTxt con_blueTxt fl").html(txt)
                        ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"));
    };
    //设置有数据字典时开关的样式
    var _setHaveDictionarySwitch = function (parentElem, txt, color) {
        parentElem.append(
                            $("<div>").addClass("statusTxt" + color + " leftTxt").html(txt)
                            ).append($("<div>").addClass("statusBtn rightIcon " + color + "Icon radioBtnCommon fr"));
    };
    //设置有currentCode没有获取到数据字典时单选的默认样式
    var _setOnlyHaveCurrentRaido = function (parentElem, txt) {
        parentElem.append(
                        $("<div>").addClass("newSealNo leftTxt conFieldTxt con_blueTxt fl").html(txt)
                        ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"));
    };
    //设置有数据字典时单选的默认样式
    var _setHaveDictionaryRadio = function (parentElem, txt, color) {
        parentElem.append(
                        $("<div>").addClass("newSealNo leftTxt conFieldTxt con_" + color + "Txt fl").html(txt)
                        ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon " + color + "Front fr"));
    }
    //设置有currentCode的多选对应元素的默认样式
    var _setHaveCurrentCheck = function (parentElem, txt) {
        parentElem.append(
                            $("<div>").addClass("newSealNo leftTxt conFieldTxt con_blueTxt fl").html(txt)
                            ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"));
    };
    //设置没有currentCode的多选对应元素的默认样式
    var _setNotHaveCurrentCheck = function (parentElem) {
        parentElem.append(
                            $("<div>").addClass("newSealNo leftTxt conFieldTxt con_grayTxt fl").html("点击添加")
                            ).append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon grayFront fr"));
    }
    //判断是单选还是多选
    //该方法主要是判断按钮显示的开关、点击弹出单选框还是点击弹出多选框
    //data表示从数据字典中获取的数据
    //greenCode表示是绿色开关的代码
    //parentElem表示按钮的jquery对象
    //bool表示是不是单选
    //defaultBool表示点击按钮必须是弹出单选框
    //defaultNull表示默认是否为空
    var setChoice = function (data, greenCode, currentCode, parentElem, bool, defaultBool, defaultNull) {
        parentElem.empty();
        var option = null;
        var color = "gray";
        var htmlTxt = '';
        if (data && data.length > 0) {
            option = {};
            for (var i = 0, dataLength = data.length; i < dataLength; i++) {
                var txt = data[i]["ItemName"];
                var code = data[i]["ItemCode"];
                option[code] = {};
                option[code]["txt"] = txt;
                option[code]["code"] = code;
            }
            //点击弹出单选对话框
            var radio = function () {
                parentElem.data("type", 2);
                if (currentCode) {
                    //如果存在currentCode
                    parentElem.data("currentCode", currentCode);
                    if (option.hasOwnProperty(currentCode)) {
                        //如果数据字典中存在currentCode对应的值
                        _setHaveDictionaryRadio(parentElem, option[currentCode]["txt"], "blue");
                    } else {
                        //如果数据字典中不存在currentCode对应的值
                        _setHaveDictionaryRadio(parentElem, currentCode, "blue");
                    }
                } else {
                    //如果不存在currentCode
                    if (defaultNull) {
                        parentElem.data("currentCode", "");
                        _setNotHaveCurrentCheck(parentElem);
                    } else {
                        parentElem.data("currentCode", data[0]["ItemCode"]);
                        _setHaveDictionaryRadio(parentElem, data[0]["ItemName"], "blue");
                    }
                }
            };
            //开关
            var switchBtn = function () {
                //如果存在currentCode
                if (option.hasOwnProperty(currentCode)) {
                    //如果数据字典中存在currentCode
                    if (currentCode == greenCode) {
                        //如果currentCode等于greenCode表示当前从后台获取的数据就是表示绿色的
                        parentElem.data("currentCode", option[currentCode]["code"]);
                        _setHaveDictionarySwitch(parentElem, option[currentCode]["txt"], "green");
                    } else {
                        parentElem.data("currentCode", option[currentCode]["code"]);
                        _setHaveDictionarySwitch(parentElem, option[currentCode]["txt"], "red");
                    }
                } else {
                    parentElem.data("currentCode", data[0]["ItemCode"]);
                    _setHaveDictionarySwitch(parentElem, data[0]["ItemName"], "green");
                }
            };
            //设置数据字典的第一个为绿色
            var switchFirtBtn = function () {
                parentElem.data("currentCode", data[0]["ItemCode"]);
                _setHaveDictionarySwitch(parentElem, data[0]["ItemName"], "green");
            }
            if (bool) {
                //bool为true表示肯定是单选
                //单选包括开关和点击弹出单选对话框
                if (data.length == 1) {
                    //如果数据字典的长度是1的话则是点击弹出单选对话框
                    radio();
                } else if (defaultBool) {
                    //如果defaultBool为true表示按钮必须是点击弹出单选对话框
                    radio();
                } else {
                    if (data.length == 2) {
                        //长度为2的话表示开关
                        parentElem.data("type", 0);
                        if (!currentCode || currentCode.length == 0) {
                            //如果不存在currentCode
                            if (option.hasOwnProperty(greenCode)) {
                                //将数据字典中存在greenCode则默认greenCode表示为绿色
                                parentElem.data("currentCode", option[greenCode]["code"]);
                                _setHaveDictionarySwitch(parentElem, option[greenCode]["txt"], "green");
                            } else {
                                //如果数据字典中不存在greenCode则默认第一个表示为绿色
                                switchFirtBtn();
                            }
                        } else {
                            switchBtn();
                        }
                    } else if (data.length > 2) {
                        radio();
                    }
                }
            } else {
                parentElem.data("type", 3);
                parentElem.data("currentCode", currentCode);
                if (!currentCode) {
                    parentElem.data("currentCode", "");
                    _setNotHaveCurrentCheck(parentElem);
                } else {
                    var txts = '';
                    var arrs = currentCode.split(",");
                    var hasInput = $(parentElem).attr("hasInput");
                    for (var i = 0, arrsLength = arrs.length; i < arrsLength; i++) {
                        var code = arrs[i];
                        if (code) {
                            if (hasInput && code == "7") {
                                var WrapOtherTxt = $(parentElem).attr("WrapOtherTxt");
                                WrapOtherTxt = WrapOtherTxt ? ":" + WrapOtherTxt : "";
                                txts += option[code]["txt"] + WrapOtherTxt + ",";
                            } else {
                                txts += option[code]["txt"] + ",";
                            }

                        }
                    }
                    txts = txts.substr(0, txts.length - 1);
                    _setHaveCurrentCheck(parentElem, txts);
                }
            }
        } else {
            if (currentCode) {
                var txt = currentCode;
                parentElem.data("currentCode", currentCode);
                parentElem.data("type", 2);
                _setOnlyHaveCurrent(parentElem, txt);
            } else {
                parentElem.data("currentCode", "");
                //_noDataDefault(parentElem);
            }
        }
        parentElem.data("option", option);
    };

    //获取图片的base64
    var getPicBase64 = function (dataType, filePath, successCallback, errorCallback) {
        var _url = ServerConfig.fileUrl + "dataType=" + encodeURI(dataType) + "&filePath=" + encodeURI(filePath);
        if (ServerConfig.debug) {
            $.ajax({
                type: "get",
                url: "http://" + ServerConfig.fileServer + ServerConfig.fileUrl + "dataType=" + dataType + "&filePath=" + encodeURI(filePath),
                success: successCallback,
                error: errorCallback
            });
        } else {
            HGRequest.post(ServerConfig.fileServer, _url, [], true, successCallback, errorCallback);
        }
    };
    //文件上传(filePath为绝对路径, fileName需要加.jpg后缀)
    var uploadFile = function (filePath, fileName, successCallback, errorCallback) {
        console.log("----------uploadFile: " + filePath);
        var _url = ServerConfig.fileUrl + "dataType=upload&JsonData=" + encodeURI("{\"BizName\":\"H2000.BizRskExamHeadRelRepository\"}");
        // HGRequest.upLoadFile(ServerConfig.fileServer, _url, [], successCallback, errorCallback, fileName);
        var params = [{
            "fileName": filePath,
            "type": "file"
        }];
        HGRequest.post(ServerConfig.fileServer, _url, params, true, successCallback, errorCallback);
    };
    //文件以base64的方式post到后台
    var uploadFileBase64 = function (base64Str, fileName, successCallback, errorCallback) {
        var _url = ServerConfig.fileUrl + "dataType=UPLOADBASE64";
        var ob = {
            JsonData: '{"BizName": "H2000.BizRskExamHeadRelRepository", "MaterialClass": ""}',
            FileBase64Str: base64Str,
            FileName: fileName
        };
        var data = [{ "data": JSON.stringify(ob) }];
        HGRequest.post(ServerConfig.fileServer, _url, data, true, successCallback, errorCallback);
    };
    var deleteFile = function (deleteDir) {
        console.log("----------deleteFile: " + deleteDir);
        var deleteSuc = function (data) {
            console.log("delete file " + deleteDir + " success");
        };
        var deleteFail = function (error) {
            console.log("delete file " + deleteDir + " error: " + error);
        };
        if (!ServerConfig.debug) {
            HGFile.removeFile(deleteDir, deleteSuc, deleteFail);
        }
    };
    //阻止事件冒泡
    var stopBubble = function (event) {
        event.stopPropagation();
    }
    //页面加载信息出现错误
    //elem代表信息加载错误的节点
    //网络错误
    function loadFailure(elem, reLoadFn, msg, option) {
        $("#fullBg").addClass("none");
        var col1 = $("<div>", { "class": "loadFail" });
        var col1_1 = $("<img>", { "src": "res/images/connection.png", "class": "connectionIcon" });
        var col1_2 = $("<div>", { "class": "connection1", "text": "数据加载失败" });
        if (msg) {
            if (msg.length > 120) {
                msg = msg.substr(0, 120) + "...";
            }
        } else {
            msg = "数据加载失败";
        }
        var col1_3 = $("<div>", { "class": "connection2", "text": msg });
        var col1_4 = $("<div>", { "class": "connectionBtn", "text": "重新加载" }).click(function () {
            $(".loadFail").remove();
            reLoadFn(option);
        });
        col1.append(col1_1);
        col1.append(col1_2);
        col1.append(col1_3);
        col1.append(col1_4);
        elem.html(col1);
        col1.addClass("failDiv3");
        $('.loadFail').css({
            marginTop: ($(window).height() - 51 - 47 - 55 - 267) / 2 + 'px'
        })
    }
    //服务器错误
    function serverFailure(elem, reLoadFn, msg) {
        $("#fullBg").addClass("none");
        var col1 = $("<div>", { "class": "loadFail" });
        var col1_2 = $("<div>", { "class": "connection1", "text": "数据获取失败" });
        var col1_3 = $("<div>", { "class": "connection2" }).text(msg);
        var col1_4 = $("<div>", { "class": "connectionBtn", "text": "再试一次" }).click(function () {
            $(".loadFail").remove();
            reLoadFn();
        });
        col1.append(col1_2);
        col1.append(col1_3);
        col1.append(col1_4);
        elem.html(col1);
        col1.addClass("failDiv3");
        $('.loadFail').css({
            marginTop: ($(window).height() - 51 - 47 - 55 - 267) / 2 + 'px'
        })
    }
    function limitMaxLength(value, maxLength, elem) {
        var bool = false;
        value = value ? value : "";
        value = value + "";
        while (value.replace(/[^\x00-\xff]/g, '**').length > maxLength) {
            value = value.slice(0, -1);
            bool = true;
        }
        if (bool) {
            toast("输入的长度不能超过限制长度");
        }
        elem.val(value);
    }
    //把字符串转换成日期
    //dateTimeStr表示要转换的日期时间字符串，dateTimeSeparator表示把日期和时间分隔的分隔符
    //dateSeparator表示把日期分隔的分隔符
    //timeSeparator表示把时间分隔的分隔符
    var strToDate = function (dateTimeStr, dateTimeSeparator, dateSeparator, timeSeparator) {
        var dateStr = dateTimeStr.split(dateTimeSeparator)[0];
        var timeStr = dateTimeStr.split(dateTimeSeparator)[1];
        var yearStr = dateStr.split(dateSeparator)[0];
        var monthStr = dateStr.split(dateSeparator)[1] - 1;
        var dayStr = dateStr.split(dateSeparator)[2];
        var hourStr = timeStr.split(timeSeparator)[0];
        var minuteStr = timeStr.split(timeSeparator)[1];
        var date = null;
        date = new Date(yearStr, monthStr, dayStr, hourStr, minuteStr);
        return date;
    };
    return {
        get: get,
        post: post,
        toast: toast,
        getUserInfo: getUserInfo,
        dtJsonFormat: dtJsonFormat,
        setChoice: setChoice,
        getOption: getOption,
        getPicBase64: getPicBase64,
        uploadFile: uploadFile,
        uploadFileBase64: uploadFileBase64,
        deleteFile: deleteFile,
        loadFailure: loadFailure,
        serverFailure: serverFailure,
        limitMaxLength: limitMaxLength,
        strToDate: strToDate,
        stopBubble: stopBubble,
        deleteClock: deleteClock
    };
})(jQuery);

var Dictionary = (function ($) {
    'use strict';
    //数据字典转码
    var dataRepository = (function () {
        var allRepository = null;
        var isInprocess = false;
        var init = function () {
            if (allRepository == null && !isInprocess) {
                isInprocess = true;
                var data = dataStructure.listData(util.getOption("moduleId"), 'SysManager.BizSysDictionaryDataRepository', 1, 1000, [{}], "SORT_NUM asc", "");
                var errorCallBack = function (data) {
                    console.log("数据字典获取失败：" + JSON.stringify(data));
                    util.toast("数据字典获取失败：" + data.Data);
                    isInprocess = false;
                };
                var successCallBack = function (data) {
                    //console.info(JSON.stringify(data));
                    if (data.Status == 1) {
                        allRepository = {};
                        var _rows = data.Data.Rows;
                        for (var _i = 0, rowLength = _rows.length; _i < rowLength; _i++) {
                            var _cell = _rows[_i].Cell;
                            var _typeCode = _cell.TypeCode;
                            if (!allRepository[_typeCode]) {
                                allRepository[_typeCode] = [];
                            }
                            allRepository[_typeCode].push({ "TypeName": _cell.TypeName, "ItemCode": _cell.ItemCode, "ItemName": _cell.ItemName });
                        }
                    }
                    isInprocess = false;
                }
                util.post(data, true, successCallBack, errorCallBack, "list");
            }
        };
        var getByTypeCode = function (typeCode) {
            if (allRepository == null) {
                init();
                util.toast("数据字典转码失败...");
                return null;
            } else {
                return allRepository[typeCode];
            }
        }
        var getCodeNameByCode = function (typeCode, codeValue) {
            var codeName = codeValue;
            var arrays = getByTypeCode(typeCode);
            if (arrays) {
                for (var i = 0, arrayLength = arrays.length; i < arrayLength; i++) {
                    if (arrays[i].ItemCode == codeValue) {
                        codeName = arrays[i].ItemName;
                        break;
                    }
                }
            }
            return codeName;
        }
        return {
            init: init,
            getByTypeCode: getByTypeCode,
            getCodeNameByCode: getCodeNameByCode
        }
    })(jQuery);
    //原产地
    var countryRepository = (function ($) {
        var country = null;
        var init = function () {
            if (country == null) {
                var data = dataStructure.choiceData("H2000.BizCountryRepository", ["1=1", null]);
                var errorCallBack = function (data) { util.toast(data); };
                var successCallBack = function (data) {
                    if (data.Status == 1) {
                        var _all = data.Data;
                        country = {};
                        for (var i = 0, allLength = _all.length; i < allLength; i++) {
                            country[_all[i][0]] = _all[i][1];
                        }
                    } else {
                        util.toast(data);
                    }
                }
                util.post(data, true, successCallBack, errorCallBack, "list");
            }
        };
        var getCountryByCode = function (typeCode) {
            if (country == null) {
                init();
                return typeCode;
            } else {
                return country[typeCode];
            }
        };
        var getAllCountry = function () {
            if (country) {
                var _o = {};
                for (var attr in country) {
                    _o[attr] = { "code": attr, "txt": country[attr] };
                }
                return _o;
            } else {
                return null;
            }
        };
        return {
            init: init,
            getCountryByCode: getCountryByCode,
            getAllCountry: getAllCountry
        }
    })(jQuery);
    //实际单位
    var unitRepository = (function ($) {
        var unit = null;
        var init = function () {
            if (unit == null) {
                var data = dataStructure.choiceData("H2000.BizUnitRepository", ["1=1", null]);
                var errorCallBack = function (data) { util.toast(data); };
                var successCallBack = function (data) {
                    if (data.Status == 1) {
                        var _all = data.Data;
                        unit = {};
                        if (unit != null) {
                            for (var i = 0, allLength = _all.length; i < allLength; i++) {
                                unit[_all[i][0]] = _all[i][1];
                            }
                        }
                    } else {
                        util.toast(data);
                    }
                }
                util.post(data, true, successCallBack, errorCallBack, "list");
            }
        };
        var getUnitByCode = function (typeCode) {
            if (unit == null) {
                init();
                return typeCode;
            } else {
                return unit[typeCode];
            }
        };
        var getAllUnit = function () {
            if (unit) {
                var _o = {};
                for (var attr in unit) {
                    _o[attr] = { "code": attr, "txt": unit[attr] };
                }
                return _o;
            } else {
                return null;
            }
        };
        return {
            init: init,
            getUnitByCode: getUnitByCode,
            getAllUnit: getAllUnit
        }
    })(jQuery);
    //实际币制
    var currRepository = (function ($) {
        var curr = null;
        var init = function () {
            if (curr == null) {
                var data = dataStructure.choiceData("H2000.BizCurrRepository", ["1=1", null]);
                var errorCallBack = function (data) { util.toast(data); };
                var successCallBack = function (data) {
                    if (data.Status == 1) {
                        var _all = data.Data;
                        curr = {};
                        for (var i = 0, allLength = _all.length; i < allLength; i++) {
                            curr[_all[i][0]] = _all[i][1];
                        }
                    } else {
                        util.toast(data);
                    }
                }
                util.post(data, true, successCallBack, errorCallBack, "list");
            }
        };
        var getCurrByCode = function (typeCode) {
            if (curr == null) {
                init();
                return typeCode;
            } else {
                return curr[typeCode];
            }
        };
        var getAllCurr = function () {
            if (curr) {
                var _o = {};
                for (var attr in curr) {
                    _o[attr] = { "code": attr, "txt": curr[attr] };
                }
                return _o;
            } else {
                return null;
            }
        };
        return {
            init: init,
            getCurrByCode: getCurrByCode,
            getAllCurr: getAllCurr
        }
    })(jQuery);

    //option是调用的接口方法，code：现有的code值,column代表字段
    var getCodeNameByCode = function (option, code, column, elem) {
        var data = dataStructure.choiceData(option, [column + " = '" + code + "'", null]);
        var errorCallBack = function (data) {
            elem.html(code);
            util.toast('网络错误');
        };
        var successCallBack = function (data) {
            var codeName = code;
            if (data.Status == 1) {
                var _all = data.Data;
                if (_all[0]) {
                    codeName = _all[0][1];
                    elem.html(code + "[" + codeName + "]");
                }
            } else {
                util.toast('服务端错误');
                elem.html(code);
            }
        }
        util.post(data, true, successCallBack, errorCallBack, "list");
    };

    var init = function () {
        dataRepository.init();
        countryRepository.init();
        unitRepository.init();
        currRepository.init();
    };

    return {
        init: init,
        dataRepository: dataRepository,
        countryRepository: countryRepository,
        unitRepository: unitRepository,
        currRepository: currRepository,
        getCodeNameByCode: getCodeNameByCode
    }
})(jQuery);
