/**
 * Created by XYC on 2017/6/19.
 */
// 全局请求url
window.G_COMMON_URL = "http://molicloud.app.yyuap.com/";
// 租户ID
window.G_COMPANY_ID = "moli";
// EMM地址
window.G_EMM_URL = "https://emm.yonyoucloud.com";
// EMM端口
window.G_EMM_PORT = "443";
// EMM MDM功能开关
window.G_EMM_MDM_SWITCH = false;
/*正式获取图像验证码的地址*/
window.G_ts_URL = 'https://euc.yonyoucloud.com/cas/images/getValiImage?ts=';
/*测试*/
//window.G_ts_URL='http://idtest.yyuap.com/cas/images/getValiImage?ts=';
//屏幕适配处理
(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (clientWidth >= 640) {
				clientWidth = 640;
			};
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function getDeviceidAndToken() {
	var deviceId = summer.getDeviceInfo().deviceid;
	var userinfo = summer.getStorage("userinfo");
	var token = userinfo ? userinfo.token : "";
	return {
		"deviceId": deviceId,
		"token": token
	}
}

function ajaxRequest(paramObj, successCallback, errorCallback) {
	//var testPath = "http://uculture-test.app.yyuap.com" + paramObj.url;
	//var testPath = "http://172.27.35.1:8080" + paramObj.url;
	var testPath = ''
	if (paramObj.fullUrl) {
		testPath = paramObj.url
	} else {
		testPath = G_COMMON_URL + paramObj.url;
	}

	var header = getDeviceidAndToken();
	if (paramObj.contentType) {
		header["Content-Type"] = paramObj.contentType;
	}
	//判断网络
	if (!summer.netAvailable()) {
        summer.refreshHeaderLoadDone();
        summer.refreshFooterLoadDone();
		summer.hideProgress();
		summer.toast({
			msg: "网络异常，请检查网络"
        });
		return false;
	}
	//设置超时
	window.cordovaHTTP.settings = {
		timeout: 5000
	};
	summer.ajax({
		type: paramObj.type,
		url: testPath,
		param: paramObj.param,
		// 考虑接口安全，每个请求都需要将这个公告header带过去
		header: header
	}, function (response) {
		var data;
		if ($summer.isJSONObject(response.data)) {
			data = response.data;
		} else {
			data = JSON.parse(response.data);
		}
		successCallback(data);
	}, function (response) {
		var tokenerror = summer.getStorage("G-TOKEN-ERROR");
		// 避免过快点击到其它页面出现连续跳转到登录页面的现象
		if (tokenerror) {
			return false;
		}
		// 判断是否token失效
		if (response.status == "401") {
			summer.hideProgress();
			// 设置token标志
			summer.setStorage("G-TOKEN-ERROR", true);
			// 清除userinfo，直接退出之后，再进入可以直接跳入到登录
			summer.setStorage("userinfo", "");
			//  退出有信
			im.logout({});
			// 退出emm
			emm.logout({});
			summer.toast({
				msg: "登录过期，请重新登录"
			});
			summer.initializeWin({
				id: 'login',
				url: 'comps/login/index.html',
				toId: 'homePage'
			});
			return;
		}
		// 执行自己的其它逻辑
		errorCallback(response)
	});
}

//判断是否为空
function isEmpty(data) {
	if (data == undefined || data == null || data == "" || data == 'NULL' || data == false || data == 'false') {
		return true;
	}
	return false;
}

function createNull(id, url, text) {
	var url = url ? url : "../image/empty.png";
	var text = text ? text : "暂无数据";
	var html = '<div class="default-error" style="display: -webkit-box;display: flex; -webkit-box-pack: center;justify-content: center; -webkit-box-align: center;align-items: center; -webkit-box-orient: vertical; -webkit-box-direction: normal;flex-direction: column;width: 100%;height: 100%;position: fixed;">' + '<img src=' + url + ' style="width:30%;" alt=""/>' + '<p style="font-size: 14px;color: #CBCBCB;padding-top:20px;">' + text + '</p>' + '</div>';
	var curId = $summer.byId(id);
	$summer.html(curId, html);
}

;
(function (w) {
	//var test = document.createElement('input');
	//var support = 'placeholder' in test && !/android/gi.test(window.navigator.userAgent);
	if (typeof $ == "undefined")
		return;
	$.fn.placeholder = function () {
		return this.each(function () {

			var $this = $(this);
			var holderText = $this.attr('placeholder');
			var holder = $('<div class="x-placeholder">' + holderText + '</div>');

			holder.css({
				position: 'absolute',
				display: 'none',
				zIndex: 999,
				cursor: 'text',
				wordWrap: 'break-word',
				color: '#bbb'
			});

			$this.after(holder).removeAttr('placeholder').parent().css('position', 'relative');

			$this.bind('focus', function () {
				holder.hide();
			}).bind('blur', function () {
				if ($this.val().length)
					return;

				var offset = $this.offset();
				var top = (parseInt($this.css('paddingTop'), 10) || 0) + (parseInt($this.css('borderTop'), 10) || 0) + (parseInt($this.parent().css('padding-top'), 10) || 0);
				var left = (parseInt($this.css('paddingLeft'), 10) || 0) + (parseInt($this.css('borderLeft'), 10) || 0) + (parseInt($this.parent().css('padding-left'), 10) || 0);
				holder.css({
					top: top,
					left: left,
					width: $this.width()
				}).show();
			}).trigger('blur');

			holder.bind('click', function () {
				$this.focus();
			});
		});
	};
})(window);

// font for rem
(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (clientWidth >= 750) {
				clientWidth = 750;
			};
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

//随机颜色选择
function getColor(name) {
	var color = ['#eead10', '#f99a2b', '#f38134', '#6495ed', '#3ab1aa', '#0abfb5', '#06aae1', '#00bfff', '#96bc53', '#00ced1', '#89a8e0'];
	var newName = encodeURI(name).replace(/%/g, "");
	var lastName,
		hexadecimal,
		tenBinary;
	if (newName.length >= 6) {
		lastName = newName.substr(lastName, 6);
		hexadecimal = parseInt(lastName, 16);
		tenBinary = hexadecimal % 10;
		return color[tenBinary]
	} else {
		return color[10]
	}
}
//涉及到头像处理
function thumbOnload(ev) {
	var ev = ev || window.event;
	var oImg = ev.target;
	var w = oImg.width;
	var h = oImg.height;
	var parentW = $(oImg).parent().width();
	var parentH = $(oImg).parent().height();
	var move;
	if (w >= h) {
		$(oImg).css('height', parentH);
		var actuallyW = parseFloat($(oImg).css('width'));
		move = -(actuallyW - parentW) / 2 + "px";
		$(oImg).css("transform", "translate(" + move + ",0)");
	} else {
		$(oImg).css('width', parentW);
		var actuallyH = parseFloat($(oImg).css('height'));
		move = -(actuallyH - parentH) / 2 + "px";
		$(oImg).css("transform", "translate(0," + move + ")");
	}
}
/* 缓存 */
(function (summer, com) {
    window.cacheManager = {
        _duration: 30000,
        setCache: function (key, data, duration) {
            try {
                var _obj = {
                    data: data,
                    datetime: (new Date()).getTime(),
                    duration: duration || this._duration
                }
                summer.setStorage(key, _obj);
            } catch (e) {
                alert("ERR100:setCache出错了\n" + e);
            }
        },
        getCache: function (key) {
            try {
                var old = null; //旧数据
                try {
                    old = summer.getStorage(key);
                } catch (e) {
                    alert("ERR104:缓存数据转json出错了,\n仅支持json数据缓存\n" + e);
                    return null;
                }
                if (old == null) 
                    return;
                var oldT = old.datetime;
                var dur = old.duration;
                if ((new Date()).getTime() - parseInt(oldT) <= parseInt(dur)) {
                    return old.data;
                } else {
                    summer.rmStorage(key);
                    return null;
                }
            } catch (e) {
                alert("ERR103:getCache出错了\n" + e);
            }
        }
    }
})(summer, window);