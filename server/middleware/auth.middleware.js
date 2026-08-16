import jwt from 'jsonwebtoken'
import { AppError } from '../errors/custom.error.js'
import {prisma} from '../config/prisma.js'

export const protect = async(req, res, next) => {

    try {
        const cookieToken = req.cookies?.token;
        const authHeader = req.headers.authorization || '';
        const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        const token = cookieToken || headerToken;

        if(!token) {
            return next(new AppError("You are not loggin in. Please login to gain access.", 401));
        }

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