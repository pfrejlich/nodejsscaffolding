#!/bin/bash

## Source: https://www.youtube.com/watch?v=2n3xS89TJMI&ab_channel=MariusEspejo
## Architecture baseline: https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf

initnpm=1
usageHelpText="Usage: ./$(basename $0) [-s|h] {{appdir}}"

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

if ! nest -version &> /dev/null
then
    npm i -g @nestjs/cli
fi

[ $# -lt 2 ] && { echo $usageHelpText; exit 1; }

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

if [ -d "$appDir" -a ! -L "$appDir" ]; then
    echo "The folder $appDir already exists"
else
    echo "The folder $appDir was not found. Creating..."
    
    appName=$(basename "$appDir")
    mkdir -p $(dirname "$appDir")
    cd $(dirname "$appDir")
    nest new $appName
fi

if [ $initnpm == 1 ]; then
    npm install --save module-alias
    npm install --save @nestjs/swagger swagger-ui-express
    npm install --save class-transformer class-validator
    npm install --save @nestjs/config config cross-env
    # npm install --save @automapper/core @automapper/classes @automapper/nestjs @automapper/types
    # npm install --save automapper-nartc
    # npm install --save @typegoose/typegoose
    # nom install --save @nestjs/mongoose mongoose
    # npm install --save @nestjs/passport passport-jwt
    npm install --save @nestjs/typeorm typeorm sqlite3
    # npm install --save pg
    npm install --save cookie-session @types/cookie-session reflect-metadata rxjs
else
    echo "Skipping npm configuration..."   
fi

cd $SCRIPT_DIR