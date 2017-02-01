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
?>