<?php


namespace app\services;


use app\admin\model\OptionModel;
use app\admin\model\RuleModel;
use app\model\sys\PaymentPlatformModel;
use support\Cache;
use think\facade\Db;

class SysServices
{

    /**
     * 获取系统配置
     * @param $key
     * @param $cache
     * @return mixed|string
     */
    public static function getSysConfig($key, $cache = true)
    {
        $name = 'system_config';
        $redis_key = $name . $key;
        if (Cache::store('file')->has($redis_key) && $cache) {
            return json_decode(Cache::store('file')->get($redis_key), true);
        }
        $config = OptionModel::where('name', $name)->value('value');
        $data = json_decode($config, true);
        $data_key = $data[$key] ?? '';
        if (!$data_key) {
            return '';
        }
        Cache::store('file')->set($redis_key, json_encode($data_key), 3600);
        return $data[$key] ?? '';
    }

    /**
     * 获取配置
     * @param $name
     * @param $key
     * @param string $default
     * @return mixed|string
     */
    public static function getSysConfigValue($name, $key, $default = '')
    {
        $data = self::getSysConfig($name);
        return $data[$key] ?? $default;
    }

    /**
     * 获取配置
     * @param $name
     * @param bool $cache
     * @return mixedss
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    public static function getConfigValue($name, $cache = true)
    {
        $redis_key = "config_value_" . $name;
        $redis = Cache::store('file');
        $data = $redis->get($redis_key);
        if (empty($data) || $cache == false) {
            $data = OptionModel::where('name', $name)->value('value');
            $redis->set($redis_key, $data, 3600);
            $data = json_decode($data, true);
            return $data;
        }
        return json_decode($data, true);
    }

    /**
     * 获取支付方式列表
     * @param int $show 1充值渠道 2提现渠道
     * @param bool $cache
     * @return array|mixed
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \RedisException
     * @throws \Symfony\Component\Cache\Exception\CacheException
     * @throws \Throwable
     */
    public static function getPaymentList($show = 1, $cache = true)
    {
        $key = 'payment_list';
        $redis = Cache::store('file');
        $data = $redis->get($key);
        $out_data = [];
        if ($data && $cache) {
            $list = json_decode($data, true);
            foreach ($list as $v) {
                if ($show == 1) {
                    if ($v['recharge_is_show'] == 1) {
                        $out_data[] = $v;
                    }
                }
                if ($show == 2) {
                    if ($v['withdraw_is_show'] == 1) {
                        $out_data[] = $v;
                    }
                }
            }
            return $out_data;
        }
        $list = PaymentPlatformModel::where('status', 1)
            ->field('id,name,type,package,image,min_recharge_money,max_recharge_money,recharge_is_show,withdraw_is_show,address,exchange_rate,fees')->select();
        if (!empty($list)) {
            $list = $list->toArray();
            $redis->set($key, json_encode($list), 3600);
        } else {
            $list = [];
        }
        foreach ($list as $v) {
            if ($show == 1) {
                if ($v['recharge_is_show'] == 1) {
                    $out_data[] = $v;
                }
            }
            if ($show == 2) {
                if ($v['withdraw_is_show'] == 1) {
                    $out_data[] = $v;
                }
            }
        }
        return $out_data;
    }
    /**
     * 更新权限列表
     */
    public static function updateRules()
    {
        $items = RuleModel::order('weight', 'desc')->select()->toArray();
        $formatted_items = [];
        foreach ($items as $item) {
            $item['pid'] = (int)$item['pid'];
            $item['name'] = $item['title'];
            $item['value'] = $item['id'];
            $item['icon'] = $item['icon'] ? "layui-icon {$item['icon']}" : '';
            $formatted_items[] = $item;
        }
        $tree = new Tree($formatted_items);
        $tree_items = $tree->getTree();
        foreach ($tree_items as $item) {
            //[id] => 90
            //                            [title] => 字典设置
            //                            [icon] => layui-icon layui-icon-read
            //                            [key] => plugin\admin\app\controller\DictController
            //                            [pid] => 73
            //                            [created_at] => 2025-09-01 16:19:36
            //                            [updated_at] => 2025-09-01 16:19:36
            //                            [href] => /app/admin/dict/index
            //                            [type] => 1
            //                            [weight] => 600
            //                            [name] => 字典设置
            //                            [value] => 90
            // `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
            //  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
            //  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '图标',
            //  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '标识',
            //  `pid` int unsigned DEFAULT '0' COMMENT '上级菜单',
            //  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
            //  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
            //  `href` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'url',
            //  `type` int DEFAULT '1' COMMENT '类型',
            //  `weight` int DEFAULT '0' COMMENT '排序',
            $in_data = [
                'title' => $item['title'],
                'icon' => $item['icon'],
                'key' => $item['key'],
                'pid' => $item['pid'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'href' => $item['href'],
                'type' => $item['type'],
                'weight' => $item['weight'],
            ];
            $pid = Db::table('wa_rulesb')->insertGetId($in_data);
            $children = isset($item['children']) ? $item['children'] : [];
            if (!empty($children)) {
                foreach ($children as $child) {
                    $in_data = [
                        'title' => $child['title'],
                        'icon' => $child['icon'],
                        'key' => $child['key'],
                        'pid' => $pid,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                        'href' => $child['href'],
                        'type' => $child['type'],
                    ];
                    $grandpid = Db::table('wa_rulesb')->insertGetId($in_data);
                    $grandchildren = isset($child['children']) ? $child['children'] : [];
                    if (!empty($grandchildren)) {
                        foreach ($grandchildren as $grandchild) {
                            $in_data = [
                                'title' => $grandchild['title'],
                                'icon' => $grandchild['icon'],
                                'key' => $grandchild['key'],
                                'pid' => $grandpid,
                                'created_at' => date('Y-m-d H:i:s'),
                                'updated_at' => date('Y-m-d H:i:s'),
                                'href' => $grandchild['href'],
                                'type' => $grandchild['type'],
                            ];
                            Db::table('wa_rulesb')->insert($in_data);
                        }
                    }
                }
            }
        }
    }

    /**
     * 插入权限
     * @param int $pid 父级id
     * @param string $name 控制器中文名称
     * @param string $con 控制器名称
     * @param int $weight 权重
     * @param boolean $root 是否是主菜单
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public static function insertRules($pid, $name, $icon, $con, $weight = 700, $root = false)
    {
//        $pid = SysServices::insertRules(0, '商品管理', 'layui-icon layui-icon-app', 'goodsManage', 900, true);
//        SysServices::insertRules($pid, '商品列表', 'layui-icon layui-icon-template-1', 'Goods', 900, false);
//        SysServices::insertRules($pid, '商品分类', 'layui-icon layui-icon-component', 'GoodsType', 800, false);
//        SysServices::insertRules($pid, '商品评论', 'layui-icon layui-icon-tabs', 'GoodsEvaluate', 700, false);
        if ($root) {
            $pid = Db::table('wa_rules')->where('key', $con)->find();
            if (!empty($pid)) {
                return $pid['id'];
            }
            $in_data = [
                'title' => $name,
                'icon' => $icon,
                'key' => $con,
                'pid' => $pid,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'href' => "",
                'type' => 1,
                'weight' => $weight
            ];
            $temp = Db::table('wa_rules')->where('key', $in_data['key'])->find();
            if (!empty($temp)) {
                return 0;
            }
            return Db::table('wa_rules')->insertGetId($in_data);
        }
        $href = strtolower($con);
        $in_data = [
            'title' => $name,
            'icon' => $icon,
            'key' => "plugin\admin\app\controller\\" . $con . "Controller",
            'pid' => $pid,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'href' => "/app/admin/" . $href . "/index",
            'type' => 1,
            'weight' => $weight
        ];
        $temp = Db::table('wa_rules')->where('key', $in_data['key'])->find();
        if (!empty($temp)) {
            $pid_in = $temp['id'];
        } else {
            $pid_in = Db::table('wa_rules')->insertGetId($in_data);
        }
        $arr_name = [
            'select' => '查询',
            'insert' => '插入',
            'update' => '更新',
            'delete' => '删除',
            'export' => '导出'
        ];
        foreach ($arr_name as $key => $name) {
            $in_data = [
                'title' => "{$name}",
                'icon' => '',
                'key' => "plugin\admin\app\controller\\" . $con . "Controller@{$key}",
                'pid' => $pid_in,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'href' => "",
                'type' => 2,
                'weight' => 0
            ];
            $temp = Db::table('wa_rules')->where('key', $in_data['key'])->find();
            if (!empty($temp)) {
                continue;
            }
            Db::table('wa_rules')->insert($in_data);
        }
        return $pid_in;
    }
}