import { AppError } from "../errors/custom.error.js"
import { prisma } from "../config/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// helper to sign JWT token
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        {
            id : user.id, 
            role : user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    const cookieOptions  = {
        expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day lifespan
        httpOnly : true, // Cookie cannot be accessed via client-side scripts
        secure : process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite : process.env.NODE_ENV === "production" ? "None" : "Lax" // CSRF protection
    };

    res.cookie('token', token, cookieOptions);

    user.password = undefined; // Remove password from response for security

    res.status(statusCode).json({
        success: "success",
        data : user,
        token : token,
    });
};

export const register = async(req, res, next) => {
    try {
        const { name, email, password, role } = req.validated.body

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role : role || "USER" // Default role is USER if not provided
            }
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {

    try {
        const {email, password } = req.validated.body;

        // now we'll see if the user exist in our Database
        const user = await prisma.user.findUnique({where : {email}});

        // now if the user is not here or password is wrong we show error;
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError("Invalid email or password credentials.", 401));
        }

        // else if user is banned so return this account has been deactivated;
        if(user.status !== 'active') {
            return next(new AppError("This user account has been deactivated.", 403));
        }
        
        // finally if no error then return 200 ok;
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// logout logic;
export const logout = (req, res) => {

    res.clearCookie('token', {
        httpOnly : true,
        secure : true, 
        sameSite: 'none',
    });
    res.status(200).json({
        status : 'success', 
        message : 'Logged out successfully'
    });
};