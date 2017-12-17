<?php 

class Query {
    
    /** @var string $query - query to database string */
    private $query;
    /** @var array $params - params to query placeholders */
    private $params;
    /** @var string|null $parametizedQuery - ready to use query */
    private $parametizedQuery;
    /** @var bool $valid - true if $parametizedQuery is valid, false - othervise */
    private $valid;

    /**
     * Private query constructor.
     * @param string $query - query to database string.
     * @param array|null $params - params to query placeholders.
     */
    private function __construct(string $query, array $params = null) {
        $this->query = $query;
        $this->params = $params;
        return $this;
    }

    /** 
     * Creates instance of Query class.
     * @param string $query - query to database string.
     * @param array|null $params - params to query placeholders.
     */
    public static function generate(string $query, array $params = null){
        return new Query($query, $params);
    }

    /**
     * Gets given query without raplcing placeholders.
     * @param string - given query string.
     */
    public function getQuery(){
        return $this->query;
    }

    /**
     * Returns array of given params.
     * @return array|null - array of given params or null if they are not set.
     */
    public function getParams(){
        return $this->params;
    }

    /**
     * Returns parametized query if it's valid or false if not.
     * @return string|null - paremetized query if it's valid, or false if it's not.
     */
    public function getParametizedQuery(){
        if (!isset($this->parametizedQuery)){
            $this->parametizeQuery((new Database())->_getConnection());
        }

        if(!isset($this->valid)){
            $this->valid = $this->checkValidity();
        }

        if ($this->valid){
            return $this->parametizedQuery;
        }
        else {
            return false;
        }
    }

    /**
     * Create $parametizedQuery by replacing placeholders with values from $params array.
     * @param mysqli $dbc - connection to database, for string escaping.
     */
    private function parametizeQuery(mysqli $dbc){
        $this->parametizedQuery = $this->query;
        if ($this->params != null and !empty($this->params)){
            //Replaces all placeholders that has values in params array.
            foreach($this->params as $key => $value){
                $pattern = "/::$key\b/i";
                $this->parametizedQuery = preg_replace($pattern, '\'' . $dbc->real_escape_string($value) . '\'', $this->parametizedQuery);
            }
        }
        return $this->parametizedQuery;
    }

    /**
     * Checks if $parametizedQuery does not consists any placeholders.
     */
    private function checkValidity():bool{
        if (!isset($this->parametizedQuery)){
            return false;
        }

        if(preg_match("/::([^(::)\s]+\b)?/", $this->parametizedQuery)){
            return false;
        }
        return true;
    }
}