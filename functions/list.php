<?
    // if ($_SERVER['REQUEST_METHOD'] != "POST") { // 確保都是使用post
    //     http_response_code(405);
    //     exit();
    // }
    include_once 'connect.inc';
    $data = array(
        "path_info" => array(
            "id" => (isset($_POST['path_id']) ? $_POST['path_id'] : 0),
            "name" => "/",
            "root_id" => null,
            "full_path" => ""
        ),
        "folders" => [],
        "files" => []
    );
    // if (isset($_POST['path_id'])) {
    //     $data['path_info']['id'] = $_POST['path_id'];
    // }
    $sql = 'SELECT * FROM `folders` WHERE `id` = ' . $data['path_info']['id'] . ';';
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        if (is_null($data['path_info']['root_id'])) {
            $data['path_info']['name'] = $row['name'];
            $data['path_info']['root_id'] = $row['path_id'];
        }
        $sql = 'SELECT * FROM `folders` WHERE `id` = ' . $row['path_id'] . ';';
        $data['path_info']['full_path'] = $row['name'] . "/" . $data['path_info']['full_path'];
        $result = mysqli_query($conn, $sql);
    }
    $data['path_info']['full_path'] = "/" . $data['path_info']['full_path'];

    // $sql = 'SELECT (SELECT COUNT(*) FROM `folders`) + (SELECT COUNT(*) FROM `files`) AS COUNT;';
    // $sql = 'SELECT * FROM `folders` WHERE `path_id` = ' . $data['path_info']['id'] . ';';
    $sql = 'SELECT
        *,
        (SELECT COUNT(*) FROM `folders` AS `count_folders` WHERE `count_folders`.`path_id` = `folders`.`id`) AS `folder_count`,
        (SELECT COUNT(*) FROM `files` AS `count_files` WHERE `count_files`.`path_id` = `folders`.`id`) AS `file_count`
    FROM `folders` WHERE `path_id` = ' . $data['path_info']['id'] . ';';

    $result = mysqli_query($conn, $sql);
    for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
        $data['folders'][$index] = $row;
    }

    $sql = 'SELECT * FROM `files` WHERE `path_id` = ' . $data['path_info']['id'] . ';';
    $result = mysqli_query($conn, $sql);
    for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
        $data['files'][$index] = $row;
        $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $row['id'];
        $data['files'][$index]['size'] = filesize($file_location);
        if ($data['files'][$index]['mime'] == "") {
            $data['files'][$index]['mime'] = mime_content_type($file_location);
        }

    }
    echo json_encode($data);
?>