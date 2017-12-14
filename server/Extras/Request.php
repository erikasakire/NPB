<?php

class Request {
    public $params;
    public $body;

    public function __construct() {
        $this->params = array();
        $this->body = array();
    }

    public function addParam($key, $value){
        $this->params[$key] = $value;
    }
    public function addBody($key, $value){
        $this->body[$key] = $value;
    }
}