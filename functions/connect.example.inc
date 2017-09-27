<?
    $dbhost = '127.0.0.1';
    $dbuser = 'user';
    $dbpass = 'pass';
    $dbname = 'database';
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die('連線錯誤 (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
    mysqli_set_charset($conn, "utf8");
?>