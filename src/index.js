const JPEGEncoder = require('./jpeg_encoder_basic')
const MegaPixImage = require('./megapix-image')

const getBase64Image = function(img, options) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
  var canvas = document.createElement("canvas");
  var w, h
  if (options.width && options.height) {
    var scale = img.width / img.height
    var resizedH = Math.floor(options.width / scale)
    if (resizedH < options.height) {
      w = options.width
      h = resizedH
    } else {
      w = Math.floor(options.height * scale)
      h = options.height
    }
  } else {
    w = img.width
    h = img.height
  }
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

module.exports = function(imgs, options) {
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
}
