import { User } from "@prisma/client";
import { Request } from "express";

interface MiddlewareRequest extends Request {
    user: User
}

export { MiddlewareRequest }