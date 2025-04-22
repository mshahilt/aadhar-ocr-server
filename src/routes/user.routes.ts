import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';
import upload from '../utils/multer';

const router = Router();

router.post('/process-image', upload.fields([{ name: 'front', maxCount: 1 },{ name: 'back', maxCount: 1 },]), asyncHandler(UserController.processImage));


export default router;
