<?php


namespace app\model\chat;

use app\model\Base;

class ChatModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ex_chat';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}