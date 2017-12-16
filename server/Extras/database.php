<?php
include 'database.config.php';

class Database {
    /** @var mysqli mysqli connection variable */
    private $dbc;

    /**
     * Constructs class Database which is used to perform query calls to database.
     */
    public function __construct() {
        $this->dbc = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD);
        $this->dbc->select_db(DATABASE_SCHEMA);
        $this->dbc->set_charset('utf8');
       return $this;
    }


    /**
     * Calls query on database
     * @param string $query - query to database string.
     * @param array|null $params - params to query placeholders.
     */
    public function query_String(string $query, array $params = null){
        return $this->_query(Query::generate($query, $params));
    }
    /**
     * Calls query on database
     * @param Query $query - query class instance with query string and params.
     */
    public function query_Query(Query $query){
        return $this->_query($query);
    }


    /**
     * Returns query data as array.
     * @param string $query - query to database string.
     * @param array|null $params - params to query placeholders.
     * @return array query data as array.
     */
    public function array_String(string $query, array $params = null){
        return $this->array_MysqliResult($this->query_String($query, $params));
    }
    /**
     * Returns query data as array.
     * @param Query $query - query class instance with query string and params.
     * @return array query data as array.
     */
    public function array_Query(Query $query){
        return $this->array_Query($query);
    }
    /**
     * Returns query data as array.
     * @param mysqli_result $result - result of query on database.
     * @return array query data as array.
     */
    public function array_MysqliResult(mysqli_result $result = null){
        if ($result == null){
            return array();
        }
        $array = array();
        while(($row = $result->fetch_assoc())){
            array_push($array, $row);
        }
        return $array;
    }

    /** 
     * Returns number of rows in query result.
     * @param string $query - query to database string.
     * @param array|null $params - params to query placeholders.
     * @return int number of rows in result.
     */    
    public function numRows_String (string $query, array $params = null){
        return $this->numRows_MysqliResult($this->query_String($query, $params));
    }
    /**
     * Returns number of rows in query result.
     * @param Query $query - query class instance with query string and params.
     * @return int number of rows in result.
     */
    public function numRows_Query (Query $query){
        return $this->numRows_MysqliResult($this->query_Query($query));
    }
    /**
     * Returns number of rows in query result.
     * @param mysqli_result $result - result of query on database.
     * @return int number of rows in result.
     */
    public function numRows_MysqliResult (mysqli_result $result = null){
        if ($result == null){
            return 0;
        }
        return $result->num_rows;
    }


    /**
     * Performs transaction on database.
     * @param array $queries - array of Query class instances queries.
     */
    public function Transaction(array $queries){
        if (empty($queries)){
            return true;
        }

        do{
            $this->dbc->autocommit(false);

            foreach($queries as $q){
                $result = $this->_query($q);
                if (!$result){
                    $erroc = true;
                    break;
                }
            }
            if(isset($erroc)){ break; }

            $this->dbc->commit();
            $this->dbc->autocommit(true);
            return true;
        }while(false);

        $this->dbc->rollback();
        $this->dbc->autocommit(true);
        return false;
    }


    /**
     * Returns last error message from mysqli class object.
     * @return string Last  error message.
     */
    public function error(){
        return $this->dbc->error;
    }

    /**
     * Performs query to database.
     * @param Query $query - query class instance with query string and params.
     * @return mysqli_result - If it's SELECTIVE query.
     * @return bool - if it's DELETING, or UPDATING function. Posible too, when tere is error in query.
     * @return mixed - Insert ID, if it's INSERT function.
     */
    private function _query(Query $query){
        if($query->getParametizedQuery()){
            $result = $this->dbc->query($query->getParametizedQuery());
            /** Error in query */
            if ($result == false){
                return false;
            }
            /** Insert function successfull */
            if ($this->dbc->insert_id != 0){
                return $this->dbc->insert_id;
            }
            /** bool: DELETION or UPDATE queries was successfull */
            /** mysqli_result: SELECTIVE query was succesfull */
            return $result;
        }
        else{
            return false;
        }
    }

    /**
     * Retruns connection to database.
     * @return mysqli connection to databse.
     */
    public function _getConnection(){
        return $this->dbc;
    }
}
?>