<?
    /**
    *  創建檔案/資料夾
    *
    *  @version 0.1.1
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-25
    *  @since 0.1.1 2017-09-25 TCC: 含重複名稱判別(合併move、rename)
    *
    *  @param Number $_POST['path_id'] 目標資料夾ID
    *  @param String $_POST['type'] 檔案/資料夾
    *  @param String $_POST['name'] 檔案/資料夾名稱
    */
    include_once 'connect.inc';
    include_once 'functions.inc';
    $path_id = (isset($_POST['path_id']) ? $_POST['path_id'] : 0);
    $type = (isset($_POST['type']) ? $_POST['type'] : "folder");
    $file = isset($_POST['name']) ? $_POST['name'] : ($type == "folder" ? "新資料夾" : "空白檔案");
    // 同名問題
    // if ($type == "file") {
    //     $file_info = pathinfo($file);
    // }
    // $serial_number = 0;
    // while (true) {
    //     if ($type == "file") {
    //         $serial_number_name = $file_info['filename'] . ($serial_number > 0 ? "(" . $serial_number . ")" : "") . ($file_info['extension'] == "" ? "" : ".") . $file_info['extension'];
    //     } else {
    //         $serial_number_name = $file . ($serial_number > 0 ? "(" . $serial_number . ")" : "");
    //     }
    //     $sql = "SELECT COUNT(*) AS count FROM `" . $type . "s` WHERE `path_id` = '" . $path_id . "' and `name` = '" . $serial_number_name . "';";
    //     $result = mysqli_query($conn, $sql);
    //     if ($row = mysqli_fetch_assoc($result)) {
    //         if ($row["count"] == 0) {
    //             break;
    //         }
    //     }
    //     $serial_number++;
    // }
    $file = getNameWithSerial($file, $type, $path_id);
    $sql = "INSERT INTO `" . $type . "s` (`id`, `path_id`, `name`) VALUES (NULL, '" . $path_id . "', '" . $file . "');";
    // echo $sql;
    mysqli_query($conn, $sql);
    if ($type == "file") {
        $tmp_name = (isset($_POST['tmp_name']) ? $_POST['tmp_name'] : null);
        if (is_null($tmp_name)) { // 是否是上傳檔案
            touch("../files/" . mysqli_insert_id($conn));
        } else {
            echo $tmp_name;
            move_uploaded_file($tmp_name, "../files/" . mysqli_insert_id($conn));
        }

        // 要將當前目錄標示為有檔案
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