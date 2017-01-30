<?
    include_once 'connect.inc';
    $id = (isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : 1));
    $newname = (isset($_POST['name']) ? $_POST['name'] : (isset($_GET['name']) ? $_GET['name'] : null));
    $download_file = (isset($_POST['download']) ? $_POST['download'] : (isset($_GET['download']) ? $_GET['download'] : 0)) == 1;
    $sql = "SELECT * FROM `files` WHERE `id` = '" . $id . "';";
    $result = mysqli_query($conn, $sql);
    $basename = is_null($newname) ? mysqli_fetch_assoc($result)['name'] : $newname;
    $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
    if (file_exists($file_location)) {

        header("Content-Type: " . ($download_file ? "application/force-download" : "text/plain") . ";charset=utf-8");
        header("Content-Disposition: " . ($download_file ? "attachment" : "inline") . "; filename=" .  $basename);
        header("Content-Length: " . filesize($file_location));
        if (preg_match("/MSIE ([0-9]\.[0-9]{1,2})/", $_SERVER['HTTP_USER_AGENT'])) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header("Pragma: public");
        } else {
            header('Pragma: no-cache');
        }
        header('TcStorage-Debug:' . mime_content_type($file_location)); //
        readfile($file_location);
    } else {
        http_response_code(404);
        die("Error: File not found.");
    }
    // // header("Content-Type: " . mime_content_type($file_location));
    // // header('Content-Type: application/octet-stream');
    // header('Content-type:application/force-download');
    // header("Content-Transfer-Encoding: Binary");
    // header("Content-Length:" . filesize($file_location));
    // header("Content-Disposition: attachment; filename=" . $basename);
    // header("Cache-Control: public");
    // readfile($file_location);
?>