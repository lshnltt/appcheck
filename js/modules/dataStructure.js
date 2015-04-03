
var dataStructure = {
    BaseData: {
        Base: {
            AppId: "0001",
            AppSecret: "A08BCCX615ED43BW",
            ModuleId: "000100020001"
        },
        List: {
            MethodName: "ListShow",
            PageIndex: 1,
            PageSize: 20
        },
        Form: {
            MethodName: "Show"
        },
        Choice: {
            MethodName: "GetACData"
        }
    },
    //conditionArr:[{ column: "id", symbol: "=", value: "" }]
    listData: function (moduleId, bizName, pageIndex, pageSize, conditionArr, sortInfo, extInfo,relationConditionInfo) {
        return {
            BizName: bizName,
            MethodName: this.BaseData.List.MethodName,
            PageIndex: pageIndex ? pageIndex : this.BaseData.List.PageIndex,
            PageSize: pageSize ? pageSize : this.BaseData.List.PageSize,
            ConditionInfo: conditionArr,
            SortInfo: sortInfo,
            ExtInfo: extInfo,
            AppId: this.BaseData.Base.AppId,
            AppSecret: this.BaseData.Base.AppSecret,
            ModuleId: moduleId,
            RelationConditionInfo: relationConditionInfo
        };
    },
    //methodName: "Save"、"Submit"
    //jsonEntityData : {RskNo:""}的字符串
    formData: function (moduleId, bizName, jsonEntityData,methodName) {
        return {
            BizName: bizName,
            MethodName: methodName ? methodName : this.BaseData.Form.MethodName,
            JsonEntityData: jsonEntityData,
            AppId: this.BaseData.Base.AppId,
            AppSecret: this.BaseData.Base.AppSecret,
            ModuleId: moduleId
        }
    },
    //methodName:"GetACData",
    //MethodParameters:["1=1,"EXAM_PROC_IDEA"]
    choiceData: function (bizName, params, methodName, moduleId) {
        return {
            BizName: bizName,
            MethodName: methodName ? methodName : this.BaseData.Choice.MethodName,
            MethodParameters: params,
            ModuleId: moduleId ? moduleId : this.BaseData.Base.ModuleId,
            AppId: this.BaseData.Base.AppId,
            AppSecret: this.BaseData.Base.AppSecret
        };
    },
    workflowData: function (bizName, params, methodName,moduleId) {
        return {
            BizName: bizName,
            MethodParameters: params,
            MethodName: methodName,
            ModuleId: moduleId ? moduleId : this.BaseData.Base.ModuleId,
            AppId: this.BaseData.Base.AppId,
            AppSecret: this.BaseData.Base.AppSecret
        };
    }
};