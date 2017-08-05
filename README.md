# upload resize image

[demo](http://stsky.cn/demo/dest/)

```
/**
 * 图片压缩
 * @param {String|Array|Object} imgs 图片路径字符串/图片路径数组/file对象
 * @param {Object} options
 * @param {Number} [options.width] 图片需要压缩的宽度，高度会跟随调整
 * @param {Number} [options.quality=0.8] 压缩质量，不压缩为1
 * @param {String} [options.type] 可选，需要返回的文件类型，如'image/jpeg'、'image/png'等
 * @param {Function} [options.success(result)] 完成的回调函数，若type有值，则返回blob，否则返回base64
 * @example
    resizeImg.getBase64('test.jpg', {
      width: 200,
      quality: 0.9,
      type: image/jpeg',
      success: function($Blob){
        formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg");
        //...
      }
    })
 */
```