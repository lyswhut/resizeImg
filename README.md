# upload resize image

## 前端图片压缩

用于前端上传图片前的图片压缩处理，兼容`PC`、`android`、`ios`平台。

本项目整合了`jpeg_encoder_basic.js`及`megapix-image.js`

[demo](https://lyswhut.github.io/resizeImg/dist/index.html)

**注意：这只是简单的图片压缩，即把原图缩小比例后再通过`canvas`画出来，本插件对于需要把高分辨率（大图）压成低分辨率（小图）时才会起效果，不然可能会起到反效果（即压了反而变大），所以需要先判断图片大小再选择是否进行压缩处理。**

## use

```html
<script src="./js/resizeImg.min.js"></script>
```
## options

```js
/**
 * 图片压缩
 * @param {String|Array|Object} imgs 图片路径字符串/图片路径数组/file对象/Blob对象
 * @param {Object} options
 * @param {Number} [options.width] 图片需要压缩的最大宽度，高度会跟随调整
 * @param {Number} [options.height] 图片需要压缩的最大高度，宽度会跟随调整
 * @param {Number} [options.quality=0.8] 压缩质量，不压缩为1
 * @param {String} [options.type] 可选，需要返回的文件类型，如'image/jpeg'、'image/png'等
 * @param {Function} [options.success(result)] 完成的回调函数，若type有值，则返回blob，否则返回base64
 * @example 接收图片路径压缩
    __resizeImg('test.jpg', {
      width: 200,
      height: 200,
      quality: 0.9,
      type: 'image/jpeg',
      success: function($Blob) {
        // formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg");
        // ...
      }
    })
 * @example 接收file对象压缩
    var dom_input_file = document.querySelector('#file_1')
    __resizeImg(dom_input_file.files[0], {
      width: 200,
      height: 200,
      quality: 0.9,
      type: 'image/jpeg',
      success: function($Blob){
        // formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg");
        // ...
      }
    })
 */
```

## example

### 获取`base64`
通过原图获取压缩后图片的`base64`，可直接当做字符串传给后台

```js
__resizeImg('test.jpg', {
  width: 200,
  quality: 0.9,
  success: function($base64){
    // resize image $base64
    // ...
  }
})
```

### 获取`blob`
通过原图获取压缩后图片的blob，可以把`blob`放进`FormData`里发给服务器

```js
__resizeImg('test.jpg', {
  width: 200,
  quality: 0.9,
  type: 'image/jpeg',
  success: function($Blob){
    // formData.append("imgFile", $Blob, "file_" + new Date().getTime() + ".jpg"); 
    // ...
  }
})
```

## LICENSE
MIT
