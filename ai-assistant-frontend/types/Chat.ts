import { ObjectId } from "mongoose";

export interface Chat {
    _id: ObjectId; // Specify the _id property type
    title: string;
    chat_history: Array<object>;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
 