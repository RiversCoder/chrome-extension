
var pluginBoxStr  = `<style type="text/css">
    .captureScreenBox{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;box-sizing:border-box;z-index:9999;border:5px solid green;}
    .captureScreenBox rect{stroke:#eee;stroke-width:2;fill:rgba(112,112,112,0.2);}
    #plugin-body{ width:100%;height:100%;position:relative;}
    .pluginRedBorder{  z-index:9999; box-sizing:border-box !important; border:2px solid red !important;  }
    .pluginBox{  width: 420px;height: 550px;padding:30px 20px 0;position: fixed; border:1px solid #eee; right: 10px;bottom: 10px; background-color: #eee; font-size:15px !important ;box-shadow: 0 0 20px #666;font-family:arial !important;}
    .pluginBox .p-container{ width: 100%;height: 100%;position: relative;  }
    .pluginBox .p-container .container{  padding: 0 !important;width: 100%;}
    .pluginBox .p-container .container .plugin-row{ margin:0 !important;width: 100%; }
    .pluginBox .p-container .container .plugin-row>div{ padding:0 !important; line-height: 60px; text-align: center; color:#666; min-height: 60px; }
    .pluginBox .p-container .container .plugin-row-content>div{ line-height: 30px  }
    .pluginBox .p-container .container .plugin-row .form-input{width:98%;display: inline-block;}
    .pluginBox .p-container .container .plugin-row .plugin-form-textarea{width:98%;display: inline-block;}
    .pluginBox .p-container .pluginShareLink{  position: absolute;right:10px;bottom:10px;color:#333;font-size:13px !important;color: #666; }
    .pluginBox .p-container .container .plugin-row .form-active{ border:1px solid red; }
    .pluginBox .p-container .container .plugin-row .captureBox{ width: 100%;height: 100px;display: flex;flex-wrap: nowrap;justify-content:space-between;align-items:flex-end;}
    .pluginBox .p-container .container .plugin-row .captureBox .imageBox{ width:120px;height:100%;background-color:#ddd;}
    .pluginBox .p-container .container .plugin-row .captureBox .imageBox img{width:100%;height:100%;}
    .pluginBox .p-container .container .plugin-row .captureBox .imageBtn{font-size:12px !important;font-style:normal;cursor:pointer;padding:0px 5px;height:30px;line-height:30px;border:1px solid #333;color:#333 !important;}
    .pluginBox .p-container .container .plugin-row .captureBox .imageBtn:hover{ text-decoration:underline;opacity:.8;}
</style>


<!-- 插件要插入的内容 -->
<div class="pluginBox" id="plugin-app-wrap" v-if="isShow">
    
    <!-- 内容 -->
    <div class="p-container" >
        <div class="container">

           <!-- 设置标题 -->    
           <div class="row plugin-row">
              <div class="col-xs-2">标题</div>
              <div class="col-xs-10">
                <input type="text" :class="['form-control form-input form-input-title',focusInputIndex=='title'?'form-active':'']" placeholder="请输入标题内容" v-model="inputData.title" @focus="focusFn('title')" />
              </div>   
           </div>
           <!-- 设置副标题 -->   
           <div class="row plugin-row">
              <div class="col-xs-2">
                 副标题
              </div>   
              <div class="col-xs-10">
                <input type="text" :class="['form-control form-input form-input-title',focusInputIndex=='subTitle'?'form-active':'']" placeholder="请输入副标题内容" v-model="inputData.subTitle" @focus="focusFn('subTitle')"/>
              </div>
           </div>
           <!-- 设置内容 -->    
           <div class="row plugin-row plugin-row-content">
              <div class="col-xs-2">
                 内容
              </div>  
              <div class="col-xs-10">
                <textarea :class="['form-control plugin-form-textarea',focusInputIndex=='content'?'form-active':'']" rows="6" v-model="inputData.content" @focus="focusFn('content')"></textarea>
              </div>
           </div>
           <!-- 设置截屏 -->
           <div class="row plugin-row plugin-row-content">
              <div class="col-xs-2">
                 截屏
              </div>  
              <div class="col-xs-10">
                <div class="captureBox">
                  <div class="imageBox">
                    <img :src="defaultImage" alt="" title="" class="captureImg" />
                  </div>
                  <span class="imageBtn" @click="windowCapture">窗口截屏</span>
                  <span class="imageBtn" @click="webCapture">网页截屏</span>
                  <span class="imageBtn" @click="areaCapture">区域截屏</span>
                </div>
              </div>
           </div>
           <!-- 设置按钮 -->    
           <div class="row plugin-row">
              <div class="col-xs-2">
                 
              </div>  
              <div class="col-xs-10">

                <button type="button" class="btn btn-secondary" @click="cancelText">取消</button>
                <button type="button" class="btn btn-secondary" @click="catchText">抓取</button>
                <button type="button" class="btn btn-secondary" @click="downImage">下载</button>
                <button type="button" class="btn btn-warning" @click="resetText">重置</button>
                <button type="button" class="btn btn-primary" @click="submitText">提交</button>
              </div>
           </div>
        </div>

        <!-- blog share link -->
        <a class="pluginShareLink" href="http://blog.sina.com.cn/riversfrog" target="_blank" > 小青蛙博客 >> </a>

    </div>

</div>`;

