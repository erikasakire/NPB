<?php

class Padaliniai extends Controller{
    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);
        

        $this->get('/login/:vardas/:pavarde/', [$this, 'login']);

        $this->mapToMethod($this);
    }

    public function login(Request $req, Response $res){
        $res->addResponseData($req->body, "body");
        $res->addResponseData($req->params, "params");
        $res->send();
    }
}

?>