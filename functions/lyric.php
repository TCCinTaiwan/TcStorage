<?
    /**
    *  獲取歌詞
    *
    *  @version 0.1.1
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-26
    *  @since 0.1.0 2017-09-26 TCC: 簡單使用檔案ID或字串搜尋LRC檔案
    *  @since 0.1.1 2017-09-26 TCC: 找不到回傳404
    *
    *  @param Number $_POST['id'] 要找歌詞的檔案ID
    *  @param String $_POST['q'] 關鍵字
    */

    include_once 'connect.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    if ($id) {
        $sql = 'SELECT * FROM `files` WHERE `id` = ' . $id . ';';
        $result = mysqli_query($conn, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            $name = pathinfo($row['name'])['filename'];
        }
        $sql = 'SELECT * FROM `files` WHERE LOWER(`name`) REGEXP "' . $name . '\.(lrc)";';
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
        $sql = 'SELECT * FROM `files` WHERE LOWER(`name`) REGEXP ".*' . $query . '.*\.lrc";';
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
?>