import { AppError } from "../errors/custom.error.js"
import { prisma } from "../config/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

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
        status: 'success',
        data: { user },
        token,
    });
};

export const register = async(req, res, next) => {
    try {
        const { name, email, password, role } = req.validated.body

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('An account with this email already exists. Please log in instead.', 409));
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role : role || "USER"
            }
        });

        const safeUser = { ...user };
        delete safeUser.password;

        res.status(201).json({
            status: 'success',
            message: 'Account created successfully. Please sign in to continue.',
            data: { user: safeUser }
        });
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};

const createPasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return { resetToken, hashedResetToken, expires };
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.validated.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(200).json({
                status: 'success',
                message: 'If an account matches that email, a password reset token has been generated.'
            });
        }

        const { resetToken, hashedResetToken, expires } = createPasswordResetToken();
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: hashedResetToken,
                passwordResetExpires: expires
            }
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset token generated successfully.',
            data: { resetToken }
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.validated.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return next(new AppError('Reset token is invalid or has expired.', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });

        sendTokenResponse(updatedUser, 200, res);
    } catch (error) {
        next(error);
    }
};

export const getMeProfile = async (req, res, next) => {
  try {
    // req.user is already loaded by our 'protect' middleware shield guard
    const user = req.user;
    user.password = undefined; // Strip hash parameter for safety
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};