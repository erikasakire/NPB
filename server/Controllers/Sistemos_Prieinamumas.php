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

        $this->get('/darbuotojai', [$this, 'Duomenys_Apie_Darbuotojus']);
        $this->get('/vairuotojai', [$this, 'Vairuotojai']);
        $this->get('/vartotojas/:username', [$this, "Vartotojas"]);

        $this->post('/registruoti/darbuotojas', [$this, 'Darbuotoju_Registravimas']);
        $this->post('/registruoti/vairuotojas', [$this, 'Vairuotoju_Registravimas']);
        $this->post('/atnaujinti/asmuo', [$this, 'Redaguoti_Darbuotojo_Duomenis']);
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
                "question" => "Kas aš?",
                "answer" => $req->body['Vardas'],
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
                "tabnr" => $req->body['Tabelio_nr'],
                "dirbanuo" => (new DateTime())->format("YYYY-mm-dd"),
                "atlyginimas" => 1000,
                "etatas" => 1,
                "stazas" => "",
                "rangas" => 3,
                "asmenskodas" => $req->body['AsmensKodas'],
                "regist" => $req->body['Vardas'],
            ))
        ));

        if ($successful){
            $res->send();        
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function Vartotojas(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("
            SELECT
                `asmuo`.`AsmensKodas`,
                `asmuo`.`Vardas`,
                `asmuo`.`Pavarde`,
                `asmuo`.`Telefono_nr`,
                `asmuo`.`Epastas`,
                `asmuo`.`Gyvenamoji_vieta`,
                `asmuo`.`Gimimo_data`,
                `asmuo`.`Issilavinimas`,
                `asmuo`.`Sveikatos_draudimas`
            FROM
                `asmuo`
            WHERE
                
        ")
    }

    public function Vairuotoju_Registravimas (Request $req, Response $res){
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
    /**
     * Darbuotojo duomenų gavimas
     */
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
                `asmuo`.`Sveikatos_draudimas`
                
                /** informacija apie prisijungimus **/
                `registracija`.`Prisijungimo_vardas`,
                `registracija`.`Prisijungimo_klausimas`,

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
        return $res->send(Response::BAD_REQUEST);
    }
    /**
     * Darbuotojo duomenų redagavimas
     */
    public function Redaguoti_Darbuotojo_Duomenis (Request $req, Response $res){
        $db = new Database();
        $successful = $db->query_Query(
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
            ))
        );
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
}