<?php 

include 'database.php';
include 'Query.php';
include 'Request.php';
include 'Response.php';


class Controller {

    /** @var array|null $params associative array of post request body params.*/
    protected $params;
    /** @var array $bodyParams - array of url parameters sent to server.
     *      URL like this:
     *          {HOST}/api/padaliniai/login/john/snow
     *      is transformed into 
     *          array('login', 'john', 'snow') */
    protected $urlParams;
    /** @var string $type - string representation of request method, sent using 
     *      typesEnumerator class constants. If there will be need to comapre type,
     *      use typesEnumerator::GET or similar expression to get uniform type name
     *      through system. */
    protected $type;

    /** @var array $post - array of url links with referenced methods to perform POST requests */
    private $post;
    /** @var array $post - array of url links with referenced methods to perform GET requests */    
    private $get;
    /** @var array $post - array of url links with referenced methods to perform DELETE requests */    
    private $delete;
    /** @var array $post - array of url links with referenced methods to perform PUT requests */    
    private $put;

    /** 
     * Contructor of Controller. It's used as parent class for subsystem controllers with default 
     * methods to make controlling easier.
     * @param array|null $params - associative array of post request body params.
     * @param array $urlParams - array of url parameters sent to server.
     *      URL like this:
     *          {HOST}/api/padaliniai/login/john/snow
     *      is transformed into 
     *          array('login', 'john', 'snow')
     *  @param string $type - string representation of request method, sent using 
     *      typesEnumerator class constants. If there will be need to comapre type,
     *      use typesEnumerator::GET or similar expression to get uniform type name
     *      through system.
     */
    protected function __construct($params, $urlParams, $type) {
        $this->params = $params;
        $this->urlParams = $urlParams;
        $this->type = $type;

        $this->post = array();
        $this->get = array();
        $this->delete = array();
        $this->put = array();
    }

    /**
     * Maps current url to method by checking templates.
     */
    protected function mapToMethod(){ 
        switch($this->type){
            case typesEnumerator::GET: {
                return $this->_mapToMethod($this->get, $this->urlParams, $this->params);
            }
            case typesEnumerator::POST: {
                return $this->_mapToMethod($this->post, $this->urlParams, $this->params);
            }
            default: {
                break;
            }
        }
    }

    /**
     * Maps current url to method by checking templates.
     * @param array $urls - url templates sorted by request method.
     * @param array $urlParams - url line parameters separated by /.
     * @param array $bodyParams - if request method is POST and has body values, they references in this array.
     */
    private function _mapToMethod(array $urls, array $urlParams, array $bodyParams = null){
        foreach($urls as $url){
            $params = explode('/', trim($url['url'], ' /'));

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
                    
                    return call_user_func($url['method'], $req, new Response());
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
     * @param string $url - url template to be able reference $method.
     * @param callable $method - method to call if url template matches current url.
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
     * @param string $url - url template to be able reference $method.
     * @param callable $method - method to call if url template matches current url.
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
     * @param string $url - url template to be able reference $method.
     * @param callable $method - method to call if url template matches current url.
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
     * @param string $url - url template to be able reference $method.
     * @param callable $method - method to call if url template matches current url.
     */
    protected function put(string $url, $method){
        array_push($this->put, array(
            "url" => $url,
            "method" => $method
        ));
    }
    
}