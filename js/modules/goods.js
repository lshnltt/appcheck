//货物模块
var goods = (function ($) {
    'use strict';
    //判断手机支不支持touchstart方法
    var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    //判断是否只读
    var readOnly = false;
    //商品属性参数配置对象
    var goodsProps = {
        "CodeTs": {
            txt: "编码",//属性名称
            realType: 2,//实际属性是输入的还是单选1：简单输入框，2：数字输入框 3：多行输入textarea，4：单选弹出
            maxLength: 16,//输入长度
            status: true, //是否相符 true：相符，false:不相符
            prop: "CodeTs",
            realProp: "RealCodeTs"
        },
        "GName": {
            txt: "品名",
            realType: 1,
            maxLength: 255,
            status: true,
            prop: "GName",
            realProp: "RealGName"
        },
        "GModel": {
            txt: "规格",
            realType: 3,
            maxLength: 255,
            status: true,
            prop: "GModel",
            realProp: "RealGModel"
        },
        //.data("type", "2")
        //.data("title", "选择原产地")
        //.data("currentCode", RealOriginCountry)
        //.data("search", true)
        //.data("option", Dictionary.countryRepository.getAllCountry());
        "OriginCountry": {
            txt: "原产地",
            realType: 4,
            status: true,
            search: true,//是否需要搜索
            prop: "OriginCountry",//对应商品属性字段
            realProp: "RealOriginCountry",//实际商品属性字段
            option: Dictionary.countryRepository.getAllCountry,
            getCodeNameOption: Dictionary.countryRepository.getCountryByCode
        },
        "Qty1": {
            txt: "数量",
            realType: 2,
            maxLength: 13,
            status: true,
            prop: "Qty1",
            realProp: "RealQty1"
        },
        "GUnit": {
            txt: "单位",
            realType: 4,
            status: true,
            search: true,
            prop: "GUnit",
            realProp: "RealGUnit",
            option: Dictionary.unitRepository.getAllUnit,
            getCodeNameOption: Dictionary.unitRepository.getUnitByCode
        },
        "TradeTotal": {
            txt: "货值",
            realType: 2,
            maxLength: 14,
            status: true,
            prop: "TradeTotal",
            realProp: "RealTradeTotal"
        },
        "TradeCurr": {
            txt: "币制",
            realType: 4,
            status: true,
            search: false,
            prop: "TradeCurr",
            realProp: "RealTradeCurr",
            option: Dictionary.currRepository.getAllCurr,
            getCodeNameOption: Dictionary.currRepository.getCurrByCode
        }
    };
    //将所有货物封装成一个对象数组
    var goodsArray = [];
    //存储各个项的状态数组
    var sendGoodArray = [];
    var $content;
    var isNull = function (value) {
        if (value == null || value == "") {
            return "";
        } else {
            return value;
        }
    }
    var showPage = function () {
        //tab_item的子元素
        $("#fullBg").addClass("none");//加载数据页面隐藏
        var $itemChild = $("<div>").addClass("innerCon");
        $content.html($itemChild);
        var totalNum = goodsArray.length; //总共的货物数量
        for (var i = 0, goodLength = goodsArray.length; i < goodLength; i++) {
            //表示货物的索引
            var index = i + 1;
            var good = isNull(goodsArray[i]);
            //console.log(good);
            var GName = isNull(good["GName"]);

            var $goodsItem = $("<div>").addClass("goodsItem itemCommon");

            //申报名称
            var good1 = $("<div>").addClass("NumCon ml40 mr40");
            var good1_1 = $("<div>").addClass("NoLeftCon fl");
            good1_1.append($("<div>").addClass("NoTxt fc8c f18").html("申报名称"));
            good1_1.append($("<div>").addClass("No fcc5 f47 mt8").html(GName));
            var good1_2 = $("<div>").addClass("Num fr");
            good1_2.append($("<span>").addClass("indexNum").html(index + "/" + totalNum));
            good1.append(good1_1).append(good1_2).append($("<div>").addClass("cb")).append($("<div>").addClass("line3 mt30"));
            $goodsItem.append(good1);
            $itemChild.append($goodsItem);
            //特殊要求
            var specialRequire = good["ExamModeCodeList"];
            //获取商品特殊要求的数据字典
            var specialRequireData = convertCode("GOODS_SPEC");
            //获取商品特殊要求对应字段的数据字典
            var specialRequireFieldData = [];
            //商品特殊要求的原值
            var oldSpecialRequire = '';
            //商品特殊要求的实际值
            var realSpecialRequire = '';
            //商品特殊要求的实际编码
            var realSpecialRequireCode = good["ExamModeCodeResultList"];
            if (!specialRequireData) {
                util.toast("商品查验特殊要求的数据字典获取失败");
            } else {
                for (var j = 0, len = specialRequireData.length; j < len; j++) {
                    var ItemCode = specialRequireData[j]["ItemCode"];
                    if (ItemCode == specialRequire) {
                        oldSpecialRequire = specialRequireData[j]["ItemName"];
                        if (specialRequire == "11") {
                            specialRequireFieldData = convertCode("EXAM_CODE_GET");
                        } else {
                            specialRequireFieldData = convertCode("EXAM_CODE_OTHER");
                        }
                        break;
                    }
                }
            }
            //for (var k = 0; k < specialRequireFieldData.length; k++) {
            //    var name = specialRequireFieldData[0]["ItemName"];
            //    var code = specialRequireFieldData[0]["ItemCode"];
            //    if (code == realSpecialRequireCode) {

            //    }
            //}
            //realSpecialRequire = specialRequireFieldData.length > 0 ? specialRequireFieldData[0]["ItemName"] : '';
            // realSpecialRequireCode = specialRequireFieldData.length > 0 ? specialRequireFieldData[0]["ItemCode"] : -1;
            var specialRowDiv = $("<div>").addClass("goods_specialRowCommon");
            var specialDiv = $("<div>").addClass("goods_specialCommon");
            var specialDiv_child1 = $("<div>").addClass("goodRowCommon")
                .append($("<div>").addClass("leftTitleTxt contTxtComm fl").html("商品查验特殊要求"))
                .append($("<div>").addClass("specialRightCon fr tr").html(oldSpecialRequire))
                .append($("<div>").addClass("cb"));
            var specialDiv_child2 = $("<div>").addClass("specialContainerRow ml40 mr40")
                .append($("<div>").addClass("leftwidth30").html(""))
                .append($("<div>").addClass("cb"));
            specialRowDiv.append(specialDiv).append($("<div>").addClass("line3 ml40 mr40"));
            specialDiv.append(specialDiv_child1).append(specialDiv_child2);
            $goodsItem.append(specialRowDiv);
            $("<div>").addClass("rightOperCon conRightCon fr")
                .append($("<div>").addClass("leftTxt conFieldTxt con_blueTxt fl"))
                .append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"))
                .append($("<div>").addClass("cb"))
            .insertAfter($(".leftwidth30", $(specialDiv_child2)));
            $(specialDiv_child2).find(".conRightCon").data("title", "特殊要求(" + oldSpecialRequire + ")").data("curentCode", realSpecialRequireCode);
            var parentElem = $(".conRightCon", specialDiv_child2);
            util.setChoice(specialRequireFieldData, 0, realSpecialRequireCode, parentElem, true, true);
            var $specialContainerRow = $(specialDiv_child2);
            $specialContainerRow.unbind("click");
            $specialContainerRow.bind("click", function () {
                //如果只读点击商品特殊要求无效
                if (!checkList.isReadOnly()) {
                    var $conRightCon = $(this).find(".conRightCon");
                    var type = $conRightCon.data("type");
                    var option = $conRightCon.data("option");
                    var title = $conRightCon.data("title");
                    switch (type) {
                        case 0:
                            //alert(containerArray[containerItemIndex]["ContainerIDResult"]);
                            setTimeout(function () {
                                if (option) {
                                    dialog.showDialog0(option, $conRightCon);
                                }
                            }, util.getOption("timer2"));
                            break;
                        case 1:
                            break;
                        case 2:
                            $(".fullBg").removeClass("none");
                            setTimeout(function () {
                                if (option) {
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
            var goodProps;
            for (var prop in goodsProps) {
                var good2 = $("<div>").addClass("rowCommon").addClass("row" + prop);
                var dashed2 = $("<div>").addClass("linedashed");//虚线
                var propCon = isNull(good[goodsProps[prop].prop]);//申报值
                var realCon = isNull(good[goodsProps[prop].realProp]);//实际值
                //申报值与实际值是否相符,实际值为空时默认相符
                var theState = (propCon == realCon || realCon == "" || realCon.length == 0) ? true : false;
                var good2_1 = $("<div>").addClass("goodRowCommon").append($("<div>").addClass("leftTitleTxt contTxtComm fl").text("商品" + goodsProps[prop].txt));
                var good2_1_pic = $("<div>").addClass("conRightCon fr tr");
                if (theState) { //相符
                    realCon = propCon; //相符时，实际值和申报值相等
                    good2_1_pic.append($("<div>").addClass("statusTxtgreen").html("相符"))
                        .append($("<div>").addClass("statusBtn  radioBtnCommon fr greenIcon").data("status", theState).attr({ "name": prop }));//设置状态值列如：.data("status",true)
                } else { //不相符
                    good2_1_pic.append($("<div>").addClass("statusTxtred").html("不相符"))
                        .append($("<div>").addClass("statusBtn radioBtnCommon fr redIcon").data("status", theState).attr({ "name": prop }));//设置状态值列如：.data("status",false)
                }
                good2_1.append(good2_1_pic).append($("<div>").addClass("cb"));

                var good2_3 = $("<div>").addClass("oldContainerRow ml40 mr40");
                good2_3.append($("<div>").addClass("leftwidth30").text("申报" + goodsProps[prop].txt + ": "));
                var propContent = $("<div>").addClass("rightwidth60 goodOldTxt");//申报的值标签
                good2_3.append(propContent.text(propCon));
                good2_3.append($("<div>").addClass("cb"));

                //实际值以什么类型输入1：简单输入框，2：数字输入框 3：多行输入textarea，4：单选弹出
                var realType = goodsProps[prop].realType;
                var good2_2;
                switch (realType) {
                    case 1:
                        good2_2 = $("<div>").addClass("goods_realInputCon");
                        good2_2.append($("<div>").addClass("fc8c f28 realCodeLabel realLabelCommon fl").html("实际" + goodsProps[prop].txt))
                        var $input1 = $("<input type='text' maxlength='" + goodsProps[prop].maxLength + "' placeholder='请输入'>").addClass("realCodeField realFieldCommon").val(realCon)
                            .prop("readonly", checkList.isReadOnly() ? true : false);
                        good2_2.append($("<div>").addClass("realInputCon fr").append($input1));
                        break;
                    case 2:
                        good2_2 = $("<div>").addClass("goods_realInputCon");
                        good2_2.append($("<div>").addClass("fc8c f28 realCodeLabel realLabelCommon fl").html("实际" + goodsProps[prop].txt))
                        var $input2 = $("<div>").addClass("realInputCon fr").append($("<input type='number' maxlength='" + goodsProps[prop].maxLength + "' placeholder='请输入' >").addClass("realCodeField realFieldCommon").val(realCon).prop("readOnly", checkList.isReadOnly() ? true : false));
                        good2_2.append($input2);
                        break;
                    case 3:
                        good2_2 = $("<div>").addClass("goods_realInputCon");
                        good2_2.append($("<div>").addClass("fc8c f28 lh120 realCodeLabel fl").html("实际" + goodsProps[prop].txt));
                        good2_2.append($("<div>").addClass("realInputCon fr").append($("<textarea maxlength='" + goodsProps[prop].maxLength + "'>").addClass("realCodeField realFieldCommon realFieldArea").val(realCon).prop("readonly", checkList.isReadOnly() ? true : false)));
                        break;
                    case 4:
                        propContent.text(goodsProps[prop].getCodeNameOption(propCon));//根据code获取值
                        good2_2 = $("<div>").addClass("goods_realInputCon goodsCommon2");
                        good2_2.append($("<div>").addClass("fc8c f28 realCodeLabel fl").html("实际" + goodsProps[prop].txt));
                        var good2_2_1 = $("<div>").addClass("rightOperCon conRightCon fr").data("type", "2").data("title", "选择" + goodsProps[prop].txt).data("currentCode", realCon).data("search", goodsProps[prop].search).data("option", goodsProps[prop].option());
                        //判断实际产地是否为空
                        if (realCon == "" || realCon.length == 0) {
                            good2_2_1.append($("<div>").addClass("newSealNo leftTxt conFieldTxt con_grayTxt  realCodeField fl").html("选择" + goodsProps[prop].txt))
                            .append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon grayFront  fr"))
                        } else {
                            good2_2_1.append($("<div>").addClass("newSealNo leftTxt conFieldTxt con_blueTxt realCodeField fl").html(goodsProps[prop].getCodeNameOption(realCon)))
                            .append($("<div>").addClass("conFrontIcon rightIcon rightFrontCommon blueFront fr"))
                        }
                        good2_2.append(good2_2_1);
                        break;
                    default: break;
                }//end switch

                if (theState) { good2_2.addClass("none"); dashed2.addClass("none") }

                //将申报的和比较的放到同一个div中goodRowCommon
                var goodContent2 = $("<div>").addClass("goodsCommon1");
                //good2代表属性标签
                good2.append(goodContent2.append(good2_1).append(good2_3)).append(dashed2).append(good2_2).append($("<div>").addClass("line3  ml40 mr40"));
                $goodsItem.append(good2);

            }  //end goodProps循环
        }
        $content.data("refresh", false);
    };
    var _loadDataError = function (str) {
        util.toast(str);
    };
    var convertCode = function (typeCode) {
        var data = Dictionary.dataRepository.getByTypeCode(typeCode);
        return data;
    };
    var loadData = function () {
        console.info("3");
        //readOnly = checkList.isReadOnly();
        var dtd = $.Deferred();
        $("#fullBg").removeClass("none");//加载数据页面显示
        var EntryID = $("#checkwork_head .titleBottom").html();
        var examNo = checkList.getCheckItem()["ExamNo"];
        var data = dataStructure.listData(util.getOption("moduleId"), "H2000.BizRskExamListRelRepository", 1, 9999, [{ column: "EXAM_REC_ID", symbol: "=", value: examNo }], "", "");
        var successCallBack = function (data) {
            if (data.Status == 1) {
                goodsArray = [];
                for (var i = 0, rowLength = data.Data.Rows.length; i < rowLength; i++) {
                    var cell = data.Data.Rows[i].Cell;
                    goodsArray.push(cell);
                }
                showPage();
            } else {
                console.log("货物获取失败:" + JSON.stringify(data));
                util.serverFailure($content, function () {
                    loadData();
                }, "数据请求失败")
            }
            dtd.resolve();
        };
        var errorCallBack = function (data) {
            console.log("货物获取失败:" + JSON.stringify(data));
            util.loadFailure($content, function () {
                loadData();
            });
            dtd.resolve();
        };
        util.post(data, true, successCallBack, errorCallBack, "list");
        return dtd;
    };
    var eventInitialize = function () {
        $content = $("#checkworkPage .goodsTab");

        //颜色按钮状态变换点击事件
        $(".goodsTab").on("click", ".goodsCommon1", function (event) {
            event.preventDefault();
            //如果只读则开关按钮点击无效
            if (!checkList.isReadOnly()) {
                //获取点击货物的index1
                var $this = $(this);
                $this.addClass("newRowCommon");
                setTimeout(function () {
                    $this.removeClass("newRowCommon");
                }, util.getOption("timer1"));
                var index1 = ($(this).parents(".goodsItem ")).index(".goodsTab .goodsItem")

                //获取货物信息中的单选按钮点击index2    statusTxtred  statusTxtgreen
                var index2 = $(this).index(".goodsItem:eq(" + index1 + ") .goodsCommon1");

                var $statusBtn = $(this).find(".statusBtn");

                //console.log("下标值::[" + index1 + "," + index2 + "]");
                if ($statusBtn.hasClass("greenIcon")) {                     //相符->不相符
                    setTimeout(function () {
                        $statusBtn.removeClass("greenIcon");
                        $statusBtn.addClass("redIcon");
                        $statusBtn.prev().removeClass("statusTxtgreen").addClass("statusTxtred").html("不相符");
                        $statusBtn.data("status", false);    //设置状态为不相符
                        $this.nextAll().removeClass("none");
                        var $realCodeField = $this.parent().find(".realCodeField");
                        var value = $realCodeField.val();
                        $realCodeField.val("").focus().val(value);
                    }, util.getOption("timer2"));
                } else {                                                    //不相符->相符
                    setTimeout(function () {
                        $statusBtn.removeClass("redIcon");
                        $statusBtn.addClass("greenIcon");
                        $statusBtn.prev().removeClass("statusTxtred").addClass("statusTxtgreen").html("相符");
                        $statusBtn.data("status", true);    //设置状态为相符
                        //获取点击状态下申报的内容
                        var oldTxt = $(".goodsItem:eq(" + index1 + ") .oldContainerRow:eq(" + index2 + ") .goodOldTxt").text();
                        //点击相符时，输入框对应申报的内容
                        $(".goodsItem:eq(" + index1 + ") .goods_realInputCon:eq(" + index2 + ") .realCodeField ").val(oldTxt);
                        $this.nextAll(".linedashed").addClass("none");
                        $this.nextAll(".goods_realInputCon").addClass("none");
                    }, util.getOption("timer2"));

                }
            }
        });

        //单选弹出点击事件
        $(".goodsTab").on("click", ".goodsCommon2", function (event) {
            event.preventDefault();
            //如果只读，点击弹出按钮无效
            if (!checkList.isReadOnly()) {
                var $this = $(this);
                $this.addClass("newRowCommon");
                setTimeout(function () {
                    $this.removeClass("newRowCommon");
                }, util.getOption("timer1"));
                var $conRightCon = $(this).find(".conRightCon");
                var option = $conRightCon.data("option");
                var type = $conRightCon.data("type");
                var search = $conRightCon.data("search");//是否可搜索
                search = (search == true) ? true : false;
                var title = $conRightCon.data("title");
                if (type == 2) {
                    $(".fullBg").removeClass("none");
                    setTimeout(function () {
                        dialog.showDialog2(option, title, $conRightCon, search);
                    }, util.getOption("timer2"));
                }
            }
        });
    };

    var getCommitData = function () {
        var commitData = [];
        for (var i = 0, goodLength = goodsArray.length; i < goodLength; i++) {
            var propItems = $(".goodsItem:eq(" + i + ") .goods_realInputCon");
            var $goodItem = $(".goodsItem:eq(" + i + ")");
            var ob = {};
            var _ob = goodsArray[i];
            ob.GNo = _ob.GNo;
            ob.ExamRecID = _ob.ExamRecID;
            ob.CodeTs = _ob.CodeTs;
            ob.RealCodeTs = _ob.CodeTs;
            ob.CodeTsResult = true;
            //goodsItem goods_realInputCon
            //不相等时，设置实际商品编码
            //if (!$(propItems[0]).hasClass("none")) {
            if (!$goodItem.find(".rowCodeTs .statusBtn").data("status")) {
                ob.RealCodeTs = $goodItem.find(".rowCodeTs .realCodeField").val();
                ob.CodeTsResult = false;
            }
            ob.GName = _ob.GName;
            ob.RealGName = _ob.GName;
            ob.GNameResult = true;
            //设置实际商品名称
            if (!$goodItem.find(".rowGName .statusBtn").data("status")) {
                ob.RealGName = $goodItem.find(".rowGName .realCodeField").val();
                ob.GNameResult = false;
            }
            ob.GModel = _ob.GModel;
            ob.RealGModel = _ob.GModel;
            ob.GModelResult = true;
            //设置实际商品规格
            if (!$goodItem.find(".rowGModel .statusBtn").data("status")) {
                ob.RealGModel = $goodItem.find(".rowGModel .realCodeField").val();
                ob.GModelResult = false;
            }
            //currentCode
            ob.OriginCountry = _ob.OriginCountry;
            ob.RealOriginCountry = _ob.OriginCountry;
            ob.OriginCountryResult = true;
            //设置实际商品原产地
            if (!$goodItem.find(".rowOriginCountry .statusBtn").data("status")) {
                ob.RealOriginCountry = $goodItem.find(".rowOriginCountry .rightOperCon").data("currentCode");
                ob.OriginCountryResult = false;
            }
            ob.Qty1 = _ob.Qty1;
            ob.RealQty1 = _ob.Qty1;
            ob.Qty1Result = true;
            //设置实际数量
            if (!$goodItem.find(".rowQty1 .statusBtn").data("status")) {
                ob.RealQty1 = $goodItem.find(".rowQty1 .realCodeField").val();
                ob.Qty1Result = false;
            }
            ob.GUnit = _ob.GUnit;
            ob.RealGUnit = _ob.GUnit;
            ob.GUnitResult = true;
            //设置实际商品单位
            if (!$goodItem.find(".rowGUnit .statusBtn").data("status")) {
                ob.RealGUnit = $goodItem.find(".rowGUnit .rightOperCon").data("currentCode");
                ob.GUnitResult = false;
            }
            ob.TradeTotal = _ob.TradeTotal;
            ob.RealTradeTotal = _ob.TradeTotal;
            ob.TradeTotalResult = true;
            //设置商品货值
            if (!$goodItem.find(".rowTradeTotal .statusBtn").data("status")) {
                ob.RealTradeTotal = $goodItem.find(".rowTradeTotal .realCodeField").val();
                ob.TradeTotalResult = false;
            }
            ob.TradeCurr = _ob.TradeCurr;
            ob.RealTradeCurr = _ob.TradeCurr;
            ob.TradeCurrResult = true;
            //设置实际商品币制
            if (!$goodItem.find(".rowTradeCurr .statusBtn").data("status")) {
                ob.RealTradeCurr = $goodItem.find(".rowTradeCurr .rightOperCon").data("currentCode");
                ob.TradeCurrResult = false;

            }
            //设置商品特殊要求
            ob.ExamModeCodeResultList = $goodItem.find(".specialContainerRow .conRightCon").data("currentCode");
            commitData.push(ob);
        }
        return commitData;
    };
    var getGoodsArray = function () {
        return goodsArray;
    };
    var emptyArray = function () {
        goodsArray = [];
    };
    return {
        loadData: loadData,
        eventInitialize: eventInitialize,
        getCommitData: getCommitData,
        getGoodsArray: getGoodsArray,
        emptyArray: emptyArray
    }
})(jQuery);