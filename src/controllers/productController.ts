import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import prisma from "../utils/client";
import { MiddlewareRequest } from "../utils/types";
import pagination from "../services/pagination";

const getSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'ID not available')
    }

    const product = await prisma.product.findFirst({
        where: {
            id
        },
        include: {
            provider: true,
            productLots: true,
        },

    })

    if (!product) {
        throw new ApiError(500, 'Product not available')
    }

    res.status(200).json({
        data: product
    })
})

const addProduct = asyncHandler(async (req: Request, res: Response) => {
    const { productName, sku } = req.body;
    const user = req.user

    if (productName && sku) {
        throw new ApiError(400, 'All fields are required');
    }

    try {
        await prisma.product.create({
            data: {
                name: productName,
                sku: sku,
                provider: {
                    connect: { id: user?.id }
                }
            }
        })
    } catch (error) {
        throw new ApiError(400, 'Cannot create product');
    }

    return res.status(200).json({
        message: "Product created",
    })
})

const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page } = req.query

    try {
        const totalCount = await prisma.product.count();
        const paginationObject = pagination(totalCount, Number(page));

        const products = await prisma.product.findMany({
            skip: paginationObject.skip,
            take: paginationObject.limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                provider: true
            }
        })

        res.status(200).json({
            data: products,
            pagination: paginationObject
        });
    } catch (error) {
        throw new ApiError(400, 'Error occured in get product api')
    }
})

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
        throw new ApiError(409, 'Name field is missing');
    }

    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name
        }
    })

    res.status(200).json({
        message: 'Product updated'
    })
})

export { getSpecificProduct, addProduct, getProducts, updateProduct }