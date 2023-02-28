import { Document } from 'mongoose';

export default interface Article extends Document {
    id: string;
    title: string;
    body: string;
}
