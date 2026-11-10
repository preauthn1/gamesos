<?php


namespace app\services;


use app\model\chat\ChatMessageModel;
use app\model\chat\ChatModel;
use app\model\shop\ShopInfoModel;
use app\model\user\UserModel;
use GatewayWorker\Lib\Gateway;
use support\Cache;

class ChatServices
{
    // 定义缓存的key名称 前缀 组合起来：chat_list_id_会话ID_service_id_服务ID
    const CHAT_LIST_PREFIX_ = 'chat_list';
    // 定义缓存的key名称 前缀 组合起来：chat_list_out_
    const CHAT_LIST_OUT_PREFIX_ = 'chat_list_out';
    // 定义缓存的key名称 前缀 组合起来：cache_key_service_shop_info_服务ID_店铺ID
    const CHAT_JOIN_KEY_PREFIX_ = 'chat_join';
    // 定义缓存的key名称 前缀 组合起来：cache_key_service_status_服务ID_用户ID
    const CHAT_STATUS_KEY_PREFIX_ = 'chat_status';
    // 定义缓存的key名称 前缀 组合起来：cache_key_service_id_list_服务ID
    const CHAT_ID_LIST_KEY_PREFIX_ = 'chat_id_list';
    // 定义缓存的key名称 前缀 组合起来：cache_key_service_id_unread_服务ID_用户ID
    const CHAT_UNREAD_KEY_PREFIX_ = 'chat_unread';

    // 定义缓存的key名称 前缀 组合起来：cache_key_service_shop_info_服务
    const CHAT_SHOP_INFO = 'shop_info';
    // 缓存的key名称 前缀 组合起来：cache_key_service_user_info_服务ID_用户ID
    const CHAT_USER_INFO = 'user_info';

    // 定义用户返回字段
    const USER_RETURN_FIELD = 'id,nickname,avatar,username';
    // 客服返回字段
    const SERVICE_RETURN_FIELD = 'id,shop_name,logo,phone,name';

