import { NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import prisma from "../utils/client";
import { MiddlewareRequest } from "../utils/types";
const jwt = require('jsonwebtoken')

export const verifyAccess = asyncHandler(async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") || null;

        if (!token) {
            throw new ApiError(401, "Unauthorized access token");
        }

        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await prisma.user.findFirst({
            where: {
                id: decodedInfo.id
            },
            // omit:{
            //     password: true,
            //     refreshToken: true
            // }
        })

        if (!user) {
            throw new ApiError(401, "User not present");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(500, "Invalid access token");
    }
})