var dialog = (function ($) {
    'use strict';
    //显示对话框
    //dialogCss表示对话框的css类名，index表示css类名为dialogCss的索引，
    //width表示对话框的宽度或者相对于屏幕宽度的百分比
    //height表示对话框的高度或者相对于屏幕高度的百分比
    //fixed表示是否将固定对话框的高度
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    var getWholeHeight = function (elem) {
        var outHeight = elem.outerHeight();
        var marginTop = elem.css("margin-top");
        var marginBottom = elem.css("margin-bottom");
        var mTop = marginTop.indexOf("px") == -1 ? parseInt(marginTop) : parseInt(marginTop.substr(0, marginTop.length - 2));
        var mBottom = marginBottom.indexOf("px") == -1 ? parseInt(marginBottom) : parseInt(marginBottom.substr(0, marginBottom.length - 2));
        var wholeHeight = outHeight + mTop + mBottom;
        return wholeHeight;
    };
    var getWholeWidth = function (elem) {
        var outWidth = elme.outerWidth();
        var marginLeft = elem.css("margin-left");
        var marginRight = elem.css("margin-right");
        var mLeft = marginLeft.indexOf("px") == -1 ? parseInt(marginLeft) : parseInt(marginLeft.substr(0, marginLeft.length - 2));
        var mRight = marginRight.indexOf("px") == -1 ? parseInt(marginRight) : parseInt(marginRight.substr(0, marginRight.length - 2));
        var wholeWidth = outWidth + mLeft + mRight;
        return wholeWidth;
    }
    var showDialog = function (dialog, width, DialogConheight, btnConPadding) {
        dialog.data("isClicked", false);
        $(".fullBg").removeClass("none");
        DialogConheight = parseInt(DialogConheight);
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var $dialog = dialog;
        var $dialogCon = $dialog.find(".dialogCon");
        var marginTop = $dialogCon.css("margin-top");
        var marginBottom = $dialogCon.css("margin-bottom");
        var realMarginTop = 0;
        realMarginTop = marginTop.indexOf("px") == -1 ? parseInt(marginTop) : parseInt(marginTop.substr(0, marginTop.length - 2));
        var realMarginBottom = 0;
        realMarginBottom = (marginBottom.indexOf("px") == -1) ? parseInt(marginBottom) : parseInt(marginBottom.substr(0, marginBottom.length - 2));
        var $dialogInnerCon = $dialog.find(".dialogInnerCon");
        var $closeBtnCon = $dialog.find(".closeBtnCon");
        var $dialogTitleCon = $dialog.find(".dialogTitleCon");
        var $btnCon = $dialog.find(".dialogBtnCon");
        var closeBtnHeight = 0;
        var dialogTitleHeight = 0;
        var btnConHeight = 0;
        var innerConHeight = $dialogInnerCon.css("padding-bottom");
        var innerHeight = innerConHeight.indexOf("px") == -1 ? parseInt(innerConHeight) : parseInt(innerConHeight.substr(0, innerConHeight.length - 2));
        if ($closeBtnCon.length > 0) {
            closeBtnHeight = getWholeHeight($closeBtnCon);
        }
        if ($dialogTitleCon.length > 0) {
            dialogTitleHeight = getWholeHeight($dialogTitleCon);
        }
        if ($btnCon.length > 0) {
            btnConHeight = getWholeHeight($btnCon);
        }
        if (!btnConPadding) {
            $btnCon.css("padding", 0);
        } else {

        }

        var maxProportion = 0.6;
        var maxHeight = winHeight * maxProportion;
        var conHeight = maxHeight > DialogConheight ? DialogConheight : maxHeight;
        $dialogCon.height(conHeight);
        var bodyScrollHeight = $("body").scrollTop()
        var width = parseFloat(width) < 1 ? width * winWidth : width;
        var height = closeBtnHeight + dialogTitleHeight + btnConHeight + realMarginTop + conHeight + realMarginBottom + innerHeight + 2;
        //if (fixed) {
        //    height = parseFloat(height) < 1 ? height * winHeight : height;
        //} else {
        //    height = $dialog.get(0).clientHeight;
        //}
        var left = (winWidth - width) / 2;
        var top = (winHeight - height) / 2 + bodyScrollHeight;
        $dialog.height(height);
        $dialog.css({
            "left": left,
            "top": top
        });
        $dialog.width(width);
        $dialog.removeClass("none");
    };
    //显示type=0的对话框-----开关
    var showDialog0 = function (option, elem) {
        var currentCode = elem.data("currentCode");
        for (var prop in option) {
            if (currentCode && option[prop]["code"] != currentCode) {
                elem.data("currentCode", option[prop]["code"]);
                elem.find(".leftTxt").html(option[prop]["txt"]);
                if (elem.find(".rightIcon").hasClass("greenIcon")) {
                    elem.find(".leftTxt").removeClass("statusTxtgreen");
                    elem.find(".rightIcon").removeClass("greenIcon");
                    elem.find(".leftTxt").addClass("statusTxtred");
                    elem.find(".rightIcon").addClass("redIcon");
                } else {
                    elem.find(".leftTxt").removeClass("statusTxtred");
                    elem.find(".rightIcon").removeClass("redIcon");
                    elem.find(".leftTxt").addClass("statusTxtgreen");
                    elem.find(".rightIcon").addClass("greenIcon");
                }
                break;
            }
        }
    };
    //显示type=1的对话框-----开关，但是不是从后台获取数据的
    var showDialog1 = function (elem) {
    };
    //显示type=2的对话框-----单选对话框
    var showDialog2 = function (option, title, elem, searchBool) {
        var historyObject = {
            page: "8",
            dialog: "2"
        };
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog2", mask: "fullBg" }, "", "index.html?page=page8");
        //var index = 2;
        var count = 0;
        var $dialog = $("#singleChoiceDialog");
        $dialog.find(".dialogTitle").html(title);
        $dialog.find(".uniterming").empty();
        for (var prop in option) {
            var $child = $("<div>").addClass("unitermingRowCon").data("currentCode", option[prop]["code"]);
            var $child_1 = $("<div>").addClass("leftChoiceTxt").html(option[prop]["txt"]);
            var $child_2 = $("<div>").addClass("cb");
            var $child_3 = $("<div>").addClass("line3");
            $dialog.find(".uniterming").append($child.append($child_1).append($child_2)).append($child_3);
            count++;
            if (elem.data("currentCode") == option[prop]["code"]) {
                $child.addClass("unitermingRowConNewBg");
            }
        }
        var height = count * 104;
        showDialog($dialog, 0.8, height, "40 0");
        if (searchBool) {
            $dialog.find(".dialogSearchCon").removeClass("none");
            $dialog.find(".dialogInput").val("");
        } else {
            $dialog.find(".dialogSearchCon").addClass("none");
            $dialog.find(".dialogInput").val("");
        }
        $(window).unbind("resize", function () {
            showDialog($dialog, 0.8, height, "40 0");
        });
        $dialog.find(".unitermingRowCon").unbind("click");
        $dialog.find(".dialogInput").unbind("input");
        $dialog.find(".unitermingRowCon").bind("click", function (event) {
            util.stopBubble(event);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                $dialog.find(".unitermingRowCon").removeClass("unitermingRowConNewBg");
                $(this).addClass("unitermingRowConNewBg");
                var currentCode = $(this).data("currentCode");
                elem.data("currentCode", currentCode);
                elem.find(".leftTxt").removeClass("con_grayTxt");
                elem.find(".leftTxt").addClass("con_blueTxt");
                elem.find(".rightIcon").removeClass("grayFront");
                elem.find(".rightIcon").addClass("blueFront");
                elem.find(".leftTxt").html($(this).find(".leftChoiceTxt").html());
                setTimeout(function () {
                    history.back();
                    $dialog.addClass("none");
                    $(".fullBg").addClass("none");
                }, util.getOption("timer2"));
            }
        });
        $dialog.find(".dialogInput").bind("input", function (event) {
            util.stopBubble(event);
            var searchKey = $(this).val();
            $dialog.find(".unitermingRowCon").each(function () {
                var code = $(this).data("currentCode");
                var txt = $(this).find(".leftChoiceTxt").html();
                if (code.indexOf(searchKey) == -1 && txt.indexOf(searchKey) == -1) {
                    $(this).addClass("none");
                    $(this).next(".line3").addClass("none");
                } else {
                    $(this).removeClass("none");
                    $(this).next(".line3").removeClass("none");
                }
            });
        });
    };
    //显示type=3的对话框------多选对话框
    //bool用于判断多选对话框是否有选中更改的项
    var showDialog3 = function (option, title, elem, bool) {
        var showFlag = false;
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog1", mask: "fullBg" }, "", "index.html?page=page8");
        //var index = 1;
        var count = 0;
        var $dialog = $("#multiChoiceDialog");
        $dialog.find(".dialogTitle").html(title);
        $dialog.find(".mutipleChoice").empty();
        //$dialog.find(".otherWrapField").val("");
        for (var prop in option) {
            var $child = $("<div>").addClass("mutipleChoiceRowCon").data("currentCode", option[prop]["code"]);
            var $child_1 = $("<div>").addClass("leftChoiceTxt").html(option[prop]["txt"]).attr("leftTxt", option[prop]["txt"]);
            var $child_2 = $("<div>").addClass("rightChoiceBtn unCheckedBtn");
            var $child_3 = $("<div>").addClass("cb");
            var $child_4 = $("<div>").addClass("line3");
            var $child_5;
            //var $child_5;
            //var $child_6;
            //var $child_1_1;
            //var $child_1_3;
            var WrapOtherTxt = $(elem).attr("WrapOtherTxt");
            count++;
            showFlag = (bool && option[prop]["code"] == "7") ? true : false;
            if (showFlag) {
                //$child_1_1 = $("<span>").addClass("otherWarpSeparator").addClass("none").html("：");
                //$child_5 = $("<div>").addClass("otherWrapTxt").addClass("none").html(WrapOtherTxt).unbind("click").bind("click", function () {
                //    showDialog13($child, "其他包装");
                //});;
                //$child_6 = $("<div>").addClass("addOtherWrapBtn").addClass("none").html("添加").unbind("click").bind("click", function () {
                //    //showDialog13($child, "其他包装");
                //});
                //$child_1.append($child_1_1);
                //$child_5.insertAfter($child);
                //$child_6.insertAfter($child);
                $child_5 = $("<div>").addClass("otherWrapCon").addClass("none");
                var $input = $("<input>").addClass("otherWrapField").attr("type", "text").val(WrapOtherTxt);
                $child_5.append($input);
                $input.unbind("click");
                $input.bind("click", function (event) {
                    util.stopBubble(event)
                });
            }
            $dialog.find(".mutipleChoice").append($child.append($child_1).append($child_2).append($child_3).append($child_5)).append($child_4);
            var currCode = new Array();
            if (elem.data("currentCode") != null) {
                currCode = elem.data("currentCode").split(",");
            }

            for (var i = 0, currLength = currCode.length; i < currLength; i++) {
                if (option[prop]["code"] == currCode[i]) {
                    $child_2.removeClass("unCheckedBtn");
                    $child_2.addClass("checkedBtn");
                    if (showFlag) {
                        //if (WrapOtherTxt) {
                        //    $child_1_1.removeClass("none");
                        //    $child_5.removeClass("none");
                        //} else {
                        //    $child_6.removeClass("none");
                        //}
                        $child_5.removeClass("none");
                    }
                }
            }
        }
        var height = count * 104;
        showDialog($dialog, 0.75, height, "40 0");
        //$dialog.find(".mutipleChoiceRowCon").last().clone().appendTo($dialog.find(".mutipleChoiceRowCon:eq(2)")).data("currentCode","7");
        $dialog.find(".mutipleChoiceRowCon").unbind("click");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".mutipleChoiceRowCon").bind("click", function (event) {
            util.stopBubble(event);
            var $choiceBtn = $(this).find(".rightChoiceBtn");
            if ($choiceBtn.hasClass("unCheckedBtn")) {
                $choiceBtn.removeClass("unCheckedBtn");
                $choiceBtn.addClass("checkedBtn");
                if (bool && $(this).data("currentCode") == "7") {
                    //$("#multiChoiceDialog .otherWarpSeparator,.otherWrapTxt").removeClass("none");
                    //$dialog.find(".dialogCon").scrollTop(10000);
                    //$choiceBtn.removeClass("unCheckedBtn");
                    //$choiceBtn.addClass("checkedBtn");
                    //$("#multiChoiceDialog").find(".addOtherWrapBtn").removeClass("none");
                    //$("#multiChoiceDialog").find(".otherWrapTxt").addClass("none");
                    $dialog.find(".dialogCon").scrollTop(10000);
                    $("#multiChoiceDialog").find(".otherWrapCon").removeClass("none");
                } else {
                }
            } else {
                if (bool && $(this).data("currentCode") == "7") {
                    //$("#multiChoiceDialog .otherWarpSeparator").addClass("none");
                    //$(".addOtherWrapBtn").addClass("none");
                    //$(".otherWrapTxt").addClass("none");
                    //elem.attr("WrapOtherTxt", "");
                    //$("#multiChoiceDialog").find(".addOtherWrapBtn").removeClass("none");
                    //$("#multiChoiceDialog").find(".otherWarpSeparator,.otherWrapTxt").addClass("none");
                    //$choiceBtn.removeClass("checkedBtn");
                    //$choiceBtn.addClass("unCheckedBtn");
                    //showDialog13($(this), "其他包装");
                    $choiceBtn.removeClass("checkedBtn");
                    $choiceBtn.addClass("unCheckedBtn");
                    if (bool && $(this).data("currentCode") == "7") {
                        $(this).find(".otherWrapCon").addClass("none");
                    }
                } else {
                    $choiceBtn.removeClass("checkedBtn");
                    $choiceBtn.addClass("unCheckedBtn");
                }
            }

        });
        $dialog.find(".dialogBlueBtn").bind("click", function (event) {
            util.stopBubble(event);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                $(".fullBg").removeClass("none");
                //e.preventDefault();
                //$(".dialogBlueBtn").addClass("newConfirmBtn");
                //setTimeout(function () {
                //    $(".dialogBlueBtn").removeClass("newConfirmBtn");
                //}, util.getOption("timer1"));

                var currentCode = '';
                var currentName = '';
                //var length = $dialog.find(".mutipleChoiceRowCon").size();
                $dialog.find(".mutipleChoiceRowCon").each(function () {
                    var $choiceBtn = $(this).find(".rightChoiceBtn");
                    if ($choiceBtn.hasClass("checkedBtn")) {
                        currentCode += $(this).data("currentCode") + ",";
                        //判断是不是其他包装并且其他包装是选中的
                        //var isOtherWrap = (bool && $(this).data("currentCode") == "7" && $(this).find(".rightChoiceBtn").hasClass("checkedBtn")) ? true : false;
                        //if (isOtherWrap) {
                        //    var otherWrap = "";
                        //    if (!$("#multiChoiceDialog").find(".otherWrapTxt").hasClass("none")) {
                        //        otherWrap = $("#multiChoiceDialog").find(".otherWrapTxt").html();
                        //    }
                        //    var otherWrapTxt = otherWrap ? ("：" + otherWrap + ",") : ",";
                        //    currentName += $(this).find(".leftChoiceTxt").attr("leftTxt") + otherWrapTxt;
                        //    elem.attr("WrapOtherTxt", otherWrap);
                        //} else {
                        //    currentName += $(this).find(".leftChoiceTxt").html() + ",";
                        //    elem.attr("WrapOtherTxt", "");
                        //    $(this).find(".otherWrapField").val("");
                        //}
                        var isOtherWrap = (bool && $(this).data("currentCode") == "7" && $(this).find(".rightChoiceBtn").hasClass("checkedBtn")) ? true : false;
                        if (isOtherWrap) {
                            var otherWrap = $(this).find(".otherWrapField").val();
                            otherWrap = otherWrap ? otherWrap:"";
                            var otherTxt = otherWrap ? ":" + otherWrap + "," : ",";
                            currentName += $(this).find(".leftChoiceTxt").html() + otherTxt;
                            elem.attr("WrapOtherTxt", otherWrap);
                        } else {
                            currentName += $(this).find(".leftChoiceTxt").html() + ",";
                        }
                    }
                });
                currentCode = currentCode.substr(0, currentCode.length - 1);
                currentName = currentName.substr(0, currentName.length - 1);
                console.info(currentCode + "-----" + currentName);
                elem.data("currentCode", currentCode);
                if ($dialog.find(".checkedBtn").length == 0) {
                    //如果没有一个选中
                    elem.find(".leftTxt").html("点击添加");
                    elem.find(".leftTxt").removeClass("con_blueTxt");
                    elem.find(".leftTxt").addClass("con_grayTxt");
                    elem.find(".rightIcon").removeClass("blueFront");
                    elem.find(".rightIcon").addClass("grayFront");
                } else {
                    elem.find(".leftTxt").removeClass("con_grayTxt");
                    elem.find(".leftTxt").addClass("con_blueTxt");
                    elem.find(".rightIcon").removeClass("grayFront");
                    elem.find(".rightIcon").addClass("blueFront");
                    elem.find(".leftTxt").html(currentName);
                }
                //setTimeout(function () {
                history.back();
                $dialog.addClass("none");
                $(".fullBg").addClass("none");
                //}, util.getOption("timer2"));
            }
        });
    };
    //显示type=4的对话框------单行输入对话框
    var showDialog4 = function (title, elem, length) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog3", mask: "fullBg" }, "", "index.html?page=page9");
        //var index = 3;
        var $dialog = $("#singleInputDialog");
        $dialog.find(".singleLineField").attr("maxlength", length);
        $dialog.find(".dialogTitle").html(title);
        if (elem.find(".leftTxt").hasClass("con_blueTxt")) {
            $dialog.find(".singleLineField").val(elem.find(".leftTxt").html());
        }
        showDialog($dialog, 0.75, "95", "40 0");
        $(window).unbind("resize", function () {
            showDialog($dialog, 0.75, "95", "40 0");
        });
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            util.stopBubble(e);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                //$(".dialogBlueBtn").addClass("newConfirmBtn");
                //setTimeout(function () {
                //    $(".dialogBlueBtn").removeClass("newConfirmBtn");
                //}, util.getOption("timer1"));
                var value = $dialog.find(".singleLineField").val();
                util.limitMaxLength(value, length, $dialog.find(".singleLineField"));
                value = $dialog.find(".singleLineField").val();
                if (value.length > 0) {
                    elem.find(".leftTxt").html(value);
                    elem.find(".leftTxt").removeClass("con_grayTxt");
                    elem.find(".leftTxt").addClass("con_blueTxt");
                    elem.find(".rightIcon").removeClass("grayFront");
                    elem.find(".rightIcon").addClass("blueFront");
                } else {
                    elem.find(".leftTxt").html("点击添加");
                    elem.find(".leftTxt").removeClass("con_blueTxt");
                    elem.find(".leftTxt").addClass("con_grayTxt");
                    elem.find(".rightIcon").removeClass("blueFront");
                    elem.find(".rightIcon").addClass("grayFront");
                }
                elem.data("currentCode", value);
                //延迟执行
                //setTimeout(function () {
                history.back();
                $dialog.find(".singleLineField").val("");
                $dialog.addClass("none");
                $(".fullBg").addClass("none");
                //}, util.getOption("timer2"));
            }
        });
        //validateNumber($dialog.find(".singleLineField"));
    };
    //显示type=5的对话框------多行输入对话框
    var showDialog5 = function (title, elem, length) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog0", mask: "fullBg" }, "", "index.html?page=page6");
        //var index = 0;
        var $dialog = $("#multiInputDialog");
        $dialog.find(".manyRow").attr("maxlength", length);
        $dialog.find(".dialogTitle").html(title);
        var txt = elem.find(".leftTxt").html();
        txt = txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        if (elem.find(".leftTxt").hasClass("con_blueTxt")) {
            $dialog.find(".manyRow").val(txt);
        }
        showDialog($dialog, 0.87, "307", "40 30");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            util.stopBubble(e);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                //$(".dialogBlueBtn").addClass("newConfirmBtn");
                //setTimeout(function () {
                //    $(".dialogBlueBtn").removeClass("newConfirmBtn");
                //}, util.getOption("timer1"));
                var v = $dialog.find(".manyRow").val();
                util.limitMaxLength(v, length, $dialog.find(".manyRow"));
                var value = $dialog.find(".manyRow").val();
                if (value.length > 0) {
                    elem.find(".leftTxt").html(value);
                    elem.find(".leftTxt").removeClass("con_grayTxt");
                    elem.find(".leftTxt").addClass("con_blueTxt");
                    elem.find(".rightIcon").removeClass("grayFront");
                    elem.find(".rightIcon").addClass("blueFront");
                } else {
                    elem.find(".leftTxt").html("点击添加");
                    elem.find(".leftTxt").removeClass("con_blueTxt");
                    elem.find(".leftTxt").addClass("con_grayTxt");
                    elem.find(".rightIcon").removeClass("blueFront");
                    elem.find(".rightIcon").addClass("grayFront");
                }
                elem.data("currentCode", value);
                //延迟执行
                //setTimeout(function () {
                history.back();
                $dialog.find(".manyRow").val("");
                $dialog.addClass("none");
                $(".fullBg").removeClass("none");
                //}, util.getOption("timer2"));
            }
        });
    };
    //显示随附单据清单对话框
    var showDialog6 = function (option, title, elem) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog4", mask: "fullBg" }, "", "index.html?page=page10");
        //var index = 4;
        var $dialog = $("#attachedListDialog");
        var $accomDocCon = $dialog.find(".accomDocCon");
        $dialog.find(".dialogTitle").html(title);
        $accomDocCon.empty();
        if (option) {
            for (var prop in option) {
                var $accomDocRowCommon = $("<div>").addClass("accomDocRowCommon").data("currentCode", option[prop]["code"]);
                var $leftChoiceTxt = $("<div>").addClass("leftChoiceTxt").html(option[prop]["txt"]);
                var $rightChoiceCon = $("<div>").addClass("rightChoiceCon");
                var $cb = $("<div>").addClass("cb");
                var $line3 = $("<div>").addClass("line3");
                var $minusBtn = $("<input>").addClass("minusBtn inputCommon btnCommon").attr("type", "button");
                var count = (/(^[0-9]\d*$)/.test(option[prop]["count"])) ? option[prop]["count"] : 0;
                var $accomField = $("<input>").addClass("accomField").val(count).attr("type", "number").attr("pattern", "[0-9]*").attr("maxlength", "10");
                var $plusBtn = $("<input>").addClass("plusBtn inputCommon btnCommon").attr("type", "button");
                $accomDocCon.append($accomDocRowCommon
                    .append($leftChoiceTxt)
                    .append($rightChoiceCon.append($minusBtn).append($accomField).append($plusBtn).append($("<div>").addClass("cb")))
                    .append($cb)
                ).append($line3);
            }
        }
        showDialog($dialog, 0.9, "706", "40 30");
        $(window).unbind("resize", function () {
            showDialog($dialog, 0.9, "706", "40 30");
        });
        $dialog.find(".minusBtn").unbind("click");
        $dialog.find(".plusBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").unbind("click");
        //$dialog.find(".accomField").unbind("input");
        //减少按钮事件绑定
        $dialog.find(".minusBtn").bind("click", function (e) {
            util.stopBubble(e);
            var count = $(this).siblings(".accomField").val();
            if (!(/(^[0-9]\d*$)/.test(count))) {
                count = 0;
            } else {
                count = parseInt(count);
                if (count > 0) {
                    count--;
                }
            }
            $(this).siblings(".accomField").val(count);
        });
        //$dialog.find(".accomField").bind("input", function () {
        //});
        //添加按钮事件绑定
        $dialog.find(".plusBtn").bind("click", function (e) {
            util.stopBubble(e);
            var count = $(this).siblings(".accomField").val();
            if (!(/(^[0-9]\d*$)/.test(count))) {
                count = 0;
            } else {
                count = parseInt(count);
                count++;
            }
            $(this).siblings(".accomField").val(count);
        });
        //完成按钮点击事件绑定
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            util.stopBubble(e);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                var $accomDocRowCommon = $dialog.find(".accomDocRowCommon");
                var names = '';
                var option = {};
                $accomDocRowCommon.each(function (index) {
                    var code = $(this).data("currentCode");
                    var txt = $(this).find(".leftChoiceTxt").html();
                    var count = $(this).find(".accomField").val();
                    if (/(^[1-9]\d*$)/.test(count)) {
                        names += txt + "×" + count + ",";
                    } else {
                        count = 0;
                    }
                    option[code] = {};
                    option[code]["code"] = code;
                    option[code]["txt"] = txt;
                    option[code]["count"] = count;

                });
                names = names.substr(0, names.length - 1);
                elem.data("option", option);
                if (names.length == 0) {
                    elem.find(".leftTxt").removeClass("con_grayTxt");
                    elem.find(".leftTxt").removeClass("con_blueTxt");
                    elem.find(".leftTxt").addClass("con_grayTxt");
                    elem.find(".rightIcon").removeClass("grayFront");
                    elem.find(".rightIcon").removeClass("blueFront");
                    elem.find(".rightIcon").addClass("grayFront");
                    elem.find(".leftTxt").html("点击添加");
                } else {
                    elem.find(".leftTxt").removeClass("con_grayTxt");
                    elem.find(".leftTxt").removeClass("con_blueTxt");
                    elem.find(".leftTxt").addClass("con_blueTxt");
                    elem.find(".rightIcon").removeClass("grayFront");
                    elem.find(".rightIcon").removeClass("blueFront");
                    elem.find(".rightIcon").addClass("blueFront");
                    elem.find(".leftTxt").html(names);
                }
                history.back();
                $dialog.addClass("none");
                $(".fullBg").addClass("none");
            }
        });
        //$dialog.find(".accomField").bind("keydown", function (e) {
        //    e.preventDefault();
        //    var value = $(this).val();
        //});
    }
    //显示人员选择框
    var showDialog7 = function (option, title, elem) {
        //var index = 8;
        var $dialog = $("#selectMemberDialog");
        $dialog.find(".dialogTitle").html(title);
        $dialog.find(".mutipleChoice").empty();
        for (var prop in option) {
            var $child = $("<div>").addClass("mutipleChoiceRowCon").data("currentCode", option[prop]["code"]);
            var $child_1 = $("<div>").addClass("leftChoiceTxt").html(option[prop]["txt"]);
            var $child_2 = $("<div>").addClass("rightChoiceBtn unCheckedBtn");
            var $child_3 = $("<div>").addClass("cb");
            var $child_4 = $("<div>").addClass("line2");
            $dialog.find(".mutipleChoice").append($child.append($child_1).append($child_2).append($child_3)).append($child_4);
        }

        $dialog.find(".mutipleChoiceRowCon").unbind("click");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".mutipleChoiceRowCon").bind("click", function (event) {
            util.stopBubble(event);
            var $choiceBtn = $(this).find(".rightChoiceBtn");
            if ($choiceBtn.hasClass("unCheckedBtn")) {
                $choiceBtn.removeClass("unCheckedBtn");
                $choiceBtn.addClass("checkedBtn");
            } else {
                $choiceBtn.removeClass("checkedBtn");
                $choiceBtn.addClass("unCheckedBtn");
            }
        });
        $dialog.find(".dialogBlueBtn").bind("click", function (event) {
            util.stopBubble(event);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                var currentCode = [];
                var currentName = '';
                //var length = $dialog.find(".mutipleChoiceRowCon").size();
                $dialog.find(".mutipleChoiceRowCon").each(function () {
                    var $choiceBtn = $(this).find(".rightChoiceBtn");
                    if ($choiceBtn.hasClass("checkedBtn")) {
                        currentCode.push($(this).data("currentCode"));
                    }
                });
                if (currentCode.length == 0) {
                    util.toast("请选择审批科长");
                    $dialog.data("isClicked", false);
                } else {
                    $dialog.addClass("none");
                    history.back();
                    checkwork.Submit("Submit", currentCode, false);
                }
            }
        });
    };
    //显示流程日志对话框
    var showDialog8 = function (data, title) {
        //var index = 6;
        var $dialog = $("#processLogDialog");
        var $workFlowCon = $dialog.find(".workFlowCon");
        $workFlowCon.empty();
        $dialog.find(".dialogTitle").html(title);
        for (var i = 0, dataLength = data.length; i < dataLength; i++) {
            var obj = data[i];
            var workFlowRow = document.createElement("div");
            var child1 = document.createElement("div");
            var ActivityName = document.createElement("span");
            var ApproveOpinion = document.createElement("span");
            var ApproveContent = document.createElement("span");
            var child2 = document.createElement("div");
            var ApproverName = document.createElement("span");
            var ApproveDateTime = document.createElement("span");
            $workFlowCon.append(workFlowRow);
            $(workFlowRow).append(child1);
            $(workFlowRow).append(child2);
            $(child1).append(ActivityName);
            $(child1).append(ApproveOpinion);
            $(child1).append(ApproveContent);
            $(child2).append(ApproverName);
            $(child2).append(ApproveDateTime);
            $(workFlowRow).addClass("workFlowRow");
            $(child1).addClass("workflowUpCon");
            $(ActivityName).html(obj["ActivityName"]).addClass("ActivityName");
            $(ApproveOpinion).html(obj["ApproveOpinion"]);
            if (obj["ApproveContent"] && obj["ApproveContent"].length > 0) {
                $(ApproveContent).html("【" + obj["ApproveContent"] + "】");
            }
            $(child2).addClass("workflowDownCon");
            $(ApproverName).html(obj["ApproverName"]);
            $(ApproveDateTime).html("(" + obj["ApproveDateTime"] + ")").addClass("ApproveDateTime");
        }
        var height = data.length * 120;
        $dialog.data("height", height);
        $dialog.find(".dialogCenterBtn").unbind("click");
        $dialog.find(".dialogCenterBtn").bind("click", function (event) {
            event.preventDefault();
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                var $this = $(this);
                $dialog.addClass("none");
                history.back();
            }
        });
    }
    //提示用户提交数据是否错误的对话框
    var showDialog9 = function (option, title, selectedUser) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog7", mask: "fullBg" }, "", "index.html?page=page13");
        //var index = 7;
        var $dialog = $("#submitWarnDialog");
        var $submitWarnCon = $dialog.find(".submitWarnCon");
        $submitWarnCon.empty();
        $dialog.find(".dialogTitle").html(title);
        var submitWarn = document.createElement("div");
        $submitWarnCon.append($(submitWarn));
        $(submitWarn).html(option["txt"]);
        dialog.showDialog($dialog, 0.75, 200, "");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            e.preventDefault();
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                //继续提交的时候SubmitAnyWay传递false
                history.back();
                checkwork.Submit("Submit", selectedUser, true);
            }
        });
    };
    //查验建议提示弹出框
    //txt表示提示的内容，title表示弹出框的标题，callback表示点击确定按钮的回调函数,data表示回调函数的参数
    var showDialog11 = function (txt, title, callBack, data) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog7", mask: "fullBg" }, "", "index.html?page=page13");
        //var index = 7;
        var $dialog = $("#submitWarnDialog");
        var $submitWarnCon = $dialog.find(".submitWarnCon");
        $submitWarnCon.empty();
        $dialog.find(".dialogTitle").html(title);
        var submitWarn = document.createElement("div");
        $submitWarnCon.append($(submitWarn));
        $(submitWarn).html(txt);
        dialog.showDialog($dialog, 0.75, 200, "");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            e.preventDefault();
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                //继续提交的时候SubmitAnyWay传递false
                history.back();
                setTimeout(function () { callBack(data); }, 200);
            }
        });
    }
    //提示用户是否退出本次查验的对话框
    var showDialog12 = function (option, title) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg"], dialog: ".dialog11", mask: "fullBg" }, "", "index.html?page=page18");
        //var index = 7;
        var $dialog = $("#exitToListDialog");
        var $submitWarnCon = $dialog.find(".submitWarnCon");
        $submitWarnCon.empty();
        $dialog.find(".dialogTitle").html(title);
        var submitWarn = document.createElement("div");
        $submitWarnCon.append($(submitWarn));
        $(submitWarn).html(option["txt"]);
        dialog.showDialog($dialog, 0.75, 100, "");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            e.preventDefault();
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                //继续提交的时候SubmitAnyWay传递false
                $(".fullBg").addClass("none");
                history.go(-2);
            }
            //util.deleteClock();
        });
    };
    //其他包装输入框
    var showDialog13 = function (elem, title) {
        history.pushState({ previousPage: ["#checkworkPage", ".fullBg", "#multiChoiceDialog", ".twoFloorFullBg"], dialog: ".dialog8", mask: "twoFloorFullBg" }, "", "index.html?page=page19");
        $(".twoFloorFullBg").removeClass("none");
        var $dialog = $("#otherWarpInputDialog");
        $dialog.find(".singleLineField").val($("#multiChoiceDialog").find(".otherWrapTxt").html());
        //$dialog.find(".singleLineField").attr("maxlength", length);
        $dialog.find(".dialogTitle").html(title);
        showDialog($dialog, 0.75, "95", "40 0");
        $dialog.find(".dialogBlueBtn").unbind("click");
        $dialog.find(".dialogBlueBtn").bind("click", function (e) {
            util.stopBubble(e);
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                var $choiceBtn = $(elem).find(".rightChoiceBtn");
                var singleLineField = $dialog.find(".singleLineField").val();
                $choiceBtn.removeClass("unCheckedBtn");
                $choiceBtn.addClass("checkedBtn");
                history.back();
                if (singleLineField) {
                    $("#multiChoiceDialog").find(".otherWarpSeparator,.otherWrapTxt").removeClass("none");
                    $("#multiChoiceDialog").find(".addOtherWrapBtn").addClass("none");
                    $("#multiChoiceDialog").find(".otherWrapTxt").html(singleLineField);
                } else {
                    $("#multiChoiceDialog").find(".otherWarpSeparator,.otherWrapTxt").addClass("none");
                    $("#multiChoiceDialog").find(".otherWrapTxt").html(singleLineField);
                    $("#multiChoiceDialog").find(".addOtherWrapBtn").removeClass("none");
                }
            }
        });
    };
    var eventInitialize = function () {
        var option = {
            "0": { "code": 0, txt: "建议放行" }, "1": { "code": 1, txt: "取样送检" },
            "2": { "code": 2, txt: "待处理" }, "3": { "code": 3, txt: "移通关部门" },
            "4": { "code": 4, txt: "移缉私部门" }, "5": { "code": 5, txt: "移法规部门" }
        };
        $(".dialog .closeBtn").unbind("click");
        $(".dialog .dialogGrayBtn").unbind("click");
        $(".dialog .closeBtn,.dialog .dialogGrayBtn").bind("click", function (e) {
            e.preventDefault();
            var $dialog = $(this).parents(".dialog");
            var isClicked = $dialog.data("isClicked");
            if (!isClicked) {
                $dialog.data("isClicked", true);
                $(this).parents(".dialog").addClass("none");
                history.back();
            }
        });
        //showDialog6();
    };
    return {
        showDialog: showDialog,
        showDialog0: showDialog0,
        showDialog1: showDialog1,
        showDialog2: showDialog2,
        showDialog3: showDialog3,
        showDialog4: showDialog4,
        showDialog5: showDialog5,
        showDialog6: showDialog6,
        showDialog7: showDialog7,
        showDialog8: showDialog8,
        showDialog9: showDialog9,
        showDialog11: showDialog11,
        showDialog12: showDialog12,
        showDialog13: showDialog13,
        eventInitialize: eventInitialize
    };
})(jQuery);