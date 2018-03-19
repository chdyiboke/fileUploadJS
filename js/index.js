/*
 *测试机：安卓(华为荣耀6)、苹果(iPhone7)
 *
 *四个按钮：
 *按钮1是文件下载、上传（多）
 *按钮2是文件下载、上传（单）
 *按钮1是图片上传（多）
 *按钮2是图片上传（单）
 * 
 * 多种情况测试：参数类型，大文件，文件类型，压缩，裁剪，多文件6个方面
 * 1、文件上传类型type类型不填写情况——summer.multiUpload、summer.upload都没有问题，加上更严格。（后台拿到的是文件的后缀名）
 * 2、大文件上传、下载——超过100M没有问题（理想情况下文件大小只受后台限制，然后和手机配置、网络性能有关系）
 * 3、上传文件类型：word/图片——各类型可用（测试过word、jpg、xls、pdf、exe等）
 * 4、上传图片压缩参数使用，是否有默认压缩值——没有默认值，各手机不同（一个参数两个api 三种方式都测试过，接口三个参数确定需要压缩值）
 * 5、上传图片是否支持裁剪：不支持裁剪——上传不支持剪裁（可在上传前借助第三方软件裁剪再上传）
 * 6、多个文件同时上传——可以：header、timeout都可用（summer.upload没有timeout参数，加上也不可用）
 * 
 * 文件上传api，推荐使用summer.multiUpload(不需要引插件)
 * 多文件上传
 * summer.multiUpload：    summer.multiUpload(json,sFn,eFn);
 * json
	*fileArray：文件列表，数组
	*fileURL:需要上传的文件路径地址（本机路径，常见情景为拍照和相册返回的路径）
	*type：上传文件的类型 > 例：图片为”image/jpeg”
	*name：后台取图片的Key，此key值在fileArray中，每个列表都需要不一样，即是文件列表的标识，保持唯一性
	*params：上传参数
	*headers：请求头
	*SERVER：服务器地址
	*timeout：超时时间，单位秒
 *sFn：成功的回调函数，注意：回调函数必须使用双引号引起来
 *eFn：失败的回调函数，注意：回调函数必须使用双引号引起来
 * 
 * 单文件上传
 * summer.upload : summer.upload(json,sFn,eFn,headers);
 * json
  *  fileURL:需要上传的文件路径地址（本机路径，常见情景为拍照和相册返回的路径）
  * 	type：上传文件的类型 > 例：图片为”image/jpeg”
  *  params：上传参数
  *  headers：类型：JSON 对象，默认值：无，描述：（可选项）请求头
  *  SERVER：服务器地址
 *sFn：成功的回调函数  
 *eFn：失败的回调函数
 * headers：请求头
 * 
 * 后台代码此处省略...
 * 
 */

function openWinFeedback() {
	summer.openWin({
		id : "userFeedback",
		url : 'html/userFeedback.html',
		create : "false",
		type : "actionBar",
		actionBar : {
			title : "多图上传",
			titleColor : "",
			backgroundColor : "",
			leftItem : {
				type : "text",
				text : "取消",
				textColor : "#ffffff",
				method : ""
			},
			rightItems : [{
				type : "text",
				text : "提交",
				textColor : "#ffffff",
				method : "uploadQuestion()"
			}]
		}
	});
}

 
function createNewDynamic() {
	summer.openWin({
		id : 'CreateNewDynamic',
		url : 'html/createNewDynamic.html',
		create : "false",
		type : "actionBar",
		actionBar : {
			title : "创建动态",
			leftItem : {
				type : "text",
				text : "取消",
				textColor : "#ffffff",
				method : ""
			},
			rightItems : [{
				type : "text",
				text : "发送",
				textColor : "#ffffff",
				method : "uploadHr()" //点击回调的方法
			}]
		}
	});
}


function uploadImg() {
	UM.actionsheet({
		title : '',
		items : ['拍照','从相册中选择'],
		callbacks : [camera,openPhotoAlbum]
	});
}
 /*压缩图片   三种情况*/
