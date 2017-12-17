<?php

class Produkcija extends Controller{
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
        
        $this->get('/visi', [$this, 'VisiProduktai']);
        $this->get('/:id', [$this,'KonkretiPreke']);
        $this->get('/Produktas/:id', [$this,'ProduktoInformacija']);
        $this->post('/prideti', [$this, 'PridetiProdukta']);
        $this->post('/redaguoti', [$this, 'RedaguotiPrduktoInformacija']);
        $this->post('/salinti', [$this,'PasalintiProdukta']);
        $this->mapToMethod($this);
    }

    public function VisiProduktai(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM produktas 
        LEFT JOIN padalinio_produktas ON produktas.Barkodas=padalinio_produktas.Produktas_Barkodas
        LEFT JOIN padalinys On padalinio_produktas.Padalinys_Inventorinis_numeris=padalinys.Inventorinis_numeris");
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
        var_dump($req->body);
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
                    "barkodas"=>$req->body['Barkodas'],
                    "Prekpavad"=>$req->body['Pavadinimas'],
                    "vntKain"=>$req->body['Vieneto_kaina'],
                    "aprasymas"=>$req->body['Aprasymas'],
                    "MatavVnt"=>$req->body['Matavimo_vnt'],
                    "gamint"=>$req->body['Gamintojas'],
                    "PrekpavadEN"=>$req->body['PavadinimasEN'],
                    "aprasymasEN"=>$req->body['AprasymasEN'],
                    "pagamData"=>$req->body['Pagaminimo_data'],
                    "galiojimData"=>$req->body['Galioja_iki'],
                    "tiekiama"=>$req->body['Tiekiamas'],
                    "kategorija"=>$req->body['Kategorija_Kategorija_id'],
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
            "Prekpavad"=>$req->body['Pavadinimas'],
            "vntKain"=>$req->body['Vieneto_kaina'],
            "aprasymas"=>$req->body['Aprasymas'],
            "MatavVnt"=>$req->body['Matavimo_vnt'],
            "gamint"=>$req->body['Gamintojas'],
            "PrekpavadEN"=>$req->body['PavadinimasEN'],
            "pagamData"=>$req->body['Pagaminimo_data'],
            "galiojimData"=>$req->body['Galioja_iki'],
            "tiekiama"=>$req->body['Tiekiamas'],
            "kategorija"=>$req->body['Kategorija_Kategorija_id'],
            "aprasymasEN"=>$req->body['AprasymasEN'],
            "barkodas"=>$req->body['Barkodas']
        ));
        
        if($result){
            $res->send();
        }
    }

    public function PasalintiProdukta (Request $req, Response $res){
        $db = new Database();
            $result = $db->Transaction(array(
                Query::generate(
                    'DELETE FROM padalinio_produktas WHERE 
                    Produktas_Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['Barkodas']
                    )),
                Query::generate(
                    'DELETE FROM uzsakymo_produktas WHERE Produktas_Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['Barkodas']
                    )),
                Query::generate(
                    'DELETE FROM produktas WHERE Barkodas = ::barkodas', array(
                        "barkodas" => $req->body['Barkodas']
                    )
                )
            ));

        if ($result){
            /** OK */
            http_response_code(200);
            $res->send();
        }
        else{
            /** Error */
            http_response_code(400);
            $res->addResponseData('transakcijos erroras');                
            $res->send();
        }
    }

    public function ProduktoInformacija (Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM produktas 
        LEFT JOIN kategorija ON produktas.Kategorija_Kategorija_id = kategorija.Kategorija_id 
        LEFT JOIN padalinio_produktas ON produktas.Barkodas = padalinio_produktas.Produktas_Barkodas 
        LEFT JOIN padalinys ON padalinio_produktas.Padalinys_Inventorinis_numeris = padalinys.Inventorinis_numeris 
        WHERE Barkodas=::id", array(
            "id"=> $req->params['id']
        ));
        $res->addResponseData($duomenys, "data");
        $res->send();
    }
}

?>