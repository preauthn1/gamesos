<?php

namespace app\admin\model;

/**
 * @property integer $id ID(主键)
 * @property string $admin_id 管理员id
 * @property string $role_id 角色id
 */
class AdminRoleModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_admin_role';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';


    protected $autoWriteTimestamp = false;

}
