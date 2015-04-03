/*
 * todo: 照片列表滑动查看大图
 * description: 现场照片列表页面，用户点击图片列表，可滑动查看图片的大图
 * auth: 曹金桂
 * time: 2015年3月4日11:17:51
 */
var photoPreview = (function ($) {
    'use strict';

    var _allPhoto = []; //所有要预览的图片对象
    var _showIndex = 0; //当前预览的图片位置在_allPhoto中的位置

    //图片获取失败显示图片
    var ERRORPICTURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ5NEVFMzREMTA4MTFFNEI5MDVBQzY3M0U1MTI1MzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ5NEVFMzVEMTA4MTFFNEI5MDVBQzY3M0U1MTI1MzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NDk0RUUzMkQxMDgxMUU0QjkwNUFDNjczRTUxMjUzOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NDk0RUUzM0QxMDgxMUU0QjkwNUFDNjczRTUxMjUzOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqBjpR0AABlASURBVHja5F19jFzX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';
    //缓存三张图片,当前显示第二张图片
    var _photoCache = ['', '', ''];

    //缓存处理
    var cacheManager = function (direction) {
        if (direction === 'left') {
            _showIndex--;
            _photoCache[3] = _photoCache[2];
            _photoCache[2] = _photoCache[1];
            _photoCache[1] = '';
            if (_showIndex > 0) {
                getPicBase64Str(_allPhoto[_showIndex - 1], 1);
                console.log('缓存上一张图片');
            }
            if (_photoCache[3] == "") {//如果后一张加载失败，重新加载
                getPicBase64Str(_allPhoto[_showIndex + 1], 3);
            }
        } else if (direction === 'right') {
            _showIndex++;
            _photoCache[1] = _photoCache[2];
            _photoCache[2] = _photoCache[3];
            _photoCache[3] = '';
            if (_showIndex < _allPhoto.length) {
                getPicBase64Str(_allPhoto[_showIndex + 1], 3);
                console.log('缓存下一张图片');
            }
            if (_photoCache[1] == "") {//如果前一张加载失败，重新加载
                getPicBase64Str(_allPhoto[_showIndex - 1], 1);
            }
        }
    };

    //获取图片的base64字符串
    var getPicBase64Str = function (photoOb, cacheIndex) {
        if (photoOb) {
            var successCallback = function (data) {
                if (data.Success) {
                    _photoCache[cacheIndex] = "data:image/png;base64," + data.Data;
                    console.log(_photoCache);
                } else {
                    _photoCache[cacheIndex] = '';
                }
            };
            var errorCallback = function (data) {
                _photoCache[cacheIndex] = '';
            };
            util.getPicBase64("SHOWBASE64", photoOb.MaterialPath, successCallback, errorCallback);
        }
    };

    //显示图片到界面，保证图片居中大小合适
    var showImage = function (base64Str) {
        var $img = $('#sceneBigPhotoID').find("img").attr({ "style": "top:0px;left:0px;position:absolute;", "src": base64Str });
        $img.load(function () {
            //动态计算照片高宽，位置居中
            var imgW = $img.width(), imgH = $img.height(), winW = $(window).width(), winH = $(window).height();
            console.log("图片高宽：" + imgH + "," + imgW + ";    窗口高宽:" + winH + "," + winW);
            if ((imgW / imgH) > (winW / winH)) {
                $img.width(winW);
                console.log("设置宽为窗口宽");
                var top = (winH - $img.height()) / 2;
                $img.css({ "margin-top": top + "px", "margin-left": "0px" });
            } else {
                $img.height(winH);
                console.log("设置高为窗口高");
                var left = (winW - $img.width()) / 2;
                $img.css({ "margin-top": "0px", "margin-left": left + "px" });
            }
            $img.unbind('load');
        });
    };
    //图片加载失败时候，显示默认图片到界面
    var showDefaultImage = function (base64Str) {
        var $img = $('#sceneBigPhotoID').find("img").attr({ "style": "width:120px;height:120px;", "src": base64Str });
        var top = $(window).height() / 2 - 60;
        var left = $(window).width() / 2 - 60;
        $img.css({ "margin-top": top + "px", "margin-left": left + "px" });
    };
    var eventInitialize = function () {
        //初始化swipe滑动控件
        $("#sceneBigPhotoID").swipe({
            swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                console.log("显示上一张图片");
                if (_showIndex == 0) {
                    return;
                } else {
                    if (_photoCache[1]) {
                        showImage(_photoCache[1]);
                    } else {
                        showDefaultImage(ERRORPICTURE);
                    }
                    cacheManager('left');
                }
            },
            swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
                console.log("显示下一张图片");
                if (_showIndex == _allPhoto.length - 1) {
                    return;
                } else {
                    if (_photoCache[3]) {
                        showImage(_photoCache[3]);
                    } else {
                        showDefaultImage(ERRORPICTURE);
                    }
                    cacheManager('right');
                }
            },
            threshold: 100
        });
        //点击大图返回
        $('#sceneBigPhotoID').click(function (event) {
            event.stopPropagation();
            window.history.back();
        });
    };

    /*
    * 图片预览方法
    * 参数allPhoto： 所有要预览的图片数组对象
    * 参数showIndex：当前预览的图片在allPhoto中的位置(从零开始)
    */
    var preview = function (allPhoto, showIndex) {
        history.pushState({ page: "page16" }, "", "index.html");
        _allPhoto = allPhoto;
        _showIndex = showIndex;
        _photoCache = ['', '', '', ''];
        if (_showIndex < 0) {
            _showIndex = 0;
        } else if (_showIndex > allPhoto.length - 1) {
            _showIndex = _allPhoto.length - 1;
        }

        $('#sceneBigPhotoID').removeClass("none");
        showDefaultImage('./res/images/handing.gif');
        //$('#sceneBigPhotoID').find("img").attr({ "style": "top:46%;left:47%;width:100px;position:absolute;", "src": "./res/images/handing.gif" });
        //获取显示第showIndex张图片
        util.getPicBase64("SHOWBASE64", _allPhoto[_showIndex].MaterialPath, function (data) {
            if (data.Success) {
                delete _photoCache.sceond;
                _photoCache[2] = "data:image/png;base64," + data.Data;
                showImage(_photoCache[2]);
            } else {
                showDefaultImage(ERRORPICTURE);
                util.toast("获取图片失败: ");
                console.log(JSON.stringify(data));
            }
        }, function (data) {
            showDefaultImage(ERRORPICTURE);
            util.toast("获取大图失败！");
            console.log(JSON.stringify(data));
        });

        //缓存其他两张图片
        if (_showIndex <= 0) {
            getPicBase64Str(allPhoto[_showIndex + 1], 3);
            console.log('缓存下一张图片');
        } else if (_showIndex >= (allPhoto.length - 1)) {
            getPicBase64Str(allPhoto[_showIndex - 1], 1);
            console.log('缓存上一张图片');
        } else {
            getPicBase64Str(allPhoto[_showIndex + 1], 3);
            getPicBase64Str(allPhoto[_showIndex - 1], 1);
            console.log('缓存前后两张图片');
        }
    };

    return {
        eventInitialize: eventInitialize,
        preview: preview
    }

})(jQuery);