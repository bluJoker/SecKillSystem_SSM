package org.seckill.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.seckill.dto.Exposer;
import org.seckill.dto.SeckillExecution;
import org.seckill.entity.Seckill;
import org.seckill.exception.RepeatKillException;
import org.seckill.exception.SeckillCloseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({
        "classpath:spring/spring-dao.xml",
        "classpath:spring/spring-service.xml"})
public class SeckillServiceTest {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SeckillService seckillService;

    @Test
    public void getSeckillList() {
        List<Seckill> seckills = seckillService.getSeckillList();
        logger.info("List={}", seckills);
    }

    @Test
    public void getSeckillById() {
        long id = 1000;
        Seckill seckill = seckillService.getSeckillById(id);
        logger.info("seckill = {}", seckill);
    }

//    @Test
//    public void exportSeckillUrl() {
//        long id = 1006;
//        Exposer exposer = seckillService.exportSeckillUrl(id);
//        logger.info("exposer={}", exposer);
//
//        /**
//         * exposer=Exposer{exposed=true, md5='33bdb4f1e3f0faaa9872415a8e9ac4c1', seckillId=1006, now=0, start=0, end=0}
//         * */
//    }
//
//    @Test
//    public void executeSeckill() {
//        long id = 1006;
//        long phone = 13107121240l;
//        String md5 = "33bdb4f1e3f0faaa9872415a8e9ac4c1";
//        SeckillExecution execution = seckillService.executeSeckill(id, phone, md5);
//        logger.info("execution={}", execution);
//
//        /**
//         * execution=SeckillExecution{
//         * seckillId=1006, state=1, stateInfo='秒杀成功',
//         * successKilled=SuccessKilled{seckillId=1006, userPhone=13107121240,
//         * state=0, createTime=Wed Apr 01 09:45:55 CST 2020}}*/
//    }

    @Test
    public void exportSeckillLogic() {
        long id = 1031;
        Exposer exposer = seckillService.exportSeckillUrl(id);
        if (exposer.isExposed()) {
            logger.info("exposer={}", exposer);

            long phone = 13207121240l;
            String md5 = exposer.getMd5();
            try {
                SeckillExecution execution = seckillService.executeSeckill(id, phone, md5);
                logger.info("execution={}", execution);
            } catch (RepeatKillException e) {
                logger.error(e.getMessage());
            } catch (SeckillCloseException e) {
                logger.error(e.getMessage());
            }
        } else {
            logger.warn("exposer={}", exposer);
        }
    }

    @Test
    public void executeSeckillProcedure() {
        long id = 1031;
        long phone = 13207121240l;
        Exposer exposer = seckillService.exportSeckillUrl(id);
        if (exposer.isExposed()) {
            String md5 = exposer.getMd5();
            SeckillExecution execution = seckillService.executeSeckillProcedure(id, phone, md5);
            logger.info(execution.getStateInfo());
        }

    }
}