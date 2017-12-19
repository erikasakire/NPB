<?php

class Transporto_priemoniu_valdiklis extends Controller {

    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);

        $this->get('/sarasas', [$this, 'gauti_TP_sarasa']);
        $this->post('/salinti', [$this, 'salinti_TP']);
        $this->post('/redaguoti', [$this, 'atnaujinti_TP_duom']);
        $this->post('/prideti', [$this, 'issaugoti_nauja_TP']);

        $this->mapToMethod($this);
    }

    public function gauti_TP_sarasa(Request $req, Response $res) {
        $db = new Database();
        $result = $db->array_String("
        SELECT 
            /* Transporto priemonės informacija */

            `transporto_priemone`.`Valstybinis_nr`,
            `transporto_priemone`.`Plotis`, 
            `transporto_priemone`.`Aukstis`,
            `transporto_priemone`.`Modelis`,
            `transporto_priemone`.`Marke`,
            `transporto_priemone`.`Galia`,
            `transporto_priemone`.`Variklio_darbinis_turis`,
            `transporto_priemone`.`Rida`,
            `transporto_priemone`.`Pagaminimo_metai`,
            `transporto_priemone`.`Kuro_tipas`, 
            `transporto_priemone`.`Didziausias_leidz_svoris` AS Didziausia_leidz_mase,
            `transporto_priemone`.`Spalva`,
            `transporto_priemone`.`Svoris` AS Mase,
            `transporto_priemone`.`Sedimu_vt_sk` AS Sed_vt_sk,

            /** Draudimo ir apžiūros datos**/

            `transporto_priemone`.`Draudimas_galioja_nuo` AS  Draudimo_pr,
            `transporto_priemone`.`Draudimas_galioja_iki` AS Draudimo_pab, 
            `transporto_priemone`.`Apziura_galioja_nuo` AS Apziuros_pr,
            `transporto_priemone`.`Apziura_galioja_iki` AS Apziuros_pab,

            /** Papildoma informacija  **/

            `vairavimo_kategorija`.`Kategorijos_id` AS Vairavimo_kate_id,
            `vairavimo_kategorija`.`kategorija` AS Vair_Kategorija,
            `transporto_busena`.`Busenos_id`,
            `transporto_busena`.`Busena`,
            `transporto_busena`.`BusenaEN`  

        FROM `transporto_priemone`
        INNER JOIN `transporto_busena` ON `transporto_priemone`.`Transporto_busena_Busenos_id` = `transporto_busena`.`Busenos_id`
        INNER JOIN `vairavimo_kategorija` ON `vairavimo_kategorija`.`Kategorijos_id` = `transporto_priemone`.`Vairavimo_kategorija_Kategorijos_id`
        ");

        $allCars = $db->array_String("
        SELECT * FROM `transporto_priemone`
        ");
        
        $allStates = $db->array_String("
        SELECT * FROM `transporto_busena`
        ");

        $allCategories = $db->array_String("
        SELECT * FROM `vairavimo_kategorija`
        ");

        $res->addResponseData($result, "cars");
        $res->addResponseData($allCars, "allCars");
        $res->addResponseData($allStates, "allStates");
        $res->addResponseData($allCategories, "allCategories");
        
        $res->send();
    }
    
    //26 paveikslėlis 18
    public function issaugoti_busena(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `transporto_priemone` 
            SET `transporto_priemone`.`Transporto_busena_Busenos_id` = ::id
            WHERE `transporto_priemone`.`Valstybinis_nr` = ::numeris
         ', array(
             "id" => $req->body['Transporto_busena_Busenos_id'],
            "numeris" => $req->body['numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }

    //galimi nauji atr:
    // auto indentifikavimo nr
    // variklio nr
    
    public function issaugoti_nauja_TP(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
        INSERT INTO `transporto_priemone` (
            `Valstybinis_nr`, `Plotis`, `Aukstis`,
            `Modelis`, `Marke`, `Galia`, `Rida`,
            `Draudimas_galioja_nuo`, `Draudimas_galioja_iki`,
            `Apziura_galioja_nuo`, `Apziura_galioja_iki`,
            `Pagaminimo_metai`, `Kuro_tipas`, `Svoris`,
            `Sedimu_vt_sk`, `Variklio_darbinis_turis`,
            `Didziausias_leidz_svoris`, `Spalva`,
            `Transporto_busena_Busenos_id`, `Vairavimo_kategorija_Kategorijos_id`
            )
            VALUES (
                ::val_Nr, ::plotis, ::aukstis,
                ::modelis, ::marke, ::galia, ::rida,
                ::draudimo_pradzia, ::draudimo_pab,
                ::apziuros_pradzia, ::apziuros_pab,
                ::pagam_metai, ::kuro_tipas, ::svoris,
                ::sed_vt_sk, ::variklio_turis,
                ::max_svoris, ::spalva,
                ::uzimtumas, ::kategorija            
                )
            ', array(
                "val_Nr" => $req->body['Valstybinis_nr'],
                "plotis" => $req->body['Plotis'],
                "aukstis" => $req->body['Aukstis'],
                "modelis" => $req->body['Modelis'],
                "marke" => $req->body['Marke'],
                "galia" => $req->body['Galia'],
                "rida" => $req->body['Rida'],
                "draudimo_pradzia" => $req->body['Draudimas_galioja_nuo'],
                "draudimo_pab" => $req->body['Draudimas_galioja_iki'],
                "apziuros_pradzia" => $req->body['Apziura_galioja_nuo'],
                "apziuros_pab" => $req->body['Apziura_galioja_iki'],
                "pagam_metai" => $req->body['Pagaminimo_metai'],
                "kuro_tipas" => $req->body['Kuro_tipas'],
                "svoris" => $req->body['Svoris'],
                "sed_vt_sk" => $req->body['Sedimu_vt_sk'],
                "variklio_turis" => $req->body['Variklio_darbinis_turis'],
                "max_svoris" => $req->body['Didziausias_leidz_svoris'],
                "spalva" => $req->body['Spalva'],
                "uzimtumas" => $req->body['Transporto_busena_Busenos_id'],
                "kategorija" => $req->body['Vairavimo_kategorija_Kategorijos_id']
        ));
        
        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }
    
    public function atnaujinti_TP_duom(Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
        UPDATE `transporto_priemone`
            SET
                `Plotis` = ::plotis, `Aukstis` = ::aukstis,
                `Modelis` = ::modelis, `Marke` = ::marke,
                `Galia` = ::galia, `Rida` = ::rida,
                `Draudimas_galioja_nuo` = ::draudimo_pradzia,
                `Draudimas_galioja_iki` = ::draudimo_pab,
                `Apziura_galioja_nuo` = ::apziuros_pradzia,
                `Apziura_galioja_iki` = ::apziuros_pab,
                `Pagaminimo_metai` = ::pagam_metai,
                `Kuro_tipas` = ::kuro_tipas, `Svoris` = ::svoris,
                `Sedimu_vt_sk` = ::sed_vt_sk,
                `Variklio_darbinis_turis` =::variklio_turis,
                `Didziausias_leidz_svoris` = ::max_svoris,
                `Spalva` = ::spalva,
                `Transporto_busena_Busenos_id` = ::busena,
                `Vairavimo_kategorija_Kategorijos_id` = ::kategorija   
            WHERE
                `Valstybinis_nr` = ::nr
        ', array(
            "nr" => $req->body['Valstybinis_nr'],
            "plotis" => $req->body['Plotis'],
            "aukstis" => $req->body['Aukstis'],
            "modelis" => $req->body['Modelis'],
            "marke" => $req->body['Marke'],
            "galia" => $req->body['Galia'],
            "rida" => $req->body['Rida'],
            "draudimo_pradzia" => $req->body['Draudimas_galioja_nuo'],
            "draudimo_pab" => $req->body['Draudimas_galioja_iki'],
            "apziuros_pradzia" => $req->body['Apziura_galioja_nuo'],
            "apziuros_pab" => $req->body['Apziura_galioja_iki'],
            "pagam_metai" => $req->body['Pagaminimo_metai'],
            "kuro_tipas" => $req->body['Kuro_tipas'],
            "svoris" => $req->body['Svoris'],
            "sed_vt_sk" => $req->body['Sedimu_vt_sk'],
            "variklio_turis" => $req->body['Variklio_darbinis_turis'],
            "max_svoris" => $req->body['Didziausias_leidz_svoris'],
            "spalva" => $req->body['Spalva'],
            "busena" => $req->body['Transporto_busena_Busenos_id'],
            "kategorija" => $req->body['Vairavimo_kategorija_Kategorijos_id']
        ));
        
        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }
    
    public function salinti_TP(Request $req, Response $res){
        $db = new Database();

        $result = $db->Transaction(array(
            Query::generate('
                DELETE FROM `transporto_priemone` 
                WHERE `transporto_priemone`.`Valstybinis_nr` = ::numeris
                ', array(
                    "numeris" => $req->body['Valstybinis_nr']
                )
            )
        ));
        
        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }
}

?>