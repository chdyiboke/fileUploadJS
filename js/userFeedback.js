var g_path = [];

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
	g_path.remove(src);
	$(obj).parent().parent(".con").remove();
	var len = $("#ibox .con").length - 1;
	$('#picShow').text(len + '/4');
	$("#plus").removeClass("none");
}

function showActionsheet() {
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
			var count = 4 - parseInt(g_path.length);
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
			if (g_path.length >= 4) {
				return
			}
			var id = String(g_path.length);
			var picObj = {
				"path" : arg.savepath,
				"jid" : id
			};
			g_path.push(picObj);
			var picDiv = '<div class="con">' + '<div class="con-con">' + '<img src="' + arg.savepath + '"><div class="bottomDelete"></div>' + '<span class="close iconfont icon-backspace" onClick="closePic(this);"></span>' + '</div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			$('#picShow').text(len + '/4');
			if (len == 4) {
				$("#plus").addClass("none");
			}
		}
	})
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
	var fileArray = [];
	for (var i = 0; i < g_path.length; i++) {
		var item = {
			fileURL : g_path[i].path,
			type : "image/jpeg",
			name : "file" + g_path[i].jid
		}
		fileArray.push(item);
	}
	var userinfo = summer.getStorage("userinfo");
	var SERVER = G_COMMON_URL+'/advice/addAdvice';

	var params = {
		context : $.trim($("#question").val())
	};
	var headers = getDeviceidAndToken();
	summer.multiUpload({
		fileArray : fileArray,
		params : params,
		headers : headers,
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