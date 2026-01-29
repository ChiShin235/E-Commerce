import express from 'express';
import { getAllRecommendations, getRecommendationById, createRecommendation, updateRecommendation, deleteRecommendation } from '../controllers/aiRecommendationControllers.js';

const router = express.Router();

router.get('/', getAllRecommendations);
router.get('/:id', getRecommendationById);
router.post('/', createRecommendation);
router.put('/:id', updateRecommendation);
router.delete('/:id', deleteRecommendation);

export default router;
