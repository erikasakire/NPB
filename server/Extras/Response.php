<?php

class Response{
    private $responseData;
    private $sent;

    public function __construct() {
        $this->responseData = array();
        $this->sent = false;
    }

    public function addResponseData($data, $key = null){
        if ($key == null){
            array_push($this->responseData, $data);
        }
        else {
            $this->responseData[$key] = $data;
        }
    }

    public function send(){
        if (!$this->sent){
            echo(json_encode($this->responseData));
            $this->sent = true;
        }
    }
}

?>