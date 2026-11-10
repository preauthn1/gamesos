<?php

return [
    'default' => env('DEFAULT_DB', 'mysql'),
    'connections' => [
        'mysql' => [
            // 数据库类型
            'type' => env('DB_TYPE', 'mysql'),
            // 服务器地址
            'hostname' => env('DB_HOST', '127.0.0.1'),
            // 数据库名
            'database' => env('DB_DATABASE', 'webman'),
            // 数据库用户名
            'username' => env('DB_USERNAME', 'root'),
            // 数据库密码
            'password' => env('DB_PASSWORD', '123456'),
            // 数据库连接端口
            'hostport' => env('DB_PORT', '3306'),
            // 数据库连接参数
            'params' => [
                // 连接超时3秒
                \PDO::ATTR_TIMEOUT => 3,
            ],
            // 数据库编码默认采用utf8
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            // 数据库表前缀
            'prefix' => '',
            // 断线重连
            'break_reconnect' => true,
            // 连接池配置
            'pool' => [
                'max_connections' => 50, // 最大连接数
                'min_connections' => 5, // 最小连接数
                'wait_timeout' => 3,    // 从连接池获取连接等待超时时间
                'idle_timeout' => 60,   // 连接最大空闲时间，超过该时间会被回收
                'heartbeat_interval' => 50, // 心跳检测间隔，需要小于60秒
            ],
        ],
        // 新增的 PostgreSQL 配置
        'pgsql' => [
            // 数据库类型
            'type' => env('PGSQL_TYPE', 'pgsql'),
            // 服务器地址
            'hostname' => env('PGSQL_HOST', '127.0.0.1'),
            // 数据库名
            'database' => env('PGSQL_DATABASE', 'overseas'),
            // 数据库用户名
            'username' => env('PGSQL_USERNAME', 'postgres'),
            // 数据库密码
            'password' => env('PGSQL_PASSWORD', ''),
            // 数据库连接端口
            'hostport' => env('PGSQL_PORT', '5432'),
            // 数据库模式
            'schema' => 'public',
            // 数据库ssl
            'sslmode' => 'prefer',
            // 数据库连接参数
            'params' => [
                // 连接超时3秒
                \PDO::ATTR_TIMEOUT => 3,
            ],
            // 数据库编码默认采用utf8
            'charset' => env('PGSQL_CHARSET', 'utf8'),
            // 数据库表前缀
            'prefix' => '',
            // 断线重连
            'break_reconnect' => true,
            'fields_strict' => false,
            'schema_cache_path' => runtime_path('schema'),
            // 连接池配置
            'pool' => [
                'max_connections' => 50, // 最大连接数
                'min_connections' => 5, // 最小连接数
                'wait_timeout' => 3,    // 从连接池获取连接等待超时时间
                'idle_timeout' => 60,   // 连接最大空闲时间，超过该时间会被回收
                'heartbeat_interval' => 50, // 心跳检测间隔，需要小于60秒
            ],
        ],
    ],
    // 自定义分页类
    'paginator' => '',
];
