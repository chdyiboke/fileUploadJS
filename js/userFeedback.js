var g_pathArr = [];

summerready = function() {
	bindEvents();
}
function bindEvents() {
	$("#question").on("input propertychange", function() {
		var length = $(this).val().length;
		$('#txtShow').text(length + '/200');
	});
	var plus = $("#ibox .con-con .font");
	var phei = plus.parent().width() - 2;
	var pwid = plus.parent().width() - 2;
	plus.css({
		"width" : pwid,
		"height" : phei
	});
}

function closePic(obj) {
	var src = $(obj).prev("img").attr("src");
	g_pathArr.remove(src);
	$(obj).parent().parent(".con").remove();
	var len = $("#ibox .con").length - 1;
	$('#picShow').text(len + '/4');
	$("#plus").removeClass("none");
}

function camera() {
	//打开相机
	summer.openCamera({
		compressionRatio : 0.2,
		callback : function(ret) {
			var imgPath = ret.compressImgPath;
			g_pathArr.push(imgPath);
			var picDiv = '<div class="con">' + '<div class="con-con">' + '<img src="' + imgPath + '"><div class="bottomDelete"></div>' + '<span class="close iconfont icon-backspace" onClick="closePic(this);"></span>' + '</div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			$('#picShow').text(len + '/4');
			if (len == 4) {
				$("#plus").addClass("none");
			}
		}
	})
}

function openPhotoAlbum() {
	//打开相册
	//maxCount是和type: "multiple"  一块使用的
	var count = 4;
	summer.openPhotoAlbum({
		compressionRatio : 0.2,
		maxCount : count,
		type : "multiple", //支持选多张图片
		callback : function(ret) {
			var imgPath = ret.compressImgPath;
			g_pathArr.push(imgPath);
			var picDiv = '<div class="con">' + '<div class="con-con">' + '<img src="' + imgPath + '"><div class="bottomDelete"></div>' + '<span class="close iconfont icon-backspace" onClick="closePic(this);"></span>' + '</div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			$('#picShow').text(len + '/4');
			if (len == 4) {
				$("#plus").addClass("none");
			}
		}
	});
}

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)
			return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

function showActionsheet() {
	UM.actionsheet({
		title : '',
		items : ['拍照', '从相册中选择'],
		callbacks : [camera, openPhotoAlbum]
	});
}

function uploadQuestion() {
	var question = $.trim($("#question").val());
	manyfileupload();

}

function manyfileupload() {
	//多图文上传方法
	if (!summer.netAvailable()) {
		summer.toast({
			"msg" : "网络连接失败，请检查网络"
		})
		return;
	}
	summer.showProgress();
	// 判断变量
	var photoPath;
	var photoList = [];
	if (g_pathArr.length == 0) {
		photoList = [];
	} else {
		for (var i = 0,
		    length = g_pathArr.length; i < length; i++) {
			var photoPath = {
				"fileURL" : "",
				"type" : "image/png",
				"name" : "file"
			};
			photoPath.fileURL = g_pathArr[i];
			photoList.push(photoPath);
		}
	}
	var userinfo = summer.getStorage("userinfo");
	var SERVER = 'http://10.6.236.6:8080/fileUpload/servlet/UploadHandleServlet';

	var params = {
		context : $.trim($("#question").val())
	};
	var header = getDeviceidAndToken();
	summer.multiUpload({
		fileArray : photoList,
		params : params,
		headers : header,
		SERVER : SERVER
	}, function(ret) {

		summer.hideProgress();
		summer.toast({
			"msg" : "感谢您的反馈"
		});
		summer.closeWin();
	}, function(err) {
		summer.hideProgress();
		summer.toast({
			"msg" : "上传失败"
		})
	});

}
