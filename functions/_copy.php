<?php
/**
 * 複製檔案/資料夾
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-26 TCC: 複製功能草稿
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 * @todo 資料夾底下也要複製，函數化應該比較適合遞迴
 *
 * @param {Number} $_POST['id'] 檔案ID
 * @param {Number} $_POST['path_id'] 目標資料夾ID
 * @param {String} $_POST['type'] 檔案/資料夾
 */

include_once 'connect.inc';
$id = isset($_POST['id']) ? $_POST['id'] : null;
if ($id) {
    $path_id = isset($_POST['path_id']) ? $_POST['path_id'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : null;
    $sql = "SELECT * FROM `" . $type . "s` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $file = $row['name'];
    }
    $file = getNameWithSerial($file, $type, $path_id);
    $sql = "INSERT INTO `" . $type . "s` (`id`, `path_id`, `name`) VALUES (NULL, '" . $path_id . "', '" . $file . "');";
    // echo $sql;
    mysqli_query($conn, $sql);

    // if ($type == "file") {
    //     $destination_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
    //     if (file_exists($destination_location)) {
    //         unlink();
    //         copy($source_location, $destination_location);
    //     }
    // }
    // TODO: 資料夾底下也要複製，函數化應該比較適合遞迴
    require 'new.php';
}
