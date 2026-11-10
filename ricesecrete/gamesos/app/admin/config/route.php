<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

use Webman\Route;

Route::group('/games_admin/v1', function () {
    // 获取语言包
    Route::get('/lang_list', [app\api\controller\v1\IndexController::class, 'lang_list']);
    // 翻译
    Route::get('/translate', [app\api\controller\v1\IndexController::class, 'translate']);
    // 添加未翻译的语言条目
    Route::get('/add_lang', [app\api\controller\v1\IndexController::class, 'add_lang']);
    // 获取配置
    Route::get('/config', [app\api\controller\v1\IndexController::class, 'config']);
    // 测试
    Route::any('/test', [app\api\controller\v1\IndexController::class, 'test']);
    // 首页
    Route::any('/index', [app\api\controller\v1\IndexController::class, 'index']);
    // 首页数据
    Route::any('/index_data', [app\api\controller\v1\IndexController::class, 'index_data']);
    // 上传文件
    Route::any('/upload', [app\api\controller\v1\IndexController::class, 'upload']);
    // 获取内容（公告 文章 ）
    Route::any('/content', [app\api\controller\v1\IndexController::class, 'content']);
    // 获取内容详情
    Route::any('/get_content', [app\api\controller\v1\IndexController::class, 'get_content']);

    // 用户接口
    Route::group('/user', function () {
        // 登录
        Route::post('/login', [app\api\controller\v1\UserController::class, 'login']);
        // 注册
        Route::post('/register', [app\api\controller\v1\UserController::class, 'register']);
        // 发送邮箱验证码
        Route::post('/send_email', [app\api\controller\v1\UserController::class, 'send_email']);
        //校验邮箱验证码
        Route::post('/verify_email_code', [app\api\controller\v1\UserController::class, 'verify_email_code']);
        //重置密码
        Route::post('/reset_password', [app\api\controller\v1\UserController::class, 'reset_password']);
    });
    // 用户接口
    Route::group('/user', function () {
        // 登出登录
        Route::post('/logout', [app\api\controller\v1\UserController::class, 'logout']);
        // 用户信息
        Route::get('/info', [app\api\controller\v1\UserController::class, 'info']);
        // 修改用户信息
        Route::post('/upinfo', [app\api\controller\v1\UserController::class, 'upinfo']);
        // 修改密码
        Route::post('/mod_password', [app\api\controller\v1\UserController::class, 'mod_password']);
        // 修改安全密码
        Route::post('/mod_security_code', [app\api\controller\v1\UserController::class, 'mod_security_code']);
        // 设置语言
        Route::post('/set_lang', [app\api\controller\v1\UserController::class, 'set_lang']);
        // 获取KYC
        Route::get('/get_kyc', [app\api\controller\v1\UserController::class, 'get_kyc']);
        // 上传KYC
        Route::post('/upload_kyc', [app\api\controller\v1\UserController::class, 'upload_kyc']);
        // 获取账单
        Route::get('/bill_list', [app\api\controller\v1\UserController::class, 'bill_list']);

    })->middleware([
        \app\middleware\TokenMiddleware::class
    ]);


    // 消息接口
    Route::group('/message', function () {
        // 获取用户消息
        Route::get('/message_list', [app\api\controller\v1\MessageController::class, 'message_list']);
        // 获取消息
        Route::get('/message_info', [app\api\controller\v1\MessageController::class, 'message_info']);
        //已读消息
        Route::get('/message_read', [app\api\controller\v1\MessageController::class, 'message_read']);
    })->middleware([\app\middleware\TokenMiddleware::class]);

})->middleware([\app\middleware\LanguageMiddleware::class]);

