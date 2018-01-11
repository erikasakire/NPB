<?php

class Uzsakymu_valdiklis extends Controller {

    
    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);

        $this->get('/sarasas', [$this, 'gauti_sarasa']);
        $this->post('/atsaukti', [$this, 'atsaukti_uzsakyma']);
        $this->post('/keisti_pr', [$this, 'keisti_prioriteta']);
        $this->post('/redaguoti', [$this, 'atnaujinti']);
        $this->post('/prideti', [$this, 'naujas_uzsakymas']);

        $this->mapToMethod($this);
    }

    public function gauti_sarasa(Request $req, Response $res) {
        $db = new Database();
        $result = $db->array_String("
        SELECT 

            /** Informacija apie užsakymą **/

            `uzsakymas`.`Numeris`,
            `uzsakymas`.`Uzsakymo_data`,
            `uzsakymas`.`Atlikimo_data`,
            `uzsakymas`.`Prioritetas`,
            `uzsakymas`.`TransportoPriemone`,
            
            /** Būsena **/

            `busena`.`Busenos_id`,
            `busena`.`Busenos_pavadinimas` AS busena,
            `busena`.`Busenos_pavEN` AS busenaEN,

            /** išvykimo padalinys **/

            `pIs`.`Inventorinis_numeris` AS pIs_ID,
            `pIs`.`padalinio_pavadinimas` AS pIs_pavadinimas, 

            /** atvykimo padalinys **/

            `pI`.`Inventorinis_numeris` AS pI_ID,
            `pI`.`padalinio_pavadinimas` AS pI_pavadinimas,

            /** užsakymo sudarytojas ir vairuotojas **/

            `a1`.`Vardas` AS sudare_vardas,
            `a1`.`Pavarde` AS sudare_pavarde,
            `vairuotojas`.`Tabelio_nr` AS `Driver_id`,
            CONCAT (`a2`.`Vardas`, ' ', `a2`.`Pavarde`) AS `Driver`              
        FROM `uzsakymas`
            INNER JOIN `darbuotojas` ON `uzsakymas`.`Suformavo` = `darbuotojas`.`Tabelio_nr`
            INNER JOIN `asmuo` a1 ON `darbuotojas`.`Asmuo_AsmensKodas` = `a1`.`AsmensKodas`
            LEFT JOIN `vairuotojas` ON `uzsakymas`.`Vairuotojas` = `vairuotojas`.`Tabelio_nr`
            LEFT JOIN `asmuo` a2 ON `vairuotojas`.`Asmuo_AsmensKodas` = `a2`.`AsmensKodas`
            INNER JOIN `padalinys` pIs ON `uzsakymas`.`IsPadalinio` = `pIs`.`Inventorinis_numeris`
            INNER JOIN `padalinys` pI ON `uzsakymas`.`IPadalini`= `pI`.`Inventorinis_numeris`
            INNER JOIN `busena` ON `uzsakymas`.`Busena`= `busena`.`Busenos_id`
        ORDER BY `uzsakymas`.`Uzsakymo_data` DESC
        ", array());

        $allWorkers = $db->array_String("
        SELECT
            `darbuotojas`.`Tabelio_nr`,
            `asmuo`.`Vardas`,
            `asmuo`.`Pavarde`,
            `asmuo`.`Issilavinimas`
        FROM `darbuotojas` 
        INNER JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `darbuotojas`.`Asmuo_AsmensKodas`
        ");

        $allDrivers = $db->array_String("
        SELECT
            `vairuotojas`.`Tabelio_nr`,
            CONCAT (`asmuo`.`Vardas`, ' ', `asmuo`.`Pavarde`) AS vardas
        FROM `vairuotojas` 
        INNER JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `vairuotojas`.`Asmuo_AsmensKodas`
        ");
        
        $allStates = $db->array_String("
        SELECT * FROM `busena`
        ");

        $allSubdivisions = $db->array_String("
        SELECT 
            Inventorinis_numeris AS id,
            CONCAT(padalinio_pavadinimas, '. ', Salis, ', ', Rajonas, ', ', Miestas, ', ', Gatve)  AS pavad
        FROM `padalinys`
        ");

        $allVehicles = $db->array_String("
        SELECT 
            `Valstybinis_nr` AS TransportoPriemone,
            CONCAT (`Marke`, ' ', `Modelis`, ' ', `Valstybinis_nr`) AS aprasas
        FROM `transporto_priemone`
        ");

        $res->addResponseData($result, "data");
        $res->addResponseData($allWorkers, "allWorkers");
        $res->addResponseData($allDrivers, "allDrivers");
        $res->addResponseData($allVehicles, "allVehicles");
        $res->addResponseData($allStates, "allStates");
        $res->addResponseData($allSubdivisions, "allSubdivisions");
        
        $res->send();
    }

    public function atsaukti_uzsakyma(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`Busena` = IF (NOT `uzsakymas`.`Busena` =  '3', '4', '3')
            WHERE `uzsakymas`.`Numeris` = ::numeris
         ", array(
            "numeris" => $req->body['Numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function keisti_prioriteta(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`Prioritetas` = ::prior
            WHERE `uzsakymas`.`Numeris` = ::numeris
         ', array(
            "prior" => $req->body['prioritetas'],
            "numeris" => $req->body['numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function naujas_uzsakymas(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
        INSERT INTO `uzsakymas` (
            `Uzsakymo_data`,
            `Prioritetas`,
            `Busena`,
            `Suformavo`,
            `Vairuotojas`,
            `TransportoPriemone`,
            `IsPadalinio`,
            `IPadalini`
            )
        VALUES (
            now(), ::prior,
            ::busena, ::formuotojas, 
            ::vairuotojas, ::tran_priemone,
            ::is_padalinys, ::at_padalinys          
            )
         ', array(
            "uzsakymo_data" => $req->body['uz_data'],
            "prior" => $req->body['prior'],
            "busena" => $req->body['busenos_id'], // tiesiog įvesti 1
            "formuotojas" => $req->body['formuotojo_id'],
            "vairuotojas" => $req->body['vair_id'],
            "tran_priemone" => $req->body['tp_id'],
            "is_padalinys" => $req->body['is_pad_id'],
            "at_padalinys" => $req->body['i_pad_id']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function atnaujinti(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
        UPDATE `uzsakymas`
            SET
            `Atlikimo_data` = ::at_data,
            `Prioritetas` = ::prior,
            `Busena` = ::busena,
            `Suformavo` = ::formuotojas, 
            `Vairuotojas` = ::vairuotojas,
            `TransportoPriemone` = ::tran_priemone,
            `IsPadalinio` = ::is_padalinys,
            `IPadalini` = ::at_padalinys
        WHERE
            `Numeris` = ::nr        
         ', array(
            "nr" => $req->body['id'],
            "at_data" => $req->body['at_data'],
            "prior" => $req->body['prior'],
            "busena" => $req->body['busenos_id'],
            "formuotojas" => $req->body['formuotojo_id'],
            "vairuotojas" => $req->body['vair_id'],
            "tran_priemone" => $req->body['tp_id'],
            "is_padalinys" => $req->body['is_pad_id'],
            "at_padalinys" => $req->body['i_pad_id']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    //pasalinti = atsaukti?
    public function salinti(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            DELETE `uzsakymas` 
            WHERE `uzsakymas`.`Numeris` = ::numeris
         ', array(
            "numeris" => $req->body['numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    //asmenu pasirinkimas
    /*public function asmenys(Request $req, Response $res) {

    }*/
}

?>