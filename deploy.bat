@echo off
scp -P 2222 -r "%~dp0*" root@89.124.69.224:/var/www/neirostuff.ru/siteneiron/
pause
