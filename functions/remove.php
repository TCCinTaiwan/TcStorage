<?
    /**
    *  刪除檔案/資料夾
    *
    *  @version 0.1.0
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-26
    *  @since 0.1.0 2017-09-26 TCC: 基本刪除
    *  @todo 資料夾底下也要刪除，函數化應該比較適合遞迴
    *
    *  @param Number $_POST['id'] 檔案ID
    *  @param String $_POST['type'] 檔案/資料夾
    */

    include_once 'connect.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    if ($id) {
        $type = isset($_POST['type']) ? $_POST['type'] : null;
        $sql = "DELETE FROM `" . $type . "s` WHERE `id` = " . $id . ";";
        mysqli_query($conn, $sql);
        if ($type == "file") {
            $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
            if (file_exists($file_location)) {
                unlink($file_location);
            }
        }
        // TODO: 資料夾底下也要刪除，函數化應該比較適合遞迴
    }
?>