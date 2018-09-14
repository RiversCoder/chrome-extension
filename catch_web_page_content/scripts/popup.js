// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function click(e) {
  console.log(this.children[0].src);
  //chrome.tabs.executeScript(null,{code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  //window.close();
  chrome.tabs.executeScript(null,{
    code: `document.body.style.background = "url(${this.children[0].src}) no-repeat cover" `
  });
  console.log(`document.body.style.background = "url('${this.children[0].src}') no-repeat cover" `);
}

// Popup类
class Popup{

  //构造函数  
  constructor(){
    this.loadOnoff = true;
    this.loadIndex = 1;
    this.str = '';
    this.init();
  }

  //初始化函数
  init(){
    //初始化事件
    this.initEvent();
  }

  //初始化事件
  initEvent(){
    var that = this;
    
    //绑定事件
    $(document).ready(function(){
      
      //回车
      $('#searchContent').keydown(function(e){
        switch(e.keyCode){
            case 13 : 
                $('.content-wrap').html('');
                that.sendEvent('getImage',$('#searchContent').val());
                break;
            default:
                break;
        }
      })  

      //点击设置背景图片
      $('.searchBtn').click(function(){
        $('.content-wrap').html('');
        that.sendEvent('getImage',$('#searchContent').val());
      });
      
      //监听滚动
      $('.img-container').scroll(function(e){
        var maxHeight = $('.content-wrap').height() - $(this).height();
        if(Math.abs(this.scrollTop - maxHeight) < 30){
            console.log(that.loadOnoff);
            if(that.loadOnoff){
                that.loadIndex++;
                that.sendEvent('getImage',$('#searchContent').val())
                that.loadOnoff = false;
            }
        }
      });

    });

  }

  //发送消息通知
  sendEvent(event,message){
    chrome.runtime.sendMessage({event: event, value: message, loadIndex: this.loadIndex},(response)=>{
      this.showDomImage(response.data);
    });
  }

  //设置DOM显示
  showDomImage(data){
    this.str = $('.content-wrap').html();
    data.map(v=>{
        if(v.thumbURL)
            this.str += ` <li class="cw-box" data-url="${v.middleURL}"><img src="${v.thumbURL}" class="cw-box-img" title="${v.fromPageTitle.replace(/<\/?[^>]*>/g,'')}" /></li>`;
    });
    $('.content-wrap').html(this.str);
    this.setBodyBackgroundImage();
    this.loadOnoff = true;
  }

  //设置背景图片
  setBodyBackgroundImage(){
    $('.cw-box').click(function(){
       console.log(this.dataset.url);
        chrome.tabs.executeScript(null,{
          code: ` 
            document.body.style.backgroundImage = "url(${this.dataset.url})";
            document.body.style.backgroundRepeat = "repeat";
            document.body.style.backgroundPosition = "0 0";
            document.body.style.backgroundSize = "contain";  
          `
        });
    })
  }
}

new Popup();
