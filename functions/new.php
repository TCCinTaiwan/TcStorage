<?
    include_once 'connect.inc';
    $path_id = (isset($_POST['path_id']) ? $_POST['path_id'] : 0);
    $type = (isset($_POST['type']) ? $_POST['type'] : "folder");
    $file = isset($_POST['name']) ? $_POST['name'] : ($type == "folder" ? "新資料夾" : "空白檔案");
    if ($type == "file") {
        $file_info = pathinfo($file);
    }
    $serial_number = 0;
    while (true) {
        if ($type == "file") {
            $serial_number_name = $file_info['filename'] . ($serial_number > 0 ? "(" . $serial_number . ")" : "") . ($file_info['extension'] == "" ? "" : ".") . $file_info['extension'];
        } else {
            $serial_number_name = $file . ($serial_number > 0 ? "(" . $serial_number . ")" : "");
        }
        $sql = "SELECT COUNT(*) AS count FROM `" . $type . "s` WHERE `path_id` = '" . $path_id . "' and `name` = '" . $serial_number_name . "';";
        $result = mysqli_query($conn, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            if ($row["count"] == 0) {
                break;
            }
        }
        $serial_number++;
    }
    $sql = "INSERT INTO `" . $type . "s` (`id`, `path_id`, `name`) VALUES (NULL, '" . $path_id . "', '" . $serial_number_name . "');";
    echo $sql;
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
            $sql = "SELECT `path_id` FROM `folders` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            $id = mysqli_fetch_assoc($result)['path_id'];
        } while ($id > 0);
    }
?>