<?
    /**
    * TcStorage 首頁
    * @version 0.1.0
    * @author TCC <john987john987@gmail.com>
    * @date 2017-09-28
    * @since 2017-09-28 0.1.0 TCC: 加入多國語言
    */
    if (!file_exists("functions/connect.inc")) { // DEBUG: 確認安裝
        header('Location: install/');
        exit;
    }
    include_once 'functions/locale.inc'; // 載入語言
    error_log(date("Y-m-d H:i:s") . " $_SERVER[REMOTE_ADDR] $_SERVER[REQUEST_URI]" . PHP_EOL . "$_SERVER[HTTP_USER_AGENT]" . PHP_EOL, 3, "logs/index.access.log"); // DEBUG:
?>
<!DOCTYPE html>
<html>
<head>
    <!-- Global Site Tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-107040564-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)};
        gtag('js', new Date());
        gtag('config', 'UA-107040564-1');
    </script>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>檔案管家</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main>
        <menu>
            <!-- <li>目前位置：<output class="path"></output></li> -->
            <li onclick="listPath();"><?=_("Refresh");?></li>
            <li onclick="createNew('folder');"><?=_("New Folder");?></li>
            <li onclick="createNew('file');"><?=_("New File");?></li>
            <li onclick="rename();"><?=_("Rename");?><span>F2</span></li>
            <li onclick="selectAll();"><?=_("Select All");?><span>Ctrl + A</span></li>
            <li onclick="inverseSelect();"><?=_("Select Invert");?><span>Ctrl + I</span></li>
            <li>排列方式</li>
            <li onclick="github();">Github</li>
        </menu>
        <div id="fileList">
            <ul class="breadcrumbs"><li path_id="0" draggable="false">/</li></ul>
            <div class="selectzone"></div>
        </div>
        <div id="dropzone"></div>
        <!-- <div id="selectzone"></div> -->
    </main>
    <menu id="context" type="context">
        <li for="folder">開啟</li>
        <li for="file" onclick="preview();">預覽</li>
        <li for="file">編輯</li>
        <li for="file" onclick="download();">下載</li>
        <li for="folder folders file files multiple" onclick="remove();">刪除</li>
        <li for="folder folders file files" onclick="rename();">重新命名</li>
        <li for="any" onclick="createNew('folder');">建立新資料夾</li>
        <li for="any" onclick="createNew('file');">建立空白檔案</li>
        <li for="any" onclick="listPath();">重新整理</li>
    </menu>
    <div id="floatWindow">
        <iframe id="iframe">你的瀏覽器不支援&lt;iframe&gt;</iframe><!-- Ace Editer -->
        <canvas id="canvas" width="800" height="300">你的瀏覽器不支援&lt;canvas&gt;</canvas>
        <div id="lyric"><div></div></div>
        <video id="video" autoplay autobuffer controls>你的瀏覽器不支援&lt;video&gt;</video><!-- poster="images/loading.gif" -->
        <audio id="audio" autoplay autobuffer controls>你的瀏覽器不支援&lt;audio&gt;</audio>
        <div id="img"></div>
    </div>
    <script src="js/main.js" charset="utf-8" async></script>
</body>
</html>
