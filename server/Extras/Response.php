<?php

class Response{
    const OK             = 200;
    const NO_CONTENT     = 204;
    const NOT_MODIFIED   = 304;
    const BAD_REQUEST    = 400;
    const NOT_AUTHORIZED = 401;
    const FORBIDDEN      = 403;
    const NOT_FOUND      = 404;

    private $responseData;
    private $sent;
    private $skipEmptyParameters;

    /** Creates instance of Response class */
    public function __construct() {
        $this->responseData = array();
        $this->sent = false;
        $this->skipEmptyParameters = false;
    }

    /** Adds parameter to response array */
    public function addResponseData($data, $key = null){
        if ($key == null){
            array_push($this->responseData, $data);
        }
        else {
            $this->responseData[$key] = $data;
        }
        return $this;
    }

    /** Sends response back to cliet */
    public function send($status = Response::OK){
        if ($this->skipEmptyParameters){
            $array = array();
            foreach($this->responseData as $key => $value){
                if (!empty($value)){
                    $array[$key] = $value;
                }
            }
        }

        if (!$this->sent){
            echo(json_encode($this->skipEmptyParameters ? $array : $this->responseData));
            http_response_code($status);
            $this->sent = true;
        }
        else{
            return new Exception('Response is already sent');
        }
    }

    public function skipEmptyParameters(bool $bool){
        $this->skipEmptyParameters = $bool;
    }
}

?>