DAO层使用了Redis缓存对地址暴露接口做了缓存，减少了对MySQL数据库的访问量，提高了高并发情况下的响应速度。
1. 可以使用Redis缓存的原因：地址暴露接口一般是不变的，且会有很多用户要在秒杀时获取该接口，故存在高并发。综合以上两点，该数据适合于放入缓存中，从缓存中获取不到再去MySQL中查找。
2. 缓存一致性通过超时时强制从MySQL数据库同步数据到Redis缓存。