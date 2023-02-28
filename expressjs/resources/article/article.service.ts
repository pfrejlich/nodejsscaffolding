import ArticleModel from '@/resources/article/article.model';
import Article from '@/resources/article/article.interface';

class ArticleService {
    private article = ArticleModel;

    /**
     * Create a new article
     */
    public async create(title: string, body: string): Promise<Article> {
        try {
            const article = await this.article.create({ title, body });

            return article;
        } catch (error) {
            throw new Error('Unable to create a article');
        }
    }

    public async getAllArticles(): Promise<Article[]> {
        try {
            const filter = {};
            const articles = await this.article.find(filter);

            return articles;
        } catch (error) {
            throw new Error('Unable to get articles');
        }
    }

    public async getArticlesByFilter(
        id: string,
        title: string
    ): Promise<Article[]> {
        try {
            const filter = {
                $or: [{ _id: id }, { title: title }],
            };
            const articles = await this.article.find(filter);
            return articles;
        } catch (error) {
            throw new Error('Unable to get articles');
        }
    }

    public async patchArticle(
        id: string,
        modifications: Article): Promise<Article | null> {

        try {
            const article = await this.article.findByIdAndUpdate(id, modifications, { new: false });
            return article;
        } catch (error) {
            throw new Error('Unable to modify article');
        }
    }

    public async deleteArticle(
        id: string): Promise<void> {

        try {
            await this.article.deleteOne({ _id: id });            
        } catch (error) {
            throw new Error('Unable to modify article');
        }
    }
}

export default ArticleService;
