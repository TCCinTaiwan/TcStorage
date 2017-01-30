<?
    include_once 'connect.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null);
    $path_id = isset($_POST['path_id']) ? $_POST['path_id'] : null);
    $type = (isset($_POST['type']) ? $_POST['type'] : "folder");
    $sql = "UPDATE `" . $type . "s` SET `path_id` = '" . $path_id . "' WHERE `files`.`id` = '" . $id . "';";
    echo $sql;
    mysqli_query($conn, $sql);
    if ($type == "file") { // 要將新目錄標示為有檔案，舊目錄判斷是否無檔案
        $sql = "";
    }
?>