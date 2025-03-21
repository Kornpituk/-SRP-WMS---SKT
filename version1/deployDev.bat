@echo off
yarn build
robocopy dist "\\103.13.230.248:33899\wwwroot\WEB_tks_dev" /E /MIR /XF web.config
echo ✅ Deploy Completed!