/*
function camera() {
	summer.openCamera({
			//compressionRatio : 0.2,        
			callback : function(ret) {
	        	var imgPath = ret.imgPath;
                upload(imgPath);
			}
		})
}
*/

/*
function camera() {
	summer.openCamera({
			//compressionRatio : 0.2,        //压缩
			callback : function(ret) {
	        	var path = ret.imgPath;
                compressImg(path);
			}
		})
}

   
    function compressImg(path) {
        // 调用上传
        summer.compressImg({
            src: path,
            //path: 'compressImg/camera' +newPath,
            quality: "0.2", // 质量压缩比例
            callback: function (ret) {
                var imgPath = ret.savepath;
                alert("图片路径："+imgPath);
                upload(imgPath);
            }
        })
    }
*/

/*
function camera() {
	summer.openCamera({
			//compressionRatio : 0.2,        //压缩
			callback : function(ret) {
				//alert("图片路径："+ret.imgPath);
				//压缩图片    一张一张压缩
				summer.compressImage({
		            src: args.imgPath,
		            compressWidth: "1500",
		            compressHeight: "1000",
		            quality: "0.5",
		            callback: function(ret) {
		                //alert("图片压缩路径："+JSON.stringify(arg));
		                var imgPath = ret.savepath;	
						upload(imgPath)
		            }
		        });
	        
			}
		})
}
*/


function camera() {
	summer.openCamera({
			compressionRatio : 0.2,
			callback : function(ret) {
			
	        	var imgPath = ret.compressImgPath;	
				upload(imgPath)
				
			}
		})
}

function openPhotoAlbum() {
	summer.openPhotoAlbum({
		compressionRatio : 0.2,
		callback : function(ret) {
			var imgPath = ret.compressImgPath;
			upload(imgPath)
		}
	});
}

//多图片上传
function upload(path) {
      var paramObj= {
        imageType:1 
      };
    
	  var headers = {
			"DEVELOP-KEY" : "95b65502021a4db8bb8b648c0e16f153",
	  };

      summer.showProgress();
      
	summer.multiUpload({
		fileArray : [{
	        fileURL : path,
	        //type : "image/jpeg",
	        name : "imgs1"
    	}], //需要上传的文件路径
		headers : headers,
		timeout : 100,  //超时时间，单位秒
		params : paramObj, //上传参数
		SERVER : "http://10.6.236.6:8080/fileUpload/servlet/UploadHandleServlet" //服务器地址
	}, function(ret){
	  summer.toast({
	             "msg" : "图片上传成功" 
	        })
	  summer.hideProgress();
	}, function(err){
			summer.hideProgress();
			summer.toast({
	             "msg" : "图片上传失败" 
	        })
	});
}

function oneImg() {
	UM.actionsheet({
		title : '',
		items : ['拍照','从相册中选择'],
		callbacks : [cameraOne,openPhotoAlbumOne]
	});
}



function cameraOne() {
	summer.openCamera({
			compressionRatio : 0.2,
			callback : function(ret) {
			
	        	var imgPath = ret.compressImgPath;	
				upload(imgPath)
				
			}
		})
}

function openPhotoAlbumOne() {
	summer.openPhotoAlbum({
		compressionRatio : 0.2,
		callback : function(ret) {
			var imgPath = ret.compressImgPath;
			uploadOne(imgPath)
		}
	});
}

//单图片上传
function uploadOne(path) {
      var paramObj= {
        imageType:1 
      };
    
    summer.showProgress();
	summer.upload({
		fileURL : path,
    	//type : "image/jpeg",
    	//timeout : 5,  //超时时间，单位秒
		params : paramObj, //上传参数
		SERVER : "http://10.6.236.6:8080/fileUpload/servlet/UploadHandleServlet" //服务器地址
	}, function(ret){
	  //ret字符串
	  summer.toast({
	             "msg" : "图片上传成功" 
	        })
	  summer.hideProgress();
	}, function(err){
			alert("错误信息"+JSON.stringify(err));
			summer.hideProgress();
			summer.toast({
	             "msg" : "图片上传失败" 
	        })
	});
}