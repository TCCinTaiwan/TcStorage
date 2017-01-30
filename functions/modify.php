<?
    include_once 'connect.inc';
    $id = (isset($_POST['id']) ? $_POST['id'] : 1);
    $content = (isset($_POST['content']) ? $_POST['content'] : 1);
    echo $content;
    $file = fopen("../files/" . $id, "w");
    fwrite($file, $content);
    fclose($file)
?>