import { ApiError } from "../utils/ApiError";

const limit = 10;

const pagination = (totalCount: number, page: number) => {

    if (!page || isNaN(page)) {
        throw new ApiError(400, 'Please send the page value');
    }

    const totalPages = (totalCount / limit) + (totalCount % limit == 0 ? 0 : 1);


    return {
        skip: page * limit,
        limit,
        totalPages,
        page
    }
}

export default pagination