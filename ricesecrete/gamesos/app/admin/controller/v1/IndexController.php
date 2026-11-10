<?php

namespace app\admin\controller\v1;

use app\common\BaseController;
use app\common\Util;
use support\Request;

class IndexController extends BaseController
{
    public function test(Request $request)
    {
//        $out_data = FileExportServices::addExportTask([], '\plugin\admin\app\services\MessageServices::exportFile');
//        $out_data['data'] = PledgeLongServices::getPledgeLongStat();
//        $queue = 'send_mail';
//        // 数据，可以直接传数组，无需序列化
//        $data = ['to' => 'tom@gmail.com', 'content' => 'hello'];
//        // 投递消息
//        Redis::send($queue, $data);
//        $data = PledgeCurrentServices::relievePledgeCurrent($uid, $amount);
//        $data = PledgeCurrentServices::settlementPledgeCurrent($uid,2);
//        Event::dispatch('recharge.success', [
//            'user_id' => 13,
//            'number' => 10023231002323,
//            'money' => 100
//        ]);
//        $amount = SysServices::getSysConfigValue('web', 'bonus_money');
//        print_r($amount);
        $ip = Util::getRealIp();
        $out_data = [
            'code' => 0,
            'data' => $ip
        ];
        return self::returnMsg($out_data);
//        $type = $request->get('type', 'group');
//        if ($type == 'group') {
//            PushApi::sendGroupMessage('data', [
//                'title' => '指数数据',
//                'type' => 4,
//                'data' => [
//                    'title' => '指数数据',
//                    'day' => '2022-01-01'
//                ],
//                'content' => '测试消息内容'
//            ]);
//        } else {
//            PushApi::sendPrivateMessage($uid, [
//                'title' => '测试消息',
//                'type' => 1,
//                'content' => '测试消息内容'
//            ]);
//        }
//        $out_data = [
//            'code' => 0,
//            'msg' => '成功'
//        ];
//        return self::returnMsg($out_data);
    }
}
