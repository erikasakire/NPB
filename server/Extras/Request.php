<?php

class Request {
    public $params;
    public $body;

    /** Creates instance of Request class */
    public function __construct() {
        $this->params = array();
        $this->body = array();
    }

    /**
     * Adds param to request class
     * @param mixed $key - key for parameter's value.
     * @param mixed $value - parameter's value.
     */
    public function addParam($key, $value){
        $this->params[$key] = $value;
    }

    /**
     * Adds body parameter to request class.
     * @param mixed $key - key for parameter's value.
     * @param mixed $value - parameter's value.
     */
    public function addBody($key, $value){
        $this->body[$key] = $value;
    }

    public function getBody($key){
        if (isset($this->body[$key])){
            return $this->body[$key];
        }
        return NULL;
    }
}