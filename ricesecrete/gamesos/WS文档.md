# WebSocket 接口文档
## 连接地址
## wss://chatoverseas.mvoag.com/?token=用户token&type=user
## type  有 user 与 service

############################### 加入聊天组##################################
json
{
    "type": "join",
    "data": {
		"user_id": 123, //用户id 如果是商户主动发起聊天 需要user_id
		"service_id": 323 //店铺id  如果是用户主动发起聊天 需要service_id
    }
}
#返回数据
json
{
    "type": "join",
    "data": {
		"chat_id": "1",
		"service_id": 28,
		"user_id": "12"
    }
}
#返回会话列表数据
json
{
    "type": "conversation",
    "data": [
    {
        "id": 1,
        "user_id": "12",
        "service_id": "28",
        "last_message":"{\"chat_id\":\"1\",\"sender_id\":\"28\",\"sender_type\":\"service\",\"content\":\"{\\\"type\\\":\\\"text\\\",\\\"data\\\":\\\"\你\好122\\\"}\",\"is_read\":0,\"created_at\":\"2025-11-11 20:24:35\",\"id\":\"39\"}",
        "unread": 1,
        "created_at": "2025-11-11 16:55:59",
        "updated_at": "2025-11-11 20:24:35",
        "service_info": {
        "id": 28,
        "shop_name": "香港跨境电商",
        "logo": "https://ushee.s3.amazonaws.com/hkxa/upload/files/2025-10-11/19ea70680f9a6100acdc58db91386f918aa80aaf.png",
        "phone": "18888888888",
        "name": "874487732@qq.com"
        },
        "service_status": 1
    }
    ]
}
############################### 加入聊天组end ##################################

###############################离开聊天组###############################
json
{
    "type": "leave",
    "data": {}
}

会断开ws
###############################离开聊天组end###############################

###############################获取聊天记录###############################
json
{
    "type": "msg_list",
    "data": {
		"chat_id": 1, //聊天组id
		"page": 1//页码
		"limit": 10//分页条数
    }
}

#返回消息列表
json
{
    "type": "msg_list",
    "data": {
        "total": 39,
        "items": [
            {
                "id": "1",
                "chat_id": "1",
                "sender_id": "12",
                "sender_type": "user",
                "content": "{\"type\":\"text\",\"data\":\"你好\"}",
                "is_read": 0,
                "created_at": "2025-11-11 16:55:59"
            },
            {
                "id": "2",
                "chat_id": "1",
                "sender_id": "28",
                "sender_type": "service",
                "content": "{\"type\":\"text\",\"data\":\"你好\"}",
                "is_read": 1,
                "created_at": "2025-11-11 18:07:19"
            },
            {
                "id": "3",
                "chat_id": "1",
                "sender_id": "28",
                "sender_type": "service",
                "content": "{\"type\":\"text\",\"data\":\"你好\"}",
                "is_read": 1,
                "created_at": "2025-11-11 18:17:55"
            },
            {
                "id": "4",
                "chat_id": "1",
                "sender_id": "28",
                "sender_type": "service",
                "content": "{\"type\":\"text\",\"data\":\"你好\"}",
                "is_read": 1,
                "created_at": "2025-11-11 18:23:27"
            },
            {
                "id": "5",
                "chat_id": "1",
                "sender_id": "28",
                "sender_type": "service",
                "content": "{\"type\":\"text\",\"data\":\"你好\"}",
                "is_read": 1,
                "created_at": "2025-11-11 18:25:26"
            }
        ]
    }
}

###############################获取聊天记录end###############################

###############################发送消息###############################
json
{
	"type": "msg",
	"data": {
		"chat_id": 1, //聊天组id
		"content": "{\"type\":\"text\",\"data\":\"你好\"}"
	}
}
content  里面的消息类型 自定义  text img file url 等

#自己发送会收到对应消息

#端都会更新会话列表
json
{
	"type": "conversation",
	"data": [
	{
		"id": 1,
		"user_id": "12",
		"service_id": "28",
		"last_message":"{\"chat_id\":\"1\",\"sender_id\":\"28\",\"sender_type\":\"service\",\"content\":\"{\\\"type\\\":\\\"text\\\",\\\"data\\\":\\\"\你\好122\\\"}\",\"is_read\":0,\"created_at\":\"2025-11-11 20:24:35\",\"id\":\"39\"}",
		"unread": 1,
		"created_at": "2025-11-11 16:55:59",
		"updated_at": "2025-11-11 20:24:35",
		"service_info": {
		"id": 28,
		"shop_name": "香港跨境电商",
		"logo": "https://ushee.s3.amazonaws.com/hkxa/upload/files/2025-10-11/19ea70680f9a6100acdc58db91386f918aa80aaf.png",
		"phone": "18888888888",
		"name": "874487732@qq.com"
		},
		"service_status": 1
	}
	]
}

###############################发送消息end###############################

###############################更新会话列表###############################
json
{
	"type": "conversation",
	"data": {}
}
返还接口
{
	"type": "conversation",
	"data": [
	{
		"id": 1,
		"user_id": "12",
		"service_id": "28",
		"last_message":"{\"chat_id\":\"1\",\"sender_id\":\"28\",\"sender_type\":\"service\",\"content\":\"{\\\"type\\\":\\\"text\\\",\\\"data\\\":\\\"\你\好122\\\"}\",\"is_read\":0,\"created_at\":\"2025-11-11 20:24:35\",\"id\":\"39\"}",
		"unread": 1,
		"created_at": "2025-11-11 16:55:59",
		"updated_at": "2025-11-11 20:24:35",
		"service_info": {
		"id": 28,
		"shop_name": "香港跨境电商",
		"logo": "https://ushee.s3.amazonaws.com/hkxa/upload/files/2025-10-11/19ea70680f9a6100acdc58db91386f918aa80aaf.png",
		"phone": "18888888888",
		"name": "874487732@qq.com"
		},
		"service_status": 1
	}
	]
}
###############################更新会话列表end###############################

###############################标记会话列表已读###############################
{
	"type": "mark_read",
	"data": {
		"chat_id": 1, //聊天组id
	}
}
#更新双方会话列表

###############################标记会话列表已读end###############################