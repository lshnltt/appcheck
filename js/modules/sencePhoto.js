//现场照片
var sencePhoto = (function ($) {
    'use strict';
    //报关单号
    var customsID = "";
    //以保存和已经上传的照片(对象以照片ID为属性，值为照片对象)
    var serverPhoto = null;
    //已经上传和已经保存的照片数量
    var photoCount = 0;
    //本地添加的照片 eg: { '1029039': {statu: 0, path: '/data/1029039.png'}} (1: 上传中，0失败)
    var lacalPhoto = {};

    //打开摄像头拍照
    var takePic = function () {
        var address = util.getUserInfo.getUser().LogName;
        var userName = util.getUserInfo.getUser().DisPlayName;
        var successCallback = function (path) {
            console.log("take pic successcallback : " + path);
            //util.toast("正在处理照片...");
            path = JSON.parse(path);
            var pathLength = path.length;
            if (pathLength > 0) {
                util.toast("正在处理照片...");
            }
            for (var i = 0; i < pathLength; i++) {
                var _path = path[i];
                var sidex = _path.lastIndexOf("/") + 1;
                var eindex = _path.lastIndexOf(".");
                var _id = _path.substring(sidex, eindex);
                lacalPhoto[_id] = { statu: 1, path: _path };
                //显示本地图片并上传图片
                showLocalPic(_id, true);
            }
        };
        var errorCallback = function (error) {
            console.log("take pic errorcallback : " + error);
            util.toast("HGCamera ERROR: " + error);
        };
        HGCamera.takePicture(userName, address, "/" + customsID, successCallback, errorCallback);
    };
    //显示本地图片，是否需要上传图片
    var showLocalPic = function (id, needUpload) {
        var _d = _createDom(id, false);
        $("#photoViewCon").append(_d);
        var path = lacalPhoto[id].path; //绝对路径
        // 文件相对路径
        //var path = customsID + "/" + id + ".jpg";
        //使用延迟对象控制当读取到文件之后再上传文件
        var deferred = new $.Deferred();
        $.when(deferred).done(function (base64Str) {
            if (needUpload) { uploadLocalPic(id); }
        });

        $(_d).find(".retryShowPic").text('正在读取本地图片').removeClass('none');
        var getbaseSucc = function (base64Str) {
            $(_d).find(".retryShowPic").addClass('none');
            $(_d).find("img").attr({ "src": "data:image/png;base64," + base64Str });
            deferred.resolve();
        };
        var getBaseFail = function (error) {
            util.toast("显示本地图片错误：" + error);
        };
        HGFile.getBase64File(path, getbaseSucc, getBaseFail);
    };
    var uploadLocalPic = function (id) {
        _changePicStatu(id, 1);
        var errorCallback = function (error) {
            _changePicStatu(id, 2);
            lacalPhoto[id].statu = 0;
            console.log("上传图片错误:" + JSON.stringify(error));
            util.toast("上传图片错误: " + JSON.stringify(error));
        };
        var successCallback = function (respone) {
            //var _back = JSON.parse(respone);
            var _back = respone;
            if (_back.Success) {
                var data = _back.Data;
                var item = {
                    "ID": data.ID,
                    "BizName": data.BizName,
                    "MaterialClass": data.MaterialClass,
                    "MaterialName": data.MaterialName,
                    "MaterialExt": data.MaterialExt,
                    "MaterialPath": data.MaterialPath,
                    "ThumbnailPath": data.ThumbnailPath,
                    "OriName": data.OriName,
                    "State": 0
                };
                if (serverPhoto == null) serverPhoto = {};
                serverPhoto[id] = item;
                _changePicStatu(id, 3);
                delete lacalPhoto[id];
                //修改照片数据
                photoCount += 1;
                $("#photoNum").text(photoCount);
                $(".totalPhoto").text(photoCount);
                //文件上传成功，删除本地图片
                util.deleteFile(customsID + "/" + id + ".jpg");
            } else {
                console.log("上传图片错误:" + JSON.stringify(respone.Data));
                util.toast("文件：" + picPath + " 上传失败, 错误：" + JSON.stringify(respone.Data));
                _changePicStatu(id, 2);
                lacalPhoto[id].statu = 0;
            }
        };
        util.uploadFile(lacalPhoto[id].path, id + ".jpg", successCallback, errorCallback);
    };

    //修改照片的状态 1:上传中 2:上传失败 3:上传成功
    var _changePicStatu = function (id, statu) {
        var $a = $("#" + id).find("a");
        var isInEdit = $("#foot2 .selectCon").css("display") == "none";
        $a.find(".uploadProcess").remove();
        if (statu == 1) {
            //上传中的照片不能编辑
            $a.find("div:last-child").removeClass("phone_selectView notSelectBtn selectBtn");
            var $div = $("<div>").addClass("uploadProcess Processing");
            $div.append($("<img>").addClass("processImg").attr({ "src": "res/images/uploadProcess.png" }));
            $div.append("<br/>");
            $div.append($("<span>").addClass("processld").text("上传中..."));
            $a.append($div);
        } else {
            if (!isInEdit) {
                $a.find("div:last-child").addClass("phone_selectView notSelectBtn");
            } else {
                $a.find("div:last-child").addClass("phone_selectView");
            }
            if (statu == 2) {
                var $div = $("<div>").addClass("uploadProcess ProcessFaild");
                $div.append($("<span>").addClass("processld").text("上传失败"));
                $div.append("<br/>");
                $div.append($("<span>").addClass("retryUploadBut tShadow_black2").text("重试"));
                $a.append($div);
            } else if (statu == 3) {
                $a.find("div").eq(0).addClass("uploadFlag uploadedFlag").text("已上传");
            }
        }
        _handlerDeleteCount();
    };

    //删除按钮数量显示修改
    var _handlerDeleteCount = function () {
        var _selectSize = $(".selectBtn").length;
        $(".selectNum").text(_selectSize);
        if (_selectSize > 0) {
            $("#photoDelete").css({ "color": "red" })
        } else {
            $("#photoDelete").css({ "color": "#a9a1a0" })
        }
        if ($(".phone_selectView").length == _selectSize) {
            $("#photoSelectAll").text("取消全选");
            $("#photoSelectAll").data("selectAll", 1);
        } else {
            $("#photoSelectAll").text("全选");
            $("#photoSelectAll").data("selectAll", 0);
        }
        $("#photoNum").text(photoCount);
        $(".totalPhoto").text(photoCount);
    };

    //查看照片大图
    //var _isLoadingBigPic = false;
    var preViewPicture = function (id) {
        var thisIndex = 0;
        var allPhoto = [];
        $("#photoViewCon li").each(function (index) {
            var _id = $(this).attr("id");
            if (id === _id) {
                thisIndex = index;
            }
            if (serverPhoto[_id]) {
                allPhoto.push(serverPhoto[_id]);
            }
        });
        console.log("当前照片为第" + thisIndex + "张");
        photoPreview.preview(allPhoto, thisIndex);
    };

    var _deleteFile = function () {
        var _allSelect = $(".selectBtn").parents("li");
        var _size = _allSelect.length
        if (_size == 0) {
            util.toast("未选择照片");
            return;
        }
        var _selectServerPhoto = 0;
        _allSelect.each(function (i) {
            var id = $(this).attr("id");
            if (serverPhoto[id]) {
                if (serverPhoto[id].ID) {
                    serverPhoto[id].State = -1;
                } else {
                    delete serverPhoto[id];
                }
                _selectServerPhoto++;
            } else {
                delete lacalPhoto[id];
            }
            $(this).remove();
        });
        photoCount = photoCount - _selectServerPhoto;
        _handlerDeleteCount();
        util.toast("成功删除" + _size + "张照片");
    };
    var eventInitialize = function () {
        (function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var footHeight = $("#foot2").outerHeight();
            var scrollHeight = (winHeight - headHeight - footHeight);
            $("#scenePhotoPage .content").css({ "min-height": scrollHeight });
        })();
        //点击照片选择
        $("#photoViewCon").on("click", "a", function (event) {
            event.stopPropagation();
            //照片列表是否在编辑模式下
            if ($("#foot2 .selectCon").hasClass("none")) {
                var _id = $(this).parent("li").attr("id");
                //如果已保存状态的缩略图获取失败，点击则重新获取照片
                if (!$(this).find("img").attr("src")) {
                    util.toast("重新获取照片...");
                    showServerPic(serverPhoto[_id]);
                } else if ($(this).find("div").hasClass("ProcessFaild")) {//如果照片上传失败，点击则重新获取照片
                    util.toast("重新上传照片...");
                    _changePicStatu(_id, 1);
                    uploadLocalPic(_id);
                } else {
                    //照片滑动预览
                    preViewPicture(_id);
                    return;
                    //查看照片大图, 看是否有正在获取的大图请求，防止快速点击多张图片
                    /*if (!_isLoadingBigPic) {
                    util.toast("正在获取大图...");
                    _isLoadingBigPic = true;
                    _showBigPic(_id);
                    } else {
                    util.toast("有正在请求的大图，请稍后...");
                    }*/
                }
            } else {
                var _con = $(this).find(".phone_selectView");
                if (_con.hasClass("phone_selectView")) {
                    _con.toggleClass("selectBtn");
                    _handlerDeleteCount();
                }
            }
        });
        $("#photoSelectAll").click(function (event) {
            event.stopPropagation();
            if ($("#photoSelectAll").data("selectAll") != 1) {
                $(".phone_selectView").addClass("selectBtn");
                $("#photoSelectAll").text("取消全选");
                $("#photoSelectAll").data("selectAll", 1);
            } else {
                $(".phone_selectView").removeClass("selectBtn");
                $("#photoSelectAll").text("全选");
                $("#photoSelectAll").data("selectAll", 0);
            }
            _handlerDeleteCount();

        });
        $("#photoDone").click(function (event) {
            event.stopPropagation();
            $("#foot2 .selectCon").addClass("none");
            $("#foot2 .editCon").removeClass("none");
            $(".phone_selectView").removeClass("notSelectBtn selectBtn");
        });
        $("#photoDelete").click(function (event) {
            event.stopPropagation();
            _deleteFile();
            //恢复全选按钮
            $(".phone_selectView").removeClass("selectBtn");
            $("#photoSelectAll").text("全选");
            $("#photoSelectAll").data("selectAll", 0);
        });
        $("#photoEdit").click(function (event) {
            event.stopPropagation();
            $(".selectBtn").removeClass("selectBtn");
            $(".selectNum").text(0);
            $("#foot2 .editCon").addClass("none");
            $("#foot2 .selectCon").removeClass("none");
            $(".phone_selectView").addClass("notSelectBtn");
            //恢复全选按钮
            $(".phone_selectView").removeClass("selectBtn");
            $("#photoSelectAll").text("全选");
            $("#photoSelectAll").data("selectAll", 0);
        });
        $("#photoSave").click(function (event) {
            event.stopPropagation();
            savePhoto();
        });
        //拍照
        $(".photoBtn").click(function (event) {
            event.stopPropagation();
            //如果不是在现场照片页面需要跳转到现场照片
            var $that = $(this);
            $that.addClass("photoBtn_c");
            setTimeout(function () {
                $that.removeClass("photoBtn_c");
                var bool = $("#scenePhotoPage").is(":hidden");
                if (bool) {
                    customsID = $("#checkwork_head").find(".titleBottom").text();
                    console.log("拍照地址存储customsID: " + customsID);
                }
                takePic();
                if (bool) {
                    initView(customsID);
                }
            }, util.getOption("timer1"));
        });

        //上传失败，重试
        $(".photo_innerCon").on("click", ".retryUploadBut", function () {
            var $that = $(this);
            $that.addClass("retryUploadBut_c");
            setTimeout(function () {
                $that.removeClass("retryUploadBut_c");
                var id = $(this).parents("li").attr("id");
                _changePicStatu(id, 1);
                uploadLocalPic(id);
            }, util.getOption("timer1"));
        });
    };

    //绘制照片显示到页面
    var initView = function (id) {
        var checkItem = checkList.getCheckItem();
        //已经查验的报关单，不能操作照片列表，掩藏#foot2，列表高度需要重新计算
        if (checkItem && checkItem.ProcessState === 16) {
            $("#foot2").hide();
            //$("#scenePhotoPage .content").height(window.innerHeight - $(".head").height());
            //$("#scenePhotoPage .content").css({ "min-height": window.innerHeight - $(".head").height() });
            console.log(window.innerHeight - $(".head").height());
        } else {
            $("#foot2").show();
            console.log(window.innerHeight - $(".head").height() - $("#foot2").outerHeight());
            //$("#scenePhotoPage .content").height(window.innerHeight - $(".head").height() - $("#foot2").outerHeight());
            //$("#scenePhotoPage .content").css({ "min-height": window.innerHeight - $(".head").height() - $("#foot2").outerHeight() });
        }
        if ($("#scenePhotoPage").data("refresh")) {
            customsID = id;
            if (serverPhoto == null) {
                util.toast("正在获取照片数据...");
                $.when(_loadPictureDatas(id)).then(function () {
                    $("#photoNum").text(photoCount);
                    $(".totalPhoto").text(photoCount);
                    _showPicView();
                }, function (error) {
                    $("#photoNum").text(0);
                    $(".totalPhoto").text(0);
                    util.toast("错误： " + error);
                });
            } else {
                _showPicView();
            }
        } else {
            _showView();
        }
    };
    var _showView = function () {
        $(".page").addClass("none");
        $("#scenePhotoPage").removeClass("none");
        history.pushState({ page: "page5" }, "", "index.html?page=page5");
        $("#foot2 .editCon").removeClass("none");
        $("#foot2 .selectCon").addClass("none");
    };
    var _showPicView = function () {
        $("#scenePhotoPage").data("refresh", false);
        _showView();
        $("#scenePhoto_userName").text(util.getUserInfo.getUser().DisPlayName);
        $(".totalPhoto").text(photoCount);
        for (var _a in serverPhoto) {
            $("#photoViewCon").append(_createDom(_a, true));
            showServerPic(serverPhoto[_a]);
        }
    };

    var showServerPic = function (ob) {
        $("#" + ob.ID).find(".retryShowPic").text('正在获取图片').removeClass('none');
        var successCallback = function (data) {
            if (data.Success) {
                $("#" + ob.ID).find("img").attr({ "src": "data:image/png;base64," + data.Data });
                $("#" + ob.ID).find(".retryShowPic").addClass('none');
            } else {
                $("#" + ob.ID).find(".retryShowPic").text('点击重试').removeClass('none');
                util.toast("获取图片失败！");
            }
        };
        var errorCallback = function (data) {
            $("#" + ob.ID).find(".retryShowPic").text('点击重试').removeClass('none');
            util.toast("获取图片失败！");
        };
        util.getPicBase64("SHOWBASE64", ob.ThumbnailPath, successCallback, errorCallback);
    };
    var _createDom = function (id, isSave) {
        //是否在选择模式
        var isInEdit = $("#foot2 .selectCon").css("display") != "none";
        var _a = $("<a>");
        _a.append($("<span>").text('点击重试').addClass('retryShowPic none'));
        _a.append($("<img>").addClass("photo"));
        var _flag = $("<div>");
        if (isSave) _flag.addClass("uploadFlag saveFlag").text("已保存");
        var _selectView = $("<div>").addClass("phone_selectView");
        if (isInEdit) _selectView.addClass("notSelectBtn");
        _a.append(_flag).append(_selectView);
        var li = $("<li>").attr({ "id": id }).append(_a);
        return li;
    };
    //获取正在上传的照片和失败的照片
    var _getUploadingAndFaild = function () {
        var back = {
            uploading: [],
            faild: []
        };
        for (var id in lacalPhoto) {
            var item = lacalPhoto[id];
            if (item.statu == 1) {
                back.uploading.push(item);
            } else {
                back.faild.push(item);
            }
        }
        return back;
    };

    //获取对应报关单照片
    var _loadPictureDatas = function (id) {
        var resourceId = checkList.getCheckItem()["ID"];
        var deferred = new $.Deferred();
        var data = dataStructure.listData(util.getOption("moduleId"), 'IDP.Sys.MaterialRepository', 1, 9999, [{ "column": "STATE", "symbol": "<>", "value": "-1" }, { "column": "RESOURCE_ID", "symbol": "=", "value": resourceId }, { "column": "BIZ_NAME", "symbol": "=", "value": "H2000.BizRskExamHeadRelRepository" }, { "column": "MATERIAL_CLASS", "symbol": "=", "value": ""}], "SORT_NO ASC", "ListShow", []);
        var successCallback = function (data) {
            if (data.Status == 1) {
                photoCount = data.Data.TotalCount;
                var rows = data.Data.Rows;
                serverPhoto = {};
                $.each(rows, function (i, value) {
                    var item = {
                        "ID": value.Cell.ID,
                        "BizName": value.Cell.BizName,
                        "MaterialClass": value.Cell.MaterialClass,
                        "MaterialName": value.Cell.MaterialName,
                        "MaterialExt": value.Cell.MaterialExt,
                        "MaterialPath": value.Cell.MaterialPath,
                        "ThumbnailPath": value.Cell.ThumbnailPath,
                        "OriName": value.Cell.OriName,
                        "State": 0
                    };
                    serverPhoto[value.Cell.ID] = item;
                });
                deferred.resolve();
            } else {
                if (ErrorType == 0) {
                    deferred.reject("服务端异常,请稍后重试。");
                } else {
                    deferred.reject(data.Data);
                }
            }
        };
        var errorCallback = function (error) {
            deferred.reject(error);
        };
        util.post(data, true, successCallback, errorCallback, "list");
        return deferred;
    };
    //获取报关单照片数量
    var getPicCountsByID = function (id) {
        if (serverPhoto == null) {
            $.when(_loadPictureDatas(id)).then(function () {
                $("#photoNum").text(photoCount);
                $(".totalPhoto").text(photoCount);
            }, function (error) {
                $("#photoNum").text(0);
                $(".totalPhoto").text(0);
                util.toast("获取照片错误: " + error);
            });
            return 0;
        } else {
            return photoCount;
        }
    };

    var clearData = function () {
        $("#scenePhotoPage").data("refresh", true);
        serverPhoto = null;
        photoCount = 0;
        lacalPhoto = {};
        $("#photoViewCon").empty();
    };
    var getCommitData = function () {
        var uploadAndFaild = _getUploadingAndFaild();
        var inUploadingSize = uploadAndFaild.uploading.length;
        var backOb = {};
        if (inUploadingSize > 0) {
            backOb.isUploading = true;
            util.toast("有正在上传的照片...");
            //有正在上传的照片，跳转到照片列表
            initView($("#checkwork_head").find(".titleBottom").text());
        } else {
            backOb.isUploading = false;
            backOb.data = [];
            if (serverPhoto != null) {
                var i = 0;
                for (var id in serverPhoto) {
                    var item = serverPhoto[id];
                    item.SortNo = i++;
                    backOb.data.push(item);
                    /*//只处理删除的和新增的照片
                    if (item.ID) {
                    if (item.State == -1) {
                    backOb.data.push(item);
                    }
                    } else {
                    backOb.data.push(item);
                    }*/
                }
            }
        }
        return backOb;
    };

    //保存未提交的照片
    var savePhoto = function () {
        var commitData = getCommitData();
        console.log("保存照片: " + JSON.stringify(commitData));
        if (commitData.isUploading) {
            return;
        }
        util.toast("正在提交照片...");
        $("#fullBg").removeClass("none");

        //保存报关单信息，主要为照片数据(调用保存方法，只提交照片和报关单信息，此处建议添加额外接口处理)
        var recordInfo = records.getCommitData();
        var allData = {
            BizName: "H2000.BizRskExamHeadRelRepository",
            MethodName: "Save",
            ExtInfo: "",
            AppId: "0000000001",
            AppSecret: "A08BCCX615ED43BW",
            ModuleId: "00000000010000000001",
            JsonEntityData: '',
            JsonWorkFlowInfo: '{}',
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
            ID: checkList.getCheckItem()["ID"],
            SubmitAnyWay: false
        };
        allData.JsonEntityData = JSON.stringify(jsonData);
        //照片处理
        for (var i = 0, photoLength = commitData.data.length; i < photoLength; i++) {
            var cont = {
                BizName: "IDP.Sys.MaterialRepository",
                JsonEntityData: JSON.stringify(commitData.data[i])
            };
            allData.RelationDataInfoList.push(cont);
        }
        //发送请求保存照片
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
    }

    return {
        eventInitialize: eventInitialize,
        initView: initView,
        clearData: clearData,
        getPicCountsByID: getPicCountsByID,
        getCommitData: getCommitData
    }
})(jQuery);