<?php


namespace app\model\sys;


use app\model\Base;


class CurrencyModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_currency';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}