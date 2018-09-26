//表单渲染
var ws_inputData = [
    { id:0, name: '专题ID', content: '', type: 'input', required:true,grab: true},
    { id:1, name: '人工干预时间', content: moment().format("YYYY-MM-DD"), type: 'input', required:true,grab: false},
    { id:2, name: '标题', content: '', type: 'input', required:true, grab: true},
    { id:4, name: '作者', content: '', type: 'input', required:true, grab: true},
    { id:5, name: '网站来源', content: '', type: 'input', required:true, grab: true},
    { id:6, name: '网站发表时间', content: moment().format("YYYY-MM-DD HH:mm:ss"), type: 'time', required:true,grab: false},
    { id:7, name: '正文', content:'', type: 'textarea', required:true, grab: true},
    { id:8, name: '情感色彩',contents: ['正面','负面','中立'], content:'正面', type: 'radio', required:true, grab: false},
    { id:9, name: '关联信息', content: '', type: 'input', required:false,grab: true},
    { id:10, name: '关联信息', content: '', type: 'input', required:false,grab: true},
    { id:11, name: '关联信息', content: '', type: 'input', required:false,grab: true},
    { id:12, name: '',content: '提交', type: 'button', required:false,grab: false}
];

