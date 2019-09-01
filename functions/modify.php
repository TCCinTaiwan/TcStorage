<?php
/**
 * 修改檔案
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 *
 * @param {Number} $_POST['id'] 檔案ID
 * @param {String} $_POST['content'] 檔案新內容
 * @todo 修改前後檔案大小
 */

if (isset($_POST['id'])) {
    // include_once 'connect.inc';
    $id = $_POST['id'];
    $content = (isset($_POST['content']) ? $_POST['content'] : "");
    $file = fopen("../files/" . $id, "w");
    fwrite($file, $content);
    fclose($file);
}
