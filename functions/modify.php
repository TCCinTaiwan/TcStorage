<?
    if (isset($_POST['id'])) {
        // include_once 'connect.inc';
        $id = $_POST['id'];
        $content = (isset($_POST['content']) ? $_POST['content'] : "");
        $file = fopen("../files/" . $id, "w");
        fwrite($file, $content);
        fclose($file);
    }
?>