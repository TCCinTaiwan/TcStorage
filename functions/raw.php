<?
    include_once 'connect.inc';
    $id = (isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : 1));
    $newname = (isset($_POST['name']) ? $_POST['name'] : (isset($_GET['name']) ? $_GET['name'] : null));
    $sql = "SELECT * FROM `files` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $basename = is_null($newname) ? $row['name'] : $newname;
    $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
    if (file_exists($file_location)) {
        $mime_type = $row['mime'] != '' ? $row['mime'] : mime_content_type($file_location);
        $filesize = filesize($file_location);
        header("Accept-Ranges: 0-" . ($filesize - 1));
        // header('Accept-Ranges: bytes');

        header("Content-Length: " . $filesize);
        if (preg_match("/MSIE ([0-9]\.[0-9]{1,2})/", $_SERVER['HTTP_USER_AGENT'])) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header("Pragma: public");
        } else {
            header('Pragma: no-cache');
        }

        header("Last-Modified: ".gmdate('D, d M Y H:i:s', @filemtime($file_location)) . ' GMT' );
        header('TcStorage-Debug:' . $mime_type . (isset($_SERVER['HTTP_RANGE']) ? " " . $_SERVER['HTTP_RANGE'] : "")); //
        if (isset($_SERVER['HTTP_RANGE'])) {
            $matches = explode('-', explode('=', $_SERVER['HTTP_RANGE'], 2)[1]);
            // preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches);
            $start_offset = intval($matches[0]);
            $end_offset = is_numeric($matches[1]) ? intval($matches[1]) : ($filesize - 1);

            header('Content-Range: bytes ' . $start_offset . '-' . $end_offset . '/' . $filesize);
            if ($start_offset > $end_offset || $start_offset > $filesize - 1 || $end_offset >= $filesize) {
                http_response_code(416);
                // header('HTTP/1.1 416 Requested Range Not Satisfiable');
                exit;
            } else {
                http_response_code(206);
                // header('HTTP/1.1 206 Partial Content');
                header("Content-Type: " . $mime_type . ";charset=utf-8");
                header("Content-Disposition: inline; filename=" .  $basename);
                $open_file = fopen($file_location, 'rb');
                fseek($open_file, $start_offset);
                echo fread($open_file, $end_offset - $start_offset);
                fclose($open_file);
                exit;
            }
        } else {
            $download_file = (isset($_POST['download']) ? $_POST['download'] : (isset($_GET['download']) ? $_GET['download'] : 0)) == 1;
            header("Content-Type: " . ($download_file ? "application/force-download" : $mime_type) . ";charset=utf-8");// "text/plain"
            header("Content-Disposition: " . ($download_file ? "attachment" : "inline") . "; filename=" .  $basename);

            readfile($file_location);
            exit;
        }
    } else {
        http_response_code(404);
        die("Error: File not found." . $file_location);
    }
    // // header("Content-Type: " . mime_content_type($file_location));
    // // header('Content-Type: application/octet-stream');
    // header('Content-type:application/force-download');
    // header("Content-Transfer-Encoding: Binary");
    // header("Content-Length:" . $filesize);
    // header("Content-Disposition: attachment; filename=" . $basename);
    // header("Cache-Control: public");
    // readfile($file_location);
?>