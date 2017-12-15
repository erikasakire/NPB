<h1>NPB grupinio projekto server-side failai</h1>

Tai yra pačių kurtas server-side "karkasas", kuris atlieka paprasčiausius route'inimo veiksmus.

Šio karkaso struktūra yra ga paprasta:

```
root/
  Controllers/
    čia talpinami valdikliai
  Extras/
    Controller.php
    database.config.php
    database.php
    Request.php
    Response.php
    typesEnumerator.php
  api.php
  README.md
  .htaccess
```

**Controller.php** - tai pagrindinė valdiklio klasė, kiekvienas kuriamas valdiklis turi paveldėti šią klasę.
**database.config.php** - tai duomenų bazės prisijungimų konfiguraciniai failai.
**database.php** - tai klasė implementuojanti pagrindines duomenų bazės funkcija.
**Request.php** - tai klasė implementuojanti užklausos (request) duomenis į metodą.
**Response.php** - tai klasė implementuojanti pagrindinius atsakymo (response) metodus.
**typesEnumeration.php** - tai klasė sauganti konstantas kurios naudojamos nuadojamos siekiant vietisumo.
