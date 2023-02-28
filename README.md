# Usage


## For nodejs + expressjs
[mongoose](https://mongoosejs.com/)

```
cd /tmp
git clone https://github.com/pfrejlich/nodejsscaffolding.git
cd nodejsscaffolding/expressjs
chmod +x node-express-api-scaffold.sh
./node-express-api-scaffold.sh new-app-path
```

## For nodejs + nestjs

[TypeORM](https://typeorm.io/repository-api)

```
cd /tmp
git clone https://github.com/pfrejlich/nodejsscaffolding.git
cd nodejsscaffolding/nestjs
chmod +x node-nest-api-scaffold.sh
./node-nest-api-scaffold.sh new-app-path
```

### Adding new components

```
nest generate module {{module-name}}

nest generate controller {{controller-name}}

nest generate service {{service-name}}
```

or

```
nest generate resource {{resource-name}} # Will create the controller, module, service and relevant dtos
```

### Adding swagger

Install the following packages:
```
npm install --save @nestjs/swagger swagger-ui-express
```

and add the following to the main.bootstrap function:

```
  const config = new DocumentBuilder()
    .setTitle('Demo API')
    .setDescription('Demo API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
```