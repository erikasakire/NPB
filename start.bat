@echo off
(php -r "require 'server/Extras/database.php'; echo((new Database())->error());") > error

set size=0
for /f %%i in ("error") do set size=%%~zi

IF %size% gtr 0 GOTO ERROR

:CONTINUE
del error

cd ./client
call npm install
start npm run start

cd ../server
start  php -S localhost:8081 api.php
exit

:ERROR
type error
del error
pause >nul
