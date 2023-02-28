import { Schema, model } from 'mongoose';
import Article from '@/resources/article/article.interface';

const ArticleSchema = new Schema(
    {
        id: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<Article>('Article', ArticleSchema);
