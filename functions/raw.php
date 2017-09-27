<?
    /**
    *  複製檔案/資料夾
    *
    *  @version 0.1.0
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-27
    *  @since 0.1.0 2017-09-27 TCC: 整理raw.php讀檔
    *  @since 0.1.0 2017-09-27 TCC: 啟用讀檔紀錄
    *
    *  @param Number $_POST['id'] 檔案ID
    *  @param String $_POST['name'] 檔案名稱
    */
    include_once 'connect.inc';
    $id = (isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : 1));
    $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
    if (!file_exists($file_location)) {
        http_response_code(404); // Not Found
        error_log("$_SERVER[REQUEST_URI] 404 ". $file_location . "\n", 3, "../log/raw.error.log"); // DEBUG:
        die(404);
    }

    header('Accept-Ranges: bytes');
    $filesize = filesize($file_location);
    header("Content-Length: " . $filesize); // TODO: 會有net::ERR_CONTENT_LENGTH_MISMATCH問題
    // header("Accept-Ranges: 0-" . ($filesize - 1));
    if (preg_match("/MSIE ([0-9]\.[0-9]{1,2})/", $_SERVER['HTTP_USER_AGENT'])) {
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        // header("Cache-Control: public");
        header("Pragma: public");
    } else {
        header('Pragma: no-cache');
    }
    header("Last-Modified: ".gmdate('D, d M Y H:i:s', @filemtime($file_location)) . ' GMT' );


    $sql = "SELECT * FROM `files` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $mime_type = $row['mime'] != '' ? $row['mime'] : mime_content_type($file_location);
    $newname = (isset($_POST['name']) ? $_POST['name'] : (isset($_GET['name']) ? $_GET['name'] : null));
    $basename = is_null($newname) ? $row['name'] : $newname;
    if (!isset($_SERVER['HTTP_RANGE'])) {
        // http_response_code(200); // OK
        $download_file = (isset($_POST['download']) ? $_POST['download'] : (isset($_GET['download']) ? $_GET['download'] : 0)) == 1;
        header("Content-Type: " . ($download_file ? "application/force-download" : $mime_type) . ";charset=utf-8");// "text/plain"
        // header("Content-Type: " . mime_content_type($file_location));
        // header('Content-Type: application/octet-stream');
        // header('Content-type: application/force-download');
        // header("Content-Transfer-Encoding: Binary");
        header("Content-Disposition: " . ($download_file ? "attachment" : "inline") . "; filename=" .  $basename);
        // header("Content-Disposition: attachment; filename=" . $basename);

        readfile($file_location);
        exit;
    }
    $matches = explode('-', explode('=', $_SERVER['HTTP_RANGE'], 2)[1]);
    // preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches);
    $start_offset = intval($matches[0]);
    $end_offset = is_numeric($matches[1]) ? intval($matches[1]) : ($filesize - 1);
    header('Content-Range: bytes ' . $start_offset . '-' . $end_offset . '/' . $filesize);
    if ($start_offset > $end_offset || $start_offset > $filesize - 1 || $end_offset >= $filesize) {
        http_response_code(416); // Requested Range Not Satisfiable
        error_log("$_SERVER[REQUEST_URI] 416 $start_offset-$end_offset/$filesize\n", 3, "../log/raw.error.log"); // DEBUG:
        die(416);
    }
    http_response_code(206); // Partial Content
    // header("Content-Length: " . $end_offset - $start_offset + 1);
    header('TcStorage-Debug:' . $mime_type . (isset($_SERVER['HTTP_RANGE']) ? " " . $_SERVER['HTTP_RANGE'] : "") . " " . ($end_offset - $start_offset + 1) . " " . $filesize); // DEBUG:

    header("Content-Type: " . $mime_type . ";charset=utf-8");
    header("Content-Disposition: inline; filename=" .  $basename);
    if (!$open_file = fopen($file_location, 'rb')) {
        http_response_code(500); // Internal Server Error
        error_log("$_SERVER[REQUEST_URI] 500 can't open '$file_location'\n", 3, "../log/raw.error.log"); // DEBUG:
        die(500);
    }
    fseek($open_file, $start_offset);
    echo fread($open_file, $end_offset - $start_offset);
    fclose($open_file);
    exit;
?>