var app = null;
$(document).ready(function(){
    
    var strHTML = $('body').html();
    $('body').html(`<div id="plugin-body">${strHTML}</div>`);

    //插入元素
    $('body').append(pluginBoxStr);

    //使用vue数据绑定DOM
    app = new Vue({
      el: '#plugin-app-wrap',
      data: {
        inputData:{
            title: '这是大标题',
            subTitle: '这是副标题',
            content: '注意在 reverseMessage 方法中，我们更新了应用的状态，但没有触碰 DOM——所有的 DOM 操作都由 Vue 来处理，你编写的代码只需要关注逻辑层面即可。'
        },
        overfn: null,
        focusInputIndex: '',
        defaultImage: './images/pic2.jpg',
        tab: null,
        isShow: true
      },
      created(){
        this.init();
      },
      mounted(){

      },
      methods: {
        //初始化相关方法及数据
        init(){
           this.getTab();
        },
        getTab(){
          chrome.runtime.sendMessage({event:'getTab',value:''},(tab)=>{
            this.tab = tab;
          });
        },
        focusFn(index){
            this.focusInputIndex = index;
        },
        cancelText(){
            var elems = $('#plugin-body').get(0).getElementsByTagName('*');
            
            for(var i=0;i<elems.length;i++){
                elems[i].index = i;
                elems[i].classList.remove('pluginRedBorder');
                elems[i].onmouseover = null;
            }
        },
        catchText(){
            this.getAllTags();
        },
        resetText(){
            this.inputData.title = '';
            this.inputData.subTitle = '';
            this.inputData.content = '';
        },
        submitText(){
          chrome.storage.local.set({iptData: this.inputData}, function() {
            chrome.storage.local.get(['iptData'], function(result) {
              console.log(result);
            });
          });
        },
        getAllTags(){
            var elems = $('#plugin-body').get(0).getElementsByTagName('*');
            $('a').removeAttr("href");

            for(var i=0;i<elems.length;i++){

                elems[i].addEventListener('mousedown',(e)=>{
                    if(this.focusInputIndex)
                        this.inputData[this.focusInputIndex] = e.target.innerText;
                    e.stopPropagation();
                    e.cancelBubble = true;
                })

                elems[i].addEventListener('mouseup',(e)=>{
                    this.cancelText();
                    e.stopPropagation();
                    e.cancelBubble = true;
                })

                elems[i].index = i;
                elems[i].onmouseover = function(e){
                    
                    // 插件边框
                    for(var j=0;j<elems.length;j++){
                        if(elems[j] == this){
                            continue;
                        }
                        elems[j].classList.remove('pluginRedBorder');
                    }
                    
                    // 添加样式
                    this.classList.add('pluginRedBorder');
                    e.stopPropagation();
                    e.cancelBubble = true;
                };
            }
        },
        //窗口捕获
        windowCapture(){
          this.isShow = false;
          setTimeout(()=>{
            chrome.runtime.sendMessage({event:'windowCapture',value:''},(data)=>{
               this.defaultImage = data;
               this.isShow = true;
            });
          },200);
        },
        //网页截屏
        webCapture(){
          this.isShow = false;

          var pageSize = {
              scrollHeight: document.body.scrollHeight,
              scrollWidth: document.body.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              clientHeight: document.documentElement.clientHeight
          };

          //接收移动页面通知
          chrome.runtime.onMessage.addListener(function(message, sender, resCallback){
            switch(message.event){
              case 'scrollBy':
                window.scrollBy(message.value.x,message.value.y);
                break;
              case 'scrollTo':
                window.scrollTo(message.value.x,message.value.y);
              default:
                break;
            }
            resCallback({status:true});
          })

          //发送捕获
          setTimeout(()=>{
            chrome.runtime.sendMessage({event:'webCapture',value:pageSize},(data)=>{
              this.defaultImage = data;
              var image = new Image();
              image.src = data;
              image.onload = function(){
                $('body').append(this);
              }
              this.isShow = true;
            });
          },200);
        },
        //区域截屏
        areaCapture(){
          var that = this;
          this.isShow = false;
          var pageSize = {
              clientWidth: document.documentElement.clientWidth,
              clientHeight: document.documentElement.clientHeight,
              x:0,
              y:0,
              width:0,
              height:0
          };
          var xmlns = 'http://www.w3.org/2000/svg';
          var dom = document.createElementNS(xmlns,'svg');
          var rect = document.createElementNS(xmlns,'rect');
          
          dom.setAttribute('class','captureScreenBox');
          dom.setAttribute('width',pageSize.clientWidth);
          dom.setAttribute('height',pageSize.clientHeight);
          dom.setAttribute('viewBox',`0 0 ${pageSize.clientWidth} ${pageSize.clientHeight}`);
          dom.setAttribute('xmlns',xmlns);
          $(dom).append(rect);

          //点击拖拽自定义选区
          $(dom).on('mousedown',(e)=>{
            var x1 = e.clientX;
            var y1 = e.clientY;
            var x2 = 0;
            var y2 = 0;
            rect.setAttribute('x',x1);
            rect.setAttribute('y',y1);
            

            $(dom).on('mousemove',(e)=>{
              x2 = e.clientX;
              y2 = e.clientY;
              rect.setAttribute('width',Math.abs(x1-x2));
              rect.setAttribute('height',Math.abs(y1-y2));
              pageSize = Object.assign({},pageSize,{x:x1,y:y1,width:Math.abs(x1-x2),height:Math.abs(y1-y2)})
            });

            $(dom).on('mouseup',(e)=>{
              sendMessage();
              $(dom).hide();
              $(dom).off();
            })
          });


          //发出生成图片的通知
          function sendMessage(){
            chrome.runtime.sendMessage({event:'areaCapture',value:pageSize},(data)=>{
              that.defaultImage = data;
              var image = new Image();
              image.src = data;
              image.onload = function(){
                $('body').append(this);
              }
              that.isShow = true;
            });
          }

          $('body').append(dom);   
        },
        //下载图片
        downImage(){
          if(!this.defaultImage)
             return;
          var link = document.createElement('a');
          link.download = 'download.png';
          link.href = this.defaultImage;
          link.click();
        }
      }
    });

});



