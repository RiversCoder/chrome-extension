// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({number: 1}, function() {
    console.log('The number is set to 1.');
  });
});

function updateIcon() {

  chrome.notifications.create(
    Math.random()+'',  // id
    {
      type: 'list',
      iconUrl: 'img2.jpg',
      appIconMaskUrl: 'img.jpg',
      title: '通知主标题',
      message: '通知副标题',
      contextMessage: '好开心呀，终于会使用谷歌扩展里面的API了！', 
      buttons: [{title:'按钮1的标题',iconUrl:'icon3.png'},{title:'按钮2的标题',iconUrl:'icon4.png'}],
      items: [{title:'消息1',message: '今天天气真好！'},{title:'消息2',message: '明天天气估计也不错！'}],
      eventTime: Date.now() + 2000
    },
    (id)=>{
      console.log(id);
    }    
  );

  chrome.storage.sync.get('number', function(data) {
    var current = data.number;
    chrome.browserAction.setIcon({path: 'icon' + current + '.png'});
    current++;
    if (current > 5)
      current = 1;
    chrome.storage.sync.set({number: current}, function() {
      console.log('The number is set to ' + current);
    });
  });
};

chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon();