    /**
     * 用户加入聊天室
     * @param $sender_id
     * @param $sender_type
     * @param $data
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function join($sender_id, $sender_type, $data)
    {
//        $data = [
//            'user_id' => '',//商家加入会话列表  sender_type service
//            'service_id' => '',//用户加入会话列表 sender_type user
//        ];
        //首次加入聊天组
        if ($sender_type == 'user') {
            $user_id = $sender_id;
            $service_id = $data['service_id'];
        } else {
            $user_id = $data['user_id'];
            $service_id = $sender_id;
        }
        //创建会话
        $chat_data = self::create($service_id, $user_id);
        //刷新会话状态
        self::setChatStatus($sender_id, $sender_type, 1);
        //刷新会话列表
        self::updateConversation($service_id, $user_id);
        return $chat_data;
    }

    /**
     * 用户离开聊天室
     * @param $sender_id
     * @param $sender_type
     * @param $chat_id
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function leave($sender_id, $sender_type)
    {
        self::setChatStatus($sender_id, $sender_type, 0);
    }

    /**
     * 获取消息列表
     * @param $sender_id
     * @param $sender_type
     * @param $data
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function getMessageList($sender_id, $sender_type, $data)
    {
        $chat_id = isset($data['chat_id']) ? $data['chat_id'] : 0;
        $limit = isset($data['limit']) ? $data['limit'] : 10;
        $page = isset($data['page']) ? $data['page'] : 1;
        $chat_data = self::getChat($chat_id);
        if (!$chat_data) {
            return [
                'code' => 1,
                'msg' => '会话不存在'
            ];
        }
        if ($sender_type == 'user') {
            if ($sender_id != $chat_data['user_id']) {
                return [
                    'code' => 1,
                    'msg' => '无权限'
                ];
            }
        } else {
            if ($sender_id != $chat_data['service_id']) {
                return [
                    'code' => 1,
                    'msg' => '无权限'
                ];
            }
        }
        $where = [];
        $where[] = ['chat_id', '=', $chat_id];
        $field = '*';
        $query = ChatMessageModel::where($where)->field($field)->order('id desc');
        $offset = ($page - 1) * $limit;
        // 使用 limit 和 offset
        $items = $query->limit($offset, $limit)->select()->toArray();
        $items = array_reverse($items);
        $total = $query->count();
        return [
            'code' => 0,
            'data' => [
                'total' => $total,
                'items' => $items
            ],
        ];
    }

    /**
     * 获取店铺信息
     * @param $service_id
     * @return array|mixed
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    private static function getServiceInfo($service_id)
    {
        $key = self::CHAT_SHOP_INFO . $service_id;
        $redis = Cache::store('redis');
        $temp = $redis->get($key);
        if ($temp) {
            return json_decode($temp, true);
        }
        $shop_info = ShopInfoModel::where("id", $service_id)->field(self::SERVICE_RETURN_FIELD)->find()->toArray();
        $redis->set($key, json_encode($shop_info), 7200);
        return $shop_info;
    }

    /**
     * 获取用户信息
     * @param $user_id
     * @return array|mixed
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    private static function getUserInfo($user_id)
    {
        $key = self::CHAT_USER_INFO . $user_id;
        $redis = Cache::store('redis');
        $temp = $redis->get($key);
        if ($temp) {
            return json_decode($temp, true);
        }
        $user_info = UserModel::where("id", $user_id)->field(self::USER_RETURN_FIELD)->find()->toArray();
        $redis->set($key, json_encode($user_info), 7200);
        return $user_info;
    }

    /**
     * 获取用户未读消息
     * @param $chat_id
     * @param $sender_id
     * @param $sender_type
     * @return int|mixed
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    private static function getChatUnread($chat_id, $sender_type)
    {
        $key = self::CHAT_UNREAD_KEY_PREFIX_ . "_" . $sender_type . "_" . $chat_id;
        $redis = Cache::store('redis');
        $temp = $redis->get($key);
        if ($temp) {
            return $temp;
        }
        $where[] = ['sender_type', '=', $sender_type];
        $where[] = ['chat_id', '=', $chat_id];
        $where[] = ['is_read', '=', 0];
        $unread = ChatMessageModel::where($where)->count();
//        print_r("getChatUnread" . $key);
        $redis->set($key, $unread, 3600 * 24 * 7);
        return $unread;
    }

    /**
     * 消息标记已读
     * @param $chat_id
     * @param $sender_type
     * @return bool
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function updateChatUnread($chat_id, $sender_type)
    {
        $sender_type = $sender_type == 'user' ? 'service' : 'user';
        $key = self::CHAT_UNREAD_KEY_PREFIX_ . "_" . $sender_type . "_" . $chat_id;
        $redis = Cache::store('redis');
        $redis->set($key, 0, 3600 * 24 * 7);
        $where[] = ['sender_type', '=', $sender_type];
        $where[] = ['chat_id', '=', $chat_id];
        $where[] = ['is_read', '=', 0];
        ChatMessageModel::where($where)->update([
            'is_read' => 1
        ]);
        $chat_data = self::getChat($chat_id);
        $user_id = $chat_data['user_id'];
        $service_id = $chat_data['service_id'];
        self::updateConversation($service_id, $user_id);
        return true;
    }

    /**
     * 更新未读消息
     * @param $chat_id
     * @param $sender_type
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    private static function updateUnreadMessage($chat_id, $sender_type)
    {
        $key = self::CHAT_UNREAD_KEY_PREFIX_ . "_" . $sender_type . "_" . $chat_id;
        $redis = Cache::store('redis');
        $unread_temp = $redis->get($key);
        if (empty($unread_temp)) {
            $unread_temp = 0;
        }
        $redis->set($key, $unread_temp + 1, 3600 * 24 * 7);
    }

    /**
     * 获取客服会话列表
     * @param $service_id
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function getChatService($service_id)
    {
        $redis = Cache::store('redis');
        $key = self::CHAT_LIST_OUT_PREFIX_ . "_service_" . $service_id;
        $temp = $redis->get($key);
        $list_arr = [];
        if ($temp) {
            $list = json_decode($temp, true);
            foreach ($list as $item) {
                $item['user_status'] = self::getChatStatus($item['user_id'], 'user');
                $item['unread'] = self::getChatUnread($item['id'], 'user');
                $item['user_info'] = self::getUserInfo($item['user_id']);
                $list_arr[] = $item;
            }
            return $list_arr;
        }
        $where[] = ['service_id', '=', $service_id];
        $list = ChatModel::where($where)->order('updated_at desc')->select()->toArray();

        foreach ($list as $item) {
            $item['user_status'] = self::getChatStatus($item['user_id'], 'user');
            $item['unread'] = self::getChatUnread($item['id'], 'user');
            $item['user_info'] = self::getUserInfo($item['user_id']);
            $list_arr[] = $item;
        }
        $redis->set($key, json_encode($list_arr), 7200);
        return $list_arr;
    }

    /**
     * 获取客服会话列表
     * @param $service_id
     * @param $is_cache
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    private static function getChatServiceTemp($service_id, $is_cache = true)
    {
        $redis = Cache::store('redis');
        $key = self::CHAT_LIST_PREFIX_ . "_service_" . $service_id;
        $temp = $redis->get($key);
        if ($temp && $is_cache) {
            return json_decode($temp, true);
        }
        $where[] = ['service_id', '=', $service_id];
        $list = ChatModel::where($where)->select()->toArray();
        $list_arr = [];
        foreach ($list as $item) {
            $item['user_status'] = self::getChatStatus($item['user_id'], 'user');
            $item['unread'] = self::getChatUnread($item['id'], 'user');
            $item['user_info'] = self::getUserInfo($item['user_id']);
            $list_arr[$item['service_id'] . "_" . $item['user_id']] = $item;
        }
        $redis->set($key, json_encode($list_arr), 7200);
        return $list_arr;
    }

    /**
     * 获取用户会话列表
     * @param $user_id
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function getChatUser($user_id)
    {
        $key = self::CHAT_LIST_OUT_PREFIX_ . "_user_" . $user_id;
        $redis = Cache::store('redis');
        $temp = $redis->get($key);
        $list_arr = [];
        if ($temp) {
            $list = json_decode($temp, true);
            foreach ($list as $item) {
                $item['service_status'] = self::getChatStatus($item['service_id'], 'service');
                $item['unread'] = self::getChatUnread($item['id'], 'service');
                $item['service_info'] = self::getServiceInfo($item['service_id']);
                $list_arr[] = $item;
            }
            return $list_arr;
        }
        $where[] = ['user_id', '=', $user_id];
        $list = ChatModel::where($where)->order('updated_at desc')->select()->toArray();
        foreach ($list as $item) {
            $item['service_status'] = self::getChatStatus($item['service_id'], 'service');
            $item['unread'] = self::getChatUnread($item['id'], 'service');
            $item['service_info'] = self::getServiceInfo($item['service_id']);
            $list_arr[] = $item;
        }
        $redis->set($key, json_encode($list_arr), 7200);
        return $list_arr;
    }

    /**
     * 获取用户会话列表
     * @param $user_id
     * @param $is_cache
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    private static function getChatUserTemp($user_id, $is_cache = true)
    {
        $key = self::CHAT_LIST_PREFIX_ . "_user_" . $user_id;
        $redis = Cache::store('redis');
        $temp = $redis->get($key);
        if ($temp && $is_cache) {
            return json_decode($temp, true);
        }
        $where[] = ['user_id', '=', $user_id];
        $list = ChatModel::where($where)->select()->toArray();
        $list_arr = [];
        foreach ($list as $item) {
            $item['service_status'] = self::getChatStatus($item['service_id'], 'service');
            $item['unread'] = self::getChatUnread($item['id'], 'service');
            $item['service_info'] = self::getServiceInfo($item['service_id']);
            $list_arr[$item['service_id'] . "_" . $item['user_id']] = $item;
        }
        $redis->set($key, json_encode($list_arr), 7200);
        return $list_arr;
    }

    /**
     * 创建会话
     * @param $service_id
     * @param $user_id
     * @return ChatModel|array|mixed|\think\model\contract\Modelable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    private static function create($service_id, $user_id)
    {
        $where = [
            'service_id' => $service_id,
            'user_id' => $user_id
        ];
        $redis = Cache::store('redis');
        $key = self::CHAT_JOIN_KEY_PREFIX_ . $service_id . "_" . $user_id;
        $chat = $redis->get($key);
        if ($chat) {
            return json_decode($chat, true);
        }
        $chat = ChatModel::where($where)->find();
        if (!$chat) {
            $data = [
                'service_id' => $service_id,
                'user_id' => $user_id,
                'last_message' => '',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            $chat_id = ChatModel::insertGetId($data);
            if ($chat_id) {
                $out_data = [
                    'chat_id' => $chat_id,
                    'service_id' => $service_id,
                    'user_id' => $user_id
                ];
                $redis->set($key, json_encode($out_data), 7200);
                $key_chat = self::CHAT_ID_LIST_KEY_PREFIX_ . $chat_id;
                $redis->set($key_chat, json_encode($out_data), 7200);
                return $out_data;
            }
        }
        $out_data = [
            'chat_id' => $chat->id,
            'service_id' => $service_id,
            'user_id' => $user_id
        ];
        $redis->set($key, json_encode($out_data), 7200);
        $key_chat = self::CHAT_ID_LIST_KEY_PREFIX_ . $chat->id;
        $redis->set($key_chat, json_encode($out_data), 7200);
        return $out_data;
    }

    /**
     * 发送消息
     * @param $sender_id
     * @param $sender_type
     * @param $data
     * @return false
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function sendMessage($sender_id, $sender_type, $data)
    {
        $chat_id = isset($data['chat_id']) ? $data['chat_id'] : 0;
        if (empty($chat_id)) {
            return false;
        }
        // 保存消息到数据库
        $message = ChatMessageModel::create([
            'chat_id' => $chat_id,
            'sender_id' => $sender_id,
            'sender_type' => $sender_type, // user/service
            'content' => $data['content'],
            'is_read' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        $message_arr = $message->toArray();
        // 更新会话
        self::updateChat($chat_id, $sender_type, $message_arr);
        // 广播消息
        self::sendChatMessage($chat_id, [
            'type' => 'msg',
            'data' => $message_arr
        ]);
    }

    /**
     * 更新会话最后一条消息
     * @param $chat_id
     * @param $sender_type
     * @param $data
     * @return ChatModel|array|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function updateChat($chat_id, $sender_type, $data)
    {
        $last_message = json_encode($data);
        $chat = ChatModel::where('id', $chat_id)->find();
        if ($chat) {
            $chat->last_message = $last_message;
            $chat->updated_at = date('Y-m-d H:i:s');
            $chat->save();
            //更新未读消息
            self::updateUnreadMessage($chat_id, $sender_type);
            // 更新会话列表缓存
            self::updateChatCache([
                'id' => $chat_id,
                'user_id' => $chat->user_id,
                'service_id' => $chat->service_id,
                'last_message' => $last_message,
                'unread' => $chat->unread,
                'created_at' => $chat->created_at,
                'updated_at' => $chat->updated_at,
            ]);
            return $chat;
        }
        return [];
    }

    /**
     * 更新会话状态
     * @param $chat
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function updateChatCache($chat)
    {
        $service_list = self::getChatServiceTemp($chat['service_id']);
        //$item['service_status'] = self::getChatStatus($item['service_id'], 'service');
        //            $item['unread'] = self::getChatUnread($item['id'], $item['service_id'], 'service');
        //            $item['service_info'] = self::getServiceInfo($item['service_id']);
        //`id` bigint NOT NULL AUTO_INCREMENT,
        //  `user_id` bigint NOT NULL,
        //  `service_id` bigint DEFAULT NULL COMMENT '客服ID，店铺ID',
        //  `last_message` text COLLATE utf8mb4_general_ci COMMENT '会话最后一条消息',
        //  `unread` int DEFAULT '0' COMMENT '未读消息条数',
        //  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        //  `updated_at` datetime DEFAULT NULL,
        $service_list[$chat['service_id'] . "_" . $chat['user_id']] = [
            'id' => $chat['id'],
            'user_id' => $chat['user_id'],
            'service_id' => $chat['service_id'],
            'last_message' => $chat['last_message'],
            'unread' => self::getChatUnread($chat['id'], 'user'),
            'created_at' => $chat['created_at'],
            'updated_at' => $chat['updated_at'],
            'user_info' => self::getUserInfo($chat['user_id'])
        ];
        $redis = Cache::store('redis');
        $service_key = self::CHAT_LIST_PREFIX_ . "_service_" . $chat['service_id'];
        $service_out_key = self::CHAT_LIST_OUT_PREFIX_ . "_service_" . $chat['service_id'];
        //去除 $service_list 的键
        $service_list_arr = array_values($service_list);
        $service_out_list = self::timeSortList($service_list_arr);
//        print_r($service_out_list);
        $redis->set($service_out_key, json_encode($service_out_list), 7200);
        $redis->set($service_key, json_encode($service_list), 7200);

        $user_list = self::getChatUserTemp($chat['user_id']);
        $user_list[$chat['service_id'] . "_" . $chat['user_id']] = [
            'id' => $chat['id'],
            'user_id' => $chat['user_id'],
            'service_id' => $chat['service_id'],
            'last_message' => $chat['last_message'],
            'unread' => self::getChatUnread($chat['id'], 'service'),
            'created_at' => $chat['created_at'],
            'updated_at' => $chat['updated_at'],
            'service_info' => self::getServiceInfo($chat['service_id'])
        ];
        $user_key = self::CHAT_LIST_PREFIX_ . "_user_" . $chat['user_id'];
        $user_out_key = self::CHAT_LIST_OUT_PREFIX_ . "_user_" . $chat['user_id'];
        //去除 $user_list 的键
        $user_list_arr = array_values($user_list);
        $user_out_list = self::timeSortList($user_list_arr);
//        print_r($user_out_list);
        $redis->set($user_out_key, json_encode($user_out_list), 7200);
        $redis->set($user_key, json_encode($user_list), 7200);
    }

    /**
     * 获取会话状态 1在线 0离线
     * @param $user_id
     * @param string $sender_type
     * @return int
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    public static function getChatStatus($user_id, $sender_type = 'user')
    {
        $key = self::CHAT_STATUS_KEY_PREFIX_ . "_" . $sender_type . "_" . $user_id;
        $redis = Cache::store('redis');
        $status = $redis->get($key);
        if (!empty($status)) {
            return 1;
        }
        return 0;
    }

    /**
     * 设置会话状态
     * @param $user_id
     * @param string $sender_type
     * @param int $status
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    public static function setChatStatus($user_id, $sender_type = 'user', $status = 1)
    {
        $key = self::CHAT_STATUS_KEY_PREFIX_ . "_" . $sender_type . "_" . $user_id;
        $redis = Cache::store('redis');
        $redis->set($key, $status, 60);
    }

    /**
     * 时间排序
     * @param $list
     * @return mixed
     */
    public static function timeSortList($list)
    {
        usort($list, function ($a, $b) {
            return strtotime($a['updated_at']) - strtotime($b['updated_at']);
        });
        return $list;
    }

    /**
     * 广播消息
     * @param $chat_id
     * @param $data
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function sendChatMessage($chat_id, $data)
    {
        $key_chat = self::CHAT_ID_LIST_KEY_PREFIX_ . $chat_id;
        $redis = Cache::store('redis');
        $chat_group = $redis->get($key_chat);
        $service_id = 0;
        $user_id = 0;
        if ($chat_group) {
            $chat_group = json_decode($chat_group, true);
            $service_id = $chat_group['service_id'];
            $user_id = $chat_group['user_id'];
        } else {
            $chat = ChatModel::where('id', $chat_id)->find();
            if ($chat) {
                $service_id = $chat['service_id'];
                $user_id = $chat['user_id'];
            }
        }
        $user_id_str = "user_" . $user_id;
        $service_id_str = "service_" . $service_id;

        $data_str = json_encode($data);
        // 推送消息
        Gateway::sendToUid($user_id_str, $data_str);
        Gateway::sendToUid($service_id_str, $data_str);
        //刷新会话列表
        self::updateConversation($service_id, $user_id);
    }

    /**
     * 更新会话列表
     * @param $service_id
     * @param $user_id
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function updateConversation($service_id, $user_id)
    {
        if (!empty($service_id)) {
            $service_id_str = "service_" . $service_id;
            $service_list = self::getChatService($service_id);
            $data_service_str = json_encode([
                'type' => 'conversation',
                'data' => $service_list
            ]);
            Gateway::sendToUid($service_id_str, $data_service_str);
        }
        if (!empty($user_id)) {
            $user_id_str = "user_" . $user_id;
            $user_list = self::getChatUser($user_id);
            $data_user_str = json_encode([
                'type' => 'conversation',
                'data' => $user_list
            ]);
            Gateway::sendToUid($user_id_str, $data_user_str);
        }
    }

    /**
     * 获取会话
     * @param $chat_id
     * @return array
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function getChat($chat_id)
    {
        $key_chat = self::CHAT_ID_LIST_KEY_PREFIX_ . $chat_id;
        $redis = Cache::store('redis');
        $chat_group = $redis->get($key_chat);
        $service_id = 0;
        $user_id = 0;
        if ($chat_group) {
            $chat_group = json_decode($chat_group, true);
            $service_id = $chat_group['service_id'];
            $user_id = $chat_group['user_id'];
        } else {
            $chat = ChatModel::where('id', $chat_id)->find();
            if ($chat) {
                $service_id = $chat['service_id'];
                $user_id = $chat['user_id'];
            }
        }
        return [
            'chat_id' => $chat_id,
            'service_id' => $service_id,
            'user_id' => $user_id
        ];
    }
}