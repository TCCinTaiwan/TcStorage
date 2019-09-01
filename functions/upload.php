<?php
/**
 * 上傳
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-29 TCC: 移除upload除錯用JSON
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 *
 * @param {Number} $_FILES 上傳的檔案
 * @param {Number} $_POST['path_id'] 位置ID
 */
$path_id = (isset($_POST['path_id']) ? $_POST['path_id'] : "0");

if (isset($_FILES["files"])) {
    foreach ($_FILES["files"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
            $_POST['tmp_name'] = $_FILES["files"]["tmp_name"][$key];
            $_POST['type'] = "file";
            $_POST['name'] = $_FILES["files"]["name"][$key];

            require 'new.php'; // LINK:
        }
    }
}
