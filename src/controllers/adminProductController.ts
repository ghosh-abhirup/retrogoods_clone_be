import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { MiddlewareRequest } from "../utils/types";
import { ApiError } from "../utils/ApiError";
import prisma from "../utils/client";
import pagination from "../services/pagination";

const getAdminProducts = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const user = req.user;
    const { page } = req.query;

    if (!user) {
        throw new ApiError(500, "User not found")
    }

    const totalCount = await prisma.product.count();
    const paginationObject = pagination(totalCount, Number(page));

    const products = await prisma.product.findMany({
        skip: paginationObject.skip,
        take: paginationObject.limit,
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            providerId: user.id,
        },
        omit: {
            createdAt: true,
            providerId: true,
        }
    })

    return res.status(200).json({
        data: products,
        message: "Products fetched of provider: " + user.firstname + " " + user.lastname,
    })
})

const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "ID not valid");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    })

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    return res.status(200).json({
        message: "Product details",
        data: product
    })
})

const updateProductByAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
        throw new ApiError(400, "ID not valid");
    }

    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })

    return res.status(200).json({
        message: "Product updated"
    })
})

const addProduct = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { name, sku } = req.body;
    const user = req.user;

    if (!(name && sku)) {
        throw new ApiError(400, 'All fields are required');
    }

    const similarSKUProduct = await prisma.product.findFirst({
        where: {
            sku: sku,
        }
    });

    if (similarSKUProduct) {
        throw new ApiError(400, 'SKU Already Present');
    }

    try {

        await prisma.product.create({
            data: {
                name: name,
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

export { getAdminProducts, getProduct, updateProductByAdmin, addProduct }