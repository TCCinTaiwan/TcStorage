<?
    include_once 'connect.inc';
    include_once 'functions.inc';
    $info = [
        "id" => isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : 1),
        "name" => "",
        "path_id" => null,
        "mime" => null,
        "size" => null,
        "mtime" => null,
        "ctime" => null,
        "atime" => null
    ];
    $sql = 'SELECT * FROM `files` WHERE `id` = ' . $info['id'] . ';';
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $info['name'] = $row['name'];
        $info['path_id'] = $row['path_id'];
        $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $info['id'];
        $info['size'] = filesize($file_location);
        $info['mime'] = getFileMimeType($file_location, $info['name']);
        $info['mtime'] = filemtime($file_location);
        $info['ctime'] = filectime($file_location);
        $info['atime'] = fileatime($file_location);
        // $perms = fileperms($file_location);
        // $info['mode'] = substr(sprintf('%o', $perms), -4);
        // $info['mode2'] = readableMode(fileperms($file_location));

        // zip讀取
        $zip_archive = new ZipArchive();
        $zip_archive->open($file_location);
        if ($zip_archive->numFiles > 0) {
            $info['files'] = [];
            for($i = 0; $i < $zip_archive->numFiles; $i++) {
                array_push(
                    $info['files'],
                    $zip_archive->statIndex($i) // $zip_archive->getNameIndex($i)
                );
            }
        }

        header("Content-Type: application/json;charset=utf-8");
        echo json_encode($info);
    } else {
        http_response_code(404);
    }

?>