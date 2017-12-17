<?php

class Transporto_priemoniu_valdiklis extends Controller {

    public function __construct($params, $type) {
        
    }

    public function gauti_TP_sarasa(Request $req, Response $res) {
        $db = new Database();
        $result = $db->query_String('
        SELECT 
            /* Transporto priemonės informacija */

            `transporto_priemone`.`Valstybinis_nr`,
            `transporto_priemone`.`Plotis`, 
            `transporto_priemone`.`Aukstis`,
            `transporto_priemone`.`Modelis`,
            `transporto_priemone`.`Galia`,
            `transporto_priemone`.`Variklio_darbinis_turis`,
            `transporto_priemone`.`Rida`,
            `transporto_priemone`.`Pagaminimo_metai`,
            `transporto_priemone`.`Kuro_tipas`, 
            `transporto_priemone`.`Didziausias_leidz_svoris`,
            `transporto_priemone`.`Spalva`,
            `transporto_priemone`.`Svoris`,
            `transporto_priemone`.`Sedimu_vt_sk`,

            /** Draudimo ir apžiūros datos**/

            CONCAT(`transporto_priemone`.`Draudimas_galioja_nuo`, ' - ', `transporto_priemone`.`Draudimas_galioja_iki`) AS draudimas, 
            CONCAT(`transporto_priemone`.`Apziura_galioja_nuo`, ' - ' , `transporto_priemone`.`Apziura_galioja_iki`) AS apziura,

            /** Papildoma informacija  **/

            `vairavimo_kategorija`.`kategorija`,
            `transporto_busena`.`Busena`,
            `transporto_busena`.`BusenaEN`  

        FROM `transporto_priemone`
        INNER JOIN `transporto_busena` ON `transporto_priemone`.`Transporto_busena_Busenos_id` = `transporto_busena`.`Busenos_id`
        INNER JOIN `vairavimo_kategorija` ON `vairavimo_kategorija`.`Kategorijos_id` = `transporto_priemone`.`Vairavimo_kategorija_Kategorijos_id`
        ', array());
        return $result;
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
            `Valstybinis_nr`, `Plotis`, `Aukstis,
            `Modelis`, `Marke`, `Galia, `Rida`,
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
                ::pagam_metai, ::kuro_tipas, :: svoris,
                ::sed_vt_sk, ::variklio_turis,
                ::max_svoris, ::spalva,
                ::uzimtumas, ::kategorija            
                )
                ', array(
                    "val_Nr" => $req->body['valstyb_nr'],
                    "plotis" => $req->body['plotis'],
                    "aukstis" => $req->body['aukstis'],
                    "modelis" => $req->body['modelis'],
                    "marke" => $req->body['marke'],
                    "galia" => $req->body['galia'],
                    "rida" => $req->body['rida'],
                    "draudimo_pradzia" => $req->body['draudimas_nuo'],
                    "draudimo_pab" => $req->body['draduimas_iki'],
                    "apziuros_pradzia" => $req->body['apziura_nuo'],
                    "apziuros_pab" => $req->body['apziura_iki'],
                    "pagam_metai" => $req->body['pagam_metai'],
                    "kuro_tipas" => $req->body['kuro_tipas'],
                    "svoris" => $req->body['mase'],
                    "sed_vt_sk" => $req->body['sed_vt_sk'],
                    "max_svoris" => $req->body['max_mase'],
            "spalva" => $req->body['spalva'],
            "uzimtumas" => $req->body['uzimtumo_K'],
            "kategorija" => $req->body['v_kategorija']
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
        `Plotis`, `Aukstis,
        `Modelis`, `Marke`,
        `Galia, `Rida`,
        `Draudimas_galioja_nuo`,
        `Draudimas_galioja_iki`,
        `Apziura_galioja_nuo`,
        `Apziura_galioja_iki`,
        `Pagaminimo_metai`,
        `Kuro_tipas`, `Svoris`,
        `Sedimu_vt_sk`,
        `Variklio_darbinis_turis`,
        `Didziausias_leidz_svoris`,
        `Spalva`,
        `Vairavimo_kategorija_Kategorijos_id`
        WHERE
        `Plotis` = ::plotis, `Aukstis` = ::aukstis,
        `Modelis` = ::modelis, `Marke` = ::marke,
        `Galia` = ::galia, `Rida` = ::rida,
        `Draudimas_galioja_nuo` = ::draudimo_pradzia,
        `Draudimas_galioja_iki` = ::draudimo_pab,
        `Apziura_galioja_nuo` = ::apziuros_pradzia,
        `Apziura_galioja_iki` = ::apziuros_pab,
        `Pagaminimo_metai` = ::pagam_metai,
        `Kuro_tipas` = ::kuro_tipas, `Svoris` = :: svoris,
        `Sedimu_vt_sk` = ::sed_vt_sk,
        `Variklio_darbinis_turis` =::variklio_turis,
        `Didziausias_leidz_svoris` = ::max_svoris,
        `Spalva` = ::spalva,
        `Vairavimo_kategorija_Kategorijos_id` = ::kategorija            
        ', array(
            "plotis" => $req->body['plotis'],
            "aukstis" => $req->body['aukstis'],
            "modelis" => $req->body['modelis'],
            "marke" => $req->body['marke'],
            "galia" => $req->body['galia'],
            "rida" => $req->body['rida'],
            "draudimo_pradzia" => $req->body['draudimas_nuo'],
            "draudimo_pab" => $req->body['draduimas_iki'],
            "apziuros_pradzia" => $req->body['apziura_nuo'],
            "apziuros_pab" => $req->body['apziura_iki'],
            "pagam_metai" => $req->body['pagam_metai'],
            "kuro_tipas" => $req->body['kuro_tipas'],
            "svoris" => $req->body['mase'],
            "sed_vt_sk" => $req->body['sed_vt_sk'],
            "max_svoris" => $req->body['max_mase'],
            "spalva" => $req->body['spalva'],
            "kategorija" => $req->body['v_kategorija']
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
        $result = $db->query_String('
        DELETE `transporto_priemone` 
        WHERE `transporto_priemone`.`Valstybinis_nr` = ::numeris
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
    /* public function pasirinkti_TP(Request $req, Response $res){
         $db = new Database();
         $result = $db->query_String('
         SELECT `transporto_priemone`.`Valstybinis_nr`, `transporto_priemone`.`Plotis`, 
             `transporto_priemone`.`Aukstis`, `transporto_priemone`.`Modelis`,
             `transporto_priemone`.`Galia`, `transporto_priemone`.`Variklio_darbinis_turis`,
             `transporto_priemone`.`Rida`,
             CONCAT(`transporto_priemone`.`Draudimas_galioja_nuo`, ' - ', `transporto_priemone`.`Draudimas_galioja_iki`) AS draudimas, 
             CONCAT(`transporto_priemone`.`Apziura_galioja_nuo`, ' - ' , `transporto_priemone`.`Apziura_galioja_iki`) AS apziura,
             `transporto_priemone`.`Pagaminimo_metai`, `transporto_priemone`.`Kuro_tipas`, 
             `transporto_priemone`.`Didziausias_leidz_svoris`, `transporto_priemone`.`Spalva`,
             `transporto_busena`.`Busena`, `transporto_busena`.`BusenaEN`, `vairavimo_kategorija`.`kategorija`,
             `transporto_priemone`.`Svoris`, `transporto_priemone`.`Sedimu_vt_sk`
         FROM `transporto_priemone`
         INNER JOIN `transporto_busena` ON `transporto_priemone`.`Transporto_busena_Busenos_id` = `transporto_busena`.`Busenos_id`
         INNER JOIN `vairavimo_kategorija` ON `vairavimo_kategorija`.`Kategorijos_id` = `transporto_priemone`.`Vairavimo_kategorija_Kategorijos_id`
         WHERE `transporto_priemone`.`Valstybinis_nr` = ::nr
         ', array(
             "nr" => $req->body['Valstybinis_nr']
         ));
     
         if($result){
             $res->send();
         }
         else{
             $res->send(Response::BAD_REQUEST);
         }
     }*/
}

?>