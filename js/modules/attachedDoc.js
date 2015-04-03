//随附单证
var attachedDoc = (function () {
    'use strict';
    var eventInitialize = function () {
        var setScrollHeight = function () {
            var winHeight = window.innerHeight;
            var headHeight = $(".head").height();
            var scrollHeight = (winHeight - headHeight);
            $(".attachedDoc .content").height(scrollHeight);
        };
        setScrollHeight();
    };
    var getImgClass = function (fileSuffix) {
        if (fileSuffix) {
            fileSuffix = fileSuffix.toLowerCase();
        }
        var imgClass = '';
        var type = null;
        switch (fileSuffix) {
            case 'gd':
            case 'sep':
                imgClass = 'file',
                type = HGPreview.type.SHUSHENG;
                break;
            case 'tif':
            case 'tiff':
                imgClass = "tiff";
                type = HGPreview.type.TIFF;
                break;
            case 'xls':
            case 'xlsx':
                imgClass = "xls";
                type = HGPreview.type.OFFICE;
                break;
            case 'pdf':
                imgClass = "pdf";
                type = HGPreview.type.PDF;
                break;
            case 'ppt':
            case 'pptx':
                imgClass = "ppt";
                type = HGPreview.type.OFFICE;
                break;
            case 'txt':
            case 'ini':
            case 'js':
            case 'css':
            case 'mad':
            case 'bat':
                imgClass = "txt";
                type = HGPreview.type.TXT;
                break;
            case 'jpg':
            case 'jpeg':
                imgClass = "jpg";
                type = HGPreview.type.IMAGE;
                break;
            case 'png':
                imgClass = "png";
                type = HGPreview.type.IMAGE;
                break;
            case 'gif':
                imgClass = "gif";
                type = HGPreview.type.IMAGE;
                break;
            case 'bmp':
                imgClass = "bmp";
                type = HGPreview.type.IMAGE;
                break;
            case 'doc':
            case 'docx':
                imgClass = "doc";
                type = HGPreview.type.OFFICE;
                break;
            case 'zip':
            case 'rar':
            case '7z':
            case 'gzip':
            case 'iso':
                imgClass = "zip";
                type = null;
                break;
            case 'apk':
                imgClass = "apk";
                type = null;
                break;
            case 'mp3':
            case 'wav':
            case 'wma':
            case 'midi':
                imgClass = "music";
                type = null;
                break;
            case 'html':
            case 'htm':
                imgClass = "html";
                type = null;
                break;
            case 'mp4':
            case 'rm':
            case 'rmvb':
            case 'mov':
            case 'qt':
            case 'mpg':
            case 'wmv':
            case 'avi':
                imgClass = "video";
                type = null;
                break;
            default:
                imgClass = "file";
                type = null;
                break;
        }
        var getImg = function () {
            return imgClass;
        };
        var getType = function () {
            return type;
        };
        return {
            getImg: getImg,
            getType: getType
        }
    };
    var createElement = function (item) {
        var fileName = item.FileName;
        var fileLink = item.FileLink;
        var createDate = item.CreatDate;
        var fileSuffix = '';
        var imgClass = '';
        var type = null;
        var imgClassObj = null;
        if (fileName.lastIndexOf(".") !== -1) {
            var index = fileName.lastIndexOf(".");
            fileSuffix = fileName.substr(index+1);
        }
        imgClassObj = getImgClass(fileSuffix)
        imgClass = imgClassObj.getImg();
        type = imgClassObj.getType();
        var $div = $(document.createElement("div")).addClass("attachedBtn");
        var $child1 = $(document.createElement("div")).addClass("photoCommon");
        var $child2 = $(document.createElement("div")).addClass("attachedFileName");
        var $child3 = $(document.createElement("div")).addClass("cb");
        $child1.addClass(imgClass);
        $child2.html(fileName);
        $(".attachedDoc_innerCon").append(
            $div.append($child1).append($child2).append($child3)
            );
        $div.attr("type", type);
        $div.attr("fileLink", fileLink);
    };
    var manageData = function (data) {
        if (data) {
            if (data.length > 0) {
                history.pushState({ page: "page4" }, "", location.href.split("?")[0] + "?page=page4");
                $(".page").addClass("none");
                $("#attachedDocPage").removeClass("none");
                $("#attachedDoc_userName").html("");
                $("#attachedDoc_userName").html(util.getUserInfo.getUser().DisPlayName);
                $("#attachedDocPage .attachedDoc_innerCon").empty();
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    createElement(item);
                }
                $(".attachedBtn").unbind("click");
                $(".attachedBtn").bind("click", function () {
                    var url = ServerConfig.downLoadUrl + "file=";
                    var fileLink = $(this).attr("fileLink");
                    var fileName = $(this).find(".attachedFileName").html();
                    var type = $(this).attr("type");
                    fileLink = (fileLink && fileLink.length > 0) ? fileLink : "";
                    fileName = (fileName && fileName.length > 0) ? fileName : "";
                    type = (type) ? type : null;
                    url += fileLink + "&n=" + fileName;
                    var param = { server: ServerConfig.server, url: url };
                    console.info("url:" + url);
                    console.info("type:" + type);
                    var successCallback = function (data) {
                        if (data.Status === 1) {
                            util.toast("获取成功");
                        } else {
                            console.info(JSON.stringify(data.Data));
                            util.taost("获取失败");
                        }
                    };
                    var errorCallback = function (data) {
                        console.info(JSON.stringify(data.Data));
                        util.taost("获取失败");
                    };
                    if (!type) {
                        util.toast('无法打开的文件类型');
                    } else {
                        HGPreview.show(type, param, successCallback, errorCallback);
                    }
                });
            } else {
                util.toast("该报关单没有随附单证信息");
            }
        }
    };
    var loadData = function () {
        //console.log("entryloadData");
        var EntryID = $("#checkwork_head .titleBottom").html();
        var data = dataStructure.choiceData("H2000.BizFileAndAddrInfoRepository", [EntryID], "CreateDownLoadFileUrl", util.getOption("entryModuleId"));
        var successCallBack = function (data) {
            var backData = data.Data;
            if (data && data.Status == 1) {
                if (backData) {
                    manageData(backData);
                } else {

                }
            } else {
                console.info(JSON.stringify(backData));
                util.toast(JSON.stringify(backData));
            }
        };
        var errorCallBack = function (data) {

        };
        util.post(data, true, successCallBack, errorCallBack, "form");
    };
    return {
        loadData: loadData,
        eventInitialize: eventInitialize
    };
})();