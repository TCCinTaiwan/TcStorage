<?
    /**
    *  公用函數
    *
    *  @version 0.1.2
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-25
    *  @since 0.1.0 TCC: 新增getFileMimeType()
    *  @since 0.1.1 2017-09-25 TCC: 新增getNameWithSerial()
    *  @since 0.1.2 2017-09-25 TCC: 流水號檔名判斷，假如已經是流水號檔名，則繼續編號
    */

    /**
    *  函數名稱
    *		函數描述 (有些會含 HTML 代碼)
    *
    *	@access 		變數可存取的權限 (Example: Public or Private)
    *	@api 			爲第三方來源的變數
    *	@author 		函數建立者名稱 (Example: @author Barry <riceooks[at]gmail.com>)
    *	@category		函數的分類別名，可能某些工具會利用這個來分類你的方法，使好幾個方法歸為某一類，方便做辨識使用
    *	@copyright		函數的版權宣告 (Example: @copyright 隨手寫有限公司 www.barryblogs.com)
    *	@deprecated 	代表不建議使用的函數，未來可能會移除這個方法使用到的某個變數，或整個方法都被刪除
    *	@example 		代表這個函數使用方式可以參考某個資料，可以使用檔案位置或網址 (Example: @example https://www.barryblogs.com/)
    *	@filesource 	這個函數所需的來源
    *	@global			函數內有使用的全域變數註解 (Example: @global Number $user_id)
    *	@ignore 		代表這個函數或區域可以被忽略，通常會加上說明
    *	@internal 		代表這個函數或區域可能只給予內部使用
    *	@license 		此函數可能是含有某個版權或許可 (Example: @license http://opensource.org/licenses/gpl-license.php GNU Public License)
    *	@link 			可能與某個網站有關係 (Example: @link https://www.barryblogs.com/)
    *	@method 		函數有使用的方法 (Example: @method Array @this->getCategories() or @method String getUserName())
    *	@package 		利用這個註解來達到細部分層結構 (Example: @package PSR\Documentation\API or @package PSR\Documentation\Doc)
    *	@param 			函數要帶入的參數 (Example: @param String|Number $username)
    *	@property 		如果這是一個類別的函數，在類別建構時通常會指定初始化參數，而這個函數可能會使用到某些初始化後的參數，稱之為屬性 (Example: @property Resource|Boolean $mysql_connect)
    *	@return 		函數最後的回傳值或形態 (Example: @return Array|Object|Boolean)
    *	@see 			函數參照或關聯的方法 (Example: @see Class User or @see <a href="https://www.barryblogs.com/">BarryBlogs</a>)
    *	@since 			函數內某個使用的變數由哪個版本變動 (Example: @since v1.3376a $user_nickname)
    *	@source 		這個比較特別，在函數中可以標示從 m 至 n 行 是做什麼事情 (Example: @source 14 21 Get user data)
    *	@static 		靜態變數的註解 (Example: @static String $lang = 'zh_TW')
    *	@subpackage 	利用這個註解來達到細部分層子結構，通常會同時使用 @package，可以參考上面的 @package (Example: @package PSR
    *																									   @subpackage Documentation\API)
    *	@throws 		例外處理的註解，有多種例外處理的方式，每種方式都不同 (Example: @throws InvalidArgumentException if the provided argument is not of type 'array'
    *																		    @throws Exception other...)
    *	@todo 			計劃要進行的項目描述，一般應該會使用文字描述
    *	@uses 			代表某個元素可能與其它結構有利用關係 (Example: @uses MyClass::$items to retrieve the count from)
    *	@var 			變數 (物件成員變數) 的形態或描述 (Example: @var Boolean)
    *	@version 		函數的版本 (Example: v1.3258c)
    */
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
    function getFileMimeType($file_location, $file_name = "") {
        if (function_exists('finfo_file')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $type = @finfo_file($finfo, $file_location);
            finfo_close($finfo);
        } else {
            $type = mime_content_type($file_location);
        }

        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $secondOpinion = exec('file -b --mime-type ' . escapeshellarg($file_location), $foo, $returnCode);
            if ($returnCode === 0 && $secondOpinion) {
                $type = $secondOpinion;
            }
        }

        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $mime = @json_decode(file_get_contents("../json/mime.json"), true)[@array_pop(explode('.', $file_name))];
            if (isset($mime)) {
                $type = $mime;
            }
        }
        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $exifImageType = @exif_imagetype($file_location);
            if ($exifImageType !== false) {
                $type = image_type_to_mime_type($exifImageType);
            }
        }

        return $type;
    }

    /**
    *  取得含有流水號的檔案/資料夾名稱
    *       檢查是否重複名稱，如重複就在後面加流水號
    *
    *  @version 0.1.1
    *  @since 0.1.0 2017-09-25 TCC: 新增getNameWithSerial()
    *  @since 0.1.1 2017-09-25 TCC: 流水號檔名判斷，假如已經是流水號檔名，則繼續編號
    *
    *  @param {String} $name 想要命名檔案/資料夾名稱
    *  @param {String} $type 檔案/資料夾
    *  @param {String} $path_id 檢查位置
    *  @global Object $conn MySQL連線
    *  @return String 含有流水號的檔案/資料夾名稱
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
?>