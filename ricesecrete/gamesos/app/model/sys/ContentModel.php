<?php


namespace app\model\sys;


use app\model\Base;

class ContentModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_content';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}