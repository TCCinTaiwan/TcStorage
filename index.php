<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>檔案管家</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main>
        <menu>
            <li>目前位置：<output class="path"></output></li>
            <li onclick="listPath();">重新整理</li>
            <li onclick="createNew('folder');">建立新資料夾</li>
            <li onclick="createNew('file');">建立空白檔案</li>
            <li>批次命名</li>
            <li onclick="github();">Github</li>
        </menu>
        <div id="fileList"></div>
    </main>
    <menu id="context">
        <li for="file">預覽</li>
        <li for="file">編輯</li>
        <li for="file">下載</li>
        <li for="folder folders file files multiple">刪除</li>
        <li for="folder folders file files">重新命名</li>
    </menu>
    <div id="floatWindow">
        <iframe></iframe>
        <video autoplay autobuffer controls poster="images/loading.gif"></video>
        <img></img>
    </div>
    <script src="js/main.js" charset="utf-8" async></script>
</body>
</html>
