//集装箱模块
var containers = (function ($) {
    'use strict';
    //将所有集装箱封装成一个对象
    var containerArray = [];
    //判断是否只读
    var readOnly = false;
    //九宫格对象显示
    var oldDownBoxObj = { "左后": "A", "中后": "B", "右后": "C", "左中": "D", "中中": "E", "右中": "F", "左前": "G", "中前": "H", "右前": "I" };
    //开拆区域2
    var oldHollowArea2Obj = {"上":"0","下":"1","全":"2"};
    //判断手机支不支持touchstart方法
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    //集装箱内容
    var $tabItem;
    var linedEntryIdTxt = "关联单证";
    //显示关联报关单
    var showAssociateEntry = function (entryIds, parentElems) {
        var formIdArray = entryIds || [];
        $(formIdArray).each(function (i, item) {
            var FormId = item.FormId;
            var FormType = item.FormType;
            var $oldContainerRow = $("<div>").addClass("oldContainerRow");
            var $oldSealCommon = $("<div>").addClass("oldSealCommon fc8c").html(linedEntryIdTxt + (i + 1));
            var $oldSealDetailCommon = $("<div>").addClass("oldSealDetailCommon bcffe6 br6");
            //var $AssociateEntryId = $("<div>").addClass("AssociateEntryId").html(item);
            var $AssociateEntryId = $("<div>").addClass("AssociateEntryId fl").html(FormId);
            if (FormType == 1) {
                $AssociateEntryId.addClass("fc0c83");
            }
            var $rightEntryIcon = $("<div>").addClass("rightEntryIcon fr");
            var $cb_child = $("<div>").addClass("cb");
            var $cb = $("<div>").addClass("cb");
            $oldContainerRow.append($oldSealCommon).append($oldSealDetailCommon.append($AssociateEntryId).append($rightEntryIcon).append($cb_child)).append($cb);
            parentElems.append($oldContainerRow);
            $oldSealDetailCommon.unbind("click").bind("click", function () {
                if (FormType == 1) {
                    history.pushState({ page: "page2" }, "", location.href.split("?")[0] + "?page=page2");
                    entryMesg.loadData(FormId);
                }
            });
        });
    }
    //显示集装箱页面
    var showPage = function () {
        $("#fullBg").addClass("none");//加载数据页面隐藏
        //清空集装箱内容
        $tabItem.empty();
        //tab_item的子元素
        var $itemChild = $("<div>").addClass("innerCon");
        $tabItem.append($itemChild);
        for (var i = 0, containerLength = containerArray.length; i < containerLength; i++) {
            //表示集装箱的索引
            var index = i + 1;
            //总共的集装箱数量
            var totalNum = containerArray.length;
            var container = containerArray[i];
            var ContainerID = container.ContainerID;
            var ContainerIDResult = container.ContainerIDResult;
            var SealNoResult = container.SealNoResult;
            var SealNo = container.SealNo;
            var SealID = container.SealID;
            var ContaResult = container.ContaResult;
            var NewSealNo = container.NewSealNo;
            var ContainerRemark = container.ContainerRemark;
            var RealHollowArea1 = container.RealHollowArea1;
            var HollowArea = container.HollowArea;
            var FormIdList = container.FormIdList;
            //开拆方式1
            var ActualHollowArea1 = container.ActualHollowArea1 || "";
            //开拆方式2
            var ActualHollowArea2 = container.ActualHollowArea2 || "";
            //系统选定开拆方式中掏箱方式1和开拆方式2的分隔符
            var separator = container.separator || "";
            var $containerItem = $("<div>").addClass("containerItem itemCommon");
            var $con_child1 = $("<div>").addClass("NumCon ml40 mr40");
            var $con_child2 = $("<div>").addClass("oldConInfoCon mb25");
            var $con_child3 = $("<div>").addClass("line3 container_lineCommon");
            var $con_child4 = $("<div>");
            var $con_child5 = $("<div>");
            var $con_child6 = $("<div>");
            var $con_child7 = $("<div>");
            var $con_child8 = $("<div>");
            var $con_child9 = $("<div>");
            var $con_child10 = $("<div>");
            //封志号右边的显示
            var rightStyle1 = _setRightStyle(NewSealNo);
            if (!(/(^[0-9]\d*$)/.test(rightStyle1["currentCode"]))) {
                rightStyle1["currentCode"] = SealNo;
            }
            //备注右边的显示
            var rightStyle2 = _setRightStyle(ContainerRemark);
            $itemChild.append($containerItem);
            $containerItem.append($con_child1);
            $containerItem.append($con_child2);
            $containerItem.append($con_child3);
            $containerItem.append($con_child4);
            $containerItem.append($con_child5);
            $containerItem.append($con_child6);
            $containerItem.append($con_child7);
            $containerItem.append($con_child8);
            $containerItem.append($con_child9);
            $containerItem.append($con_child10);
            $con_child1.append(
                $("<div>").addClass("NoLeftCon fl")
                    .append($("<div>").addClass("NoTxt fc8c f18").html("选查集装箱号"))
                    .append($("<div>").addClass("No fcc5 f47 mt8").html(ContainerID))
                ).append($("<div>").addClass("Num fr").append(
                    $("<span>").addClass("indexNum").html(index)
                    ).append("/")
                    .append($("<span>").addClass("totalNum").html(totalNum))
                ).append($("<div>").addClass("cb"));
            showAssociateEntry(FormIdList, $con_child2);
            $con_child2.append(
                $("<div>").addClass("oldContainerRow").append(
                    $("<div>").addClass("oldSealCommon").html("原封志号"))
                    .append($("<div>").addClass("oldSealDetailCommon").html(SealID))
                    .append($("<div>").addClass("cb"))
                ).append(
                $("<div>").addClass("oldContainerRow oldDownBox").unbind("click").bind("click", function () {
                    if (ActualHollowArea1) {
                        history.pushState({ page: "page17", dialog: "dialog10", mask: "fullBg" }, "", "index.html?page=page17");
                        //给开拆方式弹出框赋值
                        var setDownBoxValue = function (code) {
                            //var option = convertCode("CONT_CHK_TYPE");
                            var $dialog = $("#downBoxDialog");
                            $dialog.find("li").removeClass("current");
                            if (code) {
                                $dialog.find("li:contains(" + code + ")").addClass("current");
                            }
                            //var count = 0;
                            //for (var prop in option) {
                            //    var code = option[prop]["ItemCode"];
                            //    var txt = option[prop]["ItemName"];
                            //    $dialog.find("li:eq(" + count + ")").html(code);
                            //    count++;
                            //}
                        };
                        var getDownBoxCode = function (oldDownBox) {
                            var txt = oldDownBox;
                            var code = oldDownBoxObj[txt];
                            return code;
                        };
                        var ActualHollowArea = $(this).find(".oldSealDetailCommon .ActualHollowArea1").html();
                        var code = getDownBoxCode(ActualHollowArea);
                        setDownBoxValue(code);
                        dialog.showDialog($("#downBoxDialog"), 0.75, "334", "40 0");
                    }
                }).append(
                    $("<div>").addClass("oldSealCommon").html("系统选定开拆方式"))
                    .append($("<div>").addClass("oldSealDetailCommon")
                        .append($("<span>").addClass("ActualHollowArea1").html(ActualHollowArea1))
                        .append($("<span>").addClass("ActualHollowArea2").html(separator + ActualHollowArea2)))
                    .append($("<div>").addClass("cb"))
                );
            $con_child4.append(
                $("<div>").addClass("containerIdCon rowCommon1")
                .append($("<div>").addClass("leftTitleTxt contTxtComm fl").html("箱号/车号"))
                .append($("<div>").addClass("conRightCon fr tr").data("title", "箱号/车号")
                    //.append($("<div>").addClass("statusTxtGreen leftTxt").html("相符"))
                    //.append($("<div>").addClass("statusBtn rightIcon greenIcon radioBtnCommon fr"))
                ).append($("<div>").addClass("cb")))
            .append($("<div>").addClass("line3 container_lineCommon"));
            $con_child5.append(
                $("<div>").addClass("sealNoCon rowCommon1")
                    .append($("<div>").addClass("sealNoTxt contTxtComm fl").html("重封号"))
                    .append($("<div>").addClass("conRightCon fr").data("type", 4).data("title", "重封号").data("currentCode", rightStyle1["currentCode"])
                        .append($("<div>").addClass("newSealNo leftTxt conFieldTxt " + rightStyle1["leftTxtClass"] + " fl").html(rightStyle1["leftTxt"]))
                        .append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon " + rightStyle1["rightIconClass"] + " fr"))
                    )
                    .append($("<div>").addClass("cb"))
                ).append($("<div>").addClass("line3 container_lineCommon"));
            $con_child6.append(
                $("<div>").addClass("sealNoChkResultCon rowCommon1")
                    .append($("<div>").addClass("sealNoChkResultTxt contTxtComm fl").html("封志号检查结果"))
                    .append($("<div>").addClass("conRightCon fr").data("title", "封志号检查结果")
                        //.append($("<div>").addClass("sealNoChkResut leftTxt conFieldTxt con_blueTxt fl").html("完好"))
                        //.append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"))
                    ).append($("<div>").addClass("cb"))
                ).append($("<div>").addClass("line3 container_lineCommon"));
            $con_child7.append(
                $("<div>").addClass("containerCheckResultCon rowCommon1")
                .append($("<div>").addClass("containerCheckResultTxt contTxtComm fl").html("检查结果"))
                .append($("<div>").addClass("conRightCon fr tr").data("title", "检查结果")
                ).append($("<div>").addClass("cb"))
                ).append($("<div>").addClass("line3 container_lineCommon"));
            $con_child8.append(
                $("<div>").addClass("unstuffingCaseCon rowCommon1")
                    .append($("<div>").addClass("unstuffingCaseTxt contTxtComm fl").html("实际开拆方式1"))
                    .append($("<div>").addClass("conRightCon fr").data("title", "实际开拆方式1")
                        //.append($("<div>").addClass("unstuffingCase leftTxt conFieldTxt con_grayTxt fl").html("点击输入"))
                        //.append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon grayFront fr"))
                    ).append($("<div>").addClass("cb"))
                ).append($("<div>").addClass("line3 container_lineCommon"));
            $con_child9.append(
                $("<div>").addClass("unstuffingCaseCon rowCommon1")
                    .append($("<div>").addClass("unstuffingCaseTxt contTxtComm fl").html("实际开拆方式2"))
                    .append($("<div>").addClass("conRightCon fr").data("title", "实际开拆方式2")
                        //.append($("<div>").addClass("unstuffingCase leftTxt conFieldTxt con_blueTxt fl").html("点击输入"))
                        //.append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"))
                    ).append($("<div>").addClass("cb"))
                ).append($("<div>").addClass("line3 container_lineCommon"));
            $con_child10.append(
                $("<div>").addClass("conRemarkCon rowCommon1")
                    .append($("<div>").addClass("conRemarkConTxt contTxtComm fl").html("集装箱备注"))
                    .append($("<div>").addClass("conRightCon fr").data("type", 5).data("title", "集装箱备注").data("currentCode", rightStyle2["currentCode"])
                        .append($("<div>").addClass("conRemarkCon leftTxt conFieldTxt " + rightStyle2["leftTxtClass"] + " fl").html(rightStyle2["leftTxt"]))
                        .append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon " + rightStyle2["rightIconClass"] + " fr"))
                    ).append($("<div>").addClass("cb"))
                );
            
        }
        if (messages.getMessageObj().JJCHY["leftContainers"]) {
            var $itemChild1 = $("<div>").addClass("innerCon");
            var $innerChild1 = $("<div>").addClass("leftContainerItem itemCommon");
            var $titleCon = $("<div>").addClass("leftContainerTitle").html("未选集装箱");
            var $leftContainerCon = $("<div>").addClass("leftContainerCon");
            var $leftContainerTxt = $("<div>").addClass("No fcc5 f47 mt8 ml43 mr43").html(messages.getMessageObj().JJCHY["leftContainers"]+" ");
            $tabItem.append($itemChild1);
            $itemChild1.append($innerChild1);
            $innerChild1.append($titleCon).append($leftContainerCon.append($leftContainerTxt));
        }
        $tabItem.data("refresh", false);
    };
    var loadData = function () {
        console.info("4");
        //readOnly = checkList.isReadOnly();
        var dtd = $.Deferred();
        $("#fullBg").removeClass("none");//加载数据页面显示
        var EntryID = $("#checkwork_head .titleBottom").html();
        var examNo = checkList.getCheckItem()["ExamNo"];
        containerArray.length = 0;
        //var data = dataStructure.listData(util.getOption("moduleId"), "H2000.BizRskExamListContainerRepository", 1, 9999,
        //    [{ column: "EXAM_REC_ID", symbol: "=", value: examNo }], "", "");
        var examNo = checkList.getCheckItem()["ExamNo"];
        var examNo = checkList.getCheckItem()["ExamNo"];
        var data = dataStructure.choiceData("H2000.BizRskExamListContainerRepository", [examNo,EntryID], "GetShowList", util.getOption("moduleId"));
        var successCallBack = function (data) {
            console.info(data);
            if (data.Status == 1) {
                var containersObj = data.Data;
                var haveConts = containersObj.HaveConts;
                var Rows = data.Data.Rows;
                $("#checkworkPage .containersTab").attr("haveConts", haveConts);
                if (haveConts == 0) {
                    //无集装箱
                    haveNoCons(Rows);
                } else if (haveConts == 1) {
                    //海运有集装箱
                    haveCons(Rows);
                } else if (haveConts == 2) {
                    //无集装箱车牌信息
                    haveLicensePlate(Rows);
                }
            } else {
                util.serverFailure($tabItem, function cc() {
                    loadData();
                }, data.Data);
                //util.toast(data.Data);
            }
            dtd.resolve();
        };
        var errorCallBack = function (data) {
            util.loadFailure($tabItem, function cc() {
                loadData();
            });
            dtd.resolve();
            //util.toast("数据请求失败");
        };
        //有集装箱
        var haveCons = function (Rows) {
            for (var i = 0, rowLength = Rows.length; i < rowLength; i++) {
                var cell = Rows[i].Cell;
                var HollowArea = cell.HollowArea ? cell.HollowArea : "";
                var HollowAreaArray = HollowArea.split(",");
                //系统选定开拆方式中的实际开拆方式1
                var ActualHollowArea1 = "";
                //系统选定开拆方式中的实际开拆方式2
                var ActualHollowArea2 = "";
                var separator = "";
                ActualHollowArea1 = HollowAreaArray[0] ? HollowAreaArray[0] : "";
                ActualHollowArea2 = HollowAreaArray[1] ? HollowAreaArray[1] : "";
                if (HollowAreaArray.length == 1) {
                    if (HollowArea.length > 1) {
                        ActualHollowArea1 = "";
                        ActualHollowArea2 = HollowArea;
                    } else if (HollowArea.length == 1) {
                        ActualHollowArea1 = HollowArea;
                        ActualHollowArea2 = "";
                    }
                } else if (HollowAreaArray.length > 1) {
                    separator = ",";
                }
                var item = {};
                //集装箱号
                item["ContainerID"] = cell.ContainerID;
                //集装箱号/车号
                item["ContainerIDResult"] = cell.ContainerIDResult;
                //检查结果
                item["ContaResult"] = cell.ContaResult;
                //封志号
                item["SealNo"] = cell.SealNo;
                item["SealID"] = cell.ManifestSealID;
                //封志号检查结果
                item["SealNoResult"] = cell.SealNoResult;
                //新封志号
                item["NewSealNo"] = cell.NewSealNo;
                //备注
                item["ContainerRemark"] = cell.ContainerRemark;
                //实际开拆方式1
                item["RealHollowArea1"] = cell.RealHollowArea1 ? cell.RealHollowArea1 : (oldDownBoxObj[ActualHollowArea1] ? oldDownBoxObj[ActualHollowArea1] : "");
                //实际开拆方式2
                item["RealHollowArea2"] = cell.RealHollowArea2 ? cell.RealHollowArea2 : (oldHollowArea2Obj[ActualHollowArea2] ? oldHollowArea2Obj[ActualHollowArea2] : "");;
                //关联报关单
                item["FormIdList"] = cell.FormIdList;
                //系统选定开拆方式
                item["HollowArea"] = HollowArea;
                item["ActualHollowArea1"] = ActualHollowArea1;
                item["ActualHollowArea2"] = ActualHollowArea2;
                item["separator"] = separator;
                containerArray.push(item);
            }
            showPage();
            var choiceData = {};
            var itemLength = $(".containerItem").length;
            for (var i = 0; i < itemLength; i++) {
                //util.setChoice(data,0,)
                //箱号/车号
                var currentCode = containerArray[i]["ContainerIDResult"];
                var greenCode = "0";
                var parentElem = $($(".containerItem").get(i)).find(".conRightCon:eq(0)");
                parentElem.data("typeCode", "CHK_CONTA_ID");
                parentElem.data("currentCode", currentCode);
                parentElem.data("greenCode", greenCode);
                util.setChoice(convertCode("CHK_CONTA_ID"), greenCode, currentCode, parentElem, true);
                //封志号检查结果
                var currentCode = containerArray[i]["SealNoResult"];
                var greenCode = "0";
                parentElem = $($(".containerItem").get(i)).find(".conRightCon:eq(2)");
                parentElem.data("typeCode", "CHK_SEAL");
                parentElem.data("currentCode", currentCode);
                parentElem.data("greenCode", greenCode);
                util.setChoice(convertCode("CHK_SEAL"), greenCode, currentCode, parentElem, true, false);
                //集装箱检查结果
                var currentCode = containerArray[i]["ContaResult"];
                var greenCode = "0";
                parentElem = $($(".containerItem").get(i)).find(".conRightCon:eq(3)");
                parentElem.data("typeCode", "EXAM_RESULT");
                parentElem.data("currentCode", currentCode);
                parentElem.data("greenCode", greenCode);
                util.setChoice(convertCode("MAC_EXAM_RESULT"), greenCode, currentCode, parentElem, true, false);
                //实际开拆方式1
                var currentCode = containerArray[i]["RealHollowArea1"];
                var greenCode = "0";
                parentElem = $($(".containerItem").get(i)).find(".conRightCon:eq(4)");
                parentElem.data("typeCode", "CONT_CHK_TYPE");
                parentElem.data("currentCode", currentCode);
                parentElem.data("greenCode", greenCode);
                util.setChoice(convertCode("CONT_CHK_TYPE"), greenCode, currentCode, parentElem, true, true);
                //实际开拆方式2
                var currentCode = containerArray[i]["RealHollowArea2"];
                var greenCode = "0";
                parentElem = $($(".containerItem").get(i)).find(".conRightCon:eq(5)");
                parentElem.data("typeCode", "CONT_CHK_TYPE2");
                parentElem.data("currentCode", currentCode);
                parentElem.data("greenCode", greenCode);
                util.setChoice(convertCode("CONT_CHK_TYPE2"), greenCode, currentCode, parentElem, true, true);
            }
        };
        //无集装箱
        var haveNoCons = function (Rows) {
            $("#fullBg").addClass("none");//加载数据页面隐藏
            //清空集装箱内容
            $tabItem.empty();
        }
        //无集装箱有车牌信息
        var haveLicensePlate = function (Rows) {
            $("#fullBg").addClass("none");//加载数据页面隐藏
            //清空集装箱内容
            $tabItem.empty();
            var $itemChild = $("<div>").addClass("innerCon");
            $tabItem.append($itemChild);
            $(Rows).each(function (i, item) {
                var cell = item.Cell;
                var CarNoCn = cell.CarNoCn;
                var SealID = cell.SealID;
                var FormIdList = cell.FormIdList;
                var $containerItem = $("<div>").addClass("containerItem itemCommon");
                var $con_child1 = $("<div>").addClass("NumCon ml40 mr40");
                var $con_child2 = $("<div>").addClass("oldConInfoCon mb25");
                var $con_child3 = $("<div>").addClass("line3 container_lineCommon");
                $con_child1.append(
                $("<div>").addClass("NoLeftCon fl")
                    .append($("<div>").addClass("NoTxt fc8c f18").html("车牌号"))
                    .append($("<div>").addClass("No fcc5 f47 mt8").html(CarNoCn))
                ).append($("<div>").addClass("Num fr").append(
                    $("<span>").addClass("indexNum").html(i+1)
                    ).append("/")
                    .append($("<span>").addClass("totalNum").html(Rows.length))
                ).append($("<div>").addClass("cb"));
                showAssociateEntry(FormIdList, $con_child2);
                $con_child2.append(
               $("<div>").addClass("oldContainerRow").append(
                   $("<div>").addClass("oldSealCommon").html("封志号"))
                   .append($("<div>").addClass("oldSealDetailCommon").html(SealID))
                   .append($("<div>").addClass("cb"))
               );
            $containerItem.append($con_child1);
            $containerItem.append($con_child2);
            $itemChild.append($containerItem);
            });
        };
        util.post(data, true, successCallBack, errorCallBack, "list");
        return dtd;
    };
    var convertCode = function (typeCode) {
        var data = Dictionary.dataRepository.getByTypeCode(typeCode);
        return data;
    };
    //绑定页面元素触发事件
    var eventInitialize = function () {
        $tabItem = $("#checkworkPage .containersTab");
        $tabItem.on("click", ".rowCommon1", function (e) {
            util.stopBubble(e);
            //如果只读则每一个选择按钮点击无效
            if (!checkList.isReadOnly()) {
                $(this).addClass("newRowCommon");
                setTimeout(function () {
                    $(".rowCommon1").removeClass("newRowCommon");
                }, util.getOption("timer1"));
                var containerItemIndex = $(this).parents(".containerItem").index();
                //获取点击按钮
                var $conRightCon = $(this).find(".conRightCon");
                var title = $conRightCon.data("title");
                console.log(title + "title;::");
                var index = $(this).index(".containerItem:eq(" + containerItemIndex + ") .rowCommon1");
                var type = $conRightCon.data("type");
                var typeCode = $conRightCon.data("typeCode");
                var option = $conRightCon.data("option");
                var currentCode = $conRightCon.data("currentCode");
                var greenCode = $conRightCon.data("greenCode");
                switch (type) {
                    case 0:
                        //alert(containerArray[containerItemIndex]["ContainerIDResult"]);
                        setTimeout(function () {
                            if (!option) {
                                util.setChoice(convertCode(typeCode), greenCode, currentCode, $conRightCon, true);
                            } else {
                                dialog.showDialog0(option, $conRightCon);
                            }
                        }, util.getOption("timer2"));
                        break;
                    case 1:
                        break;
                    case 2:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            if (!option) {
                                util.setChoice(convertCode(typeCode), greenCode, currentCode, $conRightCon, true);
                            } else {
                                dialog.showDialog2(option, title, $conRightCon);
                            }
                        }, util.getOption("timer2"));
                        break;
                    case 3:
                        break;
                    case 4:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            dialog.showDialog4(title, $conRightCon, 16);
                        }, util.getOption("timer2"));
                        break;
                    case 5:
                        $(".fullBg").removeClass("none");
                        setTimeout(function () {
                            dialog.showDialog5(title, $conRightCon, 30);
                        }, util.getOption("timer2"));
                        break;
                }
            }
        });

    };
    //获取右边操作的样式和默认显示的字
    var _setRightStyle = function (value) {
        var rightStyle = {};
        if (value == undefined || value.length == 0) {
            rightStyle["leftTxtClass"] = "con_grayTxt";
            rightStyle["leftTxt"] = "点击添加";
            rightStyle["rightIconClass"] = "grayFront";
            rightStyle["currentCode"] = "";
        } else {
            rightStyle["leftTxtClass"] = "con_blueTxt";
            rightStyle["leftTxt"] = value;
            rightStyle["rightIconClass"] = "blueFront";
            rightStyle["currentCode"] = value;
        }
        return rightStyle;
    };
    var getContainerArray = function () {
        return containerArray;
    };
    var getCommitData = function () {
        var list = [];
        var EntryID = $("#checkwork_head .titleBottom").html();
        var ExamRecID = checkList.getCheckItem()["ExamNo"];
        for (var i = 0, conLength = containerArray.length; i < conLength; i++) {
            var item = {};
            var ContainerID = containerArray[i].ContainerID;
            var $containerItem = $(".containerItem:eq(" + i + ")");
            var ContainerIDResult = $containerItem.find(".conRightCon:eq(" + 0 + ")").data("currentCode");
            var NewSealNo = $containerItem.find(".conRightCon:eq(" + 1 + ")").data("currentCode");
            var SealNoResult = $containerItem.find(".conRightCon:eq(" + 2 + ")").data("currentCode");
            var ContaResult = $containerItem.find(".conRightCon:eq(" + 3 + ")").data("currentCode");
            var RealHollowArea1 = $containerItem.find(".conRightCon:eq(" + 4 + ")").data("currentCode");
            var RealHollowArea2 = $containerItem.find(".conRightCon:eq(" + 5 + ")").data("currentCode");
            var ContainerRemark = $containerItem.find(".conRightCon:eq(" + 6 + ")").data("currentCode");

            item["ExamRecID"] = ExamRecID;
            item["ContainerID"] = ContainerID;
            item["ContainerIDResult"] = ContainerIDResult;
            item["ContaResult"] = ContaResult;
            item["NewSealNo"] = NewSealNo;
            item["SealNoResult"] = SealNoResult;
            item["RealHollowArea1"] = RealHollowArea1;
            item["RealHollowArea2"] = RealHollowArea2;
            item["ContainerRemark"] = ContainerRemark;
            list.push(item);
        }
        return list;
    };
    var emptyData = function () {
        $(".containersTab").empty();
        containerArray.length = 0;
    };
    return {
        getContainerArray: getContainerArray,
        loadData: loadData,
        getCommitData: getCommitData,
        eventInitialize: eventInitialize,
        emptyData: emptyData
    };

})(jQuery);
