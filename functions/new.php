<?
    /**
    *  創建檔案/資料夾(與upload共用)
    *
    *  @version 0.1.2
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-29
    *  @since 0.1.1 2017-09-25 TCC: 含重複名稱判別(合併move、rename)
    *  @since 0.1.2 2017-09-29 TCC: 修正$path_id為'0'資料庫應該是NULL問題
    *
    *  @param {Number} $_POST['path_id'] 目標資料夾ID
    *  @param {String} $_POST['type'] 檔案/資料夾
    *  @param {String} $_POST['name'] 檔案/資料夾名稱
    */
    include_once 'connect.inc';
    include_once 'functions.inc';
    $path_id = (isset($_POST['path_id']) ? $_POST['path_id'] : "0");
    $type = (isset($_POST['type']) ? $_POST['type'] : "folder");
    $file = isset($_POST['name']) ? $_POST['name'] : ($type == "folder" ? "新資料夾" : "空白檔案");
    $file = getNameWithSerial($file, $type, $path_id);
    $sql = "INSERT INTO `" . $type . "s` (`id`, `path_id`, `name`) VALUES (NULL, " . ($path_id == 0 ? "NULL" : ("'" . $path_id . "'")) . ", '" . $file . "');";
    // echo $sql; // INFO:
    mysqli_query($conn, $sql);
    if ($type == "file") {
        $tmp_name = (isset($_POST['tmp_name']) ? $_POST['tmp_name'] : null);
        if (is_null($tmp_name)) { // 不是上傳檔案
            touch("../files/" . mysqli_insert_id($conn));
        } else { // 是上傳檔案
            echo $tmp_name;
            move_uploaded_file($tmp_name, "../files/" . mysqli_insert_id($conn));
        }

        // 要將當前目錄標示為有檔案 TODO: 函式化
        $id = $path_id;
        do {
            $sql = "UPDATE `folders` SET `descendant` = '1' WHERE `id` = '" . $id . "';";
            mysqli_query($conn, $sql);
            $sql = "SELECT `folders`.`path_id` FROM `folders` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $id = mysqli_fetch_assoc($result)['path_id'];
        } while ($id > 0);
    }
?>