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
        /** @var bool */
        $setDatabase = $this->dbc->select_db(DATABASE_SCHEMA);
        
        if (isset($_POST['submit'])){
            if ($lines = file($_POST['sql'])){
                $query = '';
                foreach ($lines as $line){
                    //If line is comment or empty.
                    if (substr($line, 0, 2) == "--" or $line == "" or $line == "\r\n"){
                        continue;
                    }

                    $query .= trim($line);

                    if (substr(trim($query), -1, 1) == ";"){
                        $dbName;
                        if (preg_match("/CREATE DATABASE `([a-zA-Z0-1_]+)`/", $query, $dbName)){
                            $setNewDatabase = true;
                        }
                        if(!$this->dbc->query($query)){
                            $error = isset($error) ? ($error . $this->dbc->error) : $this->dbc->error;
                        }
                        else {
                            if (isset($setNewDatabase) and $setNewDatabase){
                                $setNewDatabase = false;
                                $setDatabase = $this->dbc->select_db($dbName[1]);
                            }
                        }
                        $query = '';
                    }
                }
            }
        }

        //Database schema does not exists.
        //Creating new schema from file.
        if (!$setDatabase){
            ?>
                <html>
                    <head>
                        <style>
                            form{
                                margin: auto;
                                width: 400px;
                                border: 1px solid black;
                                padding: 5px;
                            }
                            div.labelInput{
                                width: 100%;
                            }
                            div.labelInput > label,
                            div.labelInput > input,
                            div.labelInput > button {
                                flex: 1;
                                margin: 10px;
                            }
                            .flex {
                                display: flex;
                            }
                        </style>
                    </head>
                    <form action="" method="post">
                        <div class="labelInput flex" style="margin-bottom: 25px">
                            <?php
                                if (isset($error)){
                                    echo ($error);
                                }
                            ?>
                        </div>
                        <div class="labelInput flex" style="margin-bottom: 25px">
                            Duomenų bazės modelis nerastas.</br>
                            Prašome pasirinkti duomenų bazės SQL failą.
                        </div>
                        <div class="labelInput">
                            <label for="sql">Pasirinkite duomenų bazės sql kodą</label>
                            <input type="file" name="sql" id="sql">
                        </div>
                        <div class="labelInput flex">
                            <button type="submit" name="submit">Tęsti</button>
                        </div>
                    </form>
                </html>
            <?php
        }
        
    }

    /**
     * Function which performs sql query. Sql queries can use placeholders which is defined with :: symbols. Placeholders will be replaced with corresponding value from array. Placeholders are case-insensitive and every value replaced will be escaped.
     * In example:
     *      sql:
     *          "SELECT * FROM table WHERE table.ID = ::ID"
     *      params:
     *          "ID" => 1
     * 
     * @param string $sql - sql string query. Can have placeholders for parameters from params array.
     * @param array|null $params - parameters array to replace placeholders in sql string query.
     * 
     * @return mysqli_result|bool Returns false if operation was unsuccessful, mysqli_result if in 
     * query was used SELECT or other data selection statements, true if INSERT, DELETE, UPDATE, etc
     * opration which does not return data was successful.
     */
    public function query(string $sql, array $params = null){
        if ($params){
            //Replaces all placeholders that has values in params array.
            foreach($params as $key => $value){
                $pattern = '/::' . $key .'\\b/i';
                $sql = preg_replace($pattern, $this->dbc->real_escape_string($value), $sql);
            }
        }
        
        $sqlError;
        if (preg_match_all("/::([^(::)\s]+\b)?/", $sql, $sqlError)){
            ?>
                <html>
                    <body>
                        <div>
                            <p>Cannot find values for these placeholders</p>
                            <?php 
                                foreach($sqlError[0] as $value){ 
                                    echo("<p>$value</p>");
                                }
                            ?>
                        </div>
                    </body>
                </html>
            <?php
        }
        else {
            return $this->dbc->query($sql);
        }
    }

    /**
     * Returns last error message from mysqli class object.
     * @return string Last  error message.
     */
    public function error(){
        return $this->dbc->error;
    }
}
?>