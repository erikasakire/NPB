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

        /** Duomenų peržiūra */
        $this->get('/darbuotojai', [$this, 'Duomenys_Apie_Darbuotojus']);
        $this->get('/vairuotojai', [$this, 'Vairuotojai']);
        
        /** Vartotojo informacijos valdymas */
        $this->get('/vartotojas/:username',  [$this, "Redaguoti_Darbuotojo_Duomenis"]);
        $this->post('/vartotojas/:username', [$this, "Redaguoti_Darbuotojo_Duomenis"]);

        /** Darbuotojo rango informacijos valdymas */
        $this->get( '/atnaujinti/ranga/:rangas', [$this, 'Darbuotojo_Rango_Nustatymas']);
        $this->post('/atnaujinti/ranga',         [$this, 'Darbuotojo_Rango_Nustatymas']);

        /** Darbuotoju registracija */
        $this->get ('/registruoti/:rangas',     [$this, 'Darbuotoju_Registravimas']);
        $this->post('/registruoti/:kategorija', [$this, 'Darbuotoju_Registravimas']);

        /** Prisijungimas */
        $this->post('/prisijungti', [$this, 'Darbuotojo_Registracija']);
        

        $this->mapToMethod($this);
    }

    #region vartotojo informacijos valdymas
    public function Redaguoti_Darbuotojo_Duomenis(Request $req , Response $res){
        switch($req->getRequestType()){
            
            case typesEnumerator::GET: {
                $result = $this->GetVartotojas($req->params["username"]);
                if (!$result){
                    $res->addResponseData("Toks vartotojas neegzistuoja.", "message");
                    return $res->send(Response::BAD_REQUEST);
                }
                $res->addResponseData($result);
                return $res->send();
            }
            case typesEnumerator::POST: {
                
                switch($req->body["method_no"]){
                    case 1: { /** Update person data */
                        $result = $this->UpdatePersonData($req->body, $req->params["username"]);
                        if (!$result){
                            $res->addResponseData("Atnaujinti nepavyko", "message");
                            return $res->send(Response::BAD_REQUEST);
                        }
                        return $res->send();
                    }
                    case 2: { /** Update password data */
                        /** Check old password */
                        if (!$this->ValidatePassword($req->params['username'], $req->body['oldPassword'])){
                            return;
                        }
                        /** Check if new passwords are identical */
                        if (!$this->MatchNewPassword($req->body['newPassword'], $req->body['newPassword2'])){
                            return;
                        }
                        /** Change password */
                        if (!$this->UpdatePassword($req->params["username"], $req->body["newPassword"])){
                            return;
                        }

                        $res->addResponseData($this->GenerateAccessKey($req->body["newPassword"]), "accessKey");
                        return $res->send(Response::OK);
                    }
                }
            }
        }
    }
    private function GetVartotojas($username){
        $db = new Database();
        return $db->CallProcedure("getUserData", [$username]); 
    }
    private function UpdatePersonData($params, $username){
        $db = new Database();
        $result =  $db->query_String("
            UPDATE `asmuo` 
            SET 
                `AsmensKodas` = ::ak,
                `Vardas` = ::name, 
                `Pavarde` = ::surname, 
                `Telefono_nr` = ::phone,
                `Epastas` = ::email,
                `Gyvenamoji_vieta` = ::livingIn,
                `Gimimo_data` = ::date,
                `Issilavinimas` = ::degree,
                `Sveikatos_draudimas` = ::insurance 
            WHERE `asmuo`.`AsmensKodas` = (
                SELECT `asmensprisijungimas`.`AsmensKodas` 
                FROM `asmensprisijungimas` 
                WHERE `asmensprisijungimas`.`Prisijungimo_vardas` = ::username
            )
         ", array(
             "ak" => $params["personId"],
             "name" => $params["name"],
             "surname" => $params["surname"],
             "phone" => $params["phone"],
             "email" => $params["email"],
             "livingIn" => $params["livingIn"],
             "date" => $params["birthDate"],
             "degree" => $params["degree"],
             "insurance" => $params["healthInsurance"] ? "1" : "0",
             "username" => $username,
         )
        );

        return !!$result;
    }
    private function ValidatePassword($username, $password){
        $db = new Database();
        $res = new Response();

        /** @var mysqli_result $result - database query result */
        $result = $db->query_String("
            SELECT `registracija`.`Slaptazodis`
            FROM `registracija`
            WHERE `registracija`.`Prisijungimo_vardas` = ::username
            ", array(
            "username" => $username
        ));

        if (!$result){
            $res->addResponseData("Toks vartotojas neegzistuoja.", "message");
            $res->send(Response::BAD_REQUEST);
            return false;
        }

        if ($db->numRows_MysqliResult($result) != 1){
            $res->addResponseData("Nepavyko rasti vartototjo.", "message");
            $res->send(Response::BAD_REQUEST);
            return false;
        }

        /** @var String $result - password */
        $storedPassword = $db->array_MysqliResult($result)[0]['Slaptazodis'];
        do{
            /** Checks if given pasword hash is same as stored one */
            if (hash("sha256", $password) == $storedPassword){
                break;
            }

            /** TEMP */
            if ($password == $storedPassword){
                break;
            }

            /** If password is not access key and not equals to stored one, return BAD REQUEST header */
            $res->addResponseData("Vartotojo vardas ir slaptažodis neteisingi.", "message");
            $res->send(Response::BAD_REQUEST);
            return false;
        }while(false);

        return true;
    }
    private function MatchNewPassword($ps1, $ps2){
        $res = new Response();

        if ($ps1 != $ps2){
            $res->addResponseData("Slaptažodžiai nesutinka", "message");
            $res->send(Response::BAD_REQUEST);
            return false;
        }

        return true;
    }
    private function UpdatePassword($username, $password){
        $db = new Database();
        $res = new Response();

        $result = $db->query_String("
            UPDATE `registracija`
            SET `registracija`.`Slaptazodis` = ::password
            WHERE `registracija`.`Prisijungimo_vardas` = ::username
         ", array (
            "password" => hash("sha256", $password),
            "username" => $username,
        ));

        if (!$result){
            $res->addResponseData("Atnauujinti nepavyko: " . $db->error(), "message");
            $res->send(Response::BAD_REQUEST);
            return false;
        }

        return true;
    }
    private function GenerateAccessKey($password){
        return password_hash(hash("sha256", $password), PASSWORD_BCRYPT);
    }
    #endregion

    #region Darbuotojų registravimas
    public function Darbuotoju_Registravimas(Request $req, Response $res){
        switch($req->getRequestType()){
            case typesEnumerator::GET:{
                return $this->GetPosibleRights($req->params["rangas"]);
            }
            case typesEnumerator::POST:{
                switch($req->params["kategorija"]){
                    case 1:
                    case "darbuotojas":
                    
                        $username = substr($req->body["name"], 0, 3) . substr($req->body["surname"]) . substr($req->body["personId"], -2, 2);
                        $password = "laikinas";

                        $b = new Database();
                        $result = $db->Transaction(
                            $this->NaujasAsmuo(
                                $req->body["personId"],
                                $req->body["name"],
                                $req->body["surname"],
                                $req->body["phone"],
                                $req->body["email"],
                                $req->body["birthDate"],
                                $req->body["healthInsurance"],
                                $req->body["livingIn"],
                                $req->body["degree"]
                            ),
                            $this->NaujaRegistracija(
                                $username,
                                $password
                            ),
                            $this->NaujasDarbuotojas(
                                $req->body["dirbaNuo"],
                                $req->body["etatas"],
                                $req->body["rangas"],
                                $req->body["personId"],
                                $username
                            )
                        );
                        
                        if ($result){
                            $res->send(Response::OK);
                        }
                        else {
                            $res->send(Response::BAD_REQUEST);
                        }

                        break;
                    case 2:
                    case "vairuotojas":
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private function NaujasDarbuotojas($workingFrom, $atatas, $rangas, $personId, $username){
        return Query::generate('
            INSERT INTO `darbuotojas`(
                `Tabelio_nr`, 
                `Dirba_nuo`,
                `Etatas`,
                `Rangas_id`,
                `Asmuo_AsmensKodas`,
                `Registracija_Prisijungimo_vardas`
            ) VALUES (
                (SELECT MAX(Tabelio_nr) + 1 FROM `darbuotojas`),
                ::dirbanuo,
                ::etatas,
                ::rangas,
                ::asmenskodas,
                ::regist
            )
         ', array(
            "dirbanuo" => $workingFrom,
            "etatas" => $atatas,
            "rangas" => $rangas,
            "asmenskodas" => $personId,
            "regist" => $username
        ));
    }
    private function NaujasVairuotojas(){
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
                "asmenskodas" => $req->body['AsmensKodas'],
                "vardas" => $req->body['Vardas'],
                "pavarde" => $req->body['Pavarde'],
                "telefononr" => $req->body['Tabelio_nr'],
                "epastas" => $req->body['Epastas'],
                "gyvenamojivieta" => $req->body['Gyvenamoji_vieta'],
                "gimimodata" => $req->body['Gimimo_data'],
                "issilavinimas" => $req->body['Issilavinimas'],
                "sveikatosdraudimas" => $req->body['Sveikatos_draudimas'] ? 1 : 0,
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
                "regist" => $req->body['Vardas'],
                "pass" => $req->body['Pavarde'],
                "question" => "Kas aš",
                "answer" => $req->body['Vardas'],
            )),
            Query::generate('
                INSERT INTO `vairuotoju_teises`(`Numeris`, `Galioja_nuo`, `Galioja_iki`) VALUES (
                    (SELECT MAX(a1.Numeris) + 1 FROM vairuotoju_teises AS a1),
                    ::from, ::to
                )
            ', array(
                "from" => (new DateTime())->format("Y-m-d"),
                "to" => ((new DateTime())->add(new DateInterval("P2Y")))->formmat("Y-m-d")
            )),
            Query::generate('
                INSERT INTO `vairuotojas`(
                    `Tabelio_nr`, 
                    `Vairavimo_stazas`,
                    `Prasizengimu_sk`,
                    `Profesine_kvalifikacija`, 
                    `Technografo_kortele`,
                    `Registracija_Prisijungimo_vardas`,
                    `Asmuo_AsmensKodas`,
                    `Vairuotoju_teises_Numeris`
                ) VALUES (
                    ::tabnr,
                    ::dirbanuo,
                    ::atlyginimas,
                    ::etatas,
                    ::stazas,
                    ::rangas,
                    ::asmenskodas,
                    (SELECT MAX(Numeris) FROM vairuotoju_teises)
                )
             ', array(
                "tabnr" => $req->body['Tabelio_nr'],
                "dirbanuo" => $req->body['Vairavimo_stazas'],
                "atlyginimas" => $req->body['Prasizengimu_sk'],
                "etatas" => $req->body['Profesine_kvalifikacija'],
                "stazas" => $req->body['Technografo_kortele'] ? 1 : 0,
                "rangas" => $req->body['Vardas'],
                "asmenskodas" => $req->body['AsmensKodas']
            ))
        ));

        if ($successful){
            $res->send();        
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }
    private function NaujasAsmuo($username, $name, $surname, $phone, $email, $bd, $hi, $livingIn = null, $degree = null){
        return Query::generate("
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
                ::1,
                ::2,
                ::3,
                ::4,
                ::5,
                ::6,
                ::7,
                ::8,
                ::9
            )
        ", array(
            "1" => $username,
            "2" => $name,
            "3" => $surname,
            "4" => $phone,
            "5" => $email,
            "6" => $livingIn,
            "7" => $bd,
            "8" => $degree,
            "9" => $hi
        ));
    }
    private function NaujaRegistracija($username, $password){
        return Query::generate("
            INSERT INTO `registracija`(
                `Prisijungimo_vardas`, 
                `Slaptazodis`
            ) VALUES (
                ::1,
                ::2
            )
         ", array(
            "1" => $username,
            "2" => hash("sha256",$password)
         ));
    }
    #endregion

    #region Darbuotojo rango nustatymas
    public function Darbuotojo_Rango_Nustatymas (Request $req, Response $res){
        switch($req->getRequestType()){
            case typesEnumerator::GET: { /** Gaunamos galimų rangų reikšmės */
                return $this->GetPosibleRights($req->params["rangas"]);
            }
            case typesEnumerator::POST: { /** Keičiamas rangas */
                return $this->ChangeUserRights($req->body["user"], $req->body["rights"]);
            }
        }
    }
    private function GetPosibleRights($rights){
        $db = new Database();
        $res = new Response();

        $result = $db->query_String("
            SELECT
                `rangas`.`rangai`,
                `rangas`.`id`
            FROM `rangas`
            WHERE `rangas`.`id` > POW((::rangas - 1), 2)
         ", array(
            "rangas" => $rights
        ));

        if (!$result){
            return 
                $res->addResponseData("Įvyko klaida: " . $db->error(), "message")
                    ->send(Response::BAD_REQUEST);
        }

        if ($result->num_rows == 0){
            return 
                $res->addResponseData("Negauta jokių duomenų.", "message")
                    ->send(Response::NO_CONTENT);
        }

        $res->addResponseData($db->array_MysqliResult($result), "rights")
            ->send(Response::OK);
        return true;
    }
    private function ChangeUserRights($user, $rights){
        $db = new Database();
        $res = new Response();

        $result = $db->query_String("
            UPDATE `darbuotojas`
            SET `darbuotojas`.`Rangas_id` = ::rangas
            WHERE `darbuotojas`.`Tabelio_nr` = ::tabnr
         ", array(
            "rangas" => $rights,
            "tabnr" => $user
        ));

        if (!$result){
            return 
                $res->addResponseData("Įvyko klaida: " . $db->error(), "message")
                    ->send(Response::BAD_REQUEST);
        }

        return 
            $res->send(Response::OK);
    }
    #endregion
    
    #region Prisijungimas
    /**
     * Esamo darbuotojo prisijungimas į sistemą.
     * @param Request $req - Gaunami duomenys:
     *  @param array $body - post kintamieji:
     *      @param String username - vartotojo vardas.
     *      @param String password - vartotojo slaptažodis.
     * 
     * Atliekami veiksmai:
     * Iš duomenų bazės ištraukiami duomenys apie vartotoją pagal jo prisijungimo duomenis.
     * Kadangi iš pradžių nėra žinoma, ar beprisijungiantis vartotojas yra darbuotojas ar
     * vairuotojas, gaunami duomenys tiek iš vienos, tiek iš kitos lentelės. Gauti duomenys
     * yra patikrinami. Patikrinimas vyksta patikrinant gražintų eilučių kiekį. Jeigu eilučių
     * kiekis yra 0, atgal nusiunčiama klaida, kitu atveju daromi tolimesni patikrinimai.
     * Toliau tikrinami duomenys, tiksliau beprisijungiančio asmens vardas ir pavardė, kadangi
     * šie laukai duomenų bazėje yra privalomi, tad tušti nebus. Pagal patikrinimo sąlyga galima
     * nustatyti, ar tai darbuotojas ar vairuotojas. Jeigu tai vairuotojas, tada gražinami jo vardas,
     * pavardė, rangas -> vairuotojas, rangoodas -> -1 (kadangi tokio rango nėra). Jeigu tai darbuotojas,
     * gražinami jo vardas, pavardė, rangas bei rango kodas.
     * Papildomai gražinamas koduotas vartotojo prisijungimo kodas, tolimesnių užklausų autentifikavimui.
     */
    public function Darbuotojo_Registracija (Request $req, Response $res){
        $db = new Database();

        /** @var mysqli_result $result - database query result */
        $result = $db->query_String("
            SELECT `registracija`.`Slaptazodis`
            FROM `registracija`
            WHERE `registracija`.`Prisijungimo_vardas` = ::username
         ", array(
            "username" => $req->body['username']
         ));

        if (!$result){
            $res->addResponseData("Toks vartotojas neegzistuoja.", "message");
            return $res->send(Response::BAD_REQUEST);
        }

        if ($db->numRows_MysqliResult($result) != 1){
            $res->addResponseData("Nepavyko rasti vartototjo.", "message");
            return $res->send(Response::BAD_REQUEST);
        }

        /** @var String $result - password */
        $storedPassword = $db->array_MysqliResult($result)[0]['Slaptazodis'];
        $givenPassword = $req->body['password'];

        do{
            /** Checks if password is access key from cookie */
            if (password_verify($storedPassword, $givenPassword)){
                break;
            }
            /** TEMP */
            if (password_verify(hash("sha256", $storedPassword), $givenPassword)){
                break;
            }

            /** Checks if give pasword is same as stored one */
            if (hash("sha256", $givenPassword) == $storedPassword){
                break;
            }

            /** TEMP */
            if ($givenPassword == $storedPassword){
                break;
            }

            /** If password is not access key and not equals to stored one, return BAD REQUEST header */
            $res->addResponseData("Vartotojo vardas ir slaptažodis neteisingi.", "message");
            return $res->send(Response::BAD_REQUEST);
        }while(false);

        /** If script reaches this place, it means user is verified. */
        $result = array_merge(
            $db->array_String("
                    SELECT 
                        `asmuo`.`Vardas`,
                        `asmuo`.`Pavarde`,
                        `rangas`.`rangai`,
                        `rangas`.`id`
                    FROM `registracija`
                    LEFT JOIN `darbuotojas` ON 	`darbuotojas`.`Registracija_Prisijungimo_vardas` = `registracija`.`Prisijungimo_vardas`
                    LEFT JOIN `asmuo` ON 	`darbuotojas`.`Asmuo_AsmensKodas` = `AsmensKodas`
                    LEFT JOIN `rangas` ON  `rangas`.`id` = `darbuotojas`.`Rangas_id`
                    WHERE `registracija`.`Prisijungimo_vardas` = ::username
                ", array(
                    "username" => $req->body['username']
                )
            ),
            $db->array_String("
                    SELECT 
                        `asmuo`.`Vardas`,
                        `asmuo`.`Pavarde`,
                        'Vairuotojas' AS `rangai`,
                        '-1' AS `id`
                    FROM `registracija`
                    LEFT JOIN `vairuotojas` ON `vairuotojas`.`Registracija_Prisijungimo_vardas` = `registracija`.`Prisijungimo_vardas`
                    LEFT JOIN `asmuo` ON `vairuotojas`.`Asmuo_AsmensKodas` = `AsmensKodas`
                    WHERE `registracija`.`Prisijungimo_vardas` = ::username;
                ", array(
                    "username" => $req->body['username']
                )
            )
        );
        $result = $result[0]['Vardas'] == null ? $result[1] : $result[0];

        $res->addResponseData($result['Vardas'], "Vardas")
            ->addResponseData($result['Pavarde'], "Pavarde")
            ->addResponseData($result['rangai'], "Pareigos")
            ->addResponseData($result['id'], "PareiguKodas")
            ->addResponseData(password_hash(hash("sha256", $givenPassword), PASSWORD_BCRYPT), "accessKey")
            ->send(Response::OK);
    }
    #endregion

    #region Duomenų peržiura
    public function Duomenys_Apie_Darbuotojus (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
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
                `asmuo`.`Sveikatos_draudimas`,
                
                `rangas`.`id`,
                `rangas`.`rangai`
                
            FROM `darbuotojas` 
            LEFT JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `darbuotojas`.`Asmuo_AsmensKodas` 
            LEFT JOIN `registracija` ON `registracija`.`Prisijungimo_vardas` = `darbuotojas`.`Registracija_Prisijungimo_vardas` 
            LEFT JOIN `rangas` ON `rangas`.`id` = `darbuotojas`.`Rangas_id`
         ');

        if ($result){
            if ($result->num_rows == 0){
                return $res->send(Response::NO_CONTENT);
            }
            $result = $db->array_MysqliResult($result);
            $res->addResponseData($result, "data");
            return $res->send();
        }
        $res->addResponseData($db->error(), "message");
        return $res->send(Response::BAD_REQUEST);
    }
    public function Vairuotojai(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            SELECT 
                /** Vairuotojo duomenys */
                `vairuotojas`.`Tabelio_nr`,
                `vairuotojas`.`Vairavimo_stazas`, 
                `vairuotojas`.`Prasizengimu_sk`, 
                `vairuotojas`.`Profesine_kvalifikacija`, 
                `vairuotojas`.`Technografo_kortele`,

                /** Asmens duomenys */
                `asmuo`.`AsmensKodas`, 
                `asmuo`.`Vardas`, 
                `asmuo`.`Pavarde`, 
                `asmuo`.`Telefono_nr`, 
                `asmuo`.`Epastas`, 
                `asmuo`.`Gyvenamoji_vieta`, 
                `asmuo`.`Gimimo_data`, 
                `asmuo`.`Issilavinimas`, 
                `asmuo`.`Sveikatos_draudimas`

            FROM `vairuotojas`
            LEFT JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `vairuotojas`.`Asmuo_AsmensKodas`
        ');

        if($result){
            if ($result->num_rows == 0){
                $res->addResponseData('Vairuotojų nerasta');
                return $res->send(Response::NO_CONTENT);
            }

            $result = $db->array_MysqliResult($result);
            $res->addResponseData($result, "data");
            return $res->send(Response::OK);
        }
        $res->addResponseData($db->error(), "error");
        return $res->send(Response::BAD_REQUEST);
    }
    #endregion
}