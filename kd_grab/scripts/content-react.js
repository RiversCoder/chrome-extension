const content_script = `

<section class="WebSubscriptionWrap">

<!-- 网情订阅APP扩展内容盒子 -->
<div class="WebSubscription" id="WebSubscription">
    <!-- 人工补录 -->
    <div class="ws-supplement" id="ws-supplement"></div>
</div>


<!-- 网情订阅APP扩展样式 -->


<!-- 资源引入 -->
<script src="https://lib.baomitu.com/react/16.4.2/cjs/react.production.min.js"></script>
<script src="https://cdn.bootcss.com/react-dom/16.4.0/umd/react-dom.development.js"></script>
<script src="https://cdn.bootcss.com/babel-standalone/6.26.0/babel.min.js"></script>
<script src="https://lib.baomitu.com/antd/3.9.3/antd.js"></script>

<!-- 操作框架 -->
<script type="text/babel">
    
    const provinceOptions  = ['Zhejiang', 'Jiangsu'];

    // 人工补录组件
    class Supplement extends React.Component{

        //构造方法
        constructor(props){
            alert('123321');
            super(props);
            this.state = {
                inputSpans: [6,13,2], 
                inputs: this.props.inputs
            };
        }

        inputOnChange(id,value){
            this.setState({
                inputs: this.state.inputs.map(v=>{
                    if(v.id == id){
                        v.content = value;
                    }
                    return v;
                })
            });
        }

        //表单输入赋值
        handleChange(v1){
            
            let args = arguments;
            
            switch(v1.type){
                case 'textarea':
                case 'radio':
                case 'input':
                    this.inputOnChange(v1.id,args[1].target.value);
                    break;
                case 'time':
                    this.inputOnChange(v1.id,args[1]);
                    break;
                case 'select':
                    this.inputOnChange(v1.id,args[1].toString());
                    break;
                default:
                 break;
            }
        }

        //点击提交按钮
        submitWS(){
            console.log(this.state.inputs);
            console.log('提交数据');
        }

        //点击抓取按钮
        grabInfo(v){
            //绑定抓取事件
            this.grabEvent(v);
            console.log(v);
        }

        //绑定抓取事件
        grabEvent(v){
            let This  = this;
            //清除所有样式
            function removeAllClass(){
                $('*').each(function(){
                    $(this).removeClass('ws-grab-class');
                })
            }

            $('*').on('mouseover',function(e){

                //清除所有
                removeAllClass();
                //添加样式
                $(this).addClass('ws-grab-class');

                $(this).on('click',function(e){
                    This.inputOnChange(v.id,$(this).text());
                    removeAllClass();
                    $("*").off();

                    //取消默认事件
                    e.preventDefault();
                    return false;
                });

                //取消冒泡
                e.cancelBubble = true;
                e.stopPropagation();
            });

            $('#WebSubscription').find('*').on('mouseover',function(e){
                $(this).removeClass('ws-grab-class');
            })
        }

        //结构渲染
        render() {

            return (
              <div>
                <h3 className="wss-title"></h3>
                { this.state.inputs.map((v,index)=>{
                    return (<antd.Row key={index}>
                      <antd.Col span={this.state.inputSpans[0]} className="wss-line-title-box">
                        <span className="wss-line-title" size={'small'}>{v.required ? (<i className="titleSpan">*</i>) : ''} {v.name}</span>
                      </antd.Col>
                      <antd.Col span={this.state.inputSpans[1]}>
                        {v.type === 'input' ? (<antd.Input placeholder="请输入内容"  value={v.content}  onChange={this.handleChange.bind(this,v)}/>) : ''}
                        {v.type === 'textarea' ? (<textarea className="wss-line-textarea" value={v.content}  onChange={this.handleChange.bind(this,v)}></textarea>) : ''}
                        {v.type === 'time' ? (<antd.DatePicker showTime="YYYY-MM-dd HH:mm:ss" format="YYYY-MM-dd HH:mm:ss" placeholder="选择时间"  value={v.content} onChange={this.handleChange.bind(this,v)} />) : ''}
                        {v.type === 'select' ? (<antd.Select style={{ width: 200 }} placeholder={'选择'+v.name}  defaultValue="新闻" value={v.content} onChange={this.handleChange.bind(this,v)} >
                            {v.contents.map(v1=>(<antd.Select.Option value={v1} key={v1}>{v1}</antd.Select.Option>))}
                        </antd.Select>) : ''}
                        {v.type === 'radio' ? (<antd.Radio.Group name="radiogroup" defaultValue={'正面'} value={v.content} onChange={this.handleChange.bind(this,v)}>
                            {v.contents.map(v1=>(<antd.Radio key={v1} value={v1}>{v1}</antd.Radio>))}
                        </antd.Radio.Group>) : '' }
                        {v.type === 'button' ? (<antd.Button type="primary" className="submitBtn" onClick={this.submitWS.bind(this)}>{v.content}</antd.Button>) : ''}
                      </antd.Col>
                      <antd.Col span={this.state.inputSpans[2]} className="wss-line-btn-box">
                        {v.grab ? (<antd.Button type="primary" size={'small'} onClick={this.grabInfo.bind(this,v)}>抓取</antd.Button>) : ''}
                      </antd.Col>
                    </antd.Row>)
                }) }
              </div>
            );
        }
    }

    function tick() {
      ReactDOM.render(
        <Supplement inputs={ws_inputData} />,
        document.getElementById('ws-supplement')
      );
    }
    tick();
</script>

</section>

`;



$(document).ready(function(){
    $('body').append(content_script);
})