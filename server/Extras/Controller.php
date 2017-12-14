<?php 

include './Extras/database.php';
include './Extras/Request.php';
include './Extras/Response.php';


class Controller {

    protected $params;
    protected $urlParams;
    protected $type;

    private $post;
    private $get;
    private $delete;
    private $put;

    protected function __construct($params, $urlParams, $type) {
        $this->params = $params;
        $this->urlParams = $urlParams;
        $this->type = $type;

        $this->post = array();
        $this->get = array();
        $this->delete = array();
        $this->put = array();
    }

    protected function mapToMethod(){
        switch($this->type){
            case typesEnumerator::GET: {
                $this->_mapToMethod($this->get, $this->urlParams, $this->params);
                break;
            }
            default: {
                break;
            }
        }
    }

    private function _mapToMethod(array $urls, array $urlParams, $bodyParams){
        foreach($urls as $value){
            $params = explode('/', trim($value['url'], ' /'));

            $matched = false;
            if (count($params) == count($urlParams)){
                $matched = true;
                $req = new Request();

                for($i = 0; $i < count($params); $i++){
                    if (substr($params[$i], 0, 1) != ":"){
                        if ($params[$i] == $urlParams[$i]){
                            continue;
                        }
                        else {
                            $matched = false;
                            break;
                        }
                    }
                    else{
                        $req->addParam(substr($params[$i], 1), $urlParams[$i]);
                    }
                }

                if ($matched){
                    if(isset($bodyParams)){
                        foreach($bodyParams as $key => $value){
                            $req->addBody($key, $value);
                        }
                    }
                    
                    call_user_func($value['method'], $req, new Response());

                    break;
                }
            }
        }
    }

    /**
     * Adds link and its corresponding method to array. 
     * Placeholders can be used, to use one, just type :parameterName in url field. 
     * URL must be symbolic (not abstarct - don't need to provide full address to site). 
     * Trailing slashes are ignored.
     * 
     * 
     * In example:
     *  We have database table which saves persons eyes colors. We need to fetch persons by theirs eyes color.
     *      url:
     *          /colors/:color/
     *      method:
     *          function getByColor(Request $req, Response $res){
     *              echo $req->params['color'];
     *          }
     */
    protected function get(string $url, callable $method){
        array_push($this->get, array(
            "url" => $url,
            "method" => $method
        ));
    }
    /**
     * Adds link and its corresponding method to array. 
     * Placeholders can be used, to use one, just type :parameterName in url field. 
     * URL must be symbolic (not abstarct - don't need to provide full address to site). 
     * Trailing slashes are ignored.
     * Body parameters are awailable to use.
     * 
     * In example:
     *  We have database table which saves persons eyes colors and logins (username and password). We need to fetch persons by theirs eyes color and find one with correct logins. Logins are sent through request body.
     *      url:
     *          /colors/:color/
     *      method:
     *          function getByColor(Request $req, Response $res){
     *              echo $req->params['color'];
     *              echo $req->body['username'];
     *              echo $req->body['password'];
     *          }
     */
    protected function post(string $url, $method){
        array_push($this->post, array(
            "url" => $url,
            "method" => $method
        ));
    }
    /**
     * Adds link and its corresponding method to array. 
     * Placeholders can be used, to use one, just type :parameterName in url field. 
     * URL must be symbolic (not abstarct - don't need to provide full address to site). 
     * Trailing slashes are ignored.
     * Theese requests must be orientated to data deletion from database.
     * 
     * In example:
     *  We have database table which saves persons eyes colors. We need to fetch persons by theirs eyes color.
     *      url:
     *          /colors/:color/
     *      method:
     *          function getByColor(Request $req, Response $res){
     *              echo $req->params['color'];
     *          }
     */
    protected function delete(string $url, $method){
        array_push($this->delete, array(
            "url" => $url,
            "method" => $method
        ));
    }
    /**
     * Adds link and its corresponding method to array. 
     * Placeholders can be used, to use one, just type :parameterName in url field. 
     * URL must be symbolic (not abstarct - don't need to provide full address to site). 
     * Trailing slashes are ignored.
     * Similar to POST
     * 
     * In example:
     *  We have database table which saves persons eyes colors. We need to fetch persons by theirs eyes color.
     *      url:
     *          /colors/:color/
     *      method:
     *          function getByColor(Request $req, Response $res){
     *              echo $req->params['color'];
     *          }
     */
    protected function put(string $url, $method){
        array_push($this->put, array(
            "url" => $url,
            "method" => $method
        ));
    }
    
}