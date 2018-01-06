# NPB

Tai Informacinių sistemų modulio projektinis darbas.
Norint pradėti darbą pasileisti <code>start.bat</code> failą.
Prieš paleidžiant reikia įsitikinti, jog kelias iki <code>php.exe</code> failo yra įtrauktas į <code>PATH</code> kintamajį.

## **Svarbu!!**<br/>
Mūsų projekto atsiskaitymo laikas *2018-01-12 11:00*.
Tačiau darbą ir ataskaitą reikia įkelti keturias dienas prieš gynymą, tad reikia viską išbaigti iki *01-08*.

Iki atsiskatymo reikia atlikti:


- [1. Funkciniai reikalavimai](#1-funkciniai-reikalavimai)
    - [Sistemos prieinamumo posistemė:](#sistemos-prieinamumo-posistem%C4%97)
- [2. Puslapio išdėstymas](#2-puslapio-i%C5%A1d%C4%97stymas)
    - [Bendrai visuose puslapiuose:](#bendrai-visuose-puslapiuose)
    - [Padalinių puslapis:](#padalini%C5%B3-puslapis)
    - [Produkcijos puslapis:](#produkcijos-puslapis)
    - [Konkretaus produkto puslapis](#konkretaus-produkto-puslapis)
    - [Konkretaus padalinio puslapis](#konkretaus-padalinio-puslapis)
    - [Darbuotojų puslapis](#darbuotoj%C5%B3-puslapis)
    - [Vairuotojų puslapis](#vairuotoj%C5%B3-puslapis)
    - [Užsakymų ir užsakymų vykdymo puslapiai](#u%C5%BEsakym%C5%B3-ir-u%C5%BEsakym%C5%B3-vykdymo-puslapiai)
    - [Transporto priemonių puslapis](#transporto-priemoni%C5%B3-puslapis)
- [3. Leidimai](#3-leidimai)
    - [Padalinių posistemė:](#padalini%C5%B3-posistem%C4%97)
    - [Produkcijos posistemė:](#produkcijos-posistem%C4%97)
    - [Sistemos prieinamumo posistemė:](#sistemos-prieinamumo-posistem%C4%97)
    - [Užsakymų vykdymas:](#u%C5%BEsakym%C5%B3-vykdymas)
    - [Užsakymų sukūrimas:](#u%C5%BEsakym%C5%B3-suk%C5%ABrimas)
    - [Transporto priemonių posistemė:](#transporto-priemoni%C5%B3-posistem%C4%97)

## 1. Funkciniai reikalavimai
**Pastaba:** Užsakymų sukūrimo ir Transporto priemonių panaudos ir priežiūros posistemių neištestavau, nes nevisos užklausos į duomenų bazę veikia dėl užsakymų.
* ### Sistemos prieinamumo posistemė:
    1. Darbuotojų registravimas
    1. Darbuotojų duomenų redagavimas
    1. Darbuotojo rango nustatymas

## 2. Puslapio išdėstymas
* ### Bendrai visuose puslapiuose:
  - [ ] **Problema:** Nesilaikoma puslapio formato standartų, nėra išskirta puslapio pabaiga.<br/>
        **Galimas sprendimo būdas:** Uždėtį *Footer*, jog matytusi puslapio pabaiga.
* ### Padalinių puslapis:
  - [x] **Problema:** leidžiama pradėti kurti naują padalinį tada, kada nėra laisvų redaktrių.<br/>
      **Galimi sprendimo būdai:**<br/>
      * Patikrinti ar yra laisvų redaktorių, jeigu ne, formoje pridėti laukus naujo redaktoriaus sukūrimui.
      * Neleisti kurti naujo padalinio, o norint tai padaryti:
        * Nuvesti į naujo vartotojo kūrimo langą.
        * Išvesti pranešimą, jog nėra laisvų redaktorių.
  - [x] **Problema:** redaktoriaus paskirties infomacinis tekstas iškraipo lentelę esant skirtingam puslapio pločiui.<br/> ![Radaktoriaus paskirtis padaliniuose](https://image.prntscr.com/image/gxpz9yh1TuCebdBZTo0rOA.png)<br/>
      **Galimas sprendimo būdas:** [Išsokantysis langas](https://react-bootstrap.github.io/components.html#popovers)
  - [x] **Problema:** gali kilt nesusipratimas, mastant jog esamam padaliniui reikia pasirinkti redaktorių tada, kada jis jau pasirinktas.<br/> !["Pasirinkti redaktorių"](https://image.prntscr.com/image/lpmuFYLqTvK9ozTUFpySLQ.png)<br/>
      **Galimas sprendimo būdas:** Pakeisti formuluotę į "Pakeisti padalinio radaktorių".
  - [x] **Problema:** redagavime nereikalingas redaktoriaus pasirinkimas, kadangi jau egzistuoja redaktoriaus pakeitimo forma.<br/>
      **Galimas sprendimo būdas:** panaikinti redaktoriaus pasirinkimą iš formos.
  - [x] **Problema:**  bandant ištrinti padalinį, reikia trynimo patvirtinimo lango, siekiant išvengti netyčinių ištrynimų. <br/>
      **Galimas sprendimo būdas:** Sukurti formą su dviem mygtukais ("Taip" ir "Ne") ir informaciniu tekstu, kuris atvaizduotų **trinamo padalinio numerį ir pavadinimą**.
  - [x] **Problema:** trinant padalinį reikia informacinio teksto, kuris pateiktų informaciją apie trinymo proceso rezultatą.<br />
      **Galimas sprendimo budas:** ["Notifications" langai](https://www.npmjs.com/package/react-notifications)
  - [x] **Problema:** ištrynimo ir redagavimo mygtukai esant mažesniam puslapiui susilygiuoja iename stulpelyje, o tada vertikalus brušnys lieka pradžioje.<br/>![Vertikalaus brūkšnio problema iki](https://image.prntscr.com/image/vWS9-tf5Re6PybQwBWnGxA.png) --> ![Vertikalaus brūkšnio problema po](https://image.prntscr.com/image/xFIHnWxTTUKTH9kBDKfVUw.png)<br/>
      **Galimas sprendimo būdas:** Panaikinti vertikalų brūkšnį ir suligiuoti mygtukus stulpeliu, nepriklausomai nuo puslapio dydžio.
  - [x] **Problema:** neveikia nuoroda į redaktoriaus informacijos puslapį.<br/>
      **Galimas sprendimo būdas:** Patikrinti ar <code>Router.js</code> failę yra nuorodą į reikiamą failą.
* ### Produkcijos puslapis:
  - [ ] **Problema:** kada padalinio filtaras yra nustatytas į *Visos prekės kataloge*, reikia rodti visas prekes, tačiau nerodyti kiekių iš padalinių, arba rodyti bendrą prakių kiekį padaliuose.<br/>
    **Galimas sprendimo būdas:** Priklausomai nuo padalinio filtro reikšmės atvaizduoti vienokį ar kitokį prekės formatą. Galimi formatų pasiūlymai:
      1. Prekių katalogo formatas:
         * Barkodas
         * Pavadinimas
         * Kaina
         * Bendras kiekis (nebūtina)
         * Tiekiama
         * Detaliau...
         * (Ištrinti), Redaguoti
      1. Padalinio prekių formatas:
         * Barkodas
         * Pavadinimas
         * Kaina
         * Kiekis padalinyje
         * Detaliau...
         * (Ištrinti), Redaguoti
        
    Antru atvejų padalinio atvaizduoti nereikia, nes jis ir taip atsispindi filtre. Abiem variantai reikalingas aprašymas, tačiau jo pateikimo galimas pakeitimas aprašytas žemiau. Beto, taip išvengiame produktų dubliavimosi:
    ![Produkcijos dubliavimasis](https://image.prntscr.com/image/syGog2rwSpue7Rag2OGnvA.png)
  - [ ] **Problema:** nėra matavimo vienetų prie prekių kiekių.<br/>
      **Galimas sprendimo būdas:** Papildomai iš duomenų bazės gauti matavimo vienetą ir jį atvaizduotį.
  - [ ] **Problema:** ištrynimo ir redagavimo mygtukai esant mažesniam puslapiui susilygiuoja iename stulpelyje, o tada vertikalus brušnys lieka pradžioje.<br/>![Vertikalaus brūkšnio problema iki](https://image.prntscr.com/image/vWS9-tf5Re6PybQwBWnGxA.png) --> ![Vertikalaus brūkšnio problema po](https://image.prntscr.com/image/xFIHnWxTTUKTH9kBDKfVUw.png)<br/>
      **Galimas sprendimo būdas:** Panaikinti vertikalų brūkšnį ir suligiuoti mygtukus stulpeliu, nepriklausomai nuo puslapio dydžio.
  - [ ] **Problema:** trinant padalinį reikia informacinio teksto, kuris pateiktų informaciją apie trinymo proceso rezultatą.<br />
      **Galimas sprendimo budas:** ["Notifications" langai](https://www.npmjs.com/package/react-notifications)
  - [ ] **Problema:** aprašymo skiltis iškraipo lentelę, sunku susiorientuoti tarp produktų. <br/>
      **Galimas sprendimo būdas:** Vietoje skilties "Tiekiama" įdėti mygtuką "Detaliau...", kurį paspaudus, atsivertu papildoma eilutė su aprašymų (kaip yra dabar).
  - [ ] **Problema:** naujas produktas privalo priklausyti kategorijai, negali kategorija būti: "Visos kategorijos".<br/>
      **Galimas sprendimo būdas:** Panaikinti pasirinkimo variantą "Visos kategorijos".
  - [ ] **Problema:** naujo ar redaguojamo produkto aprašymas turėtų būti teksto laukas (<code>textarea</code>), o ne teksto eilutė (<code>input</code>).<br/>
      **Galimas sprendimo būdas:** paeisti lauko tipą į <code>textarea</code>.
  - [ ] **Problema:** trinant produktą reikia informacinio teksto, kuris pateiktų informaciją apie trinymo proceso rezultatą.<br />
      **Galimas sprendimo budas:** ["Notifications" langai](https://www.npmjs.com/package/react-notifications)
  - [ ] **Problema:** redaguojant produkta norint jį vėl padaryti tiekiamu, reikia redagavimo formoje pasirinkti netiekiama, poto vėl tiekiama.<br/>
      **Galimas sprendimo būdas:** redaguojant produktą, formos lauko "Tiekiama" pradinę reikšmę nustatyti į esamą tiekimo būseną.
* ### Konkretaus produkto puslapis
  - [ ] **Problema:** Esant mažesniam puslapio pločiui, dalis infomacijos pasislepia po meniu panele.<br/>![informacija po sidebar](https://image.prntscr.com/image/u5DgyYQxTSOYHR-VSwaxmA.png)<br/>
      **Galimas sprendimo būdas:** Patvarkiti css stilių taip, uždedant <code>margin-left</code> atributą.
  - [ ] **Problema:** Prekei esant daugiau negu 1 padalinyje, kuriami atskiri padalinių blokai, ilgainiui, gali susidaryti ilga tokių blokų eilė.<br/>![Prekės padalinių sąrašas](https://image.prntscr.com/image/w8qdHivqThK_hMu-3PJiQA.png)<br/>
      **Galimas sprendimo būdas:** daryti padalinių lentelę, kaip kad padalinio informacijos puslapyje.<br/>![Padalinio prekių lentelė](https://image.prntscr.com/image/GBrJaw-2QC6WQkg76BOpSQ.png)
* ### Konkretaus padalinio puslapis
  - [ ] **Problema:** Neleisti iškviesti naujo darbuotojo pasamdymo formos, jeigu nėra laisvų darbuotojų.<br/>
      **Galimas sprendimo būdas:** Prieš atveriant formą, patikrinti ar yra bent vienas darbuotojas, jeigu ne, parodyti informacinį pranešimą, galima naudoti [notifications](https://www.npmjs.com/package/react-notifications).
  - [ ] **Problema:** esant vienam laisvam darbuotojui, <code>select</code> kintamasis neturi jokios reikšmės, o <code>onChange</code> metodas neiškviečiamas, nes neįmanoma sukelti <code>option</code> pasirinkimo pakeitimo.
      **Galimas sprendimo būdas:** nenaudoti <code>onChange</code> metodo, o norint gauti reikšmę naudoti kodą:<br/>
      ```javascript
            function getSelectedOption(id){
                  let selectObject = document.getElementById(id);
                  if (selectObject == undefined){
                        return null;
                  }
                  let options = selectObject.options;
                  for(let i = 0; i < options.length; i++){
                        if (options[i].selected){
                              return options[i].value;
                        }
                  }

                  return null;
            }
      ```
  - [ ] **Problema:** nėra informacijos apie atlikta operaciją atleidžiant darbuotoją.<br/>
      **Galimas sprendimo būdas:** Naudoti informacinius [notifications](https://www.npmjs.com/package/react-notifications) atvaizduojančius funkcijos rezultatą.
* ### Darbuotojų puslapis
  - [ ] **Problema:** Puslapio <code>header</code> skiriasi nuo kitų puslapių.<br/>
      **Galimas sprendimo būdas:** pritaikyti css stilių antraštei.
  - [ ] **Problema:** paspaudus ant darbuotojo tabelio nerodoma papildoma darbuotojo informacija.<br/>
      **Galimas sprendimo būdas:** suskurti iššokantį langą su darbuotojo informacija, kaip kad vairuotojų puslapyje.
* ### Vairuotojų puslapis
  - [ ] **Problema:** neleisti atidaryti "priskirti užduotis" iššokantį langą, jeigų užduočių nėra.<br/>
      **Galimas sprendimo būdas:** patikrinti užduočių skaičių prieš atidarant langą.
  - [ ] **Problema:** neleisti atidaryti "priskirti transportą" iššokančio lango, jeigu nėra laisvų transporto priemonių.<br/>
      **Galimas sprendimo būdas:** patikrinti laisvų transporto priemoinų kiekį prieš lango atidarymą.
* ### Užsakymų ir užsakymų vykdymo puslapiai
  - [ ] **Problema:** šie puslapiai yra vienas ir tas pats, tačiau pateikti atskirai.<br/>
      **Galimas sprendimo būdas:** sujungti šiuos puslapius į vieną, paliekant reikalingus elementus bei paliekant dizainą panašų į visų puslapių dizainą.
  - [ ] **Problema:** Užsakymų neina filtruoti pagal jų būseną.<br/>
      **Galimas sprendimo būdas:** įdėti būsenų filtrą.
  - [ ] **Problema:** Užsakymų pulapio redagavimo ir būsenos pakeitimo ikonos nesuteikia informacijos apie funkciją.<br/>
      **Galimas sprendimo būdas:** <br/>
      * pakeisti ikonas į aiškesnes;
      * naudoti žodžius vietoje ikonų;
  - [ ] **Problema:** Užsakymo vykdymas prasideda tada, kada jam yra priskirtas vairuotojas ir transportas, tada galimos tik keli būsenos pakeitimo variantai: *Įvykdyta* bei *Atšaukta*, kolkas galime pasirinkti visas galimas būsenas.<br/>
    **Galimas sprendimo būdas:** Padaryti du mygtukus, *Įvykyta* bei *Atšaukta*, kurių paspaudimas atnaujintų būseną, tačiau abu mygtukai matomi ne visada, pateikiu galimas atvaizdavimo salygas:<br/>
    |Užsakymo būsena|Mygtukas *Įvykdyta*|Mygtukas *Atšaukta*|
    |:-------------:|:-----------------:|:-----------------:|
    |Įvesta         |Nerodoma           |Rodoma             |
    |Vykdoma        |Rodoma             |Nerodoma           |
    |Įvykdyta       |Nerodoma           |Nerodoma           |
    |Atšaukta       |Nerodoma           |Nerodoma           |<br/>
  - [ ] **Problema:** Prioriteto reikšmė yra rodoma numeriu, tačiau dažnai tai nieko nereiškia, įvesti žodinę sistemą.<br/>
    **Galimas sprendimo būdas:** Įvesti žodinę sistemą prioritetų intervalams, kur:
    |Prioritetas|Reikšmė                |Spalva |
    |:---------:|:---------------------:|:-----:|
    |0          |Įprastas               |#2878D2|
    |0 - 5      |Svarbu                 |#FFF827|
    |5 - 10     |Labai svarbu           |#D07800|
    |10+        |Vykdoma pirmumo tvarka |#FF1800|
    Kiekvieną intervalą papildomai rikiuoti prioriteto mažėjimo tvarka, kiekviena intervalą, pradedant svarbiausiu baigiant žemiausios svarbos, išdėstyti atskiromis sekcijomis (<code>section</code>, kadangi tai HTML5 elementas, o mums to reikia) kiekvienos sekcijos kairiąją dalį nudažant atitinkama spalva, bei pateikiant prioriteto žodinę reprezentaciją.<br/>
    ![Sekcijos pavyzdys](https://image.prntscr.com/image/0klLhON7Qsq3cBuYSqsJFw.png)
  - [ ] **Problema:** Naujos užduoties sukūrimo formoje užsakymo data turi būti <code>date</code> tipo.<br/>
    **Galimas sprendimo būdas:** pakeisti <code>FormControl</code> elemento tipą į <code>date</code>.<br/>
    ```html
        <FormControl type="date"> ... </FormControl>
    ```
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Atlikimo data*.<br/>
    **Galimas sprendimo būdas:** panaukinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Prioritetas*, šio lauko reikšmė automatiškai turi būti nustatyta į 0.<br/>
    **Galimas sprendimo būdas:** panaukinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Būsena*, būsena automatiškai turi būti nustatoma į *Įvesta*. <br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Užsakymo formuotojas*, šio lauko reikšmė turi būti automatiškai paimama iš code{redux store} kintamojo, kuris saugo prisijungusio vartotojo duomenis.<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Vairuotojas*, šio lauko reikšmė bus priskirta vėliau <br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negali būti lauko *Transporto priemonė*, šio lauko reikšmė bus priskirta vėliau. <br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** naujos užduoties sukūrimo formoje negaunami padaliniai.<br/>
    **Galimas sprendimo būdas:** pakeisti užklausos (<code>fetch</code>) į duomenų bazę adresą naudojant tiekėjo (<code>host</code>) kintamajį iš nustatymų failo.<br/>
    Pakeisti:
    ```javascript
        fetch('http://localhost:8081/api/Uzsakymai/sarasas', {...});
    ```
    naudojant nustatymų failo kintamajį:
    ```javascript
        import config from "../config.json";
        fetch(config.server + '/Uzsakymai/sarasas/', {...});
    ```
  - [ ] **Problema:** naujo užsakymo sukūrimo reikia pasirinkti užsakymo prekes (kam tada aplamai reikia užsakymo tada?).<br/>
    **Galimas sprendimo būdas:** įvykdyti užklausą į duomenų bazę, siekiant gauti pasirinkto padalinio prekes.
  - [ ] **Problema:** naujo užsakymo sukūrimo formos atraštėje parašyta *Redaguoti užsakymą*.<br/>
    **Galimas sprendimo būdas:** pakeisti antraštę į *Sukurti užsakymą*.
  - [ ] **Problema:** užsakymo redagavimo formoje negalima pakeisti atlikimo datos.<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** užsakymo redagavimo formoje negali būti keičiamas prioritetas.<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** užsakymo redagavimo formoje negali būti keičiamas laukas *būsena*.<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** užsakymo redagavimo formoje negali būti keičiamas laukas *Užsakymo formuotojas*<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** užsakymo redagavimo formoje negali būti keičiamas laukas *vairuotojas*<br/>
    **Galimas sprendimo būdas:** panaikinti lauką iš formos.
  - [ ] **Problema:** užsakymo redagavimo formoje negali būti keičiamas laukas *transporto priemonė*<br/>
    **Galimas sprendimo būdas:** panaikiti lauką iš formos.
  - [ ] **Problema:** Prioriteto keitimo formos antraštėje rašoma *redaguoti užsakymą*<br/>
    **Galimas sprendimo būdas:** pakeisti tekstą į *pakeisti prioritetą*.
  - [ ] **Problema:** po kiekvieno veiksmo (prioriteto pakeitimo, naujo užsakymo pridėjimo, užsakymo redagavimo, užsakymo atšaukimo ir t.t.) reikia informacinio pranešimo.<br/>
    **Galimas sprendimo būdas:** galima naudoti [notification](https://www.npmjs.com/package/react-notifications)
* ### Transporto priemonių puslapis
  - [ ] **Problema:** nevienodas puslapio dizainas<br/>
    **Galimas sprendimo būdas:** pritaikyti dizainą prie kitų puslapių.
  - [ ] **Problema:** reikia detalesnio transporto priemonės aprašymo.<br/>
    **Galimas sprendimo būdas:** sukurti naują puslapį, ar formą, kuriame būtų atvaizduota visa transporto priemonės informacija.
  - [ ] **Problema:** reikia matavimo vienetų prie variklio galios.<br/>
    **Galimas sprendimo būdas:** pridėti variklio galio matavimo vienetus.
  - [ ] **Problema:** reikia variklio tūrio matavimo vienetų.<br/>
    **Galimas sprendimo būdas:** pridėti variklio tūrio matavimo vienetus.
  - [ ] **Problema:** reikia TP aukščio matavimo vienetų<br/>
    **Galimas sprendimo būdas:** pridėti TP aukščio matavimo vienetus.
  - [ ] **Problema:** reikia TP pločio matavimo vienetų.<br/>
    **Galimas sprendimo būdas:** pridėti TP pločio matavimo vienetus.
  - [ ] **Problema:** markė ir modelis tėra nereikalinga informacija.<br/>
    **Galimas sprendimo būdas:** sujungti stulpelius į vieną, pvz: Honda Civic
  - [ ] **Problema:** pagrindiniam puslapyje reikia atvaizduoti TP valstybinį numerį.<br/>
    **Galimas sprendimo būdas:** atvaizduoti valstybinį numerį lentelėje. ***Pasiūlymas:*** naudoti šį lauką kaip nuorodą į informacijos puslapį.
  - [ ] **Problema:** transporto priemonės sukūrimo ir redagavimo formos yra labai didelės.<br/>
    **Galimas sprendimo būdas:** naudoti sekcijas siekiant sumažinti formos ilgį. Patartina naudototi [susiskleidžiančias sekcijas](https://react-bootstrap.github.io/components.html#panels-accordion), bei išskirstyti formos laukus tokiomis sekcijomis:
    1. Pagrindinė informacija: (išskleista sekcija formos įjungimo metu)
        * Valstybinis numeris
        * Markė
        * Modelis
        * Vairavimo kategrija
    1. Variklio informacija:
        * Galia
        * Darbinis tūris
        * Kuro tipas
    1. Transporto priemonės gabaritų informacija:
        * Aukštis
        * Plotis
        * Masė be krovinio
        * Didžiausia leidžiama masė
    1. Draudimo informacija:
        * Galioja nuo
        * Galioja iki
    1. Technikinės apžiūros informacija:
        * Galioja nuo
        * Galioja iki      
    1. Papildoma informacija:
        * Rida
        * Pagaminimo metai
        * Sėdimų vietų skaičius
        * Spalva

    Transporto priemonės sbūseno, jos sukūrimo metų yra nustatomą į *Laisva*.
  - [ ] **Problema:** reikia informacinio teksto po kiekvieno atlikto veiksmo.<br/>
    **Galimas sprendimo būdas:** naudoti [notifications](https://www.npmjs.com/package/react-notifications).

## 3. Leidimai
Toliau pateikiamos funkcijų leidimų lentelės kiekvienai posistemei. Sutartiniai žymėjimo ženklai:<br/>
  - \+ - funkcija pasiekiama;
  - \- - funkcija nepasiekiama;
  - \* - funkcija pasiekiama tada, kada:
    * Redaktorius peržiūri savo padalinio darbuotojus;
    * Redaktorius redaguoja savo padalinio darbuotojo informaciją;
    * Darbuotojas redaguoja savo informaciją;
    * Vairuotojas redaguoja savo informaciją;
    * Vairuotojas peržiūri savo užsakymus;
    * Redaktorius peržiūri tik su jo padaliniu susijusius užsakymus;
    * Redaktorius redaguoja tik savo padalinio užsakymus;
    * Vairuotojas peržiūri tik jam priskirtos transporto primonės detalią informaciją.
    * Vairuotojas įvykdęs užsakymus gali pažymėti transporto priemonę kaip laisvą.

* ### Padalinių posistemė:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Atidaryti padalinių sąrašo puslapį|+|+|+|+|
    |Filtruoti padalinius pagal šalį|+|+|+|+|
    |Peržiūrėti pagrindinę padalinio informacija|+|+|+|+|
    |Peržiūrėti padalinio prekes|+|+|+|+|
    |Peržiūrėti padalinio darbuotojus|-|-|*|+|
    |Pridėti naują padalinį|-|-|-|+|
    |Redaguoti padalinį|-|-|-|+|
    |Ištrinti padalinį|-|-|-|+|
    |Pakeisti padalinio redaktorių|-|-|-|+|
    |Atleisti darbuotoją iš padalinio|-|-|-|+|
    |Pasamdyti naują darbuotoją į padalinį|-|-|-|+|

* ### Produkcijos posistemė:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Atidaryti produkcijos sąrašo puslapį|+|+|+|+|
    |Filtruoti produkciją pagal kategoriją|+|+|+|+|
    |filtruoti produkciją pagal padalinį|+|+|+|+|
    |Peržiūrėti produkto aprašymą|+|+|+|+|
    |Peržiūrėti vieno produkto informacinį puslapį|+|+|+|+|
    |Pridėti naują produktą|-|-|+|+|
    |Redaguoti esamą produktą|-|-|+|+|
    |Ištrinti esamą produktą|-|-|+|+|
    |Peržiūrėti produkcijos judėjimo ataskaitą [1]|-|-|+|+|
    
    [1] - Darbuotojams ir vairuotojams navigacijos panelėje (<code>sidebar</code>) neturi būti rodoma šio puslapio nuoroda.

* ### Sistemos prieinamumo posistemė:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Atidaryti Darbuotojų sąrašo puslapį [1]|-|-|*|+|
    |Atidaryti Vairuotojų sąrašo puslapį [1]|-|-|+|+|
    |Peržiūrėti išsamią Darbuotojų informaciją|-|-|*|+|
    |Peržiūrėti išsamią Vairuotojų informaciją|-|-|+|+|
    |Redaguoti Darbuotojų informaciją|-|*|*|+|
    |Redaguoti Vairuotojų informaciją|-|*|-|+|
    |Pridėti naują Darbuotoją|-|-|-|+|
    |Pridėti naują Vairuotoją|-|-|-|+|
    |Pašalinti esamą Darbuotoją|-|-|-|+|
    |Pašalinti esamą Vairuotoją|-|-|-|+|
    |Pakeisti vartotojo rangą|-|-|-|+|
    |Prisijungti į sistemą|+|+|+|+|
    |Atsijungti nuo sistemos|+|+|+|+|
    
    [1] - Darbuotojams ir vairuotojams navigacijos panelėje (<code>sidebar</code>) neturi būti rodoma šio puslapio nuoroda.

* ### Užsakymų vykdymas:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Peržiūrėti užsakymų sąrašą|-|*|*|+|
    |Peržiūrėti užsakymo informaciją|-|*|*|+|
    |Pakeisti užsakymo būseną|-|-|[1]|+|
    |Vairuotojui priskirti užskymus|-|-|+|+|
    |Vairuotojui priskirti transportą|-|-|+|+|
    
    [1] - Pakeisti užsakymo redaktorius gali tokiais atvėjais:
    1. Redaktorius yra užsakymo sukūrėjas, toda jis gali užsakymą atšaukti.
    1. Redaktoriaus padalinys yra užsakymo subjektas (<code>Iš padalinio</code>) (yra siunčiamos prekės į pastarajį padalinį ar prašoma prekių iš jo), tada pastarojo padalinio redaktorius gali atšaukti užsakymą.
    1. Redaktorius, kurio padalinys yra užsakymo tikslo padalinys (<code>Į padalinį</code>) gavęs užsakymo prekes gali *Patvirtinti* (pakeisti būseną į *Įvykdyta*) užsakymą.

* ### Užsakymų sukūrimas:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Sukurti naują užsakymą|-|-|+|+|
    |Redaguoti užsakymą|-|-|*|+|
    |Nustatyti užsakymo prioritetą|-|-|-|+|

* ### Transporto priemonių posistemė:

    |Funkcija|Darbuotojas|Vairuotojas|Redaktorius|Administratorius|
    |:-------|:---------:|:---------:|:---------:|:--------------:|
    |Atidaryti transporto priemonių puslapį [1]|-|-|+|+|
    |Peržiūrėti detalią transoporto priemonės informaciją|-|*|+|+|
    |Pridėti naują transporto priemonę|-|-|-|+|
    |Pašalinti transporto priemonę|-|-|-|+|
    |Redaguoti transporto priemonę|-|-|-|+|
    |Nustatyti transporto priemonės užimtumo būseną|-|*|[2]|+|
    
    [1] - Darbuotojams ir vairuotojams navigacijos panelėje <br/>
    [2] - Redaktorius gali pakeisti transporto priemonės užimtumo būseną tada, kada visi vairuotojo užsakymai yra įvykdyti.
