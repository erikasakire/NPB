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

        $this->get('/info/:id', [$this, 'Perziureti_Uzsakymo_Informacija']);

        $this->post('/pakeistiBusena', [$this, 'Pakeisti_Uzsakymo_Busena']);
        $this->post('/priskirtiTransporta', [$this, 'Uzsakymui_Priskirti_Transporta']);
        $this->post('/priskirtiVairuotoja', [$this, 'Vairuotojui_Priskirti_Uzsakymus']);

        $this->mapToMethod($this);
    }


    public function Vairuotojui_Priskirti_Uzsakymus (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`Vairuotojas`` = ::vairuotojas
            WHERE `uzsakymas`.`Numeris` = ::numeris
         ', array(
            "vairuotojas" => $req->body['vairuotojas'],
            "numeris" => $req->body['numeris']
        ));

        if($result){
            $res->send();
        }
        else{
            $res->send(Response::BAD_REQUEST);
        }
    }
    public function Uzsakymui_Priskirti_Transporta (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`TransportoPriemone` = ::tp
            WHERE `uzsakymas`.`Numeris` = ::nr
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
        $result = $db->array_String('
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

        $res->addResponseData($result);
        $res->send();
    }
    public function Pakeisti_Uzsakymo_Busena (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String('
            UPDATE `uzsakymas` 
            SET `uzsakymas`.`Busena` = ::new 
            WHERE `uzsakymas`.`Numeris` = ::nr
         ', array(
             "new" => $req->body['newState'],
             "nr" => $req->body['nr']
        ));

        if($result){
            $res->send(Response::OK);
        }
        else {
            $res->send(Response::BAD_REQUEST);
        }
    }
}