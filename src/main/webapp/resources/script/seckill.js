//存放主要交互逻辑js代码
// javascript模块化
var seckill={
    // 封装秒杀相关ajax的url
    URL : {
        now : function(){
            return '/seckill/time/now';
        }
    },

    validatePhone: function(phone){
        if(phone && phone.length == 11 && !isNaN(phone)){
            return true;
        }else{
            return false;
        }
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
            });
        }else{

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