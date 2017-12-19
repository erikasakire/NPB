<?php

class Uzsakymu_valdiklis extends Controller {

    
    public function __construct($params, $type) {
        
    }

    public function gauti_sarasa(Request $req, Response $res) {
        $db = new Database();
        $result = $db->query_String('
        SELECT 

            /** Informacija apie užsakymą **/

            `uzsakymas`.`Numeris`,
            `uzsakymas`.`Uzsakymo_data`,
            `uzsakymas`.`Atlikimo_data`,
            `uzsakymas`.`Prioritetas`,
            `uzsakymas`.`TransportoPriemone`,
            
            /** Būsena **/

            `busena`.`Busenos_pavadinimas` AS busenaLT,
            `busena`.`Busenos_pavEN` AS busenaEN,

            /** išvykimo padalinys **/

            `pIs`.`Inventorinis_numeris` AS pIs_ID,
            `pIs`.`padalinio_pavadinimas` AS pIs_pavadinimas, 

            /** atvykimo padalinys **/

            `pI`.`Inventorinis_numeris` AS pI_ID,
            `pI`.`padalinio_pavadinimas` AS pI_pavadinimas,

            /** užsakymo sudarytojas ir vairuotojas **/

            CONCAT(`a1`.`Vardas`, ' ',`a1`.`Pavarde`) AS sudare,
            CONCAT(`a2`.`Vardas`, ' ',`a2`.`Pavarde`) AS vairuotojas
        FROM `uzsakymas`
            INNER JOIN `darbuotojas` ON `uzsakymas`.`Suformavo` = `darbuotojas`.`Tabelio_nr`
            INNER JOIN `asmuo` a1 ON `darbuotojas`.`Asmuo_AsmensKodas` = `a1`.`AsmensKodas`
            LEFT JOIN `vairuotojas` ON `uzsakymas`.`Vairuotojas` = `vairuotojas`.`Tabelio_nr`
            LEFT JOIN `asmuo` a2 ON `vairuotojas`.`Asmuo_AsmensKodas` = `a2`.`AsmensKodas`
            INNER JOIN `padalinys` pIs ON `uzsakymas`.`IsPadalinio` = `pIs`.`Inventorinis_numeris`
            INNER JOIN `padalinys` pI ON `uzsakymas`.`IPadalini`= `pI`.`Inventorinis_numeris`
            INNER JOIN `busena` ON `uzsakymas`.`Busena`= `busena`.`Busenos_id`
        ', array());
        return $result;
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