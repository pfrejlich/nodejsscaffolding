import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import ArticleController from '@/resources/article/article.controller';

validateEnv();

const app = new App([new ArticleController()], Number(process.env.PORT));

app.listen();
