<?php
header("Content-Type:application/json;");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST');


include './Extras/typesEnumerator.php';

if (isset($_GET['systemdefinedcontroller'])){
    
    $params = json_decode(file_get_contents("php://input"));
    $urlParams = explode('/', trim($_GET['urlparametersforget'], '/'));
    $type = $params == null ? typesEnumerator::GET : typesEnumerator::POST;

    if ($type == typesEnumerator::POST and !$params){
        exit;
    }

    include ('./Extras/Controller.php');
    switch($_GET['systemdefinedcontroller']){
        case 'padaliniai': {
            include ('./Controllers/Padaliniai.php');
            new Padaliniai($params, $urlParams, $type);
            break;
        }
        case 'produkcija': {
            include ('./Controllers/Produkcija.php');
            new Produkcija($params, $type);
            break;
        }
        case 'transportas': {
            include ('./Controllers/Transportas.php');
            new Transportas($params, $type);
            break;
        }
    }
}
else{
    echo "Not Found";
}

?>