#!/bin/bash

initnpm=1
usageHelpText="Usage: ./$(basename $0) [-s|h] appdir"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

Help()
{
   echo $usageHelpText
   echo "options:"
   echo "s     Skip npm configuration."
   echo "h     Print this Help."
   echo
}

if ! npm -version &> /dev/null
then
    echo "npm is missing. Please install it: sudo apt install npm -y"
    exit 1
fi

[ $# -eq 0 ] && { echo $usageHelpText; exit 1; }

while getopts ':sh' option; do
   case $option in
   	s) initnpm=0;;
      	h) Help
      	   exit;;
     	*) echo $usageHelpText
     	   exit;;
   esac
done

shift "$((OPTIND - 1))"

appDir="$1"

if [ -d "$appDir" -a ! -L "
$appDir" ]; then
    echo "The folder $appDir already exists"
else
    echo "The folder $appDir was not found. Creating..."
    mkdir -p "$appDir"
fi

cd "$appDir"

# Create basic folders

if [[ ! -d src ]]; then
    mkdir src
fi

if [[ ! -d src/middleware ]]; then
    mkdir src/middleware
fi

if [[ ! -d src/resources ]]; then
    mkdir src/resources
fi

if [[ ! -d src/utils ]]; then
    mkdir src/utils
fi

touch app.ts

if [ $initnpm == 1 ]; then
    npm init -y
    npm i -D typescript tsc-watch eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin @types/node @types/express
    npm i express dotenv
    npm i module-alias
    npm i mongoose compression cors morgan helmet
    npm i -D @types/compression @types/cors @types/morgan
    npx tsc --init
else
    echo "Skipping npm configuration..."   
fi

tsconfigfile="tsconfig.json"
if [[ -f $tsconfigfile ]]; then
    echo "Modifying $tsconfigfile content..."
    sed -i 's#\/\/ "baseUrl": ".\/"#"baseUrl": ".\/src"#g' $tsconfigfile
    sed -i 's#\/\/ "outDir": ".\/"#"outDir": "dist"#g' $tsconfigfile
    sed -i 's#\/\/ "paths": {}#"paths": { "@/resources/*": ["resources/*"], "@/utils/*": ["utils/*"], "@/middleware/*": ["middleware/*"] }#g' $tsconfigfile
fi

packagefile="package.json"
if [[ -f $packagefile ]]; then
    echo "Modifying $packagefile content..."
    jq '.scripts |= . + {"test": "echo \"Error: no test specified\" && exit 1","start": "node dist/index.js","dev": "tsc-watch --onSuccess \"node .dist/index.js\"","build": "tsc","postinstall": "npm run build"} ' $packagefile >> "tmp$packagefile"
    truncate -s 0 $packagefile
    mv "tmp$packagefile" $packagefile
    
    jq '._moduleAliases |= . + {"@/resources": "dist/resources","@/utils": "dist/utils", "@/middleware": "dist/middleware"} ' $packagefile >> "tmp$packagefile"
    truncate -s 0 $packagefile
    mv "tmp$packagefile" $packagefile    
fi

if [ $initnpm == 1 ]; then
    npm i module-alias
    npm i mongoose compression cors morgan helmet
    npm i -D @types/compression @types/cors @types/morgan
fi

cd $SCRIPT_DIR

cp .prettierrc.js $appDir
cp .eslintrc.js $appDir
cp .env.example $appDir/.env
cp app.ts $appDir/src
cp index.ts $appDir/src

if [[ ! -d $appDir/src/utils/exceptions ]]; then
    mkdir -p $appDir/src/utils/exceptions
fi

if [[ ! -d $appDir/src/utils/interfaces ]]; then
    mkdir -p $appDir/src/utils/interfaces
fi

if [[ ! -d $appDir/src/middleware ]]; then
    mkdir -p $appDir/src/middleware
fi

cp -r utils/* $appDir/src/utils
cp -r middleware/* $appDir/src/middleware