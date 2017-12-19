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
        $this->get('Darbuotojas/:id', [$this,'darbuotojoInformacija']);
        $this->get('/:id', [$this,'Padalinys']);

        $this->post('/prideti', [$this, 'PridetiNaujaPadalini']);
        $this->post('/redaguoti', [$this, 'RedaguotiEsamaPadalini']);
        $this->post('/salinti', [$this, 'PasalintiEsamaPadalini']);
        $this->post('/atleisti', [$this, 'AtleidziameRedaktoriu']);
        $this->post('/samdyti', [$this, 'PasamdytiDarbutuotoja']);
        $this->post('/samdytiEilini',[$this, 'PasamdytiDarbutuotoja2']);
        $this->post('/atleistiDarb', [$this, 'AtleidziameDarbuotoja']);
        $this->mapToMethod();
    }
 
    public function visiPadaliniai(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("SELECT padalinys.*, asmuo.* FROM padalinys LEFT JOIN darbuotojas ON darbuotojas.Tabelio_nr = padalinys.Redaktorius LEFT JOIN asmuo ON asmuo.AsmensKodas = darbuotojas.Asmuo_AsmensKodas");
        
        $res->addResponseData($duomenys, "data");
        $res->addResponseData($this->PadaliniuSalys(), "filtras");
        $res->addResponseData($this->Samdymui(), "samdyti");
        $res->send();
    }
    public function PadaliniuSalys(){
        $db = new Database();
        $duom = $db->query_String("SELECT DISTINCT Salis FROM padalinys");
        $duom = $db->array_MysqliResult($duom);
        return $duom;
    }
    public function Padalinys(Request $req, Response $res){
        $db = new Database();
        $id = isset($req->params["id"]) ? $req->params["id"] : null;
        if ($id != null) {
            $duomenys= $db->query_String("
                SELECT * FROM padalinys 
                WHERE padalinys.Inventorinis_numeris = ::id", array(
                    "id" => $id
            ));

            if ($duomenys){
                $duomenys = $db->array_MysqliResult($duomenys);
                $res->addResponseData($this->VisosPrekesPadalinyje($id), "produktaiPadal");
                $res->addResponseData($this->DirbantysPadalinyje($id), "dirbantys");
                $res->addResponseData($this->Samdymui(), "laisvi");
                $res->addResponseData($duomenys, "data");     
                return $res->send();
            }
            else {
                $res->addResponseData('Klaida vykdant užklausą.', "error");
                return $res->send(Response::BAD_REQUEST);
            }
        }
        
        $res->addResponseData('Padalinio id nesuteiktas.', "error");
        return $res->send(Response::BAD_REQUEST);
        
    }
    public function VisosPrekesPadalinyje ($id){
        if ($id != null) {
            $db = new Database();
            $duomenys = $db->array_String("
                SELECT * FROM produktas 
                LEFT JOIN padalinio_produktas ON produktas.Barkodas = padalinio_produktas.Produktas_Barkodas
                LEFT JOIN padalinys ON padalinio_produktas.Padalinys_Inventorinis_numeris= padalinys.Inventorinis_numeris 
                WHERE padalinys.Inventorinis_numeris = ::id
             ",array(
                "id" => $id
            ));
            return $duomenys;
        }
        return null;
    }

    public function Samdymui(){
        $db = new Database();
        $duomenys = $db->array_String("
            SELECT * FROM darbuotojas 
            LEFT JOIN asmuo ON darbuotojas.Asmuo_AsmensKodas = asmuo.AsmensKodas
                WHERE darbuotojas.Tabelio_nr 
                NOT IN (SELECT dirbapadalinyje.Darbuotojas_Tabelio_nr FROM dirbapadalinyje)
                AND darbuotojas.Tabelio_nr
                NOT IN (SELECT padalinys.Redaktorius FROM padalinys)");
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
                ::redaktorius
            )
         ", array(
            "invNumeris"    =>$req->getBody('Inventorinis_numeris'),
            "salis"         =>$req->getBody('Salis'),
            "miestas"       =>$req->getBody('Miestas'),
            "regionas"      =>$req->getBody('Regionas'),
            "gatve"         =>$req->getBody('Gatve'),
            "pavadinimas"   =>$req->getBody('padalinio_pavadinimas'),
            "salisEN"       =>$req->getBody('salisEN'),
            "pastokodas"    =>$req->getBody('Pasto_kodas'),
            "ilguma"        =>$req->getBody('Ilguma'),
            "platuma"       =>$req->getBody('Platuma'),
            "redaktorius"   =>$req->getBody('Redaktorius'),
            "rajonas"       =>$req->getBody('Rajonas')
        ));

        if($result){
            return $res->send(Response::OK);
        }
        $res->addResponseData($db->error(), "error");
        $res->send(Response::BAD_REQUEST);
    }
    public function RedaguotiEsamaPadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->query_String("UPDATE `padalinys` 
            SET
                `Salis`                = ::salis,
                `Miestas`              = ::miestas,
                `Regionas`             = ::regionas,
                `Rajonas`              = ::rajonas,
                `Gatve`                = ::gatve,
                `padalinio_pavadinimas`= ::pavadinimas,
                `SalisEN`              = ::salisEN,
                `Pasto_kodas`          = ::pastokodas,
                `Ilguma`               = ::ilguma,
                `Platuma`              = ::platuma
            WHERE `Inventorinis_numeris`= ::invNumeris", array(
                  "invNumeris"=>$req->getBody('Inventorinis_numeris'),
                  "salis"=>$req->getBody('Salis'),
                  "miestas"=>$req->getBody('Miestas'),
                  "regionas"=>$req->getBody('Regionas'),
                  "gatve"=>$req->getBody('Gatve'),
                  "pavadinimas"=>$req->getBody('padalinio_pavadinimas'),
                  "salisEN"=>$req->getBody('salisEN'),
                  "pastokodas"=>$req->getBody('Pasto_kodas'),
                  "ilguma"=>$req->getBody('Ilguma'),
                  "platuma"=>$req->getBody('Platuma'),
                  "rajonas"=>$req->getBody('Rajonas')
        ));
        if($result){
            return $res->send(Response::OK);
        }
        $res->addResponseData($db->error(), "error");
        $res->send(Response::BAD_REQUEST);
    }
    
    public function AtleidziameDarbuotoja (Request $req, Response $res){
        $db = new Database();
        var_dump($req->body);
        $result = $db->query_String("DELETE FROM dirbapadalinyje WHERE Darbuotojas_Tabelio_nr = ::id", array(
            "id"=> $req->getBody('Darbuotojas_Tabelio_nr')
        ));

        if ($result){
            /** OK */
            http_response_code(200);
            $res->send();
        }
        else{
            /** Error */
            http_response_code(400);            
            $res->send();
        }
    }
    public function DirbantysPadalinyje ($id){
        if ($id != null) {
            $db = new Database();
            $duom = $db->query_String("SELECT dirbapadalinyje.*, asmuo.* FROM dirbapadalinyje 
                LEFT JOIN darbuotojas 
                ON dirbapadalinyje.Darbuotojas_Tabelio_nr = darbuotojas.Tabelio_nr 
                LEFT JOIN asmuo ON darbuotojas.Asmuo_AsmensKodas = asmuo.AsmensKodas  
                LEFT JOIN padalinys ON dirbapadalinyje.Padalinys_Inventorinis_numeris 
                = padalinys.Inventorinis_numeris 
                WHERE padalinys.Inventorinis_numeris = ::id", array(
                    "id"=> $id
                ));
            
            if($duom){
                return $db->array_MysqliResult($duom);
            }
            else {
                $res = new Response();
                $res->addResponseData($db->error(), "log");
                $res->addResponseData('Klaida vykdant užklausą.', "error");
                return $res->send(Response::BAD_REQUEST);
            }
        }
        $res->addResponseData('Padalinio id nesuteiktas.', "error");
        return $res->send(Response::BAD_REQUEST);
   
    }
    public function PasamdytiDarbutuotoja (Request $req, Response $res){
        $db = new Database();
        $query = Query::generate("
            UPDATE padalinys SET padalinys.Redaktorius = ::darb 
            WHERE padalinys.Inventorinis_numeris = ::id
         ",array(
            "darb"=>$req->getBody('Redaktorius'),
            "id"=>$req->getBody('Inventorinis_numeris')
         ));
        $result = $db->query_Query($query);

        if ($result){
            $res->addResponseData($query->getParametizedQuery(), "queryPerformed");
            $res->send(Response::OK);
        }
        else{
            $res->addResponseData($db->error(), "error");
            $res->send(Response::BAD_REQUEST);
        }
    }

    public function PasamdytiDarbutuotoja2 (Request $req, Response $res){
        $db = new Database();
        $query = Query::generate("
            INSERT INTO dirbapadalinyje 
                (dirbapadalinyje.Darbuotojas_Tabelio_nr, dirbapadalinyje.Padalinys_Inventorinis_numeris)
            VALUES
                (::darb, ::id)
         ",array(
            "darb"=>$req->getBody('darbuotojas'),
            "id"=>$req->getBody('padaliniys')
         ));
        $result = $db->query_Query($query);

        if ($result){
            $res->addResponseData($query->getParametizedQuery(), "queryPerformed");
            $res->send(Response::OK);
        }
        else{
            $res->addResponseData($db->error(), "error");
            $res->send(Response::BAD_REQUEST);
        }
    }
    public function PasalintiEsamaPadalini (Request $req, Response $res){
        $db = new Database();
        $result = $db->numRows_String("
            SELECT * 
            FROM padalinio_produktas 
            LEFT JOIN padalinys ON padalinys.Inventorinis_numeris = padalinio_produktas.Padalinys_Inventorinis_numeris 
            WHERE padalinys.Inventorinis_numeris = ::invNumeris", array(
                "invNumeris" => $req->getBody('Inventorinis_numeris')
            ));
        if($result){
            http_response_code(400);
            $res->addResponseData('Padalinyje yra ' . $result . ' prekių');
            $res->send();
        }
        else{
            $result = $db->Transaction(array(
                Query::generate(
                    'DELETE FROM dirbapadalinyje WHERE Padalinys_Inventorinis_numeris = ::invNumeris', array(
                        "invNumeris" => $req->body['Inventorinis_numeris']
                    )),
                Query::generate(
                    'DELETE FROM padalinys WHERE Inventorinis_numeris = ::invNumeris', array(
                        "invNumeris" => $req->body['Inventorinis_numeris']
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
    }
    public function darbuotojoInformacija(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("
            SELECT 
                *
            FROM padalinys
            LEFT JOIN darbuotojas ON padalinys.Redaktorius = darbuotojas.Tabelio_nr
            LEFT JOIN asmuo ON asmuo.AsmensKodas = darbuotojas.Asmuo_AsmensKodas
            WHERE darbuotojas.Tabelio_nr = ::id
            
            UNION
            
            SELECT
                padalinys.*,
                darbuotojas.*,
                asmuo.*
            FROM padalinys
            LEFT JOIN dirbapadalinyje ON padalinys.Inventorinis_numeris = dirbapadalinyje.Padalinys_Inventorinis_numeris
            LEFT JOIN darbuotojas ON dirbapadalinyje.Padalinys_Inventorinis_numeris = darbuotojas.Tabelio_nr
            LEFT JOIN asmuo ON asmuo.AsmensKodas = darbuotojas.Asmuo_AsmensKodas
            WHERE darbuotojas.Tabelio_nr = ::id    
        ", array(
                    "id" => $req->params["id"]
                ));
        $res->addResponseData($duomenys, "data");
        $res->send();
    }
    public function pridetiPrekeIpadalini(Request $req, Response $res){
        $db = new Database();
        $duomenys = $db->array_String("INSERT INTO `padalinio_produktas`
            (`Kiekis`,
             `Produktas_Barkodas`,
              `Padalinys_Inventorinis_numeris`) 
            VALUES (
                ::kiek,
                ::bark,
                ::inv)", array(
                    "kiek"=>$req->getBody('Kiekis'),
                    "bark"=>$req->getBody('Barkodas'),
                    "inv"=>$req->getBody('Inventorinis_numeris')
                ));
       
        if($duomenys){
            http_response_code(200);
            return $res->send();
        }
        http_response_code(400);
    }
}

?>