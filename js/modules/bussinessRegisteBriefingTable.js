var bussinessRegisteBriefingTable = (function () {
    var $bussinessRegisteBriefingTablePage = "";
    var init = function () {
        beforeShow();
        loadData();
    };
    var beforeShow = function () {
        history.pushState({ page: "page18" }, "", location.href.split("?")[0] + "?page=page18");
        $bussinessRegisteBriefingTablePage = $("#bussinessRegisteBriefingTablePage");
        $bussinessRegisteBriefingTablePage.find(".content").empty();
        $("#bussinessRegisteBriefing_userName").html(util.getUserInfo.getUser().DisPlayName);
        $(".page").addClass("none");
        $bussinessRegisteBriefingTablePage.removeClass("none");
    }; 
    //加载数据
    var loadData = function () {
        var tradeCo = $bussinessRegisteBriefingTablePage.attr("tradeco");
        var param = dataStructure.formData("000100990003", "H2000.BizCompanyRelRepository", JSON.stringify({ TradeCo: tradeCo }));
        var successBack = function (data) {
            if (data) {
                if (data.Status == 1) {
                    manageData(data.Data);
                } else {
                    console.info(data);
                    util.toast(data);
                }
            } else {
                util.toast(data);
            }
        };
        var errorBack = function (data) {
            util.toast(data);
            util.loadFailure($bussinessRegisteBriefingTablePage.find(".content"), function () {
                loadData();
            })
        };
        util.post(param, true, successBack, errorBack, "form");
    };
    //处理数据
    var manageData = function (responseData) {
        var dataObj = responseData || {};
        var CustomsCode = dataObj.CustomsCode || "";
        var BrokerType = dataObj.BrokerType || "";
        var currCode = dataObj.CurrCode || "";
        var param = dataStructure.choiceData("IDP.Sys.AC", [JSON.stringify([{ "BizName": "H2000.BizCustomsRepository", "Value": CustomsCode },
        { "BizName": "H2000.BizBrokerRepository", "Value": BrokerType }, { "BizName": "H2000.BizCurrRepository", "Value": currCode }])], "GetACData", "000100990003");
        var successBack = function (data) {
            if (data && data.Data) {
                if (data.Status == 1) {
                    var customsDictinaryData = data.Data;
                    dataObj.CustomsCode = customsDictinaryData[0][1] || CustomsCode;
                    dataObj.BrokerType = customsDictinaryData[1][1] || BrokerType;
                    dataObj.CurrCode = customsDictinaryData[2][1] || currCode;
                } else {
                    console.info(data);
                    util.toast(data);
                }
            } else {
                util.toast(data);
            }
            createElem(dataObj);
        };
        var errorBack = function (data) {
            util.toast(data);
            createElem(dataObj);
        };
        util.post(param, true, successBack, errorBack, "Method");
    };
    var createElem = function (data) {
        var data = data || {};
        var $entryContainer = $("<div>").addClass("entryContainerCommon");
        var companyBriefing = {
            "FullName": { "label": "企业注册名全称", "defaultValue": "" }, "RegCo": { "label": "企业注册名简称", "defaultValue": "" }, "TradeCo": { "label": "企业注册编码", "defaultValue": "" },
            "CopGbCode": { "label": "组织机构代码", "defaultValue": "" }, "TaxyRgNo": { "label": "税务登记号", "defaultValue": "" }, "LicenseID": { "label": "营业执照编号", "defaultValue": "" },
            "CopIoCode": { "label": "进出口代码", "defaultValue": "" }, "CustomsCode": { "label": "主管海关", "defaultValue": "" }, "CoClass": { "label": "企业分类", "defaultValue": "" },
            "CreditMar": { "label": "资信状况", "defaultValue": "" }, "ExamScore": { "label": "企业评分", "defaultValue": "0" }, "RgDate": { "label": "注册时间", "defaultValue": "" },
            "ValidDate": { "label": "注册有效期", "defaultValue": "" }, "ChkDate": { "label": "年审时间", "defaultValue": "" }, "CopModifyDate": { "label": "最后变更时间", "defaultValue": "" },
            "CopEndDate": { "label": "通关期限", "defaultValue": "" }, "BrokerType": { "label": "报关类别", "defaultValue": "" }, "BusiType": { "label": "行业种类", "defaultValue": "" },
            "AddrCo": { "label": "中文地址", "defaultValue": "" }, "MailCo": { "label": "邮政编码", "defaultValue": "" }, "EnAddrCo": { "label": "英文地址", "defaultValue": "" },
            "AccoBank": { "label": "开户银行", "defaultValue": "" }, "AccoNo": { "label": "银行账号", "defaultValue": "" }, "InvFundT": { "label": "投资总额（万美元）", "defaultValue": "0" },
            "RgFund": { "label": "注册资金（万）", "defaultValue": "0" }, "CurrCode": { "label": "注册资金币制", "defaultValue": "" }, "ActFund": { "label": "到位资金（万美元）", "defaultValue": "0" },
            "DutyFreeAmt": { "label": "免税额（万美元）", "defaultValue": "0" }, "ChkEarnestMon": { "label": "保证金额", "defaultValue": "0" }, "ApprDep": { "label": "批准部门", "defaultValue": "" },
            "ApprID": { "label": "批准文号", "defaultValue": "" }, "LawMan": { "label": "法人代表姓名", "defaultValue": "" }, "IDNumber": { "label": "法人代表证件号码", "defaultValue": "" },
            "LawManTel": { "label": "法人代表电话", "defaultValue": "" }, "ContacCo": { "label": "联系人员", "defaultValue": "" }, "TelCo": { "label": "联系电话", "defaultValue": "" },
            "BreakLawTime1": { "label": "走私次数（次）", "defaultValue": "0" }, "BreakLawTime2": { "label": "违规次数（次）", "defaultValue": "0" }, "InspectTime": { "label": "稽查次数（次）", "defaultValue": "0" },
            "InRatio": { "label": "内销比率（%）", "defaultValue": "0" }, "SpeCo": { "label": "特殊企业描述", "defaultValue": "" }, "CoType": { "label": "生产类型", "defaultValue": "" },
            "TradeArea": { "label": "经营地区范围", "defaultValue": "" }, "MainPro": { "label": "主要产品", "defaultValue": "" }, "CopNote": { "label": "备注", "defaultValue": "" },
            "PreTradeCo": { "label": "预录入编号", "defaultValue": "" }, "ChkOperCode": { "label": "经办关员", "defaultValue": "" }, "ChkOperFlag": { "label": "关员办理情况", "defaultValue": "" },
            "ChkOperDate": { "label": "关员办理时间", "defaultValue": "" }, "ChkDptCode": { "label": "审核科长", "defaultValue": "" }, "ChkDptFlag": { "label": "科长审核情况", "defaultValue": "" },
            "ChkDptDate": { "label": "科长审核时间", "defaultValue": "" }, "ChkMasterCode": { "label": "审批处长", "defaultValue": "" }, "ChkMasterFlag": { "label": "处长审批情况", "defaultValue": "" },
            "ChkMasterDate": { "label": "处长审批时间", "defaultValue": "" }, "ChkCode": { "label": "年审关员", "defaultValue": "" }, "CopFlagName": { "label": "企业标志", "defaultValue": "" },
            "CreditMarName": { "label": "资信标志", "defaultValue": "" }, "CopRange": { "label": "经营商品范围", "defaultValue": "" }
        };
        for (var prop in companyBriefing) {
            var cellLeft = companyBriefing[prop]["label"] || "";
            var cellRight = data[prop] || companyBriefing[prop]["defaultValue"];
            switch (prop) {
                case "RgDate":
                case "ValidDate":
                case "ChkDate":
                case "CopModifyDate":
                case "CopEndDate":
                case "ChkOperDate":
                case "ChkDptDate":
                case "ChkMasterDate":
                    cellRight = util.dtJsonFormat(data[prop], "yyyy-MM-dd HH:mm:ss");
                    break;
            }
            var $entryItem = $("<div>").addClass("entryItem");
            var $entryLeft = $("<div>").addClass("entryLeft fc69601c bg_f3f0dd").html(cellLeft);
            var $entryRight = $("<div>").addClass("entryRight bg_faf8ed").html(cellRight);
            $entryItem.append($entryLeft);
            $entryItem.append($entryRight);
            $entryContainer.append($entryItem);
        }
        $bussinessRegisteBriefingTablePage.find(".content").append($entryContainer);
    };
    var eventInitialize = function () {
        var setScrollHeight = function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var scrollHeight = (winHeight - headHeight);
            $("#bussinessRegisteBriefingTablePage .content").height(scrollHeight);
        };
        setScrollHeight();
    }
    
    return {
        init: init,
        eventInitialize: eventInitialize
    };
})();