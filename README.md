# NPB

Tai Informacinių sistemų modulio projektinis darbas.
Norint pradėti darbą pasileisti <code>start.bat</code> failą.
Prieš paleidžiant reikia įsitikinti, jog kelias iki <code>php.exe</code> failo yra įtrauktas į <code>PATH</code> kintamajį.

## **Svarbu!!**<br/>
Mūsų projekto atsiskaitymo laikas *2018-01-12 11:00*.
Tačiau darbą ir ataskaitą reikia įkelti keturias dienas prieš gynymą, tad reikia viską išbaigti iki *01-08*.

Iki atsiskatymo reikia atlikti:
1. Pasibaigti funkcinius reikalavimus
1. Patvarkyti puslapio išdėstymą, veikimą
   * Bendrai visuose puslapiuose:
     - [ ] **Problema:** Nesilaikoma puslapio formato standartų, nėra išskirta puslapio pabaiga.<br/>
           **Galimas sprendimo būdas:** Uždėtį *Footer*, jog matytusi puslapio pabaiga.
   * Padalinių puslapis:
     - [ ] **Problema:** leidžiama pradėti kurti naują padalinį tada, kada nėra laisvų redaktrių.<br/>
          **Galimi sprendimo būdai:**<br/>
          * Patikrinti ar yra laisvų redaktorių, jeigu ne, formoje pridėti laukus naujo redaktoriaus sukūrimui.
          * Neleisti kurti naujo padalinio, o norint tai padaryti:
            * Nuvesti į naujo vartotojo kūrimo langą.
            * Išvesti pranešimą, jog nėra laisvų redaktorių.
     - [ ] **Problema:** redaktoriaus paskirties infomacinis tekstas iškraipo lentelę esant skirtingam puslapio pločiui.<br/>
           ![Radaktoriaus paskirtis padaliniuose](https://image.prntscr.com/image/gxpz9yh1TuCebdBZTo0rOA.png)<br/>
           **Galimas sprendimo būdas:** [Išsokantysis langas](https://react-bootstrap.github.io/components.html#popovers)
     - [ ] **Problema:** gali kilt nesusipratimas, mastant jog esamam padaliniui reikia pasirinkti redaktorių tada, kada jis jau pasirinktas.<br/>
           !["Pasirinkti redaktorių"](https://image.prntscr.com/image/lpmuFYLqTvK9ozTUFpySLQ.png)<br/>
           **Galimas sprendimo būdas:** Pakeisti formuluotę į "Pakeisti padalinio radaktorių".
     - [ ] **Problema:** redagavime nereikalingas redaktoriaus pasirinkimas, kadangi jau egzistuoja redaktoriaus pakeitimo forma.<br/>
          **Galimas sprendimo būdas:** panaikinti redaktoriaus pasirinkimą iš formos.
     - [ ] **Problema:**  bandant ištrinti padalinį, reikia trynimo patvirtinimo lango, siekiant išvengti netyčinių ištrynimų. <br/>
          **Galimas sprendimo būdas:** Sukurti formą su dviem mygtukais ("Taip" ir "Ne") ir informaciniu tekstu, kuris atvaizduotų **trinamo padalinio numerį ir pavadinimą**.
     - [ ] **Problema:** trinant padalinį reikia informacinio teksto, kuris pateiktų informaciją apie trinymo proceso rezultatą.<br />
          **Galimas sprendimo budas:** ["Notifications" langai](https://www.npmjs.com/package/react-notifications)
     - [ ] **Problema:** ištrynimo ir radagavimo mygtukai esant mažesniam puslapiui usilygiuoja iename stulpelyje, o tada vertikalus brušnys lieka pradžioje.<br/>
     ![Vertikalaus brūkšnio problema iki](https://image.prntscr.com/image/vWS9-tf5Re6PybQwBWnGxA.png)
     -->
     ![Vertikalaus brūkšnio problema po](https://image.prntscr.com/image/xFIHnWxTTUKTH9kBDKfVUw.png)<br/>
          **Galimas sprendimo būdas:** Panaikinti vertikalų brūkšnį ir suligiuti mygtukus stulpeliu, nepriklausomai nuo puslapio dydžio.
     - [ ] **Problema:** neveikia nuoroda į redaktoriaus puslapį.
          **Galimas sprendimo būdas:** Patikrinti ar <code>Router.js</code> failę yra nuorodą į reikiamą failą.
1. Patvarkyti css stilius
