//报关单信息模块
var entryMesg = (function ($) {
    'use strict';
    var entrymes = {};
    var prop = {
        EntryID: "海关编号",
        PreEntryID: "预录入编号",
        IEPort: "进出口岸代码",
        RelativeManualNo: "备案号",
        DDate: "申报日期",
        TradeCountry: "贸易国别",
        TradeName: "经营单位",
        TrafMode: "运输方式",
        TrafName: "运输工具名称",
        BillNo: "提运单号",
        OwnerName: "收货单位",
        LicenseNo: "许可证号",
        DestinationPort: "抵运港",
        DistrictCode: "境内货源地",
        AgentName: "申报单位名称",
        TradeMode: "贸易方式",
        CutMode: "征免性质",
        PayWay: "结汇方式",
        ApprNo: "批准文号",
        TransMode: "成交方式",
        FeeRate: "运费额/率",
        InsurRate: "保费额/率",
        OtherRate: "杂费额/率",
        ContrNo: "合同协议号",
        PackNo: "件数",
        WrapType: "包装种类",
        GrossWt: "毛重（公斤）",
        NetWt: "净重（公斤）",
        NoteS: "备注",
        ContIds: "集装箱号"
    }
    var entryArray = [];
    //页面内容节点
    var $content;
    var isNull = function (value) {
        if (value == null) {
            return ""
        } else {
            return value;
        }
    };
    
    var showPage = function () {
        var $entryContainer = $("<div>").addClass("entryContainerCommon");
        entrymes["DDate"] = util.dtJsonFormat(entrymes["DDate"], "yyyy-MM-dd HH:mm");
        for (var attr in prop) {
            (function (attr) {
                var $entryLine1;
                var $entryRight;
                var $entryLeft;
                var $entryItem = $("<div>").addClass("entryItem");
                if (attr == "EntryID") {
                    $entryLeft = $("<div>").addClass("entryLeft fcc555");
                    $entryRight = $("<div>").addClass("entryRight").addClass("fcc555");
                } else if (attr == "TradeName" || attr == "OwnerName" || attr == "AgentName") {
                    $entryLeft = $("<div>").addClass("entryLeft");
                    $entryRight = $("<div>").addClass("entryRight greenHyperlinks").bind("click", function () {
                        //显示企业注册简况表
                        var TradeCo = entrymes["TradeCo"];
                        var OwnerCode = entrymes["OwnerCode"];
                        var AgentCode = entrymes["AgentCode"];
                        var tradeCo = "";
                        switch (attr) {
                            case "TradeName":
                                tradeCo = TradeCo;
                                break;
                            case "OwnerName":
                                tradeCo = OwnerCode;
                                break;
                            case "AgentName":
                                tradeCo = AgentCode;
                                break;
                        }
                        $("#bussinessRegisteBriefingTablePage").attr("tradeco", tradeCo);
                        bussinessRegisteBriefingTable.init();
                    });
                } else {
                    $entryLeft = $("<div>").addClass("entryLeft");
                    $entryLine1 = $("<div>").addClass("line2");
                    $entryRight = $("<div>").addClass("entryRight");
                }

                $entryLeft.append(prop[attr]);
                $entryRight.html(isNull(entrymes[attr]));
                //获取贸易国别 BizCustomsRepository
                switch (attr) {
                    case "IEPort":
                        //获取进出口口岸
                        Dictionary.getCodeNameByCode("H2000.BizCustomsRepository", entrymes[attr], "CUSTOMS_CODE", $entryRight);
                        break;
                    case "TradeCountry":
                        //获取国别
                        Dictionary.getCodeNameByCode("H2000.BizCountryRepository", entrymes[attr], "COUNTRY_CODE", $entryRight);
                        break;
                    case "TrafMode":
                        //获取运输方式
                        Dictionary.getCodeNameByCode("H2000.BizTransfRepository", entrymes[attr], "TRAF_CODE", $entryRight);
                        break;
                    case "DestinationPort":
                        //获取装/卸货港 H2000.BizPortRepository
                        Dictionary.getCodeNameByCode("H2000.BizPortRepository", entrymes[attr], "PORT_CODE", $entryRight);
                        break;
                    case "DistrictCode":
                        //获取境内货源地
                        Dictionary.getCodeNameByCode("H2000.BizDistrictRepository", entrymes[attr], "DISTRICT_CODE", $entryRight);
                        break;
                    case "TradeMode":
                        //获取贸易方式
                        Dictionary.getCodeNameByCode("H2000.BizTradeRepository", entrymes[attr], "TRADE_MODE", $entryRight);
                        break;
                    case "CutMode":
                        //获取征免性质
                        Dictionary.getCodeNameByCode("H2000.BizLevytypeRepository", entrymes[attr], "CUT_MODE", $entryRight);
                        break;
                    case "PayWay":
                        //获取结汇方式
                        Dictionary.getCodeNameByCode("H2000.BizLcTypeRepository", entrymes[attr], "PAY_WAY", $entryRight);
                        break;
                    case "TransMode":
                        //获取成交方式
                        Dictionary.getCodeNameByCode("H2000.BizTransacRepository", entrymes[attr], "TRANS_MODE", $entryRight);
                        break;
                    case "WrapType":
                        //获取包装种类
                        Dictionary.getCodeNameByCode("H2000.BizWrapRepository", entrymes[attr], "WRAP_CODE", $entryRight);
                        break;
                    default: break;
                }
                $entryItem.append($entryLeft).append($entryRight);
                $entryContainer.append($entryItem);
            })(attr);
        }

        var length = entryArray.length;
        for (var i = 0; i < length; i++) {
            var row1 = $("<div>").addClass("entryItem")
              //.append($("<div>").addClass("line2"))
               .append($("<div>").addClass("entryLeft").html("序号"))
                .append($("<div>").addClass("entryRight fcc555").html(entryArray[i].GNo))
            var row2 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("商品名称"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].GName))
            var row3 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("规格型号"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].GModel))
            var row4 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("商品编号"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].CodeTs))
            var row5 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("征免方式"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].DutyModeName))
            var row6 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("数量"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].GQty))
            var row7 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("单位"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].GUnitName))
            var row8 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("币制"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].TradeCurrName))
            var row9 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("申报单价"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].DeclPrice))
            var row10 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("成交总价"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].TradeTotal))
            var row11 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("产销国"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].OriginCountryName))
            var row12 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("完税价格"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].DutyValue))
            var row13 = $("<div>").addClass("entryItem")
                //.append($("<div>").addClass("line2"))
                .append($("<div>").addClass("entryLeft").html("用途"))
                .append($("<div>").addClass("entryRight").html(entryArray[i].UseToName))
            $entryContainer.append(row1).append(row2).append(row3).append(row4).append(row5).append(row6)
                    .append(row7).append(row8).append(row9).append(row10).append(row11)
                        .append(row12).append(row13);
        }
        $("#fullBg").addClass("none");//加载数据页面隐藏
        $content.html($entryContainer);
        $("#entryMesgPage").data("refresh",false);
    };
    var eventInitialize = function () {
        var setScrollHeight = function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var scrollHeight = (winHeight - headHeight);
            $(".entryMessage .content").height(scrollHeight);
        };
        setScrollHeight();
        $content = $("#entryMesgPage .content");
        
    };
    var loadData = function (entryId) {
        history.pushState({ page: "page2" }, "", location.href.split("?")[0] + "?page=page2");
        $(".page").addClass("none");
        $("#entryMesgPage").removeClass("none");
        //history.pushState({ page: "page2" }, "", location.href.split("?")[0] + "?page=page2");
        //if(!$("#entryMesgPage").data("refresh")){
        //    $(".page").addClass("none");
        //    $("#entryMesgPage").removeClass("none");
        //    $(".entryContainerCommon").scrollTop(0);
        //    return;
        //}
        $(".page").addClass("none");
        $("#entryMesgPage").removeClass("none");
        $(".entryContainerCommon").scrollTop(0);
        $("#fullBg").removeClass("none");
        $content.empty();
        $("#entryMessage_userName").html("");
        $("#entryMessage_userName").html(util.getUserInfo.getUser().DisPlayName);
        //var EntryID = $("#checkwork_head .titleBottom").html();
        var data = dataStructure.formData(util.getOption("entryModuleId"), "H2000.BizEntryHeadRepository", JSON.stringify({ "EntryID": entryId }));
        var successCallBack = function (data) {
            if (data.Status == "1") {
                for (var attr in prop) {
                    entrymes[attr] = data.Data[attr];
                }
                entrymes["TradeCo"] = data.Data["TradeCo"];
                entrymes["OwnerCode"] = data.Data["OwnerCode"];
                entrymes["AgentCode"] = data.Data["AgentCode"];
                loadEntryList();
            } else {
                console.log("报关单表头获取失败:" + JSON.stringify(data));
                util.serverFailure($content, function () {
                    loadEntryList();
                },"数据请求失败")
            }
        };
        var errorCallBack = function (data) {
            util.toast(util.getOption("errorStr"));
            console.log("报关单表头获取失败:" + JSON.stringify(data));
            util.loadFailure($content, function () {
                loadData();
            })
        };
        util.post(data, true, successCallBack, errorCallBack, "form");
    };
    var loadEntryList = function () {
        var EntryID = $("#checkwork_head .titleBottom").html();
        var data = dataStructure.listData(util.getOption("entryModuleId"), 'H2000.BizEntryListRepository', 1, 10, [{ column: "ENTRY_ID", symbol: "=", value: EntryID }], "", "");
        var errorCallBack = function (data) {
            util.toast(util.getOption("errorStr"));
            console.log("报关单表体获取失败:" + JSON.stringify(data));
            util.loadFailure($content, function () {
                loadData();
            })
        };
        var successCallBack = function (data) {
            if (data.Status == "1") {
                entryArray = [];
                var row = data.Data.Rows;
                for (var i = 0, rowLength = row.length; i < rowLength; i++) {
                    var cell = row[i].Cell;
                    var item = {};
                    //序号
                    item["GNo"] = cell.GNo;
                    //商品名称
                    item["GName"] = cell.GName;
                    //规格型号
                    item["GModel"] = cell.GModel;
                    //商品编号
                    item["CodeTs"] = cell.CodeTs;
                    //征免方式
                    item["DutyModeName"] = cell.DutyModeName;
                    //数量
                    item["GQty"] = cell.GQty;
                    //单位
                    item["GUnitName"] = cell.GUnitName;
                    //币制
                    item["TradeCurrName"] = cell.TradeCurrName
                    //申报单价
                    item["DeclPrice"] = cell.DeclPrice;
                    //成交总价 
                    item["TradeTotal"] = cell.TradeTotal;
                    //产销国
                    item["OriginCountryName"] = cell.OriginCountryName;
                    //完税价格
                    item["DutyValue"] = cell.DutyValue;
                    //用途
                    item["UseTo"] = cell.UseTo;
                    //用途名
                    item["UseToName"] = cell.UseToName;
                    entryArray.push(item);
                    console.log(item);
                    console.log(entryArray);
                }
                showPage();
            } else {
                console.log("报关单表体获取失败:" + JSON.stringify(data));
                util.serverFailure($content, function () {
                    loadData();
                }, "数据请求失败")
            }
            
        };
        util.post(data, true, successCallBack, errorCallBack, "list");
    };
    return {
        loadData: loadData,
        eventInitialize: eventInitialize
    };
})(jQuery);