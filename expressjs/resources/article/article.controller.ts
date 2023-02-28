import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/article/article.validation';
import ArticleService from '@/resources/article/article.service';
import Article from '@/resources/article/article.interface';

class ArticleController implements Controller {
    public path = '/articles';
    public router = Router();
    private ArticleService = new ArticleService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            [authenticationMiddleware, validationMiddleware(validate.create, 'body')],
            this.create
        );

        this.router.get(
            `${this.path}`,
            authenticationMiddleware,
            this.getAllArticles
        );

        this.router.get(
            `${this.path}/filter`,
            [authenticationMiddleware, validationMiddleware(validate.getByFilter, 'query')],
            this.getArticlesByFilter
        );

        this.router.patch(
            `${this.path}/:id`,
            [authenticationMiddleware, validationMiddleware(validate.patch, 'body')],
            this.patch
        );

        this.router.delete(
            `${this.path}/:id`,
            [authenticationMiddleware, validationMiddleware(validate.remove, 'query')],
            this.delete
        );        
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const article = await this.ArticleService.create(title, body);
            res.status(201).json({ article });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getAllArticles = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        const articles = await this.ArticleService.getAllArticles();
        if (!articles){
            res.status(404);
        }
        res.status(200).json({ articles });
    };

    private getArticlesByFilter = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const filteredArticles = await this.ArticleService.getArticlesByFilter(req.params.id, req.params.title);
            if (!filteredArticles){
                res.status(404);
            }
            res.status(200).json({ filteredArticles });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private patch = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const id = req.params.id;
        const modifications: Article = req.body;

        try {
            const patchArticle = await this.ArticleService.patchArticle(id, modifications);
            if (!patchArticle){
                res.status(404);
            }

            res.status(200).json({ patchArticle });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const id = req.params.id;

        try {
            await this.ArticleService.deleteArticle(id);
            res.status(200);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default ArticleController;