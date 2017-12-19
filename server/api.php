<?php
header("Content-Type:application/json;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST');

include_once 'Extras/typesEnumerator.php';
include_once 'Extras/database.php';
include_once 'Extras/Query.php';
include_once 'Extras/Request.php';
include_once 'Extras/Response.php';

$requestType = $_SERVER['REQUEST_METHOD'] == 'GET'  ? typesEnumerator::GET : (
                $_SERVER['REQUEST_METHOD'] == 'POST' ? typesEnumerator::POST : (
                 $_SERVER['REQUEST_METHOD'] == 'OPTIONS' ? typesEnumerator::OPTIONS : null
                ));
                


if($requestType == null){
    $res = new Response();
    $res->addResponseData('Request method not valid', 'error');
    $res->send(Response::BAD_REQUEST);
}

// $whitelist = array(

// );

// /** Checks if authorization i set */
// if (!isset($_SERVER['PHP_AUTH_USER']) and !isset($_SERVER['PHP_AUTH_PW'])){
//     $res = new Response();
//     $res->addResponseData('Not authorized to access this link.', 'error');
//     return $res->send(Response::NOT_AUTHORIZED);
// }

// /** Checks if authorization is valid */
// if(($result = (($db = new Database())->query_String('SELECT `Slaptazodis` FROM `registracija` WHERE `Prisijungimo_vardas` = ::username', array("username" => $_SERVER['PHP_AUTH_USER']))))){
//     $password = $db->array_MysqliResult($result);
//     $res = new Response();
//     $res->addResponseData($password, "pass");
//     $res->send(Response::OK);
// }

/**
 * @var array $requestParams - array of query params.
 *    @var strign $requestParams[0] - must be 'api', as identifier
 *                  to access server api.
 *    @var string $requestParams[1] - must be controller reference.
 *                  Reference must be included into routes.json file.
 */
$requestParams = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
if ($requestParams[0] == 'api'){
    $routes = json_decode(file_get_contents('routes.json'), true);
    
    if ($requestType == typesEnumerator::POST){

        $params = json_decode(file_get_contents("php://input"), true);
    }

    if (isset($routes[$requestParams[1]])){
        $route = $routes[$requestParams[1]];

        include("Extras/Controller.php");
        include("Controllers/$route.php");
        return new $route(
            isset($params) ? $params : null,
            array_slice($requestParams, 2),
            $requestType
        );
    }
    else {

    }
}
?>