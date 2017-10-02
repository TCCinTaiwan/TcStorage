<?
    /**
    *  壓縮檔讀取 FIXME: 合併到raw.php
    *
    *  @version 0.1.1
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-10-01
    *  @since 0.1.1 2017-10-01 TCC: 加註解
    *  @since 0.1.1 2017-10-01 TCC: 功能單一化，類似raw.php
    *
    *  @param Number $_POST['id'] || $_GET['id'] ZIP檔案ID
    *  @param String $_POST['file'] || $_GET['file'] ZIP檔案子路徑
    */
    include_once 'functions.inc';
    header("Content-Type: application/json;charset=utf-8");
    $id = isset($_POST['id']) ? $_POST['id'] : isset($_GET['id']) ? $_GET['id'] : null;
    if (is_null($id)) { // 沒有傳入ID
        http_response_code(404);
        exit();
    }
    $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
    if (!file_exists($file_location)) { // 不存在
        http_response_code(404);
        exit();
    }
    $zip_archive = new ZipArchive();
    $zip_archive->open($file_location);
    $file_count = $zip_archive->numFiles;
    if ($file_count == 0) { // 可能不是ZIP
        http_response_code(404);
        exit();
    }
    $file_name = isset($_POST['file']) ? $_POST['file'] : (isset($_GET['file']) ? $_GET['file'] : "/");
    if (substr($file_name, -1) != "/") { // 假如路徑不是資料夾
        $fp = $zip_archive->getStream($file_name);
        if ($fp) {
            $content = stream_get_contents($fp);
            fclose($fp);
            header("Content-Type: " . getFileMimeType("", $file_name));
            echo $content;
            exit();
        } else {
            http_response_code(404);
            exit();
        }
    } else {
        http_response_code(403);
        exit();
        // 列出該子路徑底下檔案，與file.php功能重複故移除
        //     $list = [];
        //     if ($file_name == "/") { // 當前路徑是主目錄
        //         $file_name = "./";
        //     } else {
        //         array_push( // 加入回上一層
        //             $list,
        //             "../"
        //         );
        //     }
        //     for($i = 0; $i < $file_count; $i++) {
        //         $name = $zip_archive->getNameIndex($i);
        //         if (dirname($name) . "/" == $file_name) {
        //             array_push(
        //                 $list,
        //                 str_replace(dirname($name) . "/", "", $name)
        //             );
        //         } else if (dirname(dirname($name)) . "/" == $file_name) {
        //             array_push(
        //                 $list,
        //                 dirname($name) . "/"
        //             );
        //         }
        //     }
        //     $list = array_unique($list);
        //     echo json_encode($list);
    }
?>