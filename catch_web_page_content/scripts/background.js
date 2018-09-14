let currentTab = null;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    //检测message信息
    switch(request.event)
    {
        case 'getImage':
        //console.log(request.value+request.event);
            getImageRequest({str:request.value,loadIndex:request.loadIndex},(data)=>{
                console.log(data);
                callback(data);
            });
            break;
        case 'getTab':
            chrome.tabs.query({active:true,currentWindow:true},(tab)=>{
                currentTab = tab[0];
                callback(tab[0]);
            })
            break;
        case 'windowCapture':
            chrome.tabs.captureVisibleTab({ format: 'png', quality: 100},(dataUrl)=>{
                callback(dataUrl);
            });
            break;
        case 'webCapture':
            new WebCapture(request.value,callback);
            break;
        case 'areaCapture':
            new AreaCapture(request.value,callback);
            break;          
        default:
            callback({code:0})
            break;
    }
    return true;
});

/* 百度图片搜索 */
function getImageRequest({str,loadIndex},callback){
    var per = 30;
    var ctotal = loadIndex * per;
    var url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%93%86%E5%95%A6a%E6%A2%A6&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word='+str+'&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn='+ctotal+'&rn='+per;
    fetch(url).then((response)=>(response.json())).then((data)=>{
        callback(data);
    }).catch((error)=>{
        console.log(error);
    });
}



/* 自定义区域捕捉 */

function AreaCapture(v,callback){
   
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.cw = v.clientWidth;
    this.ch = v.clientHeight;
    this.vw = v.width;
    this.vh = v.height;
    this.offsetX = v.x;
    this.offsetY = v.y; 
    this.tabId = 0;
    this.screenData = '';
    this.captureImgData = '';
    this.callback = callback;

    //初始化相关函数
    this.init();
}

AreaCapture.prototype = {
    constructor: AreaCapture,
    //初始化方法
    init(){
        //1. 初始化获取tabId
        this.getTabId();
        //2. 获取当前tab页面的宽高且初始化canvas的宽高
        this.initWH();
    },
    //获取tabId
    getTabId(){
        chrome.tabs.getSelected((tab)=>{
            this.tabId = tab.id;
            this.captureWebPage();
        })
    },
    //初始化canvas的宽高
    initWH(){
        this.canvas.width = this.vw;
        this.canvas.height = this.vh;
    },
    //将当前窗口内容转换成 image Data
    captureWebPage(){
        chrome.tabs.captureVisibleTab((data)=>{
            this.screenData = data;
            //分阶段绘制canvas
            this.drawImage();
        })
    },
    //往Canvas中填充图片
    drawImage(){
        let img = new Image();
        img.src = this.screenData;

        img.onload = ()=>{
            this.ctx.drawImage(img,this.offsetX,this.offsetY,this.vw,this.vh,0,0,this.vw,this.vh);
            this.getImage();
        };
        
    },
    //获取到最终的图片
    getImage(){
        this.captureImgData = this.canvas.toDataURL('image/png');
        this.callback(this.captureImgData);
    }
}




/* 全页面捕捉 */

function WebCapture(v,callback){
   
    this.currentY = 0;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sw = v.scrollWidth;
    this.sh = v.scrollHeight;
    this.cw = v.clientWidth;
    this.ch = v.clientHeight;
    this.tabId = 0;
    this.screenData = '';
    this.captureImgData = '';
    this.callback = callback;

    //初始化相关函数
    this.init();
}

WebCapture.prototype = {
    constructor: WebCapture,
    //初始化方法
    init(){
        //1. 初始化获取tabId
        this.getTabId();
        //2. 获取当前tab页面的宽高且初始化canvas的宽高
        this.initWH();
    },
    //获取tabId
    getTabId(){
        chrome.tabs.getSelected((tab)=>{
            this.tabId = tab.id;
            //3. 初始化页面位置移动到顶部
            this.initPagePosition();
        })
    },
    //初始化canvas的宽高
    initWH(){
        this.canvas.width = this.sw;
        this.canvas.height = this.sh;
    },
    //初始化页面位置移动到顶部
    initPagePosition(){
        this.scrollPage('scrollTo',0,0);
    },
    //向Tab页面发出跳转通知
    scrollPage(event,x,y){
        chrome.tabs.sendMessage(this.tabId,{event,value:{x,y}},(res)=>{
            if(res.status){
                //执行绘制
                setTimeout(()=>{
                    this.captureWebPage();
                },1000);
            }
        })
    },
    //将当前窗口内容转换成 image Data
    captureWebPage(){
        chrome.tabs.captureVisibleTab((data)=>{
            this.screenData = data;
            //分阶段绘制canvas
            this.drawImage();
        })
    },
    //往Canvas中填充图片
    drawImage(){
        let img = new Image();
        img.src = this.screenData;

        img.onload = ()=>{
            //绘制到最底部
            if(this.currentY + this.ch >= this.sh){
                let lastHeight = this.ch - this.sh % this.ch;
                let y = 0;
                if(this.currentY == 0){
                    y = 0;
                }else{
                    y = this.currentY - lastHeight;
                }
                this.ctx.drawImage(img,0,0,this.cw,this.ch,0,y,this.cw,this.ch);
                this.getImage();
            }else{ //还没有绘制到最底部
                this.ctx.drawImage(img,0,0,this.cw,this.ch,0,this.currentY,this.cw,this.ch);
                this.currentY += this.ch;
                this.scrollPage('scrollBy',0,this.currentY);
            }   
        };
        
    },
    //获取到最终的图片
    getImage(){
        this.captureImgData = this.canvas.toDataURL('image/png');
        this.callback(this.captureImgData);
    }
}


