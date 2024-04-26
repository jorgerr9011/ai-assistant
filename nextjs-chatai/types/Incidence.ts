import { ObjectId } from "mongoose";

export interface Incidencia {
    _id: ObjectId; // Specify the _id property type
    name: string;
    description: string;
    status: string;
    solution: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}