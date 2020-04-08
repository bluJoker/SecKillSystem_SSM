//存放主要交互逻辑js代码
// javascript模块化
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
        node.hide()
        .html('<button calss="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
        $.post(seckill.URL.exposer(seckillId), {}, function(result){
            if(result && result['success']){
                var exposer = result['data'];
                if(exposer['exposed']){
                    var md5 = exposer['md5'];
                    var killUrl = seckill.URL.execution(seckillId, md5);
                    console.log("killUrl: " + killUrl);
                    //  只绑定一次点击事件
                    $('#killBtn').one('click', function(){
                        $(this).addClass('disabled');
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

    countdown: function(seckillId, nowTime, startTime, endTime){
        var seckillBox = $('#seckill-box');
        if(nowTime > endTime){
            // 秒杀结束
            seckillBox.html('秒杀结束！');
        }else if(nowTime < startTime){
            var killTime = new Date(startTime + 1000);
            seckillBox.countdown(killTime, function(event){
                var format = event.strftime('秒杀倒计时：%D天 %H时 %M分 %S秒');
                seckillBox.html(format);
            }).on('finish.countdown', function(){
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
            var killPhone = $.cookie('killPhone');
            var startTime = params['startTime'];
            var endTime = params['endTime'];
            var seckillId = params['seckillId'];

            if(!seckill.validatePhone(killPhone)){
                var killPhoneModal = $('#killPhoneModal');
                killPhoneModal.modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
                });

                $('#killPhoneBtn').click(function(){
                    var inputPhone = $('#killPhoneKey').val();
                    console.log("inputPhone=" + inputPhone); //TODO
                    if(seckill.validatePhone(inputPhone)){
                        $.cookie('killPhone', inputPhone, {expires:7, path:'/seckill'});
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
                    seckill.countdown(seckillId, nowTime, startTime, endTime);
                }else{
                    console.log('result1=' + result);
                }
            });
        }
    }
}