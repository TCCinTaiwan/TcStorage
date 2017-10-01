<?
    /**
    * Ace Editor
    *
    * @version 0.1.0
    * @author TCC <john987john987@gmail.com>
    * @date 2017-09-26
    *
    * @since 0.1.0 2017-09-26 TCC: 補上ACE漏掉的擴充功能引用
    */
    include_once 'connect.inc';
    $baseurl = str_replace(realpath($_SERVER['DOCUMENT_ROOT']), "", realpath(dirname(__FILE__))) . "\\"; // 確保引用時，相對路徑的url
    $fileIdList = array_keys(array_flip(explode(",", isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : ""))));
    if (count($fileIdList) == 1) {
        if ($fileIdList[0] == "") {
            $fileIdList = [];
        }
    }
    $fileList = [];
    if (!empty($fileIdList)) {
        for ($i = 0; $i < count($fileIdList); $i++) {
            $id = $fileIdList[$i];
            $sql = "SELECT * FROM `files` WHERE `id` = '" . $id . "';";
            $result = mysqli_query($conn, $sql);
            if ($row = mysqli_fetch_assoc($result)) {
                $file_location = dirname(dirname(__FILE__)) . "\\files\\" . $id;
                if (file_exists($file_location))
                    if ($content = json_encode(file_get_contents($file_location))) { // 假如是binary檔案會回傳null(non-utf-8)
                        array_push(
                            $fileList,
                            array(
                                'id' => $id,
                                'basename' => $row['name'],
                                'file_location' => $file_location,
                                'content' => $content
                            )
                        );
                    }
            }
        }
    }
    if (realpath(__FILE__) == realpath($_SERVER["SCRIPT_FILENAME"])) { // 確認不是引用
        echo "<!DOCTYPE html><title>Ace" . (empty($fileList) ? "" : " - " . $fileList[0]['basename']) . "</title>";
        echo '<link rel="stylesheet" href="' . $baseurl . '../css/reset.css">';
        echo '<link rel="stylesheet" href="' . $baseurl . '../css/ace.css">';
    }
    echo "<script>
        window.history.replaceState(window.history.state, null, window.location.pathname + '" . (empty($fileList) ? "" : "?id=".join(array_column($fileList, "id"), ",")) . "');";
    if (!empty($fileList)) {
        echo "var files = [";
        for ($i = 0; $i < count($fileList); $i++) {
            echo "{
                id: " . $fileList[$i]['id'] . ",
                name: '" . $fileList[$i]['basename'] . "',
                content: " . $fileList[$i]['content'] . ",
                sessions: null
            },";
        }
        // str_replace("\n", ($quotation_mark == "\"" ? "\\" : "") . "\n", file_get_contents($fileList[$i]['file_location']))
        echo '];';
    }
    echo '</script>';
?>
<nav>
    <ul class="tabs"></ul>
</nav>
<div id="e"></div>
<div id="info"><div class="pos"></div><select class="mode"></select><div class="reload_mode">⟳</div></div>
<script src="<?=$baseurl;?>../lib/ace-builds/src/ace.js"></script>
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-modelist.js"></script><!-- 副檔名判斷語法 -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-language_tools.js"></script><!-- 自動完成 -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-emmet.js"></script><!-- 快速產生代碼 https://cloud9ide.github.io/emmet-core/emmet.js -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-settings_menu.js"></script><!-- 選項 -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-keybinding_menu.js"></script><!-- 快捷鍵清單 -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-old_ie.js"></script><!-- IE7 -->
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-linking.js"></script>
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-spellcheck.js"></script>
<script src="<?=$baseurl;?>../lib/ace-builds/src/ext-elastic_tabstops_lite.js"></script>
<script src="<?=$baseurl;?>../js/ext-hoverlink.js"></script>

<!-- <script src="https://ace.c9.io/build/src/ace.js"></script>
<script src="https://ace.c9.io/build/src/ext-modelist.js"></script>
<script src="https://ace.c9.io/build/src/ext-language_tools.js"></script>
<script src="https://ace.c9.io/build/src/ext-emmet.js"></script>
<script src="https://ace.c9.io/build/src/ext-settings_menu.js"></script>
<script src="https://ace.c9.io/build/src/ext-keybinding_menu.js"></script>
<script src="https://ace.c9.io/build/src/ext-old_ie.js"></script> -->
<script src="<?=$baseurl;?>../js/ace.js"></script>