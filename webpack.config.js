const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const packageJson = require('./package.json')

module.exports = {
  mode: process.env.NODE_ENV || 'production', // devlopment || production
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'resizeImg.min.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd',
    library: '__resizeImg',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`resizeImg.js v${packageJson.version}
Github: https://github.com/lyswhut/resizeImg

Released under the MIT License.

图片压缩
@param {String|Array|Object} imgs 图片路径字符串/图片路径数组/file对象/Blob对象
@param {Object} options
@param {Number} [options.width] 图片需要压缩的最大宽度，高度会跟随调整
@param {Number} [options.height] 图片需要压缩的最大高度，宽度会跟随调整
@param {Number} [options.quality=0.8] 压缩质量，不压缩为1
@param {String} [options.type] 可选，需要返回的文件类型，如'image/jpeg'、'image/png'等
@param {Function} [options.success(result)] 完成的回调函数，若type有值，则返回blob，否则返回base64
@example 接收图片路径压缩
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
@example 接收file对象压缩
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
`)
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
        extractComments: false
      }),
    ],
  }
}
