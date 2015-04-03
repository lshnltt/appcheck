//待查验列表模块
var checkList = (function ($) {
    'use strict';
    //保存当前操作的报关单对象
    var checkItem = {};
    //存储的当前操作报关单dom的jquery对象
    var checkDomOb = {};
    //var pageIndex = 1;
    var pageSize = 50;
    var TotalCount = 0;
    var dateTime = new Date().getTime();
    //var currentCount = 0;
    var oneDayTime = 24 * 60 * 60 * 1000;
    var option1 ={"column":"PD_DATETIME","method":"WaitForCheckMobile","value":""};
    var option2 = { "column": "EXAM_DATETIME", "method": "AlreadyForCheckMobile", "value": "","nextDay":"" };
    //待办列表的容器
    var $listItemCon = "";
    //已查验列表的容器
    var $haveCheckedItemCon = "";
    //判断进入报关单详情是不是只读
    var readOnly = false;
    //保存报关单的状态
    //0表示人员A打开的待查验状态(未点击开始查验按钮)
    //1表示人员B打开的待查验状态(未点击开始查验按钮)
    //2表示人员A打开的待查验状态(点击了开始查验按钮)
    //3表示人员B打开的待查验状态(点击了开始查验按钮)
    //4表示人员A打开的待处理状态(提交过的报关单)
    //5表示人员B打开的待处理状态(提交过的报关单)
    //6表示人员A打开的已查验状态(被审批通过的报关单)
    //7表示人员B打开的已查验状态(被审批通过的报关单)
    var entryState = -1;
    //获取日期（年、月、日）
    var getDate = function (datetime) {
        datetime = datetime ? datetime : new Date().getTime();
        var d = new Date(datetime);
        var date = null;
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        month = month > 9 ? month : "0" + month;
        day = day > 9 ? day : "0" + day;
        date = year + "-" + month + "-" + day;
        return date;
    };
    var _createRowByOb = function (item) {
        var check_state = item["check_state"];
        var entry_id = item["EntryID"];
        var disp_date = item["PdDatetime"];
        var chk_er1 = item["ExamPerson1"];
        var chk_er2 = item["ExamPerson2"];
        var container_id = item["ExamContIds"];
        var $listItem = $("<div>").addClass("listItem").attr({ "id": entry_id });

        var $listItem_leftCon = $("<div>").addClass("listItem_leftCon").addClass("fl");
        var $flag = $("<div>").addClass("flag");
        var $listItem_rightCon = $("<div>").addClass("listItem_rightCon");
        var $listItem_rightCon_left = $("<div>").addClass("listItem_rightCon_left").addClass("fl");
        var $entry = $("<div>").addClass("entry").addClass("fcblack").addClass("f38");
        var $container = $("<div>").addClass("container").addClass("fc777").addClass("f26").addClass("mt18");
        var $listItem_rightCon_right = $("<div>").addClass("listItem_rightCon_right").addClass("fr").addClass("tc");
        var $listItem_rightCon_dateCon = $("<div>").addClass("listItem_rightCon_dateCon").addClass("none");
        var $date = $("<div>").addClass("date").addClass("fc1a476b").addClass("f24");
        var $checkPerson = $("<div>").addClass("checkPerson");
        var $retryBtnCon = $("<div>").addClass("retryBtnCon").addClass("none");
        var $retryBtn = $("<input />").addClass("retryBtn").addClass("inputCommon")
                    .addClass("btnCommon").addClass("fcwhite").addClass("f32").attr("type", "button").val("重试");
        $listItem.append($listItem_leftCon).append($listItem_rightCon).append($("<div />").addClass("cb"));
        //$listItem.append($cb);
        $listItem_leftCon.append($flag);
        $listItem_rightCon.append($listItem_rightCon_dateCon);
        $listItem_rightCon.append($listItem_rightCon_left).append($listItem_rightCon_right);
        $listItem_rightCon.append($("<div />").addClass("cb"));
        $listItem_rightCon_left.append($entry).append($container);
        $listItem_rightCon_right.append($listItem_rightCon_dateCon).append($retryBtnCon);
        $listItem_rightCon_dateCon.append($date).append($checkPerson);
        $retryBtnCon.append($retryBtn);
        $entry.html(entry_id);
        $date.html(util.dtJsonFormat(disp_date, "yyyy-MM-dd"));
        $container.html(container_id);
        if (chk_er2 != null && chk_er2 != "") {
            $checkPerson.html(chk_er1 + "," + chk_er2);
        } else {
            $checkPerson.html(chk_er1);
        }

        _switchStatus(check_state, $flag, $listItem_rightCon_dateCon, $retryBtnCon);
        //将对象绑定到每行的dom中
        $listItem.data("itemob", item);
        return $listItem;
    };
    //状态修改
    var _switchStatus = function (check_state, $flag, $listItem_rightCon_dateCon, $retryBtnCon) {
        $flag.removeClass("state1 state2 state3 state4");
        switch (check_state) {
            case 0: //待查验
                $flag.addClass("state1");
                break;
            case 1: //待查验(开始查验)
                $flag.addClass("state2");
                break;
            case 2: //(待处理)
                $flag.addClass("state2");
                break;
            case 16://已查验
                $flag.addClass("state5");
            default:
                break;
        };
        $listItem_rightCon_dateCon.removeClass("none");
        $retryBtnCon.addClass("none");
    };

    var _managerData = function (rows, itemCon, param) {
        param = param || {};
        var exitInfo = "";
        //判断是不是已查验的请求
        var bool = false;
        bool = param["ExtInfo"] && param["ExtInfo"] == "AlreadyForCheckMobile";
        var _length = rows.length;
        var currentCount = $(itemCon).attr("currentCount");
        currentCount = currentCount ? currentCount : 0;
        $(".loadMore").remove();
        for (var i = 0; i < _length; i++) {
            var cell = rows[i].Cell;
            var item = {};
            item["check_state"] = cell.ProcessState;
            item["ProcessState"] = cell.ProcessState;
            //cell.ProcessState == "2"
            if (bool) {
                //如果是用户提交但是科长未审批的报关单则将其显示为已查验
                item["check_state"] = 16;
                item["ProcessState"] = 16;
            }
            item["EntryID"] = cell.EntryID;
            if (cell.PdDatetime == null) { cell.PdDatetime = "0000-00-00"; }
            item["PdDatetime"] = cell.PdDatetime;
            item["ExamPerson1"] = cell.ExamPerson1;
            item["ExamPerson2"] = cell.ExamPerson2;
            item["ExamContIds"] = cell.ExamContIds;
            item["ExamNo"] = cell.ExamNo;
            item["ExamResult"] = cell.ExamResult;
            item["RskNo"] = cell.RskNo;
            item["ID"] = cell.ID;
            //checkItems[cell.EntryID] = item;
            $(itemCon).append(_createRowByOb(item)).append($("<div>").addClass("line1"));
        }
        //加载更多
        if (currentCount < TotalCount) {
            var _loadMore = $("<div>").addClass("loadMore").text("加载更多 ＋");
            _loadMore.click(function () {
                $(".loadMore").text("加载中...");
                setTimeout(function () {
                    loadNextPage(itemCon, param);
                }, 600);
            });
            $(itemCon).append(_loadMore);
        }
        $("#fullBg").addClass("none");
    };

    var searchManager = function (searchKey) {
        $(".listItem").addClass("none");
        $(".line1").addClass("none");
        $(".downIcon").removeClass("upIcon");
        $(".downCon").addClass("none");
        var selectValue = $("#checkStateChoice").html();
        var count = 0;
        if ((searchKey == null || searchKey == "") && selectValue == "待办") {
            var currentCount = $listItemCon.attr("currentCount");
            currentCount = currentCount ? currentCount : 0;
            $(".loadMore").removeClass("none");
            $(".listItem").removeClass("none");
            $(".line1").removeClass("none");
            $("#searchField").attr({ "placeholder": "共" + currentCount + "条记录" });
            return;
        } else {
            $(".loadMore").addClass("none");
            var searchKey = searchKey ? searchKey.toLowerCase() : '';
            $(".listItem").each(function () {
                var item = $(this).data("itemob");
                //判断当前选择下拉列表的状态
                var checkStateBool = function () {
                    if (selectValue == "待办") {
                        return true;
                    } else if (selectValue == "待查验") {
                        return item["check_state"] === 0 || item["check_state"] === 1;
                    } else if (selectValue == "待处理") {
                        return item["check_state"] === 2;;
                    } else if (selectValue == "已查验") {
                        return item["check_state"] === 16;
                    }
                }
                if ((item["EntryID"].indexOf(searchKey) != -1 || item["ExamContIds"].indexOf(searchKey) != -1) && checkStateBool()) {
                    count++;
                    $(this).removeClass("none");
                    $(this).next().removeClass("none");
                } else {
                    $(this).addClass("none");
                    $(this).next().addClass("none");
                }
                $("#searchField").attr({ "placeholder": "共" + count + "条记录" });
            });
        }
    };

    var _loadDataByPage = function (itemCon, param) {
        var page = $(itemCon).data("pageIndex");
        $(".itemCon").addClass("none");
        $(itemCon).removeClass("none");
        if (page == 1) {
            $("#fullBg").removeClass("none");
        }
        //var data = dataStructure.listData(util.getOption("moduleId"), 'ExamProcess.RskExamApplyListRepository', page, pageSize, [{ "column": "ENTRY_ID", "symbol": "Rlike", "value": "" }, { "column": option.column, "symbol": ">=", "value": option.value }, { "column": option.column, "symbol": "<=", "value": option.value }], option.column + " ASC", option.method, []);
        
        var successCallBack = function (data) {
            if (data.Status == "1") {
                $("#searchField").val("");
                TotalCount = data.Data.TotalCount;
                if (page == 1) {
                    itemCon.attr("currentCount", 0);
                    $(itemCon).empty();
                }
                //显示所有隐藏的
                $(".listItem").removeClass("none");
                $(".line1").removeClass("none");
                var rows = data.Data.Rows;
                var currentCount = itemCon.attr("currentCount");
                currentCount = currentCount ? parseInt(currentCount) : 0;
                currentCount += rows.length;
                itemCon.attr("currentCount", currentCount);
                $("#searchField").attr({ "placeholder": "共" + currentCount + "条记录" });
                _managerData(rows, itemCon, param);
                if (page == 1) {
                    //加载第一页时候滚动到第一页
                    $("#listConScroll").scrollTop(0);
                }
            } else {
                var msg = "";
                if (data && data.Data) {
                    msg = JSON.stringify(data.Data);
                } else {
                    msg = "获取数据失败: " + JSON.stringify(data.Data);
                }
                if (page == 1) {
                    util.serverFailure($(itemCon), function () { _loadDataByPage(itemCon, param); }, msg);
                } else {
                    util.toast("数据加载失败：" + msg);
                    $(".loadMore").text("加载更多 ＋");
                }
                console.log(JSON.stringify(data));
            }
        };
        var errorCallBack = function (data) {
            if (page == 1) {
                util.loadFailure($(itemCon), function () { _loadDataByPage(itemCon, param); }, data);
            } else {
                util.toast(util.getOption("errorStr"));
                $(".loadMore").text("加载更多");
            }
            console.info(JSON.stringify(data));
        };
        util.post(param, true, successCallBack, errorCallBack, "list");
    };
    var addLock = function (entryId) {
        var resourceId = checkItem["ID"];
        var warnInfo = "";
        var _processState = checkList.getCheckItem()["ProcessState"];
        if (_processState == 0) {
            entryState = 0;
            readOnly = true;
        } else if (_processState == 1) {
            entryState = 2;
            readOnly = false;
        } else if (_processState == 2) {
            entryState = 4;
            readOnly = false;
        } else if (_processState == 16) {
            entryState = 6;
            readOnly = true;
        }
        $("#fullBg").removeClass("none");
        //CheckLockM
        var data = dataStructure.choiceData("SysManager.BizAppLockerRepository", [resourceId], "CheckLockM", util.getOption("moduleId"));
        //进入报关单详情页面
        var enterCheckWork = function () {
            $("#checkwork_head .titleBottom").html(entryId);
            $.when(checkwork.loadData(), goods.loadData())
            .done(function () {
                //var dtd2 = $.Deferred();
                containers.loadData();
            }).done(function () {
                //var dtd4 = $.Deferred();
                records.loadData();
            });
        };
        var successBack = function (data) {
            var selectPerson = function () {
                var id = checkList.getCheckItem()["ID"];
                var data = dataStructure.choiceData("SysManager.WFConfigRepository", [id], "GetWorkFlowInfo", util.getOption("moduleId"));
                var successCallBack = function (data) {
                    if (data.Status == 1) {
                        var datas = data.Data;
                        var isCompleted = data.Data.CurrentActivity.IsCompleted;
                        if (datas.NextActivityList && datas.NextActivityList.length > 0) {
                            var nextActivityList = datas.NextActivityList;
                            var nextActivity = nextActivityList[0];
                            var isEndNode = nextActivity["IsEndNode"];
                            var code = nextActivity.Code;
                            var name = nextActivity.Name;
                            console.log("下一个处理环节" + name);
                            var option = {};
                            if (nextActivity.Resource && nextActivity.Resource.length !== 0) {
                                var resc = nextActivity.Resource[0];
                                var id = resc.ID;
                                var name = resc.Name;
                                option[id] = {};
                                option[id]["code"] = id;
                                option[id]["txt"] = name;
                                for (var j = 0, resLength = nextActivity.Resource.length; j < resLength; j++) {
                                    var resc = nextActivity.Resource[j];
                                    var id = resc.ID;
                                    var name = resc.Name;
                                    option[id] = {};
                                    option[id]["code"] = id;
                                    option[id]["txt"] = name;
                                }
                                $("#fullBg").addClass("none");
                                dialog.showDialog7(option, "选择人员", $("#btnSubmit"));
                                enterCheckWork();
                            } else {
                                $("#fullBg").addClass("none");
                                enterCheckWork();
                                //if (!isCompleted && isEndNode) {
                                //    //util.toast("没有您需要审批的信息，该条信息已被他人审批！");
                                    
                                //} else {
                                    
                                //}
                            }
                        } else {
                            $("#fullBg").addClass("none");
                            enterCheckWork();
                        }
                    } else {
                        $("#fullBg").addClass("none");
                        util.toast(data.Data);
                        enterCheckWork();
                    }
                };
                var errorCallBack = function (data) {
                    util.toast(util.getOption("errorStr"));
                    console.log(JSON.stringify(data));
                    enterCheckWork();
                };
                util.post(data, true, successCallBack, errorCallBack, "list");
            };
            if (data.Status == 1) {
                if (data.Data) {
                    if (data.Data.result) {
                        $("#fullBg").addClass("none");
                        warnInfo = "该报关单已被(" + data.Data.msg+")打开";
                        $(".bottomWarnInfo").html(warnInfo);
                        util.toast("该条数据正在被他人办理");
                        if (_processState == 0) {
                            entryState = 1;
                        } else if (_processState == 1) {
                            entryState = 3;
                        } else if (_processState == 2) {
                            entryState = 5;
                        } else if (_processState == 16) {
                            entryState = 7;
                        }
                        readOnly = true;
                        enterCheckWork();
                    } else {
                        selectPerson();
                    }
                    
                } else {
                    selectPerson();
                }
            } else {
                util.toast(data.Data);
                $("#fullBg").addClass("none");
            }
        };
        var errorBack = function (data) {
            util.toast(util.getOption("errorStr"));
            $("#fullBg").addClass("none");
            console.info(JSON.stringify(data));
        };
        if (_processState == 16) {
            enterCheckWork();
        } else {
            util.post(data, true, successBack, errorBack, "Method");
        }
    };
    var eventInitialize = function () {
        $("#refreshBtn").click(function (event) {
            util.stopBubble(event);
            var $that = $(this);
            $that.addClass("refreshBtn_c")
            setTimeout(function () {
                $that.removeClass("refreshBtn_c");
                checkList.refreshData();
            }, util.getOption("timer1"));
        });
        $("#searchField").on("input", function (event) {
            util.stopBubble(event);
            searchManager($(this).val());
        });
        //列表项点击事件
        $("body").off("click", ".listItem");
        $("body").on("click", ".listItem", function (event) {
            util.stopBubble(event);
            $(".downIcon").removeClass("upIcon");
            $(".downCon").addClass("none");
            //当前操作报关单对象
            console.log(JSON.stringify($(this).data("itemob")));
            checkItem = $(this).data("itemob");
            checkDomOb = this;
            var EntryID = $(this).attr("id");
            $(this).addClass("bgfffde5");
            setTimeout(function () {
                $(".listItem").removeClass("bgfffde5");
                addLock(EntryID);
            }, util.getOption("timer1"));
        });
        //查验状态下拉列表点击事件
        $(".checkStateChoiceCon").unbind("click");
        $(".checkStateChoiceCon").bind("click", function () {
            util.stopBubble(event);
            if ($(".downCon").is(":visible")) {
                $(".downIcon").removeClass("upIcon");
                $(".downCon").addClass("none");
            } else {
                $(".downIcon").addClass("upIcon");
                $(".downCon").removeClass("none");
            }
        });
        //下拉列表项的点击事件
        $(".selectChoice").unbind("click");
        $(".selectChoice").bind("click", function () {
            util.stopBubble(event);
            var index = $(".selectChoice").index($(this));
            $(".downIcon").removeClass("upIcon");
            $(".downCon").addClass("none");
            $("#checkStateChoice").html($(this).html());
            var searchKey = $("#searchField").val();
            if (index < $(".selectChoice").length - 1) {
                //如果选中的不是最后一个已查验则调用searchManager(searchKey);
                $haveCheckedItemCon.addClass("none");
                $listItemCon.removeClass("none");
                //先隐藏前一天后一天按钮
                $(".daysCon").addClass("none");
                searchManager(searchKey);
            } else {
                dateTime = new Date().getTime();
                var date = getDate(dateTime);
                var nextDay = dateTime + oneDayTime;
                option2.value = getDate(dateTime);
                option2.nextDay = getDate(nextDay);
                //option2.value = "2014-11-19";
                $haveCheckedItemCon.data("pageIndex", 1);
                loadAreadyCheckedPage(option2);
                //显示前一天后一天按钮
                $(".daysCon").removeClass("none");
                $(".daysCon .nextDay").addClass("bcgray");
            }
        });
        //加载前一天后一天的数据
        var loadOtherDayCheck = function (day) {
            var nextDayTime = day + oneDayTime;
            var nextDay = getDate(nextDayTime);
            option2.value = getDate(day);
            option2.nextDay = nextDay;
            var currentDay = getDate(new Date().getTime());
            if (currentDay == option2.value) {
                $(".daysCon .nextDay").addClass("bcgray");
            } else {
                $(".daysCon .nextDay").removeClass("bcgray");
            }
            $haveCheckedItemCon.data("pageIndex", 1);
            loadAreadyCheckedPage(option2);
        }
        //前一天按钮点击
        $(".prevDay").unbind("click");
        $(".prevDay").bind("click", function () {
            dateTime -= oneDayTime;
            loadOtherDayCheck(dateTime);
        });
        //后一天按钮点击
        $(".nextDay").unbind("click");
        $(".nextDay").bind("click", function () {
            if (!$(".daysCon .nextDay").hasClass("bcgray")) {
                dateTime += oneDayTime;
                loadOtherDayCheck(dateTime);
            }
        });
        //重试按钮事件
        var retryBind = function () { };
        retryBind();
        //设置列表内容的高度
        var setHeight = function () {
            var winHeight = window.innerHeight;
            var winWidth = window.innerWidth;
            var $content = $("#checkListPage .content").css({"min-height":winHeight - 190});
            //var $content = $("#checkListPage .content").css({ "min-height": winHeight - 192,"max-height": winHeight - 192 });
        };
        setHeight();
    };

    //获取当前操作的报关单信息
    var getCheckItem = function () {
        return checkItem;
    };
    //加载已查验报关单页面
    var loadAreadyCheckedPage = function (option) {
        $(".daysCon .currentDay").html(option.value);
        var page = $haveCheckedItemCon.data("pageIndex");
        var param = dataStructure.listData(util.getOption("moduleId"), 'ExamProcess.ViewRskExamApplyListRepository', page, pageSize, [{ "column": "ENTRY_ID", "symbol": "Rlike", "value": "" },
            { "column": option.column, "symbol": ">=", "value": option.value }, { "column": option.column, "symbol": "<", "value": option2.nextDay }], option.column + " ASC", option.method, []);
        _loadDataByPage($haveCheckedItemCon, param);
    };
    var loadWaitForCheckPage = function (option) {
        var page = $listItemCon.data("pageIndex");
        var param = dataStructure.listData(util.getOption("moduleId"), 'ExamProcess.RskExamApplyListRepository', page, pageSize,
            [{ "column": "ENTRY_ID", "symbol": "Rlike", "value": "" }, { "column": option.column, "symbol": ">=", "value": "" },
                { "column": option.column, "symbol": "<=", "value": "" }], option.column + " ASC", option.method, []);
        _loadDataByPage($listItemCon, param);
    };
    var loadFisrtPage = function () {
        //待办列表的容器
        $listItemCon = $("#listItemCon");
        //已查验列表的容器
        $haveCheckedItemCon = $("#haveCheckedItemCon");
        $("#checkList_userName").html(util.getUserInfo.getUser().DisPlayName);
        readOnly = false;
        entryState = -1;
        //先隐藏前一天后一天按钮
        $(".daysCon").addClass("none");
        $(".downIcon").removeClass("upIcon");
        $(".downCon").addClass("none");
        $("#checkStateChoice").html("待办");
        $listItemCon.data("pageIndex", 1);
        loadWaitForCheckPage(option1);
    };

    var loadNextPage = function (itemCon, param) {
        var pageIndex = $(itemCon).data("pageIndex");
        $(itemCon).data("pageIndex", ++pageIndex);
        console.info($(itemCon).data("pageIndex"));
        _loadDataByPage(itemCon,param);
    };

    var changeStatus = function (id, status) {
        //var _row = $("#" + id);
        var $flag = $(checkDomOb).find(".flag");
        var $listItem_rightCon_dateCon = $(checkDomOb).find(".listItem_rightCon_dateCon");
        var $retryBtnCon = $(checkDomOb).find(".retryBtnCon");
        checkItem["ProcessState"] = status;
        _switchStatus(status, $flag, $listItem_rightCon_dateCon, $retryBtnCon);
    };

    //获取报关单打开的状态
    var getEntryState = function () {
        return entryState;
    };
    
    //提供判断报关单详情是否可读的接口给外部调用
    var isReadOnly = function () {
        return readOnly;
    };
    //设置报关单是否可读的情况
    var setReadOnly = function (readOnly1) {
        readOnly = readOnly1;
    };
    return {
        eventInitialize: eventInitialize,
        getCheckItem: getCheckItem,
        loadFisrtPage: loadFisrtPage,
        loadNextPage: loadNextPage,
        refreshData: loadFisrtPage,
        changeStatus: changeStatus,
        getEntryState: getEntryState,
        isReadOnly: isReadOnly,
        setReadOnly: setReadOnly
    };
})(jQuery);