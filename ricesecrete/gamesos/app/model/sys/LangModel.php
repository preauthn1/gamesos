<?php


namespace app\model\sys;

use app\model\Base;

class LangModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_lang';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}