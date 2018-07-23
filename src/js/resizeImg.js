/** @preserve
 * resizeImg v1.0.0
 * Github: https://github.com/lyswhut/resizeImg
 * 
 * Released under the MIT License.
 * 
 * 图片压缩
 * @param {String|Array|Object} imgs 图片路径字符串/图片路径数组/file对象
 * @param {Object} options
 * @param {Number} [options.width] 图片需要压缩的宽度，高度会跟随调整
 * @param {Number} [options.quality=0.8] 压缩质量，不压缩为1
 * @param {String} [options.type] 可选，需要返回的文件类型，如'image/jpeg'、'image/png'等
 * @param {Function} [options.success(result)] 完成的回调函数，若type有值，则返回blob，否则返回base64
 * @example 接收图片路径压缩
    __resizeImg('test.jpg', {
      width: 200,
      quality: 0.9,
      type: 'image/jpeg',
      success: function($Blob) {
        formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg");
        //...
      }
    })
 * @example 接收file对象压缩
    var dom_input_file = document.querySelector('#file_1')
    __resizeImg(dom_input_file.files[0], {
      width: 200,
      quality: 0.9,
      type: 'image/jpeg',
      success: function($Blob){
        formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg");
        //...
      }
    })
 */

function __resizeImg(imgs, options) {
  switch (typeof (imgs)) {
    case 'string':
      var image = new Image();
      image.src = imgs;
      if (imgs) {
        image.onload = function () {
          options.success(getBase64Image(image, options));
        };
      }
      break;
    case 'object':
      if (imgs instanceof Array) {
        var num = 0;
        imgs.forEach(function (img, index) {
          if (!img) return console.error('请传入正确的图片地址，当前图片地址为：' + img);
          var image = new Image();
          image.src = img;
          image.onload = function () {
            imgs.splice(index, 1, getBase64Image(image, options));
            num++;
            if (num == imgs.length) {
              options.success(imgs);
            }
          };
        }, this);
      } else {
        var blob = URL.createObjectURL(imgs);
        image = new Image();
        image.src = blob;
        if (imgs) {
          image.onload = function () {
            options.success(getBase64Image(image, options));
          };
        }
      }
      break;
    default:
      break;
  }

  function getBase64Image(img, options) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    var scale = img.width / img.height,
      w = options.width || img.width,
      h = options.width ? Math.floor(options.width / scale) : img.height;
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    // var dataURL = canvas.toDataURL();
    /**
     * 生成base64
     * 兼容修复移动设备需要引入mobileBUGFix.js
     */
    var dataURL = canvas.toDataURL('image/jpeg', options.quality || 0.8);

    // 修复IOS
    if (navigator.userAgent.match(/iphone/i)) {
      var mpImg = new MegaPixImage(img);
      mpImg.render(canvas, {
        maxWidth: w,
        maxHeight: h,
        quality: options.quality || 0.8
      });
      dataURL = canvas.toDataURL('image/jpeg', options.quality || 0.8);
    }

    // 修复android
    if (navigator.userAgent.match(/Android/i)) {
      var encoder = new JPEGEncoder();
      dataURL = encoder.encode(ctx.getImageData(0, 0, w, h), options.quality * 100 || 80);
    }

    // 生成结果
    // var result = {
    //   base64: dataURL,
    //   clearBase64: dataURL.substring(dataURL.indexOf(',') + 1)
    // };
    if (options.type) return getBlobBydataURI(dataURL, options.type);
    return dataURL;

    function getBlobBydataURI(dataURL, type) {
      var binary = atob(dataURL.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: type });
    }
  }
}
