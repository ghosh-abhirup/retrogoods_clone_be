import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { MiddlewareRequest } from "../utils/types";
import { ApiError } from "../utils/ApiError";
import prisma from "../utils/client";
import pagination from "../services/pagination";

const getWishlists = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { id } = req.user;
    const { page } = req.query

    if (id!) {
        throw new ApiError(409, 'User does not exist')
    }

    try {
        const totalCount = await prisma.wishlist.count({
            where: {
                userId: id,
            }
        });

        const paginationObject = pagination(totalCount, Number(page));
        const wishlists = await prisma.wishlist.findMany({
            skip: paginationObject.skip,
            take: paginationObject.limit,
            where: {
                userId: id
            }
        })

        res.status(200).json({
            data: wishlists,
            pagination: paginationObject
        });
    } catch (error) {
        throw new ApiError(400, 'Error occured in get wishlist api')
    }

})

const addToWishlist = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { id } = req.user;
    const { id: product_id } = req.body;

    if (id!) {
        throw new ApiError(409, 'User does not exist')
    }
    if (!product_id) {
        throw new ApiError(409, 'Product ID field is required')
    }

    const presentInWishlist = await prisma.wishlist.findFirst({
        where: {
            userId: id,
            productId: product_id
        }
    })

    if (presentInWishlist) {
        throw new ApiError(400, 'Product already in wishlist')
    }

    try {
        await prisma.wishlist.create({
            data: {
                userId: id,
                productId: product_id
            }
        })

    } catch (error) {
        throw new ApiError(400, 'Failed to add product in wishlist')
    }

    return res.status(200).json({
        message: 'Added to wishlist'
    })

})

const removeFromWishlist = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { id: wishlist_id } = req.params;

    if (wishlist_id!) {
        throw new ApiError(409, 'Wishlist ID is faulty')
    }

    try {
        await prisma.wishlist.delete({
            where: {
                id: parseInt(wishlist_id)
            }
        })
    } catch (error) {
        throw new ApiError(400, 'Cannot remove product from wishlist')
    }

    return res.status(200).json({
        message: 'Removed from wishlist'
    })

})

export { removeFromWishlist, addToWishlist, getWishlists }