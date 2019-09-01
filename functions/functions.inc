<?php

/**
 * 公用函數
 *
 * @version 0.1.4
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 TCC: 新增getFileMimeType()
 * @since 0.1.1 2017-09-25 TCC: 新增getNameWithSerial()
 * @since 0.1.2 2017-09-25 TCC: 流水號檔名判斷，假如已經是流水號檔名，則繼續編號
 * @since 0.1.3 2019-09-01 TCC: 簡單調整 PHP 排版
 * @since 0.1.4 2019-09-01 TCC: 加上時區
 * @todo 時區由 config 設定
 */

date_default_timezone_set('Asia/Taipei');
// function readableMode($perms) {
//     switch ($perms & 0xF000) {
//         case 0xC000: // socket
//             $info = 's';
//             break;
//         case 0xA000: // symbolic link
//             $info = 'l';
//             break;
//         case 0x8000: // regular
//             $info = '-';
//             break;
//         case 0x6000: // block special
//             $info = 'b';
//             break;
//         case 0x4000: // directory
//             $info = 'd';
//             break;
//         case 0x2000: // character special
//             $info = 'c';
//             break;
//         case 0x1000: // FIFO pipe
//             $info = 'p';
//             break;
//         default: // unknown
//             $info = 'u';
//     }
//     // Autres
//     $info .= $perms & 0x0100 ? 'r' : '-';
//     $info .= $perms & 0x0080 ? 'w' : '-';
//     $info .= $perms & 0x0040 ? ($perms & 0x0800 ? 's' : 'x' ) : ($perms & 0x0800 ? 'S' : '-');

//     // Groupe
//     $info .= $perms & 0x0020 ? 'r' : '-';
//     $info .= $perms & 0x0010 ? 'w' : '-';
//     $info .= $perms & 0x0008 ? ($perms & 0x0400 ? 's' : 'x' ) : ($perms & 0x0400 ? 'S' : '-');

//     // Tout le monde
//     $info .= $perms & 0x0004 ? 'r' : '-';
//     $info .= $perms & 0x0002 ? 'w' : '-';
//     $info .= $perms & 0x0001 ? ($perms & 0x0200 ? 't' : 'x' ) : ($perms & 0x0200 ? 'T' : '-');
//     return $info;
// }

/**
 * 取得檔案的 Mime 類型
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-02-02 TCC: 新增getFileMimeType()
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 *
 * @param {String} $name 檔案位置
 * @param {String} $file_name 檔案/資料夾名稱
 * @return String 檔案的 Mime 類型
 */
function getFileMimeType($file_location, $file_name = "") {
    if (function_exists('finfo_file')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = @finfo_file($finfo, $file_location);
        finfo_close($finfo);
    } else {
        $type = mime_content_type($file_location);
    }

    $unsureMimeTypes = ['application/octet-stream', 'text/plain'];

    if (!$type || in_array($type, $unsureMimeTypes)) {
        $secondOpinion = exec('file -b --mime-type ' . escapeshellarg($file_location), $foo, $returnCode);

        if ($returnCode === 0 && $secondOpinion) {
            $type = $secondOpinion;
        }
    }

    if (!$type || in_array($type, $unsureMimeTypes)) {
        $mime = @json_decode(file_get_contents("../json/mime.json"), true)[@array_pop(explode('.', $file_name))];

        if (isset($mime)) {
            $type = $mime;
        }
    }

    if (!$type || in_array($type, $unsureMimeTypes)) {
        $exifImageType = @exif_imagetype($file_location);

        if ($exifImageType !== false) {
            $type = image_type_to_mime_type($exifImageType);
        }
    }

    return $type;
}

/**
 * 取得含有流水號的檔案/資料夾名稱
 *      檢查是否重複名稱，如重複就在後面加流水號
 *
 * @version 0.1.2
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-25 TCC: 新增getNameWithSerial()
 * @since 0.1.1 2017-09-25 TCC: 流水號檔名判斷，假如已經是流水號檔名，則繼續編號
 * @since 0.1.2 2019-09-01 TCC: 簡單調整 PHP 排版
 *
 * @param {String} $name 想要命名檔案/資料夾名稱
 * @param {String} $type 檔案/資料夾
 * @param {String} $path_id 檢查位置
 * @global Object $conn MySQL連線
 * @return String 含有流水號的檔案/資料夾名稱
 */
function getNameWithSerial($name, $type, $path_id) {
    global $conn;

    $serial_number = 0;

    if ($type == "file") {
        $file_info = pathinfo($name);

        if (preg_match_all("/([\w\W]+)\((\d+)\)/", $file_info['filename'], $output_array)) {
            $file_info['filename'] = $output_array[1][0];
            $serial_number = $output_array[2][0];
        }
    } else {
        if (preg_match_all("/([\w\W]+)\((\d+)\)/", $name, $output_array)) {
            $name = $output_array[1][0];
            $serial_number = $output_array[2][0];
        }
    }

    while (true) {
        if ($type == "file") {
            $serial_number_name = $file_info['filename'] . ($serial_number > 0 ? "(" . $serial_number . ")" : "") . (@$file_info['extension'] == "" ? "" : ".") . @$file_info['extension'];
        } else {
            $serial_number_name = $name . ($serial_number > 0 ? "(" . $serial_number . ")" : "");
        }

        $sql = "SELECT COUNT(*) AS count FROM `" . $type . "s` WHERE `path_id` = '" . $path_id . "' and `name` = '" . $serial_number_name . "';";
        $result = mysqli_query($conn, $sql);

        if ($row = mysqli_fetch_assoc($result)) {
            if ($row["count"] == 0) {
                return $serial_number_name;
            }
        }

        $serial_number++;
    }
}
