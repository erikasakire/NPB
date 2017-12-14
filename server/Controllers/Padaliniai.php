<?php

class Padaliniai extends Controller{
    /**
     * Constructor for Padaliniai controller.
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
    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);

        $this->get('/login/:vardas/:pavarde/', [$this, 'login']);
        $this->post('/login/:vardas/:pavare/', [$this, 'login']);

        $this->mapToMethod($this);
    }

    /** Testing function that gets params, and sends them right away */
    public function login(Request $req, Response $res){
        $res->addResponseData($req->body, "body");
        $res->addResponseData($req->params, "params");
        $res->skipEmptyParameters(true);
        $res->send();
    }
}

?>