//存放主要交互逻辑js代码
// javascript模块化

// 通过var创建seckill的json对象
var seckill={
    // 封装秒杀相关ajax的url
    URL : {
        now : function(){
            return '/seckill/time/now';
        },
        exposer : function(seckillId){
            return '/seckill/' + seckillId + '/exposer';
        },
        execution : function(seckillId, md5){
            return '/seckill/' + seckillId + '/' + md5 + '/execution';
        }
    },

    validatePhone: function(phone){
        if(phone && phone.length == 11 && !isNaN(phone)){
            return true;
        }else{
            return false;
        }
    },

    // 处理秒杀逻辑
    handleSeckillkill: function(seckillId, node){
        // 所有控制结点的操作都需要在操作内容之前隐藏一下，why?
        node.hide()
        .html('<button calss="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
        $.post(seckill.URL.exposer(seckillId), {}, function(result){
            if(result && result['success']){
                var exposer = result['data'];

                // 判断是否开启秒杀
                if(exposer['exposed']){
                    var md5 = exposer['md5'];

                    // 获取秒杀地址
                    var killUrl = seckill.URL.execution(seckillId, md5);
                    console.log("killUrl: " + killUrl);

                    //  只绑定一次点击事件：执行秒杀操作
                    $('#killBtn').one('click', function(){

                        // 1. 先禁用按钮，按钮变灰
                        $(this).addClass('disabled');

                        // 2. 发送秒杀请求
                        $.post(killUrl, {}, function(result){
                            if(result && result['success']){
                                var killResult = result['data'];
                                var state = killResult['state'];
                                var stateInfo = killResult['stateInfo'];
                                node.html('<span class="label label-success">' + stateInfo + '</span>');
                            }
                        });
                    });
                    node.show();

                }else{
                    var now = exposer['now'];
                    var start = exposer['start'];
                    var end = exposer['end'];
                    //seckill.countdown(seckillId, now, start, end);
                }
            }else{
                console.log('result=' + result);
            }
        });
    },

    seckillCountdown: function(seckillId, nowTime, startTime, endTime){
        var seckillBox = $('#seckill-box');
        if(nowTime > endTime){
            // 秒杀结束
            seckillBox.html('秒杀结束！');
        }else if(nowTime < startTime){
            // 秒杀未开始，倒计时
            var killTime = new Date(startTime + 1000);  // 加1秒，防止用户事件偏移
            // jQuery的countdown插件：以killTime做基准时间，每一次时间变化都会调用function的回调函数
            seckillBox.countdown(killTime, function(event){
                // 时间变化时，按format做输出
                var format = event.strftime('秒杀倒计时：%D天 %H时 %M分 %S秒');
                // 将format的输出显示到seckillBox的span标签中
                seckillBox.html(format);
            }).on('finish.countdown', function(){     // 倒计时完成后回调事件：获取秒杀地址，控制现实逻辑，执行秒杀
                seckill.handleSeckillkill(seckillId, seckillBox);
            });
        }else{
            console.log("start seckill");
            seckill.handleSeckillkill(seckillId, seckillBox);
        }
    },

    // 详情页秒杀逻辑
    detail: {
        // 详情页初始化
        init : function(params){

            // 使用jQuery的cookie插件从http的cookie信息中找到名为killphone的cookie
            var killPhone = $.cookie('killPhone');
            // 取出从detail.jsp中传入的参数（放在params中）
            var startTime = params['startTime'];
            var endTime = params['endTime'];
            var seckillId = params['seckillId'];

            if(!seckill.validatePhone(killPhone)){
                // 通过jQuery的选择器找到名为killPhoneModal的弹出层结点
                var killPhoneModal = $('#killPhoneModal');

                // 控制输出，因为detail.jsp的killPhoneModal默认是隐藏的（class="modal fade"）
                // 此时要显示出来
                killPhoneModal.modal({
                    show: true,             // 显示弹出层
                    backdrop: 'static',     // 禁止位置关闭
                    keyboard: false         // 禁止键盘事件关闭
                });

                // 为弹出层做点击事件绑定
                $('#killPhoneBtn').click(function(){
                    // 拿到killPhoneKey对应text中填写的手机号值
                    var inputPhone = $('#killPhoneKey').val();
                    console.log("inputPhone=" + inputPhone); //TODO
                    if(seckill.validatePhone(inputPhone)){
                        //手机写入cookie，设置cookie有效期7天；设置cookie路径，只在/seckill下有效
                        $.cookie('killPhone', inputPhone, {expires:7, path:'/seckill'});
                        // 登录成功(写入手机号)后刷新页面，继续从86行init : function(params)开始走
                        window.location.reload();
                    }else{
                       $('#killPhoneMessage').hide().html('<label class="label label-danger">手机号错误!</label>').show(300);
                    }
                });
            }

            // 已经登录
            // 计时交互
            $.get(seckill.URL.now(), {}, function(result){
                if(result && result['success']){
                    var nowTime = result['data'];
                    seckill.seckillCountdown(seckillId, nowTime, startTime, endTime);
                }else{
                    console.log('result1=' + result);
                }
            });
        }
    }
}