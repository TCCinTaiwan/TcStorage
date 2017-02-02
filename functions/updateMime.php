<?php
    define('APACHE_MIME_TYPES_URL','http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types');
    function updateMime() {
        $mime = [];
        foreach(@explode("\n", @file_get_contents(APACHE_MIME_TYPES_URL)) as $x) {
            if(isset($x[0]) && $x[0] !== '#' && preg_match_all('#([^\s]+)#', $x, $out) && isset($out[1]) && ($c = count($out[1])) > 1) {
                for($i = 1; $i < $c; $i++) {
                    $mime[$out[1][$i]] = $out[1][0];
                }
            }
        }
        if (count($mime) > 0) {
            file_put_contents("../json/mime.json", json_encode($mime));
            echo "更新成功!! 一共" . count($mime) . "種檔案類型被載入";
        } else {
            echo "無法讀取最新檔案!!";
        }
    }
    updateMime();
?>