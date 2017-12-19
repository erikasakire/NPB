<?php

class Uzsakymu_Vykdymas extends Controller {
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

        $this->get('/priskirti_vairuotoja/nepriskirtos_busenos', [$this, 'Gauti_Nepriskirtas_Uzduotis']);
        $this->get('/vairuotojo_uzduotys/:id', [$this, 'Vairuotojo_Uzsakymai']);
        $this->get('/uzsakymai', [$this, 'Uzsakymai']);
        $this->get('/uzsakymai/:id', [$this, 'Perziureti_Uzsakymo_Informacija']);
        $this->get('/busenos', [$this, 'Busenos']);

        $this->post('/pakeisti_busena', [$this, 'Pakeisti_Uzsakymo_Busena']);
        $this->post('/priskirti_transporta', [$this, 'Uzsakymui_Priskirti_Transporta']);
        $this->post('/priskirti_vairuotoja', [$this, 'Vairuotojui_Priskirti_Uzsakymus']);

        $this->mapToMethod($this);
    }


    public function Vairuotojui_Priskirti_Uzsakymus (Request $req, Response $res){
        $db = new Database();
        $successfull = [];
        foreach ($req->body['uzsakymai'] as $u){
           $result = $db->query_String('
                UPDATE `uzsakymas`
                SET
                    `uzsakymas`.`Vairuotojas` = ::vairuotojas,
                    `uzsakymas`.`Busena` = ::busena
                WHERE `uzsakymas`.`Numeris` = ::numeris
             ', array(
                "vairuotojas" => $req->body['vairuotojas'],
                "numeris" => $u,
                "busena" => 2
            ));
            
            if($result){
                array_push($successfull, $u);
            }
            else{
                if(count($successfull) == 0){
                    $res->addResponseData("Nepavyko priskirti užsakymams vairuotojų", "error");
                }
                else{
                    foreach($successfull as $s){
                        $res->addResponseData('Sėkmingai priskirtas užsakymas numeris: ' . $s);
                    }
                    $res->addResponseData('Nepavyko pridėti užsakymo numeris: ' . $u, "error");
                }
                $res->addResponseData($db->error(), "log");
                return $res->send(Response::BAD_REQUEST);
            }
        }

        $res->addResponseData("Visos užduotys sėkmingai priskirtos.", "log");
        return $res->send(Response::OK);
    }
    public function Uzsakymui_Priskirti_Transporta (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`TransportoPriemone` = ::tp
            WHERE `uzsakymas`.`Vairuotojas` = ::nr
         ', array(
            "tp" => $req->body['transportoPriemone'],
            "nr" => $req->body['nr']
        ));

        if($result){
            $res->send(Response::OK);
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }
    public function Perziureti_Uzsakymo_Informacija (Request $req, Response $res){
        $db = new Database();
        if(false){
            $db->array_String('
                SELECT 
                    /** Uzsakymo informacija **/
                    `uzsakymas`.`Numeris`,
                    `uzsakymas`.`Uzsakymo_data`,
                    `uzsakymas`.`Atlikimo_data`,
                    `uzsakymas`.`Prioritetas`,
                    
                    /** Busenos informacija **/
                    `busena`.`Busenos_pavadinimas` AS UsakymoBusena,
                    
                    /** Suformavusio darbuotojo informacja **/
                    `suformavoDarbuotojas`.`Tabelio_nr` AS SuformavoTabelioNumeris,
                    `suformavoAsmuo`.`Vardas` AS SuformavoVardas,
                    `suformavoAsmuo`.`Pavarde` AS SuformavoPavarde,
                    
                    /** Vairuotojo informacija **/
                    `vairuotojas`.`Tabelio_nr` AS vairuotojasTabelioNumeris,
                    `vairuotojasAsmuo`.`Vardas` AS vairuotojasVardas,
                    `vairuotojasAsmuo`.`Pavarde` AS vairuotojasPavarde,
                    
                    /** Transporto priemones informacija **/
                    `transporto_priemone`.`Valstybinis_nr`,
                    `transporto_priemone`.`Modelis`,
                    `transporto_priemone`.`Marke`,
                    
                    /** Is padalinio informacija **/
                    `IsPadalinio`.`Inventorinis_numeris` AS IsPadalinioInvNr,
                    `IsPadalinio`.`padalinio_pavadinimas` AS IsPadalinioPavadinimas,
                    `IsPadalinio`.`Salis` AS IsPadalinioSalis,
                    `IsPadalinio`.`Miestas` AS IsPadalinioMiestas,
                    
                    /** Is padalinio informacija **/
                    `IPadalini`.`Inventorinis_numeris` AS IPadalinioInvNr,
                    `IPadalini`.`padalinio_pavadinimas` AS IPadalinioPavadinimas,
                    `IPadalini`.`Salis` AS IPadalinioSalis,
                    `IPadalini`.`Miestas` AS IPadalinioMiestas,

                    
                    /** Uzsakymo produktai **/
                    `produktas`.`Barkodas`,
                    `produktas`.`Pavadinimas`,
                    `produktas`.`Vieneto_kaina`,
                    `produktas`.`Matavimo_vnt`,
                    `uzsakymo_produktas`.`Kiekis`
                
                FROM `uzsakymas`
                LEFT JOIN `busena` ON `uzsakymas`.`Busena` = `busena`.`Busenos_id`
                LEFT JOIN `darbuotojas` AS `suformavoDarbuotojas`  ON `suformavoDarbuotojas`.`Tabelio_nr` = `uzsakymas`.`Suformavo`
                LEFT JOIN `asmuo` AS `suformavoAsmuo` ON `suformavoAsmuo`.`AsmensKodas` = `suformavoDarbuotojas`.`Asmuo_AsmensKodas`
                LEFT JOIN `vairuotojas` ON `vairuotojas`.`Tabelio_nr` = `uzsakymas`.`Vairuotojas`
                LEFT JOIN `asmuo` AS `vairuotojasAsmuo` ON  `vairuotojasAsmuo`.`AsmensKodas` = `vairuotojas`.`Asmuo_AsmensKodas`
                LEFT JOIN `transporto_priemone` ON `transporto_priemone`.`Valstybinis_nr` = `uzsakymas`.`TransportoPriemone`
                LEFT JOIN `padalinys` AS `IsPadalinio` ON `IsPadalinio`.`Inventorinis_numeris` = `uzsakymas`.`IsPadalinio`
                LEFT JOIN `padalinys` AS `IPadalini` ON `IPadalini`.`Inventorinis_numeris` = `uzsakymas`.`IPadalini`
                LEFT JOIN `uzsakymo_produktas` ON `uzsakymas`.`Numeris` = `uzsakymo_produktas`.`Uzsakymas_Numeris`
                LEFT JOIN `produktas` ON `produktas`.`Barkodas` = `uzsakymo_produktas`.`Produktas_Barkodas`
                WHERE `uzsakymas`.`Numeris` = ::id
            ', array(
                "id" => $req->params['id']
            ));
        }
        $result = $db->array_String("
            SELECT * FROM `uzsakymas` WHERE `uzsakymas`.`Numeris` = ::id
        ", array(
            "id" => $req->params['id']
        ));
        $res->addResponseData($result[0], "data");
        return $res->send();
    }

    public function Pakeisti_Uzsakymo_Busena (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`Busena` = ::new 
            WHERE `uzsakymas`.`Numeris` = ::nr
         ', array(
             "new" => $req->body['busena'],
             "nr" => $req->body['numeris']
        ));

        if($result){
            $res->send(Response::OK);
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function Gauti_Nepriskirtas_Uzduotis(Request $req, Response $res){
        $db = new Database();
        if (($result = $db->query_String("
            SELECT
                `uzsakymas`.`Numeris`, 
                `uzsakymas`.`Uzsakymo_data`, 
                `uzsakymas`.`Prioritetas`,
                `uzsakymas`.`Suformavo`, 
                `isp`.`Inventorinis_numeris` AS is_Inventorinis_numeris,
                `isp`.`padalinio_pavadinimas` AS is_padalinio_pavadinimas,
                `isp`.`Miestas` AS is_Miestas,
                `ip`.`Inventorinis_numeris` AS i_Inventorinis_numeris,
                `ip`.`padalinio_pavadinimas` AS i_padalinio_pavadinimas,
                `ip`.`Miestas` AS i_Miestas
            FROM `uzsakymas` 
            LEFT JOIN `padalinys` as `isp` ON `isp`.`Inventorinis_numeris` = `uzsakymas`.`IsPadalinio`
            LEFT JOIN `padalinys` as `ip` ON `ip`.`Inventorinis_numeris` = `uzsakymas`.`IPadalini`
            WHERE `uzsakymas`.`Busena` = '1'
            ORDER BY `uzsakymas`.`Prioritetas` DESC
         ", array("busena" => 1)))){
            if ($result->num_rows == 0){
                $res->addResponseData("Domenų nerasta", "error");
                return $res->send(Response::NO_CONTENT);
            }
            
            $result = $db->array_MysqliResult($result);
            $res->addResponseData($result, "data");
            return $res->send(Response::OK);
        }
        else {
            $res->addResponseData($db->error(), "error");
            return $res->send(Response::BAD_REQUEST);
        }
    }
    public function Vairuotojo_Uzsakymai(Request $req, Response $res){
        $db = new Database();
        if(($result = $db->query_String("
            SELECT
                `uzsakymas`.`Numeris`, 
                `uzsakymas`.`Uzsakymo_data`, 
                `uzsakymas`.`Prioritetas`,
                `uzsakymas`.`Suformavo`, 
                `uzsakymas`.`TransportoPriemone`, 
                `isp`.`Inventorinis_numeris` AS is_Inventorinis_numeris,
                `isp`.`padalinio_pavadinimas` AS is_padalinio_pavadinimas,
                `isp`.`Miestas` AS is_Miestas,
                `ip`.`Inventorinis_numeris` AS i_Inventorinis_numeris,
                `ip`.`padalinio_pavadinimas` AS i_padalinio_pavadinimas,
                `ip`.`Miestas` AS i_Miestas
            FROM `uzsakymas` 
            LEFT JOIN `padalinys` as `isp` ON `isp`.`Inventorinis_numeris` = `uzsakymas`.`IsPadalinio`
            LEFT JOIN `padalinys` as `ip` ON `ip`.`Inventorinis_numeris` = `uzsakymas`.`IPadalini`
            WHERE `uzsakymas`.`Vairuotojas` = ::id
            ORDER BY `uzsakymas`.`Prioritetas` DESC 
         ", array(
            "id" => $req->params['id']
        )))){
            if ($result->num_rows == 0){
                $res->addResponseData("Domenų apie vairuotojo uzsakymus nerasta.", "log");
                return $res->send(Response::NO_CONTENT);
            }
            
            $result = $db->array_MysqliResult($result);
            $res->addResponseData($result, "data");
            return $res->send(Response::OK);
        }
        $res->addResponseData("Klaida vydtant užklausą.", "error");
        $res->addResponseData($db->error(), "log");
        return $res->send(Response::BAD_REQUEST);
    }
    public function Uzsakymai(Request $req, Response $res){
        $db = new Database();
        if (($result = $db->query_String("
            SELECT
                `uzsakymas`.`Numeris`,
                `uzsakymas`.`Uzsakymo_data`,	
                `busena`.`Busenos_pavadinimas` AS `Busena`,	
                `uzsakymas`.`Prioritetas`
            FROM `uzsakymas`
            LEFT JOIN `busena` ON `busena`.`Busenos_id` = `uzsakymas`.`Busena`
        "))){
            if ($result->num_rows == 0){
                return $res->send(Response::NO_CONTENT);
            }
            $res->addResponseData($db->array_MysqliResult($result), "data");
            return $res->send();
        }
        $res->addResponseData($db->error(), "error");
        return $res->send(Response::BAD_REQUEST);
    }
    public function Busenos(Request $req, Response $res){
        $db = new Database();

        $result = $db->array_String("
            SELECT * FROM `busena`
        ");
        $res->addResponseData($result, "data");
        return $res->send();
    }
}