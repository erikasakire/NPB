<?php
header("Content-Type:application/json;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST');


include 'Extras/typesEnumerator.php';
$requestType = $_SERVER['REQUEST_METHOD'] == 'GET'  ? typesEnumerator::GET : (
                $_SERVER['REQUEST_METHOD'] == 'POST' ? typesEnumerator::POST : null);
                
if($requestType == null){
    echo(
        json_encode(
            array(
                'error' => 'Request method not valid'
            )
        )
    );
}
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