# NPB

Tai Informacinių sistemų modulio projektinis darbas.
Norint pradėti darbą pasileisti <code>start.bat</code> failą.
Prieš paleidžiant reikia įsitikinti, jog kelias iki <code>php.exe</code> failo yra įtrauktas į <code>PATH</code> kintamajį.

## **Svarbu!!**<br/>
Mūsų projekto atsiskaitymo laikas *2018-01-12 11:00*.
Tačiau darbą ir ataskaitą reikia įkelti keturias dienas prieš gynymą, tad reikia viską išbaigti iki *01-08*.

Iki atsiskatymo reikia atlikti:


- [1. Funkcniai reikalavimai](#1-funkcniai-reikalavimai)
- [2. Puslapio išdėstymas](#2-puslapio-i%C5%A1d%C4%97stymas)
  - [Bendrai visuose puslapiuose](#bendrai-visuose-puslapiuose)
  - [Padalinių puslapis](#padalini%C5%B3-puslapis)
  - [Produkcijos puslapis](#produkcijos-puslapis)
  - [Konkretaus produkto puslapis](#konkretaus-produkto-puslapis)
  - [Konkretaus padalinio puslapis](#konkretaus-padalinio-puslapis)
  - [Darbuotojų puslapis](#darbuotoj%C5%B3-puslapis)
  - [Vairuotojų puslapis](#vairuotoj%C5%B3-puslapis)

## 1. Funkcniai reikalavimai
   
## 2. Puslapio išdėstymas
* ### Bendrai visuose puslapiuose:
  - [ ] **Problema:** Nesilaikoma puslapio formato standartų, nėra išskirta puslapio pabaiga.<br/>
        **Galimas sprendimo būdas:** Uždėtį *Footer*, jog matytusi puslapio pabaiga.
* ### Padalinių puslapis:
  - [ ] **Problema:** leidžiama pradėti kurti naują padalinį tada, kada nėra laisvų redaktrių.<br/>
      **Galimi sprendimo būdai:**<br/>
      * Patikrinti ar yra laisvų redaktorių, jeigu ne, formoje pridėti laukus naujo redaktoriaus sukūrimui.
      * Neleisti kurti naujo padalinio, o norint tai padaryti:
        * Nuvesti į naujo vartotojo kūrimo langą.
        * Išvesti pranešimą, jog nėra laisvų redaktorių.
  - [ ] **Problema:** redaktoriaus paskirties infomacinis tekstas iškraipo lentelę esant skirtingam puslapio pločiui.<br/> ![Radaktoriaus paskirtis padaliniuose](https://image.prntscr.com/image/gxpz9yh1TuCebdBZTo0rOA.png)<br/>
      **Galimas sprendimo būdas:** [Išsokantysis langas](https://react-bootstrap.github.io/components.html#popovers)
  - [ ] **Problema:** gali kilt nesusipratimas, mastant jog esamam padaliniui reikia pasirinkti redaktorių tada, kada jis jau pasirinktas.<br/> !["Pasirinkti redaktorių"](https://image.prntscr.com/image/lpmuFYLqTvK9ozTUFpySLQ.png)<br/>
      **Galimas sprendimo būdas:** Pakeisti formuluotę į "Pakeisti padalinio radaktorių".
  - [ ] **Problema:** redagavime nereikalingas redaktoriaus pasirinkimas, kadangi jau egzistuoja redaktoriaus pakeitimo forma.<br/>
      **Galimas sprendimo būdas:** panaikinti redaktoriaus pasirinkimą iš formos.
  - [ ] **Problema:**  bandant ištrinti padalinį, reikia trynimo patvirtinimo lango, siekiant išvengti netyčinių ištrynimų. <br/>
      **Galimas sprendimo būdas:** Sukurti formą su dviem mygtukais ("Taip" ir "Ne") ir informaciniu tekstu, kuris atvaizduotų **trinamo padalinio numerį ir pavadinimą**.
  - [ ] **Problema:** trinant padalinį reikia informacinio teksto, kuris pateiktų informaciją apie trinymo proceso rezultatą.<br />
      **Galimas sprendimo budas:** ["Notifications" langai](https://www.npmjs.com/package/react-notifications)
  - [ ] **Problema:** ištrynimo ir redagavimo mygtukai esant mažesniam puslapiui susilygiuoja iename stulpelyje, o tada vertikalus brušnys lieka pradžioje.<br/>![Vertikalaus brūkšnio problema iki](https://image.prntscr.com/image/vWS9-tf5Re6PybQwBWnGxA.png) --> ![Vertikalaus brūkšnio problema po](https://image.prntscr.com/image/xFIHnWxTTUKTH9kBDKfVUw.png)<br/>
      **Galimas sprendimo būdas:** Panaikinti vertikalų brūkšnį ir suligiuoti mygtukus stulpeliu, nepriklausomai nuo puslapio dydžio.
  - [ ] **Problema:** neveikia nuoroda į redaktoriaus informacijos puslapį.<br/>
      **Galimas sprendimo būdas:** Patikrinti ar <code>Router.js</code> failę yra nuorodą į reikiamą failą.
* ### Produkcijos puslapis:
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
