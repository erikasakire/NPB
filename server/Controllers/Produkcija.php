<?php

class Produkcija extends Controller{
    public function __construct($params, $type) {
        parent::__construct($params, $urlParams, $type);
        
        $this->get('/visi', [$this, 'visiProduktai']);
        $this->get('/:id', [$this,'KonkretiPreke']);
    }

    public function VisiProduktai(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM produktas");
        $res->addResponseData($duomenys, "data");
        $res->addResponseData($this->ProdukcijosKategorijos(), "filtras");
        $res->addResponseData($this->ProduktoPadalinys(), "filtras2");
        $res->send();
    }
    public function ProdukcijosKategorijos(){
        $db = new Database();
        $duom = $db->query_String("SELECT * FROM kategorija");
        $duom = $db->array_MysqliResult($duom);
        return $duom;
    }
    public function ProduktoPadalinys(){
        $db = new Database();
        $duomenys = $db->query_String("SELECT * FROM padalinys");
        $duomenys = $db->array_MysqliResult($duomenys);    
        return $duomenys;
    }
    public function KonkretiPreke(){
        $db = new Database();
        $id = isset($req->params['id']) ? $req->params['id'] : null;
        if($id != null){
            $duomenys = $db->array_String("SELECT * FROM produktas 
            LEFT JOIN padalinio_produktas 
            ON produktas.Barkodas = padalinio_produktas.Produktas_Barkodas",
            array(
                "id"=> $id
            ));
        }
        return $duomenys;
    }

    public function PridetiProdukta (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("INSERT INTO `produktas`
            (`Barkodas`, 
            `Pavadinimas`, 
            `Vieneto_kaina`, 
            `Aprasymas`, 
            `Matavimo_vnt`, 
            `Gamintojas`, 
            `PavadinimasEN`, 
            `AprasymasEN`, 
            `Pagaminimo_data`, 
            `Galioja_iki`, 
            `Tiekiama`, 
            `Kategorija_Kategorija_id`
            ) VALUES (
                ::barkodas,
                ::Prekpavad,
                ::vntKain,
                ::aprasymas,
                ::MatavVnt,
                ::gamint,
                ::PrekpavadEN,
                ::aprasymasEN,
                ::pagamData,
                ::galiojimData,
                ::tiekiama,
                ::kategorija
                )", array(
                    "barkodas"=>$req->body['barkodas'],
                    "Prekpavad"=>$req->body['Prekpavad'],
                    "vntKain"=>$req->body['vntKain'],
                    "aprasymas"=>$req->body['aprasymas'],
                    "MatavVnt"=>$req->body['MatavVnt'],
                    "gamint"=>$req->body['gamint'],
                    "PrekpavadEN"=>$req->body['PrekpavadEN'],
                    "aprasymasEN"=>$req->body['aprasymasEN'],
                    "pagamData"=>$req->body['pagamData'],
                    "galiojimData"=>$req->body['galiojimData'],
                    "tiekiama"=>$req->body['tiekiama'],
                    "kategorija"=>$req->body['kategorija'],
                ));

        if($result){
            $res->send();
        }
    }

    public function PridetiProduktaIpadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("INSERT INTO `padalinio_produktas`(
            `Kiekis`, 
            `Produktas_Barkodas`, 
            `Padalinys_Inventorinis_numeris`) 
        VALUES (
            ::kiekis,
            ::barkodas,
            ::invNumeris)", array(
                "kiekis"=>$req->body['kiekis'],
                "barkodas"=>$req->body['barkodas'],
                "invNumeris"=>$req->body['invNumeris'],
            ));

        if($result){
            $res->send();
        }
    }

    public function RedaguotiPrduktoInformacija (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("UPDATE `produktas` SET 
        `Pavadinimas`=::Prekpavad,
        `Vieneto_kaina`=::vntKain,
        `Aprasymas`=::aprasymas,
        `Matavimo_vnt`=::MatavVnt,
        `Gamintojas`=::gamint,
        `PavadinimasEN`=::PrekpavadEN,
        `AprasymasEN`=::aprasymasEN,
        `Pagaminimo_data`=::pagamData,
        `Galioja_iki`=::galiojimData,
        `Tiekiama`=::tiekiama,
        `Kategorija_Kategorija_id`=::kategorija 
        WHERE `Barkodas` = ::barkodas", array(
            "Prekpavad"=>$req->body['Prekpavad'],
            "vntKain"=>$req->body['vntKain'],
            "aprasymas"=>$req->body['aprasymas'],
            "MatavVnt"=>$req->body['MatavVnt'],
            "gamint"=>$req->body['gamint'],
            "PrekpavadEN"=>$req->body['PrekpavadEN'],
            "pagamData"=>$req->body['pagamData'],
            "galiojimData"=>$req->body['galiojimData'],
            "tiekiama"=>$req->body['tiekiama'],
            "kategorija"=>$req->body['kategorija'],
            "aprasymasEN"=>$req->body['aprasymasEN'],
        ));
        
        if($result){
            $res->send();
        }
    }

    public function PasalintiProdukta (Request $req, Response $res){
        $db = new Database();
            $result = $db->Transaction(array(
                Query::generate(
                    'DELETE FROM padalinio_produkcija WHERE 
                    Produktas_Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['barkodas']
                    )),
                Query::generate(
                    'DELETE FROM uzsakymo_produkcija WHERE Produktas_Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['barkodas']
                    )),
                Query::generate(
                    'DELETE FROM produktas WHERE Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['barkodas']
                    )
                )
            ));

        if ($result){
            /** OK */
            $res->send();
        }
        else{
            /** Error */
            $res->send();
        }
    }
}

?>