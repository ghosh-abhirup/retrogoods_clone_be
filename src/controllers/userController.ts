import { Request, Response } from "express";
import prisma from "../utils/client";

import { User, UserType } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { comparePasswords, generateAccessToken, generateRefreshToken, hashPassword } from "../services/authServices";
import { MiddlewareRequest } from "../utils/types";

const jwt = require('jsonwebtoken')

interface registerUserType {

    firstname: string;
    lastname: string;
    email: string;
    password: string;
    type: UserType;

}

const generateAccessAndRefreshToken = async (user: User) => {
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    })

    return { accessToken, refreshToken }
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, type }: registerUserType = req.body;

    if (
        !(firstname.trim() && lastname.trim() && email.trim() && password.trim() && type.trim())
    ) {
        throw new ApiError(400, 'All fields are required')
    }

    const userWithEmail = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (userWithEmail) {
        throw new ApiError(409, 'Email is being used by another user')
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            firstname,
            lastname,
            password: hashedPassword,
            type
        }
    })

    const createdUser = await prisma.user.findFirst({
        where: {
            id: user.id
        },

    })

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering user')
    }

    return res
        .status(200)
        .json({
            message: 'User registered'
        })
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!(email.trim() && password.trim())) {
        throw new ApiError(400, "All fields are mandatory");
    }

    const userWithEmail = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (!userWithEmail) {
        throw new ApiError(400, "User with this email doesn't exist");
    }

    const isPasswordCorrect = await comparePasswords(password, userWithEmail.password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password didn't match");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userWithEmail)

    return res
        .status(200)
        .cookie('accessToken', accessToken)
        .cookie('refreshToken', refreshToken)
        .json({
            message: "User logged in"
        })
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not present");
    }

    try {
        const decodedToken = await jwt.decode(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken.id
            }
        })

        if (!user) {
            throw new ApiError(500, "User doesn't exist")
        }

        if (incomingRefreshToken != user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

        return res
            .status(200)
            .cookie('accessToken', accessToken)
            .cookie('refreshToken', refreshToken)
            .json({
                message: "Refreshed access token"
            })

    } catch (error) {
        throw new ApiError(401, "Token is wrong");
    }
})

const getUser = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'ID not available')
    }

    const user = await prisma.user.findFirst({
        where: {
            id
        },
        include: {
            wishlist: true,
            orders: true,

        },
        omit: {
            password: true,
            refreshToken: true
        }
    })

    if (!user) {
        throw new ApiError(409, "User doesn't exist")
    }

    return res.status(200).json({
        data: user,
    })
})

const updateUser = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;

    if (!id) {
        throw new ApiError(400, 'Id not available');
    }

    // const user = await prisma.user.findFirst({
    //     where: {
    //         id
    //     }
    // })
    const user = req.user;

    if (!user) {
        throw new ApiError(409, "User doesn't exist")
    }

    const updatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            firstname,
            lastname,
            email
        }
    })

    if (!updatedUser) {
        throw new ApiError(500, 'Issue in update user');
    }

    return res.status(200).json({
        data: updatedUser,

    })
})

const logoutHandler = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const id = req.user.id;

    await prisma.user.update({
        where: {
            id
        },
        data: {
            refreshToken: null
        }
    })

    const options = {
        httpOnly: true,
        secure: true,
    };


    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({
            message: "User logged out"
        })
})

export { registerUser, loginUser, refreshAccessToken, getUser, updateUser, logoutHandler }