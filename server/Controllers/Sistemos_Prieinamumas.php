<?php 
class Sistemos_Prieinamumas extends Controller {
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

        $this->get('/darbuotojas/:tabnr', [$this, 'Duomenys_Apie_Darbuotoja']);
    
        $this->post('/registruoti', [$this, 'Darbuotoju_Registravimas']);
        $this->post('/atnaujinti', [$this, 'Redaguoti_Darbuotojo_Duomenis']);
        $this->post('/atnaujinti/ranga', [$this, 'Darbuotojo_Rango_Nustatymas']);
        $this->post('/prisijungti', [$this, 'Darbuotojo_Registracija']);

        $this->mapToMethod($this);
    }

    /**
     * Naujo darbuotojo pridėjimas į sistemą.
     */
    public function Darbuotoju_Registravimas (Request $req, Response $res){
        $db = new Database();

        $successful = $db->Transaction(array(
            Query::generate('
                INSERT INTO `asmuo`(
                    `AsmensKodas`, 
                    `Vardas`, 
                    `Pavarde`, 
                    `Telefono_nr`,
                    `Epastas`,
                    `Gyvenamoji_vieta`,
                    `Gimimo_data`,
                    `Issilavinimas`,
                    `Sveikatos_draudimas`
                ) VALUES (
                    ::asmenskodas,
                    ::vardas,
                    ::pavarde,
                    ::telefononr,
                    ::epastas,
                    ::gyvenamojivieta,
                    ::gimimodata,
                    ::issilavinimas,
                    ::sveikatosdraudimas
                )
             ', array(
                "asmenskodas" => $req->body['asmenskodas'],
                "vardas" => $req->body['vardas'],
                "pavarde" => $req->body['pavarde'],
                "telefononr" => $req->body['telefononr'],
                "epastas" => $req->body['epastas'],
                "gyvenamojivieta" => $req->body['gyvenamojivieta'],
                "gimimodata" => $req->body['gimimodata'],
                "issilavinimas" => $req->body['issilavinimas'],
                "sveikatosdraudimas" => $req->body['sveikatosdraudimas'],
            )),
            Query::generate('
                INSERT INTO `registracija`(
                    `Prisijungimo_vardas`, 
                    `Slaptazodis`, 
                    `Prisijungimo_klausimas`, 
                    `Prisijungimo_atsakymas`
                ) VALUES (
                    ::regist, 
                    ::pass, 
                    ::question, 
                    ::answer
                )
             ', array(
                "regist" => $req->body['regist'],
                "pass" => $req->body['pass'],
                "question" => $req->body['question'],
                "answer" => $req->body['answer'],
            )),
            Query::generate('
                INSERT INTO `darbuotojas`(
                    `Tabelio_nr`, 
                    `Dirba_nuo`,
                    `Alyginimas`,
                    `Etatas`,
                    `Stazas`,
                    `Rangas_id`,
                    `Asmuo_AsmensKodas`,
                    `Registracija_Prisijungimo_vardas`
                ) VALUES (
                    ::tabnr,
                    ::dirbanuo,
                    ::atlyginimas,
                    ::etatas,
                    ::stazas,
                    ::rangas,
                    ::asmenskodas,
                    ::regist
                )
             ', array(
                "tabnr" => $req->body['tabnr'],
                "dirbanuo" => $req->body['dirbanuo'],
                "atlyginimas" => $req->body['atlyginimas'],
                "etatas" => $req->body['etatas'],
                "stazas" => $req->body['stazas'],
                "rangas" => $req->body['rangas'],
                "asmenskodas" => $req->body['asmenskodas'],
                "regist" => $req->body['regist'],
            ))
        ));

        if ($successful){
            $res->send();        
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }

    /**
     * Darbuotojo duomenų gavimas
     */
    public function Duomenys_Apie_Darbuotoja (Request $req, Response $res){
        $db = new Database();
        $result = $db->array_String('
            SELECT 
                /** Informacija apie darbuotoja **/
                `darbuotojas`.`Tabelio_nr`, 
                `darbuotojas`.`Dirba_nuo`, 
                `darbuotojas`.`Alyginimas`, 
                `darbuotojas`.`Etatas`, 
                `darbuotojas`.`Stazas`, 
                
                /** informacija apie asmeni **/
                `asmuo`.`AsmensKodas`,
                `asmuo`.`Vardas`,
                `asmuo`.`Pavarde`,
                `asmuo`.`Telefono_nr`,
                `asmuo`.`Epastas`,
                `asmuo`.`Gyvenamoji_vieta`,
                `asmuo`.`Gimimo_data`,
                `asmuo`.`Issilavinimas`,
                
                /** informacija apie prisijungimus **/
                `registracija`.`Prisijungimo_vardas`,
                `registracija`.`Prisijungimo_klausimas`
                
            FROM `darbuotojas` 
            LEFT JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `darbuotojas`.`Asmuo_AsmensKodas` 
            LEFT JOIN `registracija` ON `registracija`.`Prisijungimo_vardas` = `darbuotojas`.`Registracija_Prisijungimo_vardas` 
            LEFT JOIN `rangas` ON `rangas`.`id` = `darbuotojas`.`Rangas_id`
            WHERE `darbuotojas`.`Tabelio_nr` = ::tabnr
         ', array(
            "tabnr" => $req->params['tabnr']
        ));

        if ($result){
            $res->addResponseData($result, "data");
            $res->send();
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }

    }

    /**
     * Darbuotojo duomenų redagavimas
     */
    public function Redaguoti_Darbuotojo_Duomenis (Request $req, Response $res){
        $successful = $db->Transaction(array(
            Query::generate('
                UPDATE `asmuo` SET
                    `Vardas`              = ::vardas, 
                    `Pavarde`             = ::pavarde, 
                    `Telefono_nr`         = ::telefononr,
                    `Epastas`             = ::epastas,
                    `Gyvenamoji_vieta`    = ::gyvenamojivieta,
                    `Gimimo_data`         = ::gimimodata,
                    `Issilavinimas`       = ::issilavinimas,
                    `Sveikatos_draudimas` = ::sveikatosdraudimas
                WHERE
                    `AsmensKodas`         = ::asmenskodas
             ', array(
                "asmenskodas"           => $req->body['asmenskodas'],
                "vardas"                => $req->body['vardas'],
                "pavarde"               => $req->body['pavarde'],
                "telefononr"            => $req->body['telefononr'],
                "epastas"               => $req->body['epastas'],
                "gyvenamojivieta"       => $req->body['gyvenamojivieta'],
                "gimimodata"            => $req->body['gimimodata'],
                "issilavinimas"         => $req->body['issilavinimas'],
                "sveikatosdraudimas"    => $req->body['sveikatosdraudimas'],
            )),
            Query::generate('
                UPDATE `registracija` SET 
                    `Slaptazodis`            = ::pass
                    `Prisijungimo_klausimas` = ::question
                    `Prisijungimo_atsakymas` = ::answer
                WHERE
                    `Prisijungimo_vardas`    = ::regist
             ', array(
                "regist"    => $req->body['regist'],
                "pass"      => $req->body['pass'],
                "question"  => $req->body['question'],
                "answer"    => $req->body['answer'],
            )),
            Query::generate('
                UPDATE `darbuotojas` SET
                    `Dirba_nuo`  = ::dirbanuo,
                    `Alyginimas` = ::atlyginimas,
                    `Etatas`     = ::etatas,    
                    `Stazas`     = ::stazas
                WHERE 
                    `Tabelio_nr` = ::tabnr,             
             ', array(
                "tabnr" => $req->body['tabnr'],
                "dirbanuo" => $req->body['dirbanuo'],
                "atlyginimas" => $req->body['atlyginimas'],
                "etatas" => $req->body['etatas'],
                "stazas" => $req->body['stazas'],
            ))
        ));
    }

    /**
     * Pakeičiamas darbuotojo rangas
     */
    public function Darbuotojo_Rango_Nustatymas (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `darbuotojas`
            SET `darbuotojas`.`Rangas_id` = ::rangas
            WHERE `darbuotojas`.`Tabelio_nr` = ::tabnr
         ', array(
            "rangas" => $req->body['rangas'],
            "tabnr" => $req->body['tabnr']
        ));
        if ($result){
            $res->send();
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }

    /**
     * Esamo darbuotojo prisijungimas į sistemą.
     */
    public function Darbuotojo_Registracija (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            SELECT 
                /** Asmens informacija **/
                da.`Vardas` AS DVardas,
                da.`Pavarde` AS DPavarde,
                    
                /** Asmens informacija **/
                va.`Vardas` AS VVaradas,
                va.`Pavarde` AS VPavarde,
                
                /** Teisiu informacija**/
                `rangas`.`rangai`,
                `rangas`.`id`
                
            FROM `registracija`
            LEFT JOIN `darbuotojas` ON 	`darbuotojas`.`Registracija_Prisijungimo_vardas` = `registracija`.`Prisijungimo_vardas`
            LEFT JOIN `asmuo` AS da ON 	`darbuotojas`.`Asmuo_AsmensKodas` = da.`AsmensKodas`
            LEFT JOIN `rangas` ON  `rangas`.`id` = `darbuotojas`.`Rangas_id`

            LEFT JOIN `vairuotojas` ON `vairuotojas`.`Registracija_Prisijungimo_vardas` = `registracija`.`Prisijungimo_vardas`
            LEFT JOIN `asmuo` AS va ON `vairuotojas`.`Asmuo_AsmensKodas` = va.`AsmensKodas`
            
            WHERE `registracija`.`Prisijungimo_vardas` = ::username 
                AND `registracija`.`Slaptazodis` = ::password
         ', array(
            "username" => $req->body['username'],
            "password" => $req->body['password']
        ));
        if ($result){
            /** @var mysqli_result $result*/
            if ($result->num_rows == 0){
                return $res->send(Response::BAD_REQUEST);
            }

            $result = $db->array_MysqliResult($result)[0];
            if ($result['DVardas'] != null and $result['DPavarde'] != null){
                $res->addResponseData(array(
                    "Vardas" => $result['DVardas'],
                    "Pavarde" => $result['DPavarde'],
                    "Pareigos" => $result['rangai'],
                    "PareiguKodas" => $result['id']
                ), "data");
            }
            elseif($result['VVaradas'] != null and $result['VPavarde'] != null){
                $res->addResponseData(array(
                    "Vardas" => $result['VVaradas'],
                    "Pavarde" => $result['VPavarde'],
                    "Pareigos" => "Vairuotojas",
                    "PareiguKodas" => -1
                ), "data");
            }
            else {
                return $res->send(Response::BAD_REQUEST);
            }

            $res->addResponseData(password_hash(hash("sha256", $req->body['password']), PASSWORD_BCRYPT), "accessKey");
            return $res->send(Response::OK);
        } 
        else{
            return $res->send(Response::BAD_REQUEST);
        }
    }

}