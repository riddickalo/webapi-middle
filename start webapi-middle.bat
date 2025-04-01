:: Start webapi-middle service after startup
:: win + R => shell:startup
:: pm2 start ecosystem.config.cjs --env production

@echo off
cd /d C:\code_space\js_projs\webapi-middle
start /b cmd /k "npm run start"
exit