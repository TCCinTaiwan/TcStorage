<?
    /**
    *  壓縮檔讀取
    *
    *  @version 0.1.0
    *  @author TCC <john987john987@gmail.com>
    */
    include_once 'functions.inc';
    if (isset($_POST['id']) || isset($_GET['id'])) {
        $id = isset($_POST['id']) ? $_POST['id'] : $_GET['id'];
        $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
        if (file_exists($file_location)) {
            $zip_archive = new ZipArchive();
            $zip_archive->open($file_location);
            if ($zip_archive->numFiles > 0) {
                $file_name = isset($_POST['file']) ? $_POST['file'] : (isset($_GET['file']) ? $_GET['file'] : "/");
                if (substr($file_name, -1) == "/") {
                    $list = [];
                    echo "<h1>" . $file_name . "</h1>";
                    if ($file_name != "/") {
                        array_push(
                            $list,
                            "../"
                        );
                    } else {
                        $file_name = "./";
                    }
                    for($i = 0; $i < $zip_archive->numFiles; $i++) {
                        $name = $zip_archive->getNameIndex($i);
                        if (dirname($name) . "/" == $file_name) {
                            array_push(
                                $list,
                                str_replace(dirname($name) . "/", "", $name)
                            );
                        } else if (dirname(dirname($name)) . "/" == $file_name) {
                            array_push(
                                $list,
                                dirname($name) . "/"
                            );
                        }
                    }
                    $list = array_unique($list);
                    // header("Content-Type: application/json;charset=utf-8");
                    // echo json_encode($list);
                    foreach ($list as $value) {
                        echo "<a href='$value'>$value</a><br>";
                    }
                    exit();
                }
                $fp = $zip_archive->getStream($file_name);
                if ($fp) {
                    $content = stream_get_contents($fp);
                    fclose($fp);
                    header("Content-Type: " . getFileMimeType("", $file_name));
                    echo $content;
                    exit();
                }
            }
        }
    }
    http_response_code(404);
?>