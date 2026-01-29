import AIRecommendation from '../models/AIRecommendation.js';

export const getAllRecommendations = async (req, res) => {
    try {
        const recommendations = await AIRecommendation.find().sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (error) {
        console.error("Error in getAllRecommendations:", error);
        res.status(500).json({ message: "Server error while fetching recommendations" });
    }
};

export const getRecommendationById = async (req, res) => {
    try {
        const recommendation = await AIRecommendation.findById(req.params.id);
        if (!recommendation) {
            return res.status(404).json({ message: "Recommendation not found" });
        }
        res.status(200).json(recommendation);
    } catch (error) {
        console.error("Error in getRecommendationById:", error);
        res.status(500).json({ message: "Server error while fetching recommendation" });
    }
};

export const createRecommendation = async (req, res) => {
    try {
        const { user, product, score } = req.body;
        const recommendation = new AIRecommendation({ user, product, score });
        const newRecommendation = await recommendation.save();
        res.status(201).json(newRecommendation);
    } catch (error) {
        console.error("Error in createRecommendation:", error);
        res.status(500).json({ message: "Server error while creating recommendation" });
    }
};

export const updateRecommendation = async (req, res) => {
    try {
        const { user, product, score } = req.body;
        const updatedRecommendation = await AIRecommendation.findByIdAndUpdate(
            req.params.id,
            { user, product, score },
            { new: true }
        );
        if (!updatedRecommendation) {
            return res.status(404).json({ message: "Recommendation not found" });
        }
        res.status(200).json(updatedRecommendation);
    } catch (error) {
        console.error("Error in updateRecommendation:", error);
        res.status(500).json({ message: "Server error while updating recommendation" });
    }
};

export const deleteRecommendation = async (req, res) => {
    try {
        const deletedRecommendation = await AIRecommendation.findByIdAndDelete(req.params.id);
        if (!deletedRecommendation) {
            return res.status(404).json({ message: "Recommendation not found" });
        }
        res.status(200).json(deletedRecommendation);
    } catch (error) {
        console.error("Error in deleteRecommendation:", error);
        res.status(500).json({ message: "Server error while deleting recommendation" });
    }
};
