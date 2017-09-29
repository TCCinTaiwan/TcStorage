<?
    /**
    *  API: 列出檔案/資料夾 NEXT: 移到API
    *
    *  @version 0.1.0
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-29
    *  @since 0.1.0 2017-09-29 TCC: 因應資料庫改動[path_id]
    *  @since 0.1.0 2017-09-29 TCC: MIME換成使用函數
    *
    *  @param Number $_POST['path_id'] 目標資料夾ID
    */
    // if ($_SERVER['REQUEST_METHOD'] != "POST") { // DEBUG: 確保都是使用post
    //     http_response_code(405); // Method not allowed
    //     exit();
    // }
    include_once 'connect.inc';
    include_once 'functions.inc';
    header("Content-Type: application/json;charset=utf-8");
    $data = array(
        "path_info" => array(
            "id" => (isset($_POST['path_id']) ? $_POST['path_id'] : (isset($_GET['path_id']) ? $_GET['path_id'] : "0")), // 預設為主目錄 DEBUG: $_GET是方便測試，請視情況拿掉
            "name" => "/", // 主目錄
            "root_id" => null, // 主目錄沒有上層
            "full_path" => "",
            "breadcrumbs" => []
        ),
        "folders" => [],
        "files" => []
    );
    $query_id = $data['path_info']['id'] == "0" ? 'IS NULL' : '= ' . $data['path_info']['id'];
    $sql = 'SELECT * FROM `folders` WHERE `id` ' . $query_id . ';';
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        if (is_null($data['path_info']['root_id'])) {
            $data['path_info']['name'] = $row['name'];
            $data['path_info']['root_id'] = is_null($row['path_id']) ? "0" : $row['path_id'];
        }
        $sql = 'SELECT * FROM `folders` WHERE `id` ' . (is_null($row['path_id']) ? 'IS NULL' : '= ' . $row['path_id']) . ';';
        $data['path_info']['full_path'] = $row['name'] . "/" . $data['path_info']['full_path'];
        array_push($data['path_info']['breadcrumbs'],
            [
                "id" => $row['id'],
                "name" => $row['name']
            ]
        );
        $result = mysqli_query($conn, $sql);
    }
    $data['path_info']['full_path'] = "/" . $data['path_info']['full_path'];
    array_push($data['path_info']['breadcrumbs'],
        [
            "id" => "0",
            "name" => "/"
        ]
    );
    $data['path_info']['breadcrumbs'] = array_reverse($data['path_info']['breadcrumbs']);
    // $sql = 'SELECT (SELECT COUNT(*) FROM `folders`) + (SELECT COUNT(*) FROM `files`) AS COUNT;';
    // $sql = 'SELECT * FROM `folders` WHERE `path_id` ' . $query_id . ';';
    $sql = 'SELECT *, (SELECT COUNT(*) FROM `folders` AS `count_folders` WHERE `count_folders`.`path_id` = `folders`.`id`) AS `folder_count`, (SELECT COUNT(*) FROM `files` AS `count_files` WHERE `count_files`.`path_id` = `folders`.`id`) AS `file_count` FROM `folders` WHERE `path_id` ' . $query_id . ';';

    $result = mysqli_query($conn, $sql);
    for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
        $data['folders'][$index] = $row;
        if (is_null($data['folders'][$index]['path_id'])) { // 將主目錄的路徑設為0
            $data['folders'][$index]['path_id'] = "0";
        }
    }

    $sql = 'SELECT * FROM `files` WHERE `path_id` ' . $query_id . ' ORDER BY `name` ASC;';
    $result = mysqli_query($conn, $sql);
    for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
        $data['files'][$index] = $row;
        $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $row['id'];
        $data['files'][$index]['size'] = filesize($file_location);

        if (is_null($data['files'][$index]['path_id'])) { // 將主目錄的路徑設為0
            $data['files'][$index]['path_id'] = "0";
        }
        if ($data['files'][$index]['mime'] == "") {
            $data['files'][$index]['mime'] = getFileMimeType($file_location, $data['files'][$index]['name']); // LINK: file.php:21 $info['mime'] = getFileMimeType($file_location, $info['name']);
        }

    }
    echo json_encode($data);
?>