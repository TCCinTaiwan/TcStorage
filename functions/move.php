<?
    /**
    *  移動檔案/資料夾
    *
    *  @version 0.1.3
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-29
    *  @since 0.1.1 2017-09-25 TCC: 含重複名稱判別
    *  @since 0.1.2 2017-09-25 TCC: 修正無限執行問題
    *  @since 0.1.3 2017-09-29 TCC: 資料夾有無檔案判斷修正：加入子資料夾部分
    *
    *  @param Number $_POST['id'] 檔案ID
    *  @param Number $_POST['new_path'] 目標資料夾ID
    *  @param String $_POST['type'] 檔案/資料夾
    */
    include_once 'connect.inc';
    include_once 'functions.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $path_id = isset($_POST['new_path']) ? $_POST['new_path'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : "folder";
    $sql = "SELECT * FROM `" . $type . "s` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $src_path_id = $row['path_id'];
        $name = $row['name'];
    }
    $name = getNameWithSerial($name, $type, $path_id);
    $sql = "UPDATE `" . $type . "s` SET `path_id` = '" . $path_id . "', `name` = '" . $name . "' WHERE `id` = '" . $id . "';";
    mysqli_query($conn, $sql);
    // 舊目錄判斷是否無檔案 DEBUG: 曾有BUG一直跑，持續追蹤 TODO: 函式化
    $id = $src_path_id;
    while ($id > 0) {
        // 資料夾是否有檔案
        $sql = "SELECT COUNT(*) AS `count` FROM `files` WHERE `path_id` = '" . $id . "';";
        $result = mysqli_query($conn, $sql);
        $count = mysqli_fetch_assoc($result)['count'];
        // 子資料夾是否"有資料"
        $sql = "SELECT COUNT(*) > 0 AS `descendant` FROM `folders` WHERE `path_id` = " . $id . " AND `descendant` = 1;";
        $result = mysqli_query($conn, $sql);
        $descendant = mysqli_fetch_assoc($result)['descendant'];
        if ($count > 0 || $descendant) {
            break; // 只要往上到"有資料"資料夾就可以停了
        } else {
            // 設定資料夾為"空"資料夾
            $sql = "UPDATE `folders` SET `descendant` = '0' WHERE `id` = '" . $id . "';";
            mysqli_query($conn, $sql);
            // 資料夾往上一層 TODO: 函式化
            $sql = "SELECT `folders`.`path_id` FROM `folders` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $id = mysqli_fetch_assoc($result)['path_id'];
        }
    }
    // 要將當前目錄標示為有檔案 TODO: 底下有"有資料資料夾"也要標示 TODO: 函式化
    $id = $path_id;
    // 資料夾是否有檔案
    $sql = "SELECT COUNT(*) AS `count` FROM `files` WHERE `path_id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    $count = mysqli_fetch_assoc($result)['count'];
    // 子資料夾是否"有資料"
    $sql = "SELECT COUNT(*) > 0 AS `descendant` FROM `folders` WHERE `path_id` = " . $id . " AND `descendant` = 1;";
    $result = mysqli_query($conn, $sql);
    $descendant = mysqli_fetch_assoc($result)['descendant'];
    if ($count > 0 || $descendant) {
        while ($id > 0){
            // 設定資料夾為"有資料"
            $sql = "UPDATE `folders` SET `descendant` = '1' WHERE `id` = '" . $id . "';";
            mysqli_query($conn, $sql);
            // 資料夾往上一層 TODO: 函式化
            $sql = "SELECT `folders`.`path_id` FROM `folders` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $id = mysqli_fetch_assoc($result)['path_id'];
        }
    }
?>