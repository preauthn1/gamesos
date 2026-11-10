<?php


namespace app\admin\model;


/**
 * Class FileExport
 * @package plugin\admin\app\model
 */
class FileExportModel extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_file_export';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $pk = 'id';
}