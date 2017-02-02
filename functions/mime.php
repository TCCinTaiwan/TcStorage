<?
    $id = (isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : 1));
    $mime = (isset($_POST['mime']) ? $_POST['mime'] : (isset($_GET['mime']) ? $_GET['mime'] : null));
    if (!$mime) {
?>
    <iframe src="../files/<?=$id?>" onload="window.location.href = 'mime.php?id=<?=$id?>&mime=' + this.contentDocument.contentType;"></iframe>
<?
    } else {
        echo "$mime";
    }
?>