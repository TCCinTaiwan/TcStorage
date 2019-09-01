<?php
/**
 * TcStorage多語言
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-28 TCC: 建立多語言locale.inc
 * @since 0.1.0 2017-09-28 TCC: 調整路徑
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 */

//設定多國語言
if(!isset($locale)) {
    $locale = "zh_TW"; // 預設值
}

if (!$results = putenv("LANGUAGE=$locale")) { // LC_ALL LANG
    exit('putenv failed');
}

// if (!$results = setlocale(LC_ALL, $locale, "cht")) {
//     exit('setlocale failed: locale function is not available on this platform, or the given local does not exist in this environment');
// }

// bindtextdomain('main', dirname(__FILE__) . '/nocache'); // DEBUG: 清理Cache用
bindtextdomain("main", dirname(__FILE__)); // 設定語系翻譯的最上層目錄
bind_textdomain_codeset("main", "UTF-8");
textdomain("main"); // 設定mo檔的名稱
clearstatcache(); // DEBUG:
// echo sprintf(_("測試%s"),5);  // 多國語言使用的範例
