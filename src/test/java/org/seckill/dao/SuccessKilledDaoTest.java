package org.seckill.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.seckill.entity.SuccessKilled;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

import static org.junit.Assert.*;

/**
 * 配置spring和junit整合, junit启动时加载springIoC容器*/
@RunWith(SpringJUnit4ClassRunner.class)

//告诉junit spring配置文件
@ContextConfiguration({"classpath:spring/spring-dao.xml"})
public class SuccessKilledDaoTest {
    //@Resource默认按byName自动注入
    @Resource
    private SuccessKilledDao successKilledDao;
    
    
    @Test
    public void insertSuccessKilled() {

        //第一次：insertCount = 1
        //第二次：insertCount = 0
        // 因为联合主键：PRIMARY KEY (seckill_id, user_phone)
        long id = 1001L;
        long phone = 13007121240L;
        int insertCount = successKilledDao.insertSuccessKilled(id, phone);
        System.out.println("insertCount = " + insertCount);
    }

    @Test
    public void queryByIdWithSeckill() {
        long id = 1001L;
        long phone = 13007121240L;
        SuccessKilled successKilled = successKilledDao.queryByIdWithSeckill(id, phone);
        System.out.println("successKilled = " + successKilled);
        System.out.println("successKilled.getSeckill() = " + successKilled.getSeckill());
    }
}