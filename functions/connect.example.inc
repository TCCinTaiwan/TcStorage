<?
    $dbhost = '127.0.0.1';
    $dbname = 'database';
    $dbuser = 'user';
    $dbpass = 'pass';
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die('連線錯誤 (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
    mysqli_set_charset($conn, "utf8");
?>