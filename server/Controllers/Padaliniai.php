<?php

class Padaliniai extends Controller{
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

        $this->get('/visi', [$this, 'visiPadaliniai']);
        $this->get('/:id', [$this,'PrekesPadalinyje']);
        $this->post('/prideti', [$this, 'PridetiNaujaPadalini']);
        $this->post('/redaguoti', [$this, 'RedaguotiEsamaPadalini']);
        $this->mapToMethod($this);
    }

    public function visiPadaliniai(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM padalinys");
        $res->addResponseData($duomenys, "data");
        $res->addResponseData($this->PadaliniuSalys(), "filtras");
       
        $res->send();
    }
    public function PadaliniuSalys(){
        $db = new Database();
        $duom = $db->query_String("SELECT DISTINCT Salis FROM padalinys");
        $duom = $db->array_MysqliResult($duom);
        return $duom;
    }
    public function PrekesPadalinyje(Request $req, Response $res){
        $db = new Database();
        $id = isset($req->params['id']) ? $req->params['id'] : null;
        if ($id != null) {
            $duomenys= $db->query_String("
                SELECT * FROM padalinio_produktas 
                LEFT JOIN produktas ON padalinio_produktas.Produktas_Barkodas = produktas.Barkodas 
                LEFT JOIN padalinys ON padalinio_produktas.Padalinys_Inventorinis_numeris = 
                padalinys.Inventorinis_numeris 
                WHERE padalinio_produktas.Padalinys_Inventorinis_numeris = ::id", array(
                    "id" => $id
                ));    
               $dirbantys=$this->Dirbantys($id);   
        }

        $duomenys = $db->array_MysqliResult($duomenys);
        $res->addResponseData($duomenys, "padalinioProduktai");
        $res->addResponseData($dirbantys, "dirbantysPadalinyje");        
        $res->send();
    }
    //Dar nieko negrąžina, nerealizuotas.
    public function Samdymui(){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM darbuotojas 
            WHERE darbuotojas.Tabelio_nr 
            NOT IN (SELECT dirbapadalinyje.Darbuotojas_Tabelio_nr) 
            FROM dirbapadalinyje ");
        
    }
    public function Dirbantys($id){
        $db = new Database();
        $duomenys = $db->array_String("SELECT * FROM dirbapadalinyje 
        LEFT JOIN darbuotojas 
        ON dirbapadalinyje.Darbuotojas_Tabelio_nr = darbuotojas.Tabelio_nr 
        LEFT JOIN padalinys ON dirbapadalinyje.Padalinys_Inventorinis_numeris 
        = padalinys.Inventorinis_numeris 
        WHERE padalinys.Inventorinis_numeris = ::id", array(
            "id"=> $id
        ));
        return $duomenys;
    }

    public function PridetiNaujaPadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("INSERT INTO `padalinys`(
                `Inventorinis_numeris`, 
                `Salis`, 
                `Miestas`, 
                `Regionas`, 
                `Rajonas`, 
                `Gatve`, 
                `padalinio_pavadinimas`, 
                `SalisEN`, 
                `Pasto_kodas`, 
                `Ilguma`, 
                `Platuma`, 
                `Redaktorius`
            ) VALUES (
                ::invNumeris, 
                ::salis,
                ::miestas, 
                ::regionas, 
                ::rajonas, 
                ::gatve, 
                ::pavadinimas, 
                ::salisEN, 
                ::pastokodas,
                ::ilguma, 
                ::platuma, 
                ::redaktorius)", array(
                    "invNumeris"=>$req->body['invNumeris'],
                    "salis"=>$req->body['salis'],
                    "miestas"=>$req->body['miestas'],
                    "regionas"=>$req->body['regionas'],
                    "gatve"=>$req->body['gatve'],
                    "pavadinimas"=>$req->body['pavadinimas'],
                    "salisEN"=>$req->body['salisEN'],
                    "pastokodas"=>$req->body['pastokodas'],
                    "ilguma"=>$req->body['ilguma'],
                    "platuma"=>$req->body['platuma'],
                    "redaktorius"=>$req->body['redaktorius'],
                    "rajonas"=>$req->body['rajonas'],
        ));

        if($result){
            $res->send();
        }
    }
    public function RedaguotiEsamaPadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("UPDATE `padalinys` 
            SET
            `Salis`=::salis,
            `Miestas`=::miestas,
            `Regionas`=::regionas,
            `Rajonas`=::rajonas,
            `Gatve`=::gatve,
            `padalinio_pavadinimas`=::pavadinimas,
            `SalisEN`=::salisEN,
            `Pasto_kodas`=::pastokodas,
            `Ilguma`=::ilguma,
            `Platuma`=::platuma
            WHERE ::invNumeris", array(
                "miestas"=>$req->body['miestas'],
                "salis"=>$req->body['salis'],
                "regionas"->$req->body['regionas'],
                "rajonas"->$req->body['rajonas'],
                "gatve"->$req->body['gatve'],
                "pavadinimas"->$req->body['pavadinimas'],
                "salisEN"->$req->body['salisEN'],
                "pastokodas"->$req->body['pastokodas'],
                "ilguma"->$req->body['ilguma'],
                "platuma"->$req->body['platuma'],
                "invNumeris"->$req->body['invNumeris'],
        ));

        if($result){
            $res->send();
        }
    }
    public function PasalintiEsamaPadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->numRows_String("SELECT * FROM padalinys 
        LEFT JOIN padalinio_produktas ON padalinys.Inventorinis_numeris = padalinio_produktas.Padalinys_Inventorinis_numeris WHERE padalinys.Inventorinis_numeris = ::invNumeris");
        if($result){
            $res->send();
        }
        else{
            $result = $db->Transaction(array(
                Query::generate(
                    'DELETE FROM dirbapadalinyje WHERE Padalinys_Inventorinis_numeris = ::invNumeris', array(
                        "invNumeris" => $req->body['invNumeris']
                    )),
                Query::generate(
                    'DELETE FROM padalinys WHERE Inventorinis_numeris = ::invNumeris', array(
                        "invNumeris" => $req->body['invNumeris']
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
}

?>