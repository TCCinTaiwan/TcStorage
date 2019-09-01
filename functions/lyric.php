<?php
/**
 * 獲取歌詞
 *
 * @version 0.1.5
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-26 TCC: 簡單使用檔案ID或字串搜尋LRC檔案
 * @since 0.1.1 2017-09-26 TCC: 找不到回傳404
 * @since 0.1.2 2017-09-26 TCC: 同路徑才使用(Query的先不管)
 * @since 0.1.3 2017-09-26 TCC: 文字轉小寫
 * @since 0.1.4 2017-09-29 TCC: 因應資料庫改動[path_id]
 * @since 0.1.5 2019-09-01 TCC: 簡單調整 PHP 排版
 *
 * @param {Number} $_POST['id'] 要找歌詞的檔案ID
 * @param {String} $_POST['q'] 關鍵字
 */

include_once 'connect.inc';

$id = isset($_POST['id']) ? $_POST['id'] : null;

if ($id) {
    $sql = 'SELECT * FROM `files` WHERE `id` = ' . $id . ';';
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $name = strtolower(pathinfo($row['name'])['filename']);
        $path_id = is_null($row['path_id']) ? "0" : $row['path_id'];
    }
    $sql = 'SELECT * FROM `files` WHERE `path_id` = ' . $path_id . ' AND LOWER(`name`) REGEXP "' . $name . '\.(lrc)";';
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $lyric_location = dirname(dirname(__FILE__)) . "\\files\\" . $row['id'];
        if (file_exists($lyric_location)) {
            readfile($lyric_location);
            exit;
        }
    }
}

$query = isset($_POST['q']) ? $_POST['q'] : null;

if ($query) {
    $sql = 'SELECT * FROM `files` WHERE LOWER(`name`) REGEXP ".*' . strtolower($query) . '.*\.lrc";';
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $lyric_location = dirname(dirname(__FILE__)) . "\\files\\" . $row['id'];
        if (file_exists($lyric_location)) {
            readfile($lyric_location);
            exit;
        }
    }
}

http_response_code(404);
exit;
