<?php


namespace app\model\sys;


use app\model\Base;


class PaymentPlatformModel extends Base
{
    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'wa_payment_platform';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}