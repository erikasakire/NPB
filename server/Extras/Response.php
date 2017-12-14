<?php

class Response{
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
    }

    /** Sends response back to cliet */
    public function send(){
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
            $this->sent = true;
        }
        else{
            return Exception('Response is already sent');
        }
    }

    public function skipEmptyParameters(bool $bool){
        $this->skipEmptyParameters = $bool;
    }
}

?>