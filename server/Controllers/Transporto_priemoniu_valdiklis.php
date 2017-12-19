<?php

class Transporto_priemoniu_valdiklis extends Controller {

    public function __construct($params, $urlParams, $type) {
        parent::__construct($params, $urlParams, $type);

        $this->get('/neuzimtostp/:id', [$this, 'Neuzimtos_transporto_priemones']);

        $this->mapToMethod();
    }

    public function Neuzimtos_transporto_priemones(Request $req, Response $res){
        $db = new Database();
        if (($result = $db->query_String("
            SELECT 
                `transporto_priemone`.`Valstybinis_nr`, 
                `transporto_priemone`.`Marke`, 
                `transporto_priemone`.`Modelis` 
            FROM `transporto_priemone` 
            LEFT JOIN `transporto_busena` 
                ON `transporto_priemone`.`Transporto_busena_Busenos_id` = `transporto_busena`.`Busenos_id` 
            WHERE `transporto_busena`.`Busenos_id` = ::busena AND `transporto_priemone`.`Vairavimo_kategorija_Kategorijos_id` IN ( 
                SELECT 
                    `vairavimo_kategorija`.`Kategorijos_id` 
                FROM `vairavimo_kategorija` 
                LEFT JOIN `vairuotojo_kategorijos` 
                    ON `vairuotojo_kategorijos`.`Vairavimo_kategorija_Kategorijos_id` = `vairavimo_kategorija`.`Kategorijos_id` 
                LEFT JOIN `vairuotojas` 
                    ON `vairuotojas`.`Vairuotoju_teises_Numeris` = `vairuotojo_kategorijos`.`Vairuotoju_teises_Numeris`
                WHERE `vairuotojas`.`Tabelio_nr` = ::id 
            )
        ", array(
            "busena" => 2,
            "id" => $req->params['id']
        )))){
            if ($result->num_rows == 0){
                $res->addResponseData('Nėra laisvų transporto priemonių', "log");
                return $res->send(Response::NO_CONTENT);
            }
            $result = $db->array_MysqliResult($result);
            $res->addResponseData($result, "data");
            return $res->send(Response::OK);
        }
        $res->addResponseData('Nepavyko gauti duomenų', "error");
        return $res->send(Response::BAD_REQUEST);
    }
}