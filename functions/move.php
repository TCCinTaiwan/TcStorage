<?
    include_once 'connect.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    // $src_path_id = isset($_POST['from']) ? $_POST['from'] : null;
    $path_id = isset($_POST['to']) ? $_POST['to'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : "folder";
    $sql = "SELECT * FROM `" . $type . "s` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $src_path_id = $row['path_id'];
        $name = $row['name'];
    }
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
    // $sql = "INSERT INTO `" . $type . "s` (`id`, `path_id`, `name`) VALUES (NULL, '" . $path_id . "', '" . $serial_number_name . "');";
    // // echo $sql;
    // mysqli_query($conn, $sql);
    ////////////要修同名問題，這樣也不用傳來源資料夾ID了
    $sql = "UPDATE `" . $type . "s` SET `path_id` = '" . $path_id . "' WHERE `id` = '" . $id . "';";
    mysqli_query($conn, $sql);
    if ($type == "file") {
        // 舊目錄判斷是否無檔案
        $id = $src_path_id;
        do {
            $sql = "SELECT COUNT(*) AS `count` FROM `files` WHERE `path_id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $count = mysqli_fetch_assoc($result)['count'];
            if ($count == 0) {
                $sql = "UPDATE `folders` SET `descendant` = '0' WHERE `id` = '" . $id . "';";
                mysqli_query($conn, $sql);
                $sql = "SELECT `path_id` FROM `folders` WHERE `id` = '" . $id . "';";
                $result = mysqli_query($conn, $sql);
                $id = mysqli_fetch_assoc($result)['path_id'];
            }
        } while ($count == 0);

        $sql = "";
        // 要將當前目錄標示為有檔案
        $id = $path_id;
        do {
            $sql = "UPDATE `folders` SET `descendant` = '1' WHERE `id` = '" . $id . "';";
            mysqli_query($conn, $sql);
            $sql = "SELECT `path_id` FROM `folders` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $id = mysqli_fetch_assoc($result)['path_id'];
        } while ($id > 0);
    }
?>