#!/usr/bin/env bash

echo " *********** build.sh -- INICIO EJECUCION -- ************"
echo ""
echo " ******** Borrando y Creando dist/ **********"
rm -rf ./dist/
mkdir ./dist/
echo ""
echo ""
echo " ********** Copiando contenido de src/ a dist/ *********"
cp -r ./src/* ./dist/
echo ""
echo ""
echo " *********** Compilando SCSS a CSS ************"
node-sass ./dist/assets/scss/main.scss > ./dist/assets/css/main.css
echo ""
echo " *********** build.sh -- FIN EJECUCION -- ****************"
echo ""