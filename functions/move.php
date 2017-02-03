<?
    include_once 'connect.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $src_path_id = isset($_POST['from']) ? $_POST['from'] : null;
    $path_id = isset($_POST['to']) ? $_POST['to'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : "folder";
    ////////////要修同名問題，這樣也不用傳來源資料夾ID了
    $sql = "UPDATE `" . $type . "s` SET `path_id` = '" . $path_id . "' WHERE `files`.`id` = '" . $id . "';";
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