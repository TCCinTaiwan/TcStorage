<?
    /**
    *  重新命名檔案/資料夾
    *
    *  @version 0.1.1
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-29
    *  @since 0.1.0 2017-09-25 TCC: 基本重新命名功能(含重複名稱)
    *  @since 0.1.1 2017-09-29 TCC: 因應資料庫改動[path_id]
    *
    *  @param Number $_POST['id'] 檔案ID
    *  @param String $_POST['new_name'] 想要命名檔案/資料夾名稱
    *  @param String $_POST['type'] 檔案/資料夾
    */
    include_once 'connect.inc';
    include_once 'functions.inc';
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $new_name = isset($_POST['new_name']) ? $_POST['new_name'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : "folder";
    $sql = "SELECT * FROM `" . $type . "s` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $path_id = is_null($row['path_id']) ? "0" : $row['path_id'];
        $name = $row['name'];
    }
    $new_name = getNameWithSerial($new_name, $type, $path_id);// 同名問題(同MOVE)
    $sql = "UPDATE `" . $type . "s` SET `name` = '$new_name' WHERE `id` = $id;";
    echo $sql;
    mysqli_query($conn, $sql);
?>