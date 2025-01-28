// express.d.ts
import { User } from '@prisma/client';
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            // Add your custom fields here
            user?: User
        }
    }
}
