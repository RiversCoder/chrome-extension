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
        default:
            callback({code:0})
            break;
    }
    return true;
});


function getImageRequest({str,loadIndex},callback){
    var per = 30;
    var ctotal = loadIndex * per;
    console.log(ctotal)
    var url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%93%86%E5%95%A6a%E6%A2%A6&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word='+str+'&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn='+ctotal+'&rn='+per;
    fetch(url).then((response)=>(response.json())).then((data)=>{
        callback(data);
    }).catch((error)=>{
        console.log(error);
    });
}