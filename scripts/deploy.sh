#!/usr/bin/env bash

echo " ************ deploy.sh -- INICIO EJECUCION -- ************"
echo ""
echo " ******** Borrando y Creando htdocs/nature/site *********"
rm -rf C:/xampp/htdocs/nature/site
mkdir C:/xampp/htdocs/nature/site
echo ""
echo ""
echo " ****** Copiando contenido de dist/ a htdocs/nature/site/ ******"
cp -r ./dist/* C:/xampp/htdocs/nature/site
echo ""
echo ""
echo " ************ deploy.sh -- FIN EJECUCION -- ***************"
echo ""