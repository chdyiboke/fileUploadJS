/* 全局变量（默认值） */
var teamId = 0;
var teamName = '公开';
/* 图片路径存放数组 */
var g_path = [];

summerready = function() {
	// 设置placeholder方法
	$("#advice").placeholder();
}
function trimStr(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*更改字符串中的换行符*/
function transferString(content) {
	var string = content;
	try {
		string = string.replace(/\r\n/g, "");
		string = string.replace(/\n/g, "");
	} catch (e) {
	}
	return string;
}

/* 弹出弹层选择相机或相册 */
function showPhotoMethod() {
	UM.actionsheet({
		title : '',
		items : ['拍照', '从相册中选择'],
		callbacks : [
		function() {
			// 打开相机
			summer.openCamera({
				bindfield : "image",
				callback : function(args) {
					var path = args.imgPath;
					compressImg(path);
				}
			})
		},
		function() {
			// 打开相册
			var count = 9 - parseInt(g_path.length);
			summer.openPhotoAlbum({
				bindfield : "image",
				maxCount : count,
				type : "multiple", //支持选多张图片
				callback : function(args) {
					var paths = args.imgPaths;
					for (var i = 0; i < paths.length; i++) {
						compressImg(paths[i].imgPath);
					}
				}
			});
		}]

	});
}

// 预览图片
function goSwiperImg(ev, imgArr) {
	var ev = ev || window.event;
	var activeIndex = ev.target.dataset.index;
	var imgUrlArr = imgArr.map(function(e) {
		return e.path;
	});
	summer.openWin({
		id : 'PhotosSwiper',
		url : 'comps/dynamic/html/photosSwiper.html',
		create : false,
		animation : {
			type : "fade",
			subType : "",
			duration : 300
		},
		pageParam : {
			activeIndex : activeIndex,
			imgArr : imgUrlArr,
			localPath : true
		}
	})
}

/*压缩图片*/
function compressImg(path) {
	var pathArr = path.split('/');
	var newPath = pathArr[pathArr.length - 1];
	// 调用上传
	summer.compressImg({
		src : path,
		path : 'compressImg/camera' + newPath,
		quality : "0.2", // 质量压缩比例
		callback : function(arg) {
			if (g_path.length >= 9) {
				return
			}
			var id = String(g_path.length);
			var picObj = {
				"path" : arg.savepath,
				"jid" : id
			};
			g_path.push(picObj);
			var picDiv = '<div class="conBox"><i class = "iconfont icon-close-c close" onclick="closePic(t' + 'his)"></i><div class="con"><img src="' + arg.savepath + '" onclick="goSwiperImg(event,g_path)" onload="thumbOnload()" data-index="' + id + '"></div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			if (len == 9) {
				$("#plus").addClass("none");
			}
		}
	})
}

/* 点击发送 */
function uploadHr() {
	var advice = $.trim($("#advice").val());
	summer.showProgress();
	if (!g_path || g_path.length < 1) {
		//判断是否选取图片，没有选取图片，不用上传
		createNewDynamic();
	} else {
		manyfileupload();
	}
}

/* 多图文上传方法 */
function manyfileupload(obj) {
	var fileArray = [];
	var params = {};
	var headers = getDeviceidAndToken();
	var SERVER = 'http://10.6.236.6:8080/fileUpload/servlet/UploadHandleServlet';
	for (var i = 0; i < g_path.length; i++) {
		var item = {
			fileURL : g_path[i].path,
			type : "image/jpeg",
			name : "file" + g_path[i].jid
		}
		fileArray.push(item);
	}
	summer.multiUpload({
		fileArray : fileArray,
		params : params,
		headers : headers,
		SERVER : SERVER
	}, 'uploadImgS()', 'uploadImgE()');
}

function uploadImgS(ret) {
	summer.hideProgress();
	summer.toast({
		"msg" : "图片上传成功"
	});
	summer.closeWin();
}

function uploadImgE(err) {
	summer.hideProgress();
	summer.toast({
		msg : '上传图片失败'
	})
	summer.closeWin();	
}

/* 删除单张图片 */
function closePic(obj) {
	var id = $(obj).siblings().find('img').attr("data-index");
	for (var i = 0; i < g_path.length; i++) {
		if (g_path[i].jid == id) {
			g_path.splice(i, 1);
			i--;
		}
	}
	$(obj).parent(".conBox").remove();
	g_path.forEach(function(e, i) {
		e.jid = String(i);
		$("#plus").siblings(".conBox").eq(i).find('img').attr("data-index", String(i));
	});
	$("#plus").removeClass("none");
}