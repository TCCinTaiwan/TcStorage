<?
    /**
    * TcStorage多語言
    * @version 0.1.0
    * @author TCC <john987john987@gmail.com>
    * @date 2017-09-28
    * @since 2017-09-28 0.1.0 TCC: 建立多語言locale.inc
    * @since 2017-09-28 0.1.0 TCC: 調整路徑
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
?>