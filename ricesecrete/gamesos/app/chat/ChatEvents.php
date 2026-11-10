<?php


namespace app\chat;

use app\services\ChatServices;
use app\services\ShopServices;
use app\services\UserServices;
use GatewayWorker\Lib\Gateway;

class ChatEvents
{
    //链接地址ws://127.0.0.1:7272/?token=kjxdvjkasfh&type=user
    //加入聊天组
    const MESSAGE_TYPE_JOIN = 'join';
    //离开聊天组
    const MESSAGE_TYPE_LEAVE = 'leave';
    //发送消息
    const MESSAGE_TYPE_SEND = 'msg';
    //获取聊天列表
    const MESSAGE_TYPE_MSG_LIST = 'msg_list';
    //获取会话列表
    const MESSAGE_TYPE_CONVERSATION = 'conversation';
    //标记已读消息
    const MESSAGE_TYPE_MARK_READ = 'mark_read';
    //心跳
    const MESSAGE_TYPE_PING = 'heartbeat';

    public static $client_id_uid = [];
    /**
     * 消息数据
     * @var array
     */
    public static $message_data = [
        'type' => 'join',// 通讯类型
        'data' => [
            'chat_id' => '',//聊天组id
            'content_type' => '',//消息类型 text:文字 img:图片 file:文件 url:链接 goods:商品
            'content' => '',//消息内容 具体内容
            'sender_id' => '',//发送用户id
            'sender_type' => '',//接收者类型 user:用户 service:服务
            'user_id' => '',//加入聊天组用户id  sender_type service
            'service_id' => '',//加入聊天组服务id sender_type user
        ],
    ];

    /**
     * 消息类型
     * @var string[]
     */
    public $MESSAGE_TYPE = [
        self::MESSAGE_TYPE_JOIN,//加入
        self::MESSAGE_TYPE_LEAVE,//离开
        self::MESSAGE_TYPE_SEND,//发送
        self::MESSAGE_TYPE_MSG_LIST,//获取聊天列表
        self::MESSAGE_TYPE_CONVERSATION,//获取会话列表
        self::MESSAGE_TYPE_MARK_READ,//标记已读消息
    ];

    public static function onWorkerStart($worker)
    {
        // 启动时初始化
    }

    public static function onConnect($client_id)
    {
        // 当客户端连接时触发
    }

    public static function onWebSocketConnect($client_id, $data)
    {
//        var_export($data);
        // 当客户端连接时触发
        $accessToken = $data['get']['token'];
        $type = $data['get']['type'];
        if (empty($accessToken) || empty($type)) {
            Gateway::closeClient($client_id);
            return;
        }
        $data_token = null;
        if ($type == 'user') {
            $data_token = UserServices::checkToken($accessToken);
            if ($data_token['code'] == 0) {
                Gateway::bindUid($client_id, "user_" . $data_token['data']);
                self::$client_id_uid[$client_id] = "user_" . $data_token['data'];
                ChatServices::setChatStatus($data_token['data'], 'user', 1);
            } else {
                Gateway::sendToClient($client_id, json_encode(['type' => 'error', 'data' => 'token_error']));
                sleep(2);
                Gateway::closeClient($client_id);
            }
        } else {
            $data_token = ShopServices::checkToken($accessToken);
            if ($data_token['code'] == 0) {
                Gateway::bindUid($client_id, "service_" . $data_token['data']);
                self::$client_id_uid[$client_id] = "service_" . $data_token['data'];
                ChatServices::setChatStatus($data_token['data'], 'service', 1);
            } else {
                Gateway::sendToClient($client_id, json_encode(['type' => 'error', 'data' => 'token_error']));
                sleep(2);
                Gateway::closeClient($client_id);
            }
        }
//        var_export($data_token);
    }

    public static function onMessage($client_id, $message_str)
    {
        //消息类型定义
        $message = json_decode($message_str, true);
        if ($message['type'] == self::MESSAGE_TYPE_PING) {
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            ChatServices::setChatStatus($sender_id, $sender_type, 1);
            Gateway::sendToClient($client_id, json_encode(['type' => 'pong', 'data' => 'pong']));
            return;
        }
        if ($message['type'] == self::MESSAGE_TYPE_SEND) {
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            //发送消息
            ChatServices::sendMessage($sender_id, $sender_type, $message['data']);
        } else if ($message['type'] == self::MESSAGE_TYPE_JOIN) {
            //加入聊天组
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            $chat_data = ChatServices::join($sender_id, $sender_type, $message['data']);
            Gateway::sendToClient($client_id, json_encode(['type' => 'join', 'data' => $chat_data]));
        } else if ($message['type'] == self::MESSAGE_TYPE_LEAVE) {
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            //离开聊天组
            ChatServices::leave($sender_id, $sender_type);
        } else if ($message['type'] == self::MESSAGE_TYPE_MSG_LIST) {
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            $chat_list = ChatServices::getMessageList($sender_id, $sender_type, $message['data']);
            if ($chat_list['code'] == 0) {
                Gateway::sendToClient($client_id, json_encode(['type' => 'msg_list', 'data' => $chat_list['data']]));
            } else {
                Gateway::sendToClient($client_id, json_encode(['type' => 'msg_list', 'data' => []]));
            }
        } else if ($message['type'] == self::MESSAGE_TYPE_CONVERSATION) {
            //获取会话列表
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
            if ($sender_type == 'user') {
                ChatServices::updateConversation('', $sender_id);
            } else {
                ChatServices::updateConversation($sender_id, '');
            }
        } else if ($message['type'] == self::MESSAGE_TYPE_MARK_READ) {
            //标记已读消息
            $sender_id_str = Gateway::getUidByClientId($client_id);
            $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
            $chat_id = isset($message['data']['chat_id']) ? $message['data']['chat_id'] : '';
            if (!empty($chat_id)) {
                ChatServices::updateChatUnread($chat_id, $sender_type);
            }
        }

    }

    public static function onClose($client_id)
    {
//        print_r("onClose_client_id:" . $client_id);
        $sender_id_str = self::$client_id_uid[$client_id];
        $sender_type = substr($sender_id_str, 0, strpos($sender_id_str, '_'));
        $sender_id = substr($sender_id_str, strpos($sender_id_str, '_') + 1);
        unset(self::$client_id_uid[$client_id]);
        // 当客户端断开连接时触发
        ChatServices::leave($sender_id, $sender_type);
    }
}