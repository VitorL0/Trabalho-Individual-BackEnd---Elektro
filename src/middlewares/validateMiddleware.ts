import { Request,Response,NextFunction } from "express";
import {z} from "zod"

export function validateBody<T>(schema:z.ZodSchema<T>){
    return(req: Request, res:Response,next:NextFunction)=>{
        const validate = schema.safeParse(req.body);
        if(!validate.success){
            res.status(400).json({errors: z.treeifyError(validate.error)});
            return;
        }
        next();
    }

}