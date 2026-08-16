import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/custom.error.js';
import bcrypt from 'bcrypt';

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const createUserAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role = 'USER' } = req.validated.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('An account with this email already exists. Please choose another email.', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'User account created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.validated.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return next(new AppError('The requested user record could not be found.', 404));
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return next(new AppError('User not found.', 404));
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
