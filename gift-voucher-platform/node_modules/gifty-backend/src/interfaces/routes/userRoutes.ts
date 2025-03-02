import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../../application/controllers/userController';

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

export { router as userRoutes }; 