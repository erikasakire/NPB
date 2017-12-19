<?php

class Uzsakymu_valdiklis extends Controller {

    
    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);

        $this->get('/sarasas', [$this, 'gauti_sarasa']);
        $this->post('/atsaukti', [$this, 'atsaukti_uzsakyma']);
        $this->post('/keisti_pr', [$this, 'keisti_prioriteta']);
        $this->post('/redaguoti', [$this, 'atnaujinti_TP_duom']);
        $this->post('/prideti', [$this, 'issaugoti_nauja_TP']);

        $this->mapToMethod($this);
    }

    public function gauti_sarasa(Request $req, Response $res) {
        $db = new Database();
        $result = $db->array_String('
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
            `vairuotojas`.`Tabelio_nr` AS vair_tab_nr,
            `a2`.`Vardas` AS vair_vardas,
            `a2`.`Pavarde` AS vair_pavarde
        FROM `uzsakymas`
            INNER JOIN `darbuotojas` ON `uzsakymas`.`Suformavo` = `darbuotojas`.`Tabelio_nr`
            INNER JOIN `asmuo` a1 ON `darbuotojas`.`Asmuo_AsmensKodas` = `a1`.`AsmensKodas`
            LEFT JOIN `vairuotojas` ON `uzsakymas`.`Vairuotojas` = `vairuotojas`.`Tabelio_nr`
            LEFT JOIN `asmuo` a2 ON `vairuotojas`.`Asmuo_AsmensKodas` = `a2`.`AsmensKodas`
            INNER JOIN `padalinys` pIs ON `uzsakymas`.`IsPadalinio` = `pIs`.`Inventorinis_numeris`
            INNER JOIN `padalinys` pI ON `uzsakymas`.`IPadalini`= `pI`.`Inventorinis_numeris`
            INNER JOIN `busena` ON `uzsakymas`.`Busena`= `busena`.`Busenos_id`
        ', array());

        $allWorkers = $db->array_String("
        SELECT
            `darbuotojas`.`Tabelio_nr`,
            `asmuo`.`Vardas`,
            `asmuo`.`Pavarde`,
            `asmuo`.`Issilavinimas`
        FROM `darbuotojas` 
        INNER JOIN `asmuo` ON `asmuo`.`AsmensKodas` = `darbuotojas`.`Asmuo_AsmensKodas`
        ");
        
        $allStates = $db->array_String("
        SELECT * FROM `busena`
        ");

        $allSubdivisions = $db->array_String("
        SELECT * FROM `padalinys`
        ");

        $res->addResponseData($result, "data");
        $res->addResponseData($allWorkers, "allWorkers");
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
            "numeris" => $req->body['numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    //26 paveikslėlis 18
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
    //auto indentifikavimo nr
    //variklio nr

    public function naujas_uzsakymas(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
        INSERT INTO `uzsakymas` (
            `Numeris`,
            `Uzsakymo_data`,
            `Prioritetas,
            `Busena`,
            `Suformavo`,
            `Vairuotojas`,
            `TransportoPriemone`,
            `IsPadalinio,
            `IPadalini`
            )
        VALUES (
            ::nr, ::uzsakymo_data, ::prior,
            ::busena, ::formuotojas, 
            ::vairuotojas, ::tran_priemone,
            ::is_padalinys, ::at_padalinys          
            )
         ', array(
            "nr" => $req->body['nr'],
            "uzsakymo_data" => $req->body['uzsakymo_data'],
            "prior" => $req->body['prioritetas'],
            "busena" => $req->body['busena'], // tiesiog įvesti 1
            "formuotojas" => $req->body['formuotojas'],
            "vairuotojas" => $req->body['vairuotojas'],
            "tran_priemone" => $req->body['TP_valst_nr'],
            "is_padalinys" => $req->body['is_padalinys'],
            "at_padalinys" => $req->body['at_padalinys']
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
            `Numeris`,
            `Uzsakymo_data`,
            `Prioritetas,
            `Busena`,
            `Suformavo`,
            `Vairuotojas`,
            `TransportoPriemone`,
            `IsPadalinio,
            `IPadalini`
        WHERE
            ::nr, ::uzsakymo_data, ::prior,
            ::busena, ::formuotojas, 
            ::vairuotojas, ::tran_priemone,
            ::is_padalinys, ::at_padalinys         
         ', array(
            "nr" => $req->body['nr'],
            "uzsakymo_data" => $req->body['uzsakymo_data'],
            "prior" => $req->body['prioritetas'],
            "busena" => $req->body['busena'],
            "formuotojas" => $req->body['formuotojas'],
            "vairuotojas" => $req->body['vairuotojas'],
            "tran_priemone" => $req->body['TP_valst_nr'],
            "is_padalinys" => $req->body['is_padalinys'],
            "at_padalinys" => $req->body['at_padalinys']
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