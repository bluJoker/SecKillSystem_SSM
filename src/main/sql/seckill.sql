-- 秒杀执行存储过程
DELIMITER //

CREATE PROCEDURE execute_seckill(
    IN v_seckill_id bigint,
    IN v_phone bigint,
    IN v_kill_time timestamp,
    OUT r_result int
)
BEGIN
    DECLARE insert_count int default 0;
    start transaction;
    insert ignore into success_killed
        (seckill_id, user_phone, create_time)
        values (v_seckill_id, v_phone, v_kill_time);
    select row_count() into insert_count;
    IF (insert_count = 0) THEN
        ROLLBACK;
        SET r_result = -1;
    ELSEIF (insert_count < 0) THEN
        ROLLBACK;
        SET r_result = -2;
    ELSE
        update seckill
        set number = number-1
        where seckill_id = v_seckill_id
            and start_time < v_kill_time
            and end_time > v_kill_time
            and number > 0;
        select row_count() into insert_count;
        IF (insert_count = 0) THEN
                ROLLBACK;
                SET r_result = 0;
        ELSEIF (insert_count < 0) THEN
            ROLLBACK;
            SET r_result = -2;
        ELSE
            COMMIT;
            set r_result = 1;
        END IF;
    END IF;
END //
DELIMITER ;

-- 调用存储过程
SET @r_result = -3;
CALL execute_seckill(1031, 13502178891, now(), @r_result);

-- 打印存储过程
SELECT @r_result；