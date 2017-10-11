<?
    /**
    *  API: 列出檔案/資料夾
    *
    *  @version 0.1.2
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-10-03
    *  @since 0.1.0 2017-09-29 TCC: 因應資料庫改動[path_id]
    *  @since 0.1.0 2017-09-29 TCC: MIME換成使用函數
    *  @since 0.1.1 2017-10-01 TCC: 移到API資料夾
    *  @since 0.1.2 2017-10-02 TCC: 檔案清單增加更多時間資訊
    *  @since 0.1.2 2017-10-03 TCC: ZIP加到list
    *
    *  @param {Number} $_POST['id'] 目標資料夾ID或ZIP資料夾ID
    *  @param {String} $_POST['zip'] ZIP檔案子路徑
    *  @todo zip路徑大小寫忽略
    */
    // if ($_SERVER['REQUEST_METHOD'] != "POST") { // DEBUG: 確保都是使用post
    //     http_response_code(405); // Method not allowed
    //     exit();
    // }
    include_once '../functions/connect.inc';
    include_once '../functions/functions.inc';
    header("Content-Type: application/json;charset=utf-8");
    $zip = isset($_POST['zip']) ? $_POST['zip'] : (isset($_GET['zip']) ? $_GET['zip'] : null);
    if ($zip === "") {
        $zip = ".";
    } else if (!is_null($zip) && substr($zip, -1) === "/") {
        $zip = substr($zip, 0, -1);
    }
    $id = isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : "0");
    $data = array(
        "path_info" => array(
            "id" => $id, // 預設為主目錄 DEBUG: $_GET是方便測試，請視情況拿掉
            "name" => "/", // 主目錄
            "root_id" => null, // 主目錄沒有上層
            "zip_path" => $zip, // 假如是壓縮檔會有這個路徑
            "full_path" => "",
            "breadcrumbs" => []
        ),
        "folders" => [],
        "files" => []
    );
    $query_id = $id === "0" ? 'IS NULL' : '= ' . $id;
    if (!is_null($zip)) {
        $path_array = explode("/", rtrim($zip, "/"));
        $data['path_info']['name'] = end($path_array);
        for ($i = count($path_array) - 1; $i >= 0; $i--) {
            if ($path_array[$i] != ".") {
                array_push(
                    $data['path_info']['breadcrumbs'],
                    [
                        "name" => $path_array[$i],
                        "zip_path" => join("/", array_slice($path_array, 0, $i + 1))
                    ]
                );
            }
        }
        $data['path_info']['full_path'] = $zip == "." ? "" : $zip;
        $sql = 'SELECT * FROM `files` WHERE `id` ' . $query_id . ';'; // TODO: ZIP
        $result = mysqli_query($conn, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            if ($data['path_info']['name'] == ".") {
                $data['path_info']['name'] = $row['name'];
            }
            $data['path_info']['full_path'] = $row['name'] . "/" . $data['path_info']['full_path'];
            array_push(
                $data['path_info']['breadcrumbs'],
                [
                    "name" => $row['name'],
                    "zip_path" => "."
                ]
            );
            $data['path_info']['root_id'] = $row['path_id'];
            $query_id = $row['path_id'] == "0" ? 'IS NULL' : '= ' . $row['path_id'];
        }
    }
    // 當前目錄資訊
    $sql = 'SELECT * FROM `folders` WHERE `id` ' . $query_id . ';';
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) { // 一直往上一層，並填充資料
        if (is_null($data['path_info']['root_id']) && is_null($zip)) { // 把第一層資料夾資訊填入
            $data['path_info']['name'] = $row['name'];
            $data['path_info']['root_id'] = is_null($row['path_id']) ? "0" : $row['path_id'];
        }
        $data['path_info']['full_path'] = $row['name'] . "/" . $data['path_info']['full_path'];
        array_push(
            $data['path_info']['breadcrumbs'],
            [
                "id" => $row['id'],
                "name" => $row['name']
            ]
        );
        $sql = 'SELECT * FROM `folders` WHERE `id` ' . (is_null($row['path_id']) ? 'IS NULL' : '= ' . $row['path_id']) . ';';
        $result = mysqli_query($conn, $sql);
    }
    // 加入主目錄資訊
    $data['path_info']['full_path'] = "/" . $data['path_info']['full_path'];
    array_push($data['path_info']['breadcrumbs'],
        [
            "id" => "0",
            "name" => "/"
        ]
    );
    $data['path_info']['breadcrumbs'] = array_reverse($data['path_info']['breadcrumbs']);

    if (is_null($zip)) {
        // 子資料夾資訊(計算folder_count、file_count)
        $sql = 'SELECT *, (SELECT COUNT(*) FROM `folders` AS `count_folders` WHERE `count_folders`.`path_id` = `folders`.`id`) AS `folder_count`, (SELECT COUNT(*) FROM `files` AS `count_files` WHERE `count_files`.`path_id` = `folders`.`id`) AS `file_count` FROM `folders` WHERE `path_id` ' . $query_id . ';';

        $result = mysqli_query($conn, $sql);
        for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
            $data['folders'][$index] = $row;
            $data['folders'][$index]['mtime'] = strtotime($data['folders'][$index]['mtime']);
            $data['folders'][$index]['ctime'] = strtotime($data['folders'][$index]['ctime']);
            $data['folders'][$index]['atime'] = strtotime($data['folders'][$index]['atime']);
            if (is_null($data['folders'][$index]['path_id'])) { // 將主目錄的路徑設為0
                $data['folders'][$index]['path_id'] = "0";
            }
        }

        // 子檔案資訊
        $sql = 'SELECT * FROM `files` WHERE `path_id` ' . $query_id . ' ORDER BY `name` ASC;';
        $result = mysqli_query($conn, $sql);
        for ($index = 0; $row = mysqli_fetch_assoc($result); $index++) {
            $data['files'][$index] = $row;
            $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $row['id'];
            $data['files'][$index]['size'] = filesize($file_location);
            $data['files'][$index]['mtime'] = filemtime($file_location);
            $data['files'][$index]['ctime'] = filectime($file_location);
            $data['files'][$index]['atime'] = fileatime($file_location);

            if (is_null($data['files'][$index]['path_id'])) { // 將主目錄的路徑設為0
                $data['files'][$index]['path_id'] = "0";
            }
            if ($data['files'][$index]['mime'] == "") {
                $data['files'][$index]['mime'] = getFileMimeType($file_location, $data['files'][$index]['name']); // LINK: file.php:21 $info['mime'] = getFileMimeType($file_location, $info['name']);
            }

        }
    } else {
        $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
        // zip讀取
        $zip_archive = new ZipArchive();
        $zip_archive->open($file_location);
        if ($zip_archive->numFiles > 0) {
            for($i = 0; $i < $zip_archive->numFiles; $i++) {
                $file_stat = $zip_archive->statIndex($i);
                // echo dirname($file_stat['name']) . "\n";
                $file_stat['path'] = $file_stat['name'];
                $file_stat['name'] = basename($file_stat['name']);
                if (dirname($file_stat['path']) == $zip) { // $zip_archive->getNameIndex($i)
                    if (substr($file_stat['path'], -1) == "/") { // 資料夾
                        array_push(
                            $data['folders'],
                            $file_stat
                        );
                    } else { // 檔案
                        $file_stat['mime'] = getFileMimeType("zip://" . $file_location . "#" . $file_stat['path'], $file_stat['name']);
                        array_push(
                            $data['files'],
                            $file_stat
                        );
                    }
                }
            }
        }
    }
    echo json_encode($data);
?>