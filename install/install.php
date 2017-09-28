<?
    /**
    *  安裝TcStorage，執行頁
    *
    *  @version 0.1.0
    *  @author TCC <john987john987@gmail.com>
    *  @date 2017-09-27
    *  @since 0.1.0 2017-09-27 TCC: 稍微整理一下快速安裝
    *  @todo 改成新版資料庫結構，如TcStorage.sql(2017-09-28)
    */
?>
<pre>
<?
    if (isset($_POST["server"]) && isset($_POST["database"]) && isset($_POST["account"]) && isset($_POST["password"])) {
        if (!is_dir("../files")) {
            if (mkdir("../files")) {
                echo "資料夾建立成功！\n";
            } else {
                echo "資料夾建立失敗！\n";
            }
        } else {
            echo "資料夾已存在！\n";
        }
        if (!is_dir("../logs")) {
            if (mkdir("../logs")) {
                echo "資料夾建立成功！\n";
            } else {
                echo "資料夾建立失敗！\n";
            }
        } else {
            echo "資料夾已存在！\n";
        }
        $server = $_POST["server"];
        $database = $_POST["database"];
        $account = $_POST["account"];
        $password = $_POST["password"];
        $new_account = $_POST["new_account"] == "" ? $account : $_POST["new_account"];
        $new_password = $_POST["new_password"] == "" ? $password : $_POST["new_password"];
        $conn = @mysqli_connect($server, $account, $password);
        if ($conn) {
            echo "MySQL連線成功！\n";
            $sql = "CREATE DATABASE `$database`;";
            if (mysqli_query($conn, $sql)) {
                echo "資料庫($database)建立成功！\n";
            } else {
                echo "資料庫($database)建立失敗！\n";
            }
            $sql = "GRANT USAGE ON *.* TO `$new_account`@`%` IDENTIFIED BY '$new_password';";
            if (mysqli_query($conn, $sql)) {
                echo "使用者($new_account)新增成功！\n";
            } else {
                echo "使用者($new_account)新增失敗！\n";
            }
            $sql = "GRANT ALL PRIVILEGES ON `$database`.* TO '$new_account'@'%' WITH GRANT OPTION;";
            if (mysqli_query($conn, $sql)) {
                echo "使用者($new_account)權限設定成功！\n";
            } else {
                echo "使用者($new_account)權限設定失敗！\n";
            }
            mysqli_select_db($conn, $database);
            mysqli_set_charset($conn, "utf8");
            $sql = "
CREATE TABLE `files` (
  `id` bigint(20) NOT NULL,
  `path_id` bigint(20) NOT NULL,
  `name` longtext COLLATE utf8_general_mysql500_ci NOT NULL,
  `mime` tinytext COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(files)建立成功！\n";
            } else {
                echo "資料表(files)建立失敗！\n";
            }
            $sql = "ALTER TABLE `files` ADD PRIMARY KEY (`id`);";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(files)建立主索引成功！\n";
            } else {
                echo "資料表(files)建立主索引失敗！\n";
            }
            $sql = "ALTER TABLE `files` MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(files)主索引設定流水號成功！\n";
            } else {
                echo "資料表(files)主索引設定流水號失敗！\n";
            }
            $sql = "
CREATE TABLE `folders` (
  `id` bigint(20) NOT NULL,
  `path_id` bigint(20) NOT NULL,
  `name` longtext COLLATE utf8_general_mysql500_ci NOT NULL,
  `descendant` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(folders)建立成功！\n";
            } else {
                echo "資料表(folders)建立失敗！\n";
            }
            $sql = "ALTER TABLE `folders` ADD PRIMARY KEY (`id`);";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(folders)建立主索引成功！\n";
            } else {
                echo "資料表(folders)建立主索引失敗！\n";
            }
            $sql = "ALTER TABLE `folders` MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;";
            if (mysqli_query($conn, $sql)) {
                echo "資料表(folders)主索引設定流水號成功！\n";
            } else {
                echo "資料表(folders)主索引設定流水號失敗！\n";
            }
            if (!file_exists("../functions/connect.inc")) {
                $file = fopen("../functions/connect.inc", "w");
                $txt = "<?\n    \$dbhost = '$server';\n    \$dbname = '$database';\n    \$dbuser = '$new_account';\n    \$dbpass = '$new_password';\n    \$conn = mysqli_connect(\$dbhost, \$dbuser, \$dbpass, \$dbname) or die('連線錯誤 (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());\n    mysqli_set_charset(\$conn, 'utf8');\n?>";
                fwrite($file, $txt);
                fclose($file);
                if (file_exists("../functions/connect.inc")) {
                    echo "資料庫連線設定成功！\n";
                } else {
                    echo "資料庫連線設定失敗！\n";
                }
            } else {
                echo "資料庫連線設定已存在！\n";
            }
            if (!file_exists(".htaccess")) {
                $file = fopen(".htaccess", "w");
                $txt = "deny from all";
                fwrite($file, $txt);
                fclose($file);
                if (file_exists(".htaccess")) {
                    echo "限制安裝目錄權限成功！\n";
                } else {
                    echo "限制安裝目錄權限失敗！\n";
                }
            } else {
                echo "安裝目錄權限檔案已存在！\n";
            }
        } else {
            echo "MySQL連線失敗！\n";
        }
    } else {
        header('Location: ../');
    }
?>
<a href="../" title=""><button type="button">安裝完成，請刪除install資料夾</button></a>
</pre>