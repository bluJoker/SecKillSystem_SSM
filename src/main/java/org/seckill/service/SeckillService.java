package org.seckill.service;

import org.seckill.dto.Exposer;
import org.seckill.dto.SeckillExecution;
import org.seckill.entity.Seckill;
import org.seckill.exception.RepeatKillException;
import org.seckill.exception.SeckillCloseException;
import org.seckill.exception.SeckillException;

import java.util.List;

public interface SeckillService {
//    列表页：查询所有秒杀记录
    List<Seckill> getSeckillList();

//    查询某条秒杀记录
    Seckill getSeckillById(long seckillId);

//    秒杀开启时输出秒杀接口地址，否则输出系统时间和秒杀时间
    Exposer exportSeckillUrl(long seckillId);

//    执行秒杀操作，md5用来进行秒杀验证，如果验证不通过，说明用户的url被篡改了
    SeckillExecution executeSeckill(long seckillId, long userPhone, String md5)
    throws SeckillException, RepeatKillException, SeckillCloseException;


    // 使用存储过程执行秒杀操作，此时不需要异常，因为不通过异常来回滚
    SeckillExecution executeSeckillProcedure(long seckillId, long userPhone, String md5);
}
