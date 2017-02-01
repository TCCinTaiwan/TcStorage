<?
    // echo json_encode(getallheaders());
    // echo $_SERVER['REQUEST_METHOD'];
    // echo count([1, 2, 3]);
    // phpinfo();
    $temp = [
        array("id" => 5, "g" => 123),
        array("id" => 2),
        array("id" => 1)
    ];
    var_dump(json_encode(file_get_contents("../files/1")));
    $file_info = pathinfo('/www/htdocs/index.');
    echo ($file_info['extension'] == "" ? "" : ".") . $file_info['extension'];
    // echo $file_info['dirname'], "<br>";
    // echo $file_info['basename'], "<br>";
    // echo $file_info['extension'], "<br>";
    // echo $file_info['filename'], "<br>";
?>