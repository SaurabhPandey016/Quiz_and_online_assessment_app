import jwt from 'jsonwebtoken'
import { AppError } from '../errors/custom.error.js'
import {prisma} from '../config/prisma.js'

export const protect = async(req, res, next) => {

    try {
        // first take the token from the body
        const token = req.cookies?.token;

        // if token is not present just show the error;
        if(!token) {
            return next(new AppError("You are not loggin in. Please login to gain access.", 401));
        }

        // compare and decode the cookie with the supersecret key that we have
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await prisma.user.findUnique({where : {id : decoded.id}});

        // if the user belongs to this token exist then ok if not return error
        if(!currentUser) {
            return next(new AppError("Your account that have this token, no longer exists.", 401));
        }

        if(currentUser.status !== 'active') {
            return next(new AppError("Your account has been deactivated", 403));
        }

        // now every test passed then add active profile context to the user
        req.user = currentUser;
        
        // Then call the next middleware
        next();   
    } catch(error) {
        return next(new AppError("Invalid token validation sequence.", 401));
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not possess permission authorization to view this resource.', 403));
        }
        next();
    };
};