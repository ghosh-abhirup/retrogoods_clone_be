import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import prisma from "../utils/client";
import pagination from "../services/pagination";
import { MiddlewareRequest } from "../utils/types";

type OrderProductInput = {
    productId: string;
    productLotId: string;
    quantity: number;
};

type CreateOrderPayload = {
    orderProducts: OrderProductInput[], address_line_1: string, address_line_2: string, pincode: number
}


const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(409, 'ID is not valid');
    }

    const order = await prisma.orders.findFirst({
        where: {
            id,
        },
        include: {
            customer: true,
            orderProductPivots: {
                include: {
                    product: true,
                    productLot: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                },
            },
        }
    });

    if (!order) {

        throw new ApiError(409, 'Order is not present');
    }

    return res.status(200).json({
        message: 'Order fetched',
        data: order
    })
});


const createOrder = asyncHandler(async (req: MiddlewareRequest, res: Response) => {
    const { orderProducts, address_line_1, address_line_2, pincode }: CreateOrderPayload = req.body
    const customer_id = req.user?.id;


    if (!address_line_1 && !pincode && orderProducts.length == 0) {
        throw new ApiError(409, 'All fields are necessary');
    }

    const order = await prisma.orders.create({
        data: {
            customerId: '' + customer_id,
            address_line_1,
            address_line_2,
            pincode,
            status: "order_placed",
            orderProductPivots: {
                createMany: {
                    data: orderProducts
                }
            }
        },
    });

    if (!order) {
        throw new ApiError(400, 'Order cannot be created')
    }

    return res.status(200).json({
        message: 'Order created'
    })

})

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;

    if (status) {
        throw new ApiError(400, 'Status is not defined')
    }

    try {

        await prisma.orders.update({
            where: {
                id
            },
            data: {
                status: status
            }
        })
    } catch (error) {
        console.log('error = ', error)
    }

    return res.status(200).json({
        message: 'Order status updated'
    })
})

const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page } = req.query

    try {
        const totalCount = await prisma.orders.count();
        const paginationObject = pagination(totalCount, Number(page));

        const orders = await prisma.orders.findMany({
            skip: paginationObject.skip,
            take: paginationObject.limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                orderProductPivots: {
                    include: {
                        product: true,
                        productLot: true,
                    }
                }
            }
        })

        res.status(200).json({
            data: orders,
            pagination: paginationObject
        });
    } catch (error) {

        throw new ApiError(400, 'Error occured in get product api')
    }
})

export { getOrder, createOrder, updateOrderStatus, getOrders }