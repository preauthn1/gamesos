<?php
namespace app\common;

class ArrayUtil {
    /**
     * @param $array
     * @param $index_key
     * @param null $column_key
     * @return array
     * 将数组转换成map，如果column_key为null，则返回索引数组，不为空则返回字段数组
     */
    public static function arrayToMap($array, $index_key,  $column_key = null): array
    {
        return array_column($array, $column_key, $index_key);
    }

    /**
     * @param $array
     * @param $column_key
     * @return float
     * 计算数组字段总和
     */
    public static function arrayColumnKeyTotal($array, $column_key): array
    {
        return array_sum(array_column($array, $column_key));
    }


}