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

function _resizeImg(imgs, options) {
  switch (typeof(imgs)) {
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
            imgs.splice(index,1,getBase64Image(image, options));
            num ++;
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

    /* ================================================================================================================ */
    /* jpeg_encoder_basic.js  for android jpeg压缩质量修复 */
    // function JPEGEncoder(a){function I(a){var c,i,j,k,l,m,n,o,p,b=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99];for(c=0;64>c;c++)i=d((b[c]*a+50)/100),1>i?i=1:i>255&&(i=255),e[z[c]]=i;for(j=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],k=0;64>k;k++)l=d((j[k]*a+50)/100),1>l?l=1:l>255&&(l=255),f[z[k]]=l;for(m=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],n=0,o=0;8>o;o++)for(p=0;8>p;p++)g[n]=1/(8*e[z[n]]*m[o]*m[p]),h[n]=1/(8*f[z[n]]*m[o]*m[p]),n++}function J(a,b){var f,g,c=0,d=0,e=new Array;for(f=1;16>=f;f++){for(g=1;g<=a[f];g++)e[b[d]]=[],e[b[d]][0]=c,e[b[d]][1]=f,d++,c++;c*=2}return e}function K(){i=J(A,B),j=J(E,F),k=J(C,D),l=J(G,H)}function L(){var c,d,e,a=1,b=2;for(c=1;15>=c;c++){for(d=a;b>d;d++)n[32767+d]=c,m[32767+d]=[],m[32767+d][1]=c,m[32767+d][0]=d;for(e=-(b-1);-a>=e;e++)n[32767+e]=c,m[32767+e]=[],m[32767+e][1]=c,m[32767+e][0]=b-1+e;a<<=1,b<<=1}}function M(){for(var a=0;256>a;a++)x[a]=19595*a,x[a+256>>0]=38470*a,x[a+512>>0]=7471*a+32768,x[a+768>>0]=-11059*a,x[a+1024>>0]=-21709*a,x[a+1280>>0]=32768*a+8421375,x[a+1536>>0]=-27439*a,x[a+1792>>0]=-5329*a}function N(a){for(var b=a[0],c=a[1]-1;c>=0;)b&1<<c&&(r|=1<<s),c--,s--,0>s&&(255==r?(O(255),O(0)):O(r),s=7,r=0)}function O(a){q.push(w[a])}function P(a){O(255&a>>8),O(255&a)}function Q(a,b){var c,d,e,f,g,h,i,j,l,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,k=0;const m=8,n=64;for(l=0;m>l;++l)c=a[k],d=a[k+1],e=a[k+2],f=a[k+3],g=a[k+4],h=a[k+5],i=a[k+6],j=a[k+7],p=c+j,q=c-j,r=d+i,s=d-i,t=e+h,u=e-h,v=f+g,w=f-g,x=p+v,y=p-v,z=r+t,A=r-t,a[k]=x+z,a[k+4]=x-z,B=.707106781*(A+y),a[k+2]=y+B,a[k+6]=y-B,x=w+u,z=u+s,A=s+q,C=.382683433*(x-A),D=.5411961*x+C,E=1.306562965*A+C,F=.707106781*z,G=q+F,H=q-F,a[k+5]=H+D,a[k+3]=H-D,a[k+1]=G+E,a[k+7]=G-E,k+=8;for(k=0,l=0;m>l;++l)c=a[k],d=a[k+8],e=a[k+16],f=a[k+24],g=a[k+32],h=a[k+40],i=a[k+48],j=a[k+56],I=c+j,J=c-j,K=d+i,L=d-i,M=e+h,N=e-h,O=f+g,P=f-g,Q=I+O,R=I-O,S=K+M,T=K-M,a[k]=Q+S,a[k+32]=Q-S,U=.707106781*(T+R),a[k+16]=R+U,a[k+48]=R-U,Q=P+N,S=N+L,T=L+J,V=.382683433*(Q-T),W=.5411961*Q+V,X=1.306562965*T+V,Y=.707106781*S,Z=J+Y,$=J-Y,a[k+40]=$+W,a[k+24]=$-W,a[k+8]=Z+X,a[k+56]=Z-X,k++;for(l=0;n>l;++l)_=a[l]*b[l],o[l]=_>0?0|_+.5:0|_-.5;return o}function R(){P(65504),P(16),O(74),O(70),O(73),O(70),O(0),O(1),O(1),O(0),P(1),P(1),O(0),O(0)}function S(a,b){P(65472),P(17),O(8),P(b),P(a),O(3),O(1),O(17),O(0),O(2),O(17),O(1),O(3),O(17),O(1)}function T(){var a,b;for(P(65499),P(132),O(0),a=0;64>a;a++)O(e[a]);for(O(1),b=0;64>b;b++)O(f[b])}function U(){var a,b,c,d,e,f,g,h;for(P(65476),P(418),O(0),a=0;16>a;a++)O(A[a+1]);for(b=0;11>=b;b++)O(B[b]);for(O(16),c=0;16>c;c++)O(C[c+1]);for(d=0;161>=d;d++)O(D[d]);for(O(1),e=0;16>e;e++)O(E[e+1]);for(f=0;11>=f;f++)O(F[f]);for(O(17),g=0;16>g;g++)O(G[g+1]);for(h=0;161>=h;h++)O(H[h])}function V(){P(65498),P(12),O(3),O(1),O(0),O(2),O(17),O(3),O(17),O(0),O(63),O(0)}function W(a,b,c,d,e){var h,l,o,q,r,s,t,u,v,w,f=e[0],g=e[240];const i=16,j=63,k=64;for(l=Q(a,b),o=0;k>o;++o)p[z[o]]=l[o];for(q=p[0]-c,c=p[0],0==q?N(d[0]):(h=32767+q,N(d[n[h]]),N(m[h])),r=63;r>0&&0==p[r];r--);if(0==r)return N(f),c;for(s=1;r>=s;){for(u=s;0==p[s]&&r>=s;++s);if(v=s-u,v>=i){for(t=v>>4,w=1;t>=w;++w)N(g);v=15&v}h=32767+p[s],N(e[(v<<4)+n[h]]),N(m[h]),s++}return r!=j&&N(f),c}function X(){var b,a=String.fromCharCode;for(b=0;256>b;b++)w[b]=a(b)}function Y(a){if(0>=a&&(a=1),a>100&&(a=100),y!=a){var b=0;b=50>a?Math.floor(5e3/a):Math.floor(200-2*a),I(b),y=a,console.log("Quality set to: "+a+"%")}}function Z(){var c,b=(new Date).getTime();a||(a=50),X(),K(),L(),M(),Y(a),c=(new Date).getTime()-b,console.log("Initialization "+c+"ms")}var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;Math.round,d=Math.floor,e=new Array(64),f=new Array(64),g=new Array(64),h=new Array(64),m=new Array(65535),n=new Array(65535),o=new Array(64),p=new Array(64),q=[],r=0,s=7,t=new Array(64),u=new Array(64),v=new Array(64),w=new Array(256),x=new Array(2048),z=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],A=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],B=[0,1,2,3,4,5,6,7,8,9,10,11],C=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],D=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],E=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],F=[0,1,2,3,4,5,6,7,8,9,10,11],G=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],H=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250],this.encode=function(a,b){var d,e,f,m,n,o,p,y,z,A,B,C,D,E,F,G,H,I,J,K,c=(new Date).getTime();for(b&&Y(b),q=new Array,r=0,s=7,P(65496),R(),T(),S(a.width,a.height),U(),V(),d=0,e=0,f=0,r=0,s=7,this.encode.displayName="_encode_",m=a.data,n=a.width,o=a.height,p=4*n,z=0;o>z;){for(y=0;p>y;){for(D=p*z+y,E=D,F=-1,G=0,H=0;64>H;H++)G=H>>3,F=4*(7&H),E=D+G*p+F,z+G>=o&&(E-=p*(z+1+G-o)),y+F>=p&&(E-=y+F-p+4),A=m[E++],B=m[E++],C=m[E++],t[H]=(x[A]+x[B+256>>0]+x[C+512>>0]>>16)-128,u[H]=(x[A+768>>0]+x[B+1024>>0]+x[C+1280>>0]>>16)-128,v[H]=(x[A+1280>>0]+x[B+1536>>0]+x[C+1792>>0]>>16)-128;d=W(t,g,d,i,k),e=W(u,h,e,j,l),f=W(v,h,f,j,l),y+=32}z+=8}return s>=0&&(I=[],I[1]=s+1,I[0]=(1<<s+1)-1,N(I)),P(65497),J="data:image/jpeg;base64,"+btoa(q.join("")),q=[],K=(new Date).getTime()-c,console.log("Encoding time: "+K+"ms"),J},Z()}function getImageDataFromImage(a){var d,b="string"==typeof a?document.getElementById(a):a,c=document.createElement("canvas");return c.width=b.width,c.height=b.height,d=c.getContext("2d"),d.drawImage(b,0,0),d.getImageData(0,0,c.width,c.height)}
    /*
      Basic GUI blocking jpeg encoder ported to JavaScript and optimized by 
      Andreas Ritter, www.bytestrom.eu, 11/2009.

      Example usage is given at the bottom of this file.

      ---------

      Copyright (c) 2008, Adobe Systems Incorporated
      All rights reserved.

      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are
      met:

      * Redistributions of source code must retain the above copyright notice,
        this list of conditions and the following disclaimer.

      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

      * Neither the name of Adobe Systems Incorporated nor the names of its
        contributors may be used to endorse or promote products derived from
        this software without specific prior written permission.

      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
      IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
      THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
      PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
      PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
      PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
      LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
    function JPEGEncoder(quality) {
      var self = this;
        var fround = Math.round;
        var ffloor = Math.floor;
        var YTable = new Array(64);
        var UVTable = new Array(64);
        var fdtbl_Y = new Array(64);
        var fdtbl_UV = new Array(64);
        var YDC_HT;
        var UVDC_HT;
        var YAC_HT;
        var UVAC_HT;

        var bitcode = new Array(65535);
        var category = new Array(65535);
        var outputfDCTQuant = new Array(64);
        var DU = new Array(64);
        var byteout = [];
        var bytenew = 0;
        var bytepos = 7;

        var YDU = new Array(64);
        var UDU = new Array(64);
        var VDU = new Array(64);
        var clt = new Array(256);
        var RGB_YUV_TABLE = new Array(2048);
        var currentQuality;

        var ZigZag = [
                0, 1, 5, 6,14,15,27,28,
                2, 4, 7,13,16,26,29,42,
                3, 8,12,17,25,30,41,43,
                9,11,18,24,31,40,44,53,
                10,19,23,32,39,45,52,54,
                20,22,33,38,46,51,55,60,
                21,34,37,47,50,56,59,61,
                35,36,48,49,57,58,62,63
            ];

        var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
        var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
        var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
        var std_ac_luminance_values = [
                0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
                0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
                0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
                0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
                0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
                0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
                0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
                0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
                0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
                0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
                0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
                0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
                0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
                0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
                0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
                0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
                0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
                0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
                0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
                0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
                0xf9,0xfa
            ];

        var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
        var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
        var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
        var std_ac_chrominance_values = [
                0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
                0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
                0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
                0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
                0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
                0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
                0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
                0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
                0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
                0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
                0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
                0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
                0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
                0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
                0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
                0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
                0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
                0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
                0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
                0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
                0xf9,0xfa
            ];

        function initQuantTables(sf){
                var YQT = [
                    16, 11, 10, 16, 24, 40, 51, 61,
                    12, 12, 14, 19, 26, 58, 60, 55,
                    14, 13, 16, 24, 40, 57, 69, 56,
                    14, 17, 22, 29, 51, 87, 80, 62,
                    18, 22, 37, 56, 68,109,103, 77,
                    24, 35, 55, 64, 81,104,113, 92,
                    49, 64, 78, 87,103,121,120,101,
                    72, 92, 95, 98,112,100,103, 99
                ];

                for (var i = 0; i < 64; i++) {
                    var t = ffloor((YQT[i]*sf+50)/100);
                    if (t < 1) {
                        t = 1;
                    } else if (t > 255) {
                        t = 255;
                    }
                    YTable[ZigZag[i]] = t;
                }
                var UVQT = [
                    17, 18, 24, 47, 99, 99, 99, 99,
                    18, 21, 26, 66, 99, 99, 99, 99,
                    24, 26, 56, 99, 99, 99, 99, 99,
                    47, 66, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99
                ];
                for (var j = 0; j < 64; j++) {
                    var u = ffloor((UVQT[j]*sf+50)/100);
                    if (u < 1) {
                        u = 1;
                    } else if (u > 255) {
                        u = 255;
                    }
                    UVTable[ZigZag[j]] = u;
                }
                var aasf = [
                    1.0, 1.387039845, 1.306562965, 1.175875602,
                    1.0, 0.785694958, 0.541196100, 0.275899379
                ];
                var k = 0;
                for (var row = 0; row < 8; row++)
                {
                    for (var col = 0; col < 8; col++)
                    {
                        fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                        fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                        k++;
                    }
                }
            }

            function computeHuffmanTbl(nrcodes, std_table){
                var codevalue = 0;
                var pos_in_table = 0;
                var HT = new Array();
                for (var k = 1; k <= 16; k++) {
                    for (var j = 1; j <= nrcodes[k]; j++) {
                        HT[std_table[pos_in_table]] = [];
                        HT[std_table[pos_in_table]][0] = codevalue;
                        HT[std_table[pos_in_table]][1] = k;
                        pos_in_table++;
                        codevalue++;
                    }
                    codevalue*=2;
                }
                return HT;
            }

            function initHuffmanTbl()
            {
                YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
                UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
                YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
                UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
            }

            function initCategoryNumber()
            {
                var nrlower = 1;
                var nrupper = 2;
                for (var cat = 1; cat <= 15; cat++) {
                    //Positive numbers
                    for (var nr = nrlower; nr<nrupper; nr++) {
                        category[32767+nr] = cat;
                        bitcode[32767+nr] = [];
                        bitcode[32767+nr][1] = cat;
                        bitcode[32767+nr][0] = nr;
                    }
                    //Negative numbers
                    for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
                        category[32767+nrneg] = cat;
                        bitcode[32767+nrneg] = [];
                        bitcode[32767+nrneg][1] = cat;
                        bitcode[32767+nrneg][0] = nrupper-1+nrneg;
                    }
                    nrlower <<= 1;
                    nrupper <<= 1;
                }
            }

            function initRGBYUVTable() {
                for(var i = 0; i < 256;i++) {
                    RGB_YUV_TABLE[i]              =  19595 * i;
                    RGB_YUV_TABLE[(i+ 256)>>0]     =  38470 * i;
                    RGB_YUV_TABLE[(i+ 512)>>0]     =   7471 * i + 0x8000;
                    RGB_YUV_TABLE[(i+ 768)>>0]     = -11059 * i;
                    RGB_YUV_TABLE[(i+1024)>>0]     = -21709 * i;
                    RGB_YUV_TABLE[(i+1280)>>0]     =  32768 * i + 0x807FFF;
                    RGB_YUV_TABLE[(i+1536)>>0]     = -27439 * i;
                    RGB_YUV_TABLE[(i+1792)>>0]     = - 5329 * i;
                }
            }

            // IO functions
            function writeBits(bs)
            {
                var value = bs[0];
                var posval = bs[1]-1;
                while ( posval >= 0 ) {
                    if (value & (1 << posval) ) {
                        bytenew |= (1 << bytepos);
                    }
                    posval--;
                    bytepos--;
                    if (bytepos < 0) {
                        if (bytenew == 0xFF) {
                            writeByte(0xFF);
                            writeByte(0);
                        }
                        else {
                            writeByte(bytenew);
                        }
                        bytepos=7;
                        bytenew=0;
                    }
                }
            }

            function writeByte(value)
            {
                byteout.push(clt[value]); // write char directly instead of converting later
            }

            function writeWord(value)
            {
                writeByte((value>>8)&0xFF);
                writeByte((value   )&0xFF);
            }

            // DCT & quantization core
            function fDCTQuant(data, fdtbl)
            {
                var d0, d1, d2, d3, d4, d5, d6, d7;
                /* Pass 1: process rows. */
                var dataOff=0;
                var i;
                const I8 = 8;
                const I64 = 64;
                for (i=0; i<I8; ++i)
                {
                    d0 = data[dataOff];
                    d1 = data[dataOff+1];
                    d2 = data[dataOff+2];
                    d3 = data[dataOff+3];
                    d4 = data[dataOff+4];
                    d5 = data[dataOff+5];
                    d6 = data[dataOff+6];
                    d7 = data[dataOff+7];

                    var tmp0 = d0 + d7;
                    var tmp7 = d0 - d7;
                    var tmp1 = d1 + d6;
                    var tmp6 = d1 - d6;
                    var tmp2 = d2 + d5;
                    var tmp5 = d2 - d5;
                    var tmp3 = d3 + d4;
                    var tmp4 = d3 - d4;

                    /* Even part */
                    var tmp10 = tmp0 + tmp3;    /* phase 2 */
                    var tmp13 = tmp0 - tmp3;
                    var tmp11 = tmp1 + tmp2;
                    var tmp12 = tmp1 - tmp2;

                    data[dataOff] = tmp10 + tmp11; /* phase 3 */
                    data[dataOff+4] = tmp10 - tmp11;

                    var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
                    data[dataOff+2] = tmp13 + z1; /* phase 5 */
                    data[dataOff+6] = tmp13 - z1;

                    /* Odd part */
                    tmp10 = tmp4 + tmp5; /* phase 2 */
                    tmp11 = tmp5 + tmp6;
                    tmp12 = tmp6 + tmp7;

                    /* The rotator is modified from fig 4-8 to avoid extra negations. */
                    var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
                    var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
                    var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
                    var z3 = tmp11 * 0.707106781; /* c4 */

                    var z11 = tmp7 + z3;    /* phase 5 */
                    var z13 = tmp7 - z3;

                    data[dataOff+5] = z13 + z2;    /* phase 6 */
                    data[dataOff+3] = z13 - z2;
                    data[dataOff+1] = z11 + z4;
                    data[dataOff+7] = z11 - z4;

                    dataOff += 8; /* advance pointer to next row */
                }

                /* Pass 2: process columns. */
                dataOff = 0;
                for (i=0; i<I8; ++i)
                {
                    d0 = data[dataOff];
                    d1 = data[dataOff + 8];
                    d2 = data[dataOff + 16];
                    d3 = data[dataOff + 24];
                    d4 = data[dataOff + 32];
                    d5 = data[dataOff + 40];
                    d6 = data[dataOff + 48];
                    d7 = data[dataOff + 56];

                    var tmp0p2 = d0 + d7;
                    var tmp7p2 = d0 - d7;
                    var tmp1p2 = d1 + d6;
                    var tmp6p2 = d1 - d6;
                    var tmp2p2 = d2 + d5;
                    var tmp5p2 = d2 - d5;
                    var tmp3p2 = d3 + d4;
                    var tmp4p2 = d3 - d4;

                    /* Even part */
                    var tmp10p2 = tmp0p2 + tmp3p2;    /* phase 2 */
                    var tmp13p2 = tmp0p2 - tmp3p2;
                    var tmp11p2 = tmp1p2 + tmp2p2;
                    var tmp12p2 = tmp1p2 - tmp2p2;

                    data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
                    data[dataOff+32] = tmp10p2 - tmp11p2;

                    var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
                    data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
                    data[dataOff+48] = tmp13p2 - z1p2;

                    /* Odd part */
                    tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
                    tmp11p2 = tmp5p2 + tmp6p2;
                    tmp12p2 = tmp6p2 + tmp7p2;

                    /* The rotator is modified from fig 4-8 to avoid extra negations. */
                    var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
                    var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
                    var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
                    var z3p2 = tmp11p2 * 0.707106781; /* c4 */
                    var z11p2 = tmp7p2 + z3p2;    /* phase 5 */
                    var z13p2 = tmp7p2 - z3p2;

                    data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
                    data[dataOff+24] = z13p2 - z2p2;
                    data[dataOff+ 8] = z11p2 + z4p2;
                    data[dataOff+56] = z11p2 - z4p2;

                    dataOff++; /* advance pointer to next column */
                }

                // Quantize/descale the coefficients
                var fDCTQuant;
                for (i=0; i<I64; ++i)
                {
                    // Apply the quantization and scaling factor & Round to nearest integer
                    fDCTQuant = data[i]*fdtbl[i];
                    outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
                    //outputfDCTQuant[i] = fround(fDCTQuant);

                }
                return outputfDCTQuant;
            }

            function writeAPP0()
            {
                writeWord(0xFFE0); // marker
                writeWord(16); // length
                writeByte(0x4A); // J
                writeByte(0x46); // F
                writeByte(0x49); // I
                writeByte(0x46); // F
                writeByte(0); // = "JFIF",'\0'
                writeByte(1); // versionhi
                writeByte(1); // versionlo
                writeByte(0); // xyunits
                writeWord(1); // xdensity
                writeWord(1); // ydensity
                writeByte(0); // thumbnwidth
                writeByte(0); // thumbnheight
            }

            function writeSOF0(width, height)
            {
                writeWord(0xFFC0); // marker
                writeWord(17);   // length, truecolor YUV JPG
                writeByte(8);    // precision
                writeWord(height);
                writeWord(width);
                writeByte(3);    // nrofcomponents
                writeByte(1);    // IdY
                writeByte(0x11); // HVY
                writeByte(0);    // QTY
                writeByte(2);    // IdU
                writeByte(0x11); // HVU
                writeByte(1);    // QTU
                writeByte(3);    // IdV
                writeByte(0x11); // HVV
                writeByte(1);    // QTV
            }

            function writeDQT()
            {
                writeWord(0xFFDB); // marker
                writeWord(132);       // length
                writeByte(0);
                for (var i=0; i<64; i++) {
                    writeByte(YTable[i]);
                }
                writeByte(1);
                for (var j=0; j<64; j++) {
                    writeByte(UVTable[j]);
                }
            }

            function writeDHT()
            {
                writeWord(0xFFC4); // marker
                writeWord(0x01A2); // length

                writeByte(0); // HTYDCinfo
                for (var i=0; i<16; i++) {
                    writeByte(std_dc_luminance_nrcodes[i+1]);
                }
                for (var j=0; j<=11; j++) {
                    writeByte(std_dc_luminance_values[j]);
                }

                writeByte(0x10); // HTYACinfo
                for (var k=0; k<16; k++) {
                    writeByte(std_ac_luminance_nrcodes[k+1]);
                }
                for (var l=0; l<=161; l++) {
                    writeByte(std_ac_luminance_values[l]);
                }

                writeByte(1); // HTUDCinfo
                for (var m=0; m<16; m++) {
                    writeByte(std_dc_chrominance_nrcodes[m+1]);
                }
                for (var n=0; n<=11; n++) {
                    writeByte(std_dc_chrominance_values[n]);
                }

                writeByte(0x11); // HTUACinfo
                for (var o=0; o<16; o++) {
                    writeByte(std_ac_chrominance_nrcodes[o+1]);
                }
                for (var p=0; p<=161; p++) {
                    writeByte(std_ac_chrominance_values[p]);
                }
            }

            function writeSOS()
            {
                writeWord(0xFFDA); // marker
                writeWord(12); // length
                writeByte(3); // nrofcomponents
                writeByte(1); // IdY
                writeByte(0); // HTY
                writeByte(2); // IdU
                writeByte(0x11); // HTU
                writeByte(3); // IdV
                writeByte(0x11); // HTV
                writeByte(0); // Ss
                writeByte(0x3f); // Se
                writeByte(0); // Bf
            }

            function processDU(CDU, fdtbl, DC, HTDC, HTAC){
                var EOB = HTAC[0x00];
                var M16zeroes = HTAC[0xF0];
                var pos;
                const I16 = 16;
                const I63 = 63;
                const I64 = 64;
                var DU_DCT = fDCTQuant(CDU, fdtbl);
                //ZigZag reorder
                for (var j=0;j<I64;++j) {
                    DU[ZigZag[j]]=DU_DCT[j];
                }
                var Diff = DU[0] - DC; DC = DU[0];
                //Encode DC
                if (Diff==0) {
                    writeBits(HTDC[0]); // Diff might be 0
                } else {
                    pos = 32767+Diff;
                    writeBits(HTDC[category[pos]]);
                    writeBits(bitcode[pos]);
                }
                //Encode ACs
                var end0pos = 63; // was const... which is crazy
                for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
                //end0pos = first element in reverse order !=0
                if ( end0pos == 0) {
                    writeBits(EOB);
                    return DC;
                }
                var i = 1;
                var lng;
                while ( i <= end0pos ) {
                    var startpos = i;
                    for (; (DU[i]==0) && (i<=end0pos); ++i) {}
                    var nrzeroes = i-startpos;
                    if ( nrzeroes >= I16 ) {
                        lng = nrzeroes>>4;
                        for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
                            writeBits(M16zeroes);
                        nrzeroes = nrzeroes&0xF;
                    }
                    pos = 32767+DU[i];
                    writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
                    writeBits(bitcode[pos]);
                    i++;
                }
                if ( end0pos != I63 ) {
                    writeBits(EOB);
                }
                return DC;
            }

            function initCharLookupTable(){
                var sfcc = String.fromCharCode;
                for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
                    clt[i] = sfcc(i);
                }
            }

            this.encode = function(image,quality,toRaw) // image data object
            {
                var time_start = new Date().getTime();

                if(quality) setQuality(quality);

                // Initialize bit writer
                byteout = new Array();
                bytenew=0;
                bytepos=7;

                // Add JPEG headers
                writeWord(0xFFD8); // SOI
                writeAPP0();
                writeDQT();
                writeSOF0(image.width,image.height);
                writeDHT();
                writeSOS();

                // Encode 8x8 macroblocks
                var DCY=0;
                var DCU=0;
                var DCV=0;

                bytenew=0;
                bytepos=7;

                this.encode.displayName = "_encode_";

                var imageData = image.data;
                var width = image.width;
                var height = image.height;

                var quadWidth = width*4;
                var tripleWidth = width*3;

                var x, y = 0;
                var r, g, b;
                var start,p, col,row,pos;
                while(y < height){
                    x = 0;
                    while(x < quadWidth){
                    start = quadWidth * y + x;
                    p = start;
                    col = -1;
                    row = 0;

                    for(pos=0; pos < 64; pos++){
                        row = pos >> 3;// /8
                        col = ( pos & 7 ) * 4; // %8
                        p = start + ( row * quadWidth ) + col;

                        if(y+row >= height){ // padding bottom
                            p-= (quadWidth*(y+1+row-height));
                        }

                        if(x+col >= quadWidth){ // padding right
                            p-= ((x+col) - quadWidth +4)
                        }

                        r = imageData[ p++ ];
                        g = imageData[ p++ ];
                        b = imageData[ p++ ];

                        /* // calculate YUV values dynamically
                        YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                        UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                        VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                        */

                        // use lookup table (slightly faster)
                        YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
                        UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
                        VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;

                    }

                    DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                    DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                    DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                    x+=32;
                    }
                    y+=8;
                }

                ////////////////////////////////////////////////////////////////

                // Do the bit alignment of the EOI marker
                if ( bytepos >= 0 ) {
                    var fillbits = [];
                    fillbits[1] = bytepos+1;
                    fillbits[0] = (1<<(bytepos+1))-1;
                    writeBits(fillbits);
                }

                writeWord(0xFFD9); //EOI

                if(toRaw) {
                    var len = byteout.length;
                    var data = new Uint8Array(len);

                    for (var i=0; i<len; i++ ) {
                        data[i] = byteout[i].charCodeAt();
                    }

                    //cleanup
                    byteout = [];

                    // benchmarking
                    var duration = new Date().getTime() - time_start;
                    console.log('Encoding time: '+ duration + 'ms');

                    return data;
                }

                var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

                byteout = [];

                // benchmarking
                var duration = new Date().getTime() - time_start;
                console.log('Encoding time: '+ duration + 'ms');

                return jpegDataUri
        }

        function setQuality(quality){
            if (quality <= 0) {
                quality = 1;
            }
            if (quality > 100) {
                quality = 100;
            }

            if(currentQuality == quality) return // don't recalc if unchanged

            var sf = 0;
            if (quality < 50) {
                sf = Math.floor(5000 / quality);
            } else {
                sf = Math.floor(200 - quality*2);
            }

            initQuantTables(sf);
            currentQuality = quality;
            console.log('Quality set to: '+quality +'%');
        }

        function init(){
            var time_start = new Date().getTime();
            if(!quality) quality = 50;
            // Create tables
            initCharLookupTable()
            initHuffmanTbl();
            initCategoryNumber();
            initRGBYUVTable();

            setQuality(quality);
            var duration = new Date().getTime() - time_start;
            console.log('Initialization '+ duration + 'ms');
        }

        init();

    };

    /* Example usage. Quality is an int in the range [0, 100]
    function example(quality){
        // Pass in an existing image from the page
        var theImg = document.getElementById('testimage');
        // Use a canvas to extract the raw image data
        var cvs = document.createElement('canvas');
        cvs.width = theImg.width;
        cvs.height = theImg.height;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(theImg,0,0);
        var theImgData = (ctx.getImageData(0, 0, cvs.width, cvs.height));
        // Encode the image and get a URI back, toRaw is false by default
        var jpegURI = encoder.encode(theImgData, quality);
        var img = document.createElement('img');
        img.src = jpegURI;
        document.body.appendChild(img);
    }

    Example usage for getting back raw data and transforming it to a blob.
    Raw data is useful when trying to send an image over XHR or Websocket,
    it uses around 30% less bytes then a Base64 encoded string. It can
    also be useful if you want to save the image to disk using a FileWriter.

    NOTE: The browser you are using must support Blobs
    function example(quality){
        // Pass in an existing image from the page
        var theImg = document.getElementById('testimage');
        // Use a canvas to extract the raw image data
        var cvs = document.createElement('canvas');
        cvs.width = theImg.width;
        cvs.height = theImg.height;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(theImg,0,0);
        var theImgData = (ctx.getImageData(0, 0, cvs.width, cvs.height));
        // Encode the image and get a URI back, set toRaw to true
        var rawData = encoder.encode(theImgData, quality, true);

        blob = new Blob([rawData.buffer], {type: 'image/jpeg'});
        var jpegURI = URL.createObjectURL(blob);

        var img = document.createElement('img');
        img.src = jpegURI;
        document.body.appendChild(img);
    }*/


    /* megapix-image.js for IOS(iphone5+) drawImage画面扭曲修复  */
    // !function(){function a(a){var d,e,b=a.naturalWidth,c=a.naturalHeight;return b*c>1048576?(d=document.createElement("canvas"),d.width=d.height=1,e=d.getContext("2d"),e.drawImage(a,-b+1,0),0===e.getImageData(0,0,1,1).data[3]):!1}function b(a,b,c){var e,f,g,h,i,j,k,d=document.createElement("canvas");for(d.width=1,d.height=c,e=d.getContext("2d"),e.drawImage(a,0,0),f=e.getImageData(0,0,1,c).data,g=0,h=c,i=c;i>g;)j=f[4*(i-1)+3],0===j?h=i:g=i,i=h+g>>1;return k=i/c,0===k?1:k}function c(a,b,c){var e=document.createElement("canvas");return d(a,e,b,c),e.toDataURL("image/jpeg",b.quality||.8)}function d(c,d,f,g){var m,n,o,p,q,r,s,t,u,v,w,h=c.naturalWidth,i=c.naturalHeight,j=f.width,k=f.height,l=d.getContext("2d");for(l.save(),e(d,l,j,k,f.orientation),m=a(c),m&&(h/=2,i/=2),n=1024,o=document.createElement("canvas"),o.width=o.height=n,p=o.getContext("2d"),q=g?b(c,h,i):1,r=Math.ceil(n*j/h),s=Math.ceil(n*k/i/q),t=0,u=0;i>t;){for(v=0,w=0;h>v;)p.clearRect(0,0,n,n),p.drawImage(c,-v,-t),l.drawImage(o,0,0,n,n,w,u,r,s),v+=n,w+=r;t+=n,u+=s}l.restore(),o=p=null}function e(a,b,c,d,e){switch(e){case 5:case 6:case 7:case 8:a.width=d,a.height=c;break;default:a.width=c,a.height=d}switch(e){case 2:b.translate(c,0),b.scale(-1,1);break;case 3:b.translate(c,d),b.rotate(Math.PI);break;case 4:b.translate(0,d),b.scale(1,-1);break;case 5:b.rotate(.5*Math.PI),b.scale(1,-1);break;case 6:b.rotate(.5*Math.PI),b.translate(0,-d);break;case 7:b.rotate(.5*Math.PI),b.translate(c,-d),b.scale(-1,1);break;case 8:b.rotate(-.5*Math.PI),b.translate(-c,0)}}function f(a){var b,c,d;if(window.Blob&&a instanceof Blob){if(b=new Image,c=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null,!c)throw Error("No createObjectURL function found to create blob url");b.src=c.createObjectURL(a),this.blob=a,a=b}a.naturalWidth||a.naturalHeight||(d=this,a.onload=function(){var b,c,a=d.imageLoadListeners;if(a)for(d.imageLoadListeners=null,b=0,c=a.length;c>b;b++)a[b]()},this.imageLoadListeners=[]),this.srcImage=a}f.prototype.render=function(a,b,e){var f,g,h,i,j,k,l,m,n,o,p;if(this.imageLoadListeners)return f=this,this.imageLoadListeners.push(function(){f.render(a,b,e)}),void 0;b=b||{},g=this.srcImage.naturalWidth,h=this.srcImage.naturalHeight,i=b.width,j=b.height,k=b.maxWidth,l=b.maxHeight,m=!this.blob||"image/jpeg"===this.blob.type,i&&!j?j=h*i/g<<0:j&&!i?i=g*j/h<<0:(i=g,j=h),k&&i>k&&(i=k,j=h*i/g<<0),l&&j>l&&(j=l,i=g*j/h<<0),n={width:i,height:j};for(o in b)n[o]=b[o];p=a.tagName.toLowerCase(),"img"===p?a.src=c(this.srcImage,n,m):"canvas"===p&&d(this.srcImage,a,n,m),"function"==typeof this.onrender&&this.onrender(a),e&&e()},"function"==typeof define&&define.amd?define([],function(){return f}):this.MegaPixImage=f}();
    /**
     * Mega pixel image rendering library for iOS6 Safari
     *
     * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
     * which causes unexpected subsampling when drawing it in canvas.
     * By using this library, you can safely render the image with proper stretching.
     *
     * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
     * Released under the MIT license
     */
    (function() {

      /**
       * Detect subsampling in loaded image.
       * In iOS, larger images than 2M pixels may be subsampled in rendering.
       */
      function detectSubsampling(img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
          var canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, -iw + 1, 0);
          // subsampled image becomes half smaller in rendering size.
          // check alpha channel value to confirm image is covering edge pixel or not.
          // if alpha value is 0 image is not covering, hence subsampled.
          return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
        } else {
          return false;
        }
      }

      /**
       * Detecting vertical squash in loaded image.
       * Fixes a bug which squash image vertically while drawing into canvas for some images.
       */
      function detectVerticalSquash(img, iw, ih) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
          var alpha = data[(py - 1) * 4 + 3];
          if (alpha === 0) {
            ey = py;
          } else {
            sy = py;
          }
          py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio===0)?1:ratio;
      }

      /**
       * Rendering image element (with resizing) and get its data URL
       */
      function renderImageToDataURL(img, options, doSquash) {
        var canvas = document.createElement('canvas');
        renderImageToCanvas(img, canvas, options, doSquash);
        return canvas.toDataURL("image/jpeg", options.quality || 0.8);
      }

      /**
       * Rendering image element (with resizing) into the canvas element
       */
      function renderImageToCanvas(img, canvas, options, doSquash) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        if (!(iw+ih)) return;
        var width = options.width, height = options.height;
        var ctx = canvas.getContext('2d');
        ctx.save();
        transformCoordinate(canvas, ctx, width, height, options.orientation);
        var subsampled = detectSubsampling(img);
        if (subsampled) {
          iw /= 2;
          ih /= 2;
        }
        var d = 1024; // size of tiling canvas
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = tmpCanvas.height = d;
        var tmpCtx = tmpCanvas.getContext('2d');
        var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
        var dw = Math.ceil(d * width / iw);
        var dh = Math.ceil(d * height / ih / vertSquashRatio);
        var sy = 0;
        var dy = 0;
        while (sy < ih) {
          var sx = 0;
          var dx = 0;
          while (sx < iw) {
            tmpCtx.clearRect(0, 0, d, d);
            tmpCtx.drawImage(img, -sx, -sy);
            ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
            sx += d;
            dx += dw;
          }
          sy += d;
          dy += dh;
        }
        ctx.restore();
        tmpCanvas = tmpCtx = null;
      }

      /**
       * Transform canvas coordination according to specified frame size and orientation
       * Orientation value is from EXIF tag
       */
      function transformCoordinate(canvas, ctx, width, height, orientation) {
        switch (orientation) {
          case 5:
          case 6:
          case 7:
          case 8:
            canvas.width = height;
            canvas.height = width;
            break;
          default:
            canvas.width = width;
            canvas.height = height;
        }
        switch (orientation) {
          case 2:
            // horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
          case 3:
            // 180 rotate left
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
          case 4:
            // vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
          case 5:
            // vertical flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6:
            // 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;
          case 7:
            // horizontal flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;
          case 8:
            // 90 rotate left
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;
          default:
            break;
        }
      }

      var URL = window.URL && window.URL.createObjectURL ? window.URL :
                window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
                null;

      /**
       * MegaPixImage class
       */
      function MegaPixImage(srcImage) {
        if (window.Blob && srcImage instanceof Blob) {
          if (!URL) { throw Error("No createObjectURL function found to create blob url"); }
          var img = new Image();
          img.src = URL.createObjectURL(srcImage);
          this.blob = srcImage;
          srcImage = img;
        }
        if (!srcImage.naturalWidth && !srcImage.naturalHeight) {
          var _this = this;
          srcImage.onload = srcImage.onerror = function() {
            var listeners = _this.imageLoadListeners;
            if (listeners) {
              _this.imageLoadListeners = null;
              for (var i=0, len=listeners.length; i<len; i++) {
                listeners[i]();
              }
            }
          };
          this.imageLoadListeners = [];
        }
        this.srcImage = srcImage;
      }

      /**
       * Rendering megapix image into specified target element
       */
      MegaPixImage.prototype.render = function(target, options, callback) {
        if (this.imageLoadListeners) {
          var _this = this;
          this.imageLoadListeners.push(function() { _this.render(target, options, callback); });
          return;
        }
        options = options || {};
        var imgWidth = this.srcImage.naturalWidth, imgHeight = this.srcImage.naturalHeight,
            width = options.width, height = options.height,
            maxWidth = options.maxWidth, maxHeight = options.maxHeight,
            doSquash = !this.blob || this.blob.type === 'image/jpeg';
        if (width && !height) {
          height = (imgHeight * width / imgWidth) << 0;
        } else if (height && !width) {
          width = (imgWidth * height / imgHeight) << 0;
        } else {
          width = imgWidth;
          height = imgHeight;
        }
        if (maxWidth && width > maxWidth) {
          width = maxWidth;
          height = (imgHeight * width / imgWidth) << 0;
        }
        if (maxHeight && height > maxHeight) {
          height = maxHeight;
          width = (imgWidth * height / imgHeight) << 0;
        }
        var opt = { width : width, height : height };
        for (var k in options) opt[k] = options[k];

        var tagName = target.tagName.toLowerCase();
        if (tagName === 'img') {
          target.src = renderImageToDataURL(this.srcImage, opt, doSquash);
        } else if (tagName === 'canvas') {
          renderImageToCanvas(this.srcImage, target, opt, doSquash);
        }
        if (typeof this.onrender === 'function') {
          this.onrender(target);
        }
        if (callback) {
          callback();
        }
        if (this.blob) {
          this.blob = null;
          URL.revokeObjectURL(this.srcImage.src);
        }
      };

      /**
       * Export class to global
       */
      if (typeof define === 'function' && define.amd) {
        define([], function() { return MegaPixImage; }); // for AMD loader
      } else if (typeof exports === 'object') {
        module.exports = MegaPixImage; // for CommonJS
      } else {
        this.MegaPixImage = MegaPixImage;
      }

    })();


  }
}


