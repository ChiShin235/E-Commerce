import Review from '../models/Review.js';

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error in getAllReviews:", error);
        res.status(500).json({ message: "Server error while fetching reviews" });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(review);
    } catch (error) {
        console.error("Error in getReviewById:", error);
        res.status(500).json({ message: "Server error while fetching review" });
    }
};

export const createReview = async (req, res) => {
    try {
        const { user, product, rating, comment } = req.body;
        const review = new Review({ user, product, rating, comment });
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error in createReview:", error);
        res.status(500).json({ message: "Server error while creating review" });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { user, product, rating, comment } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { user, product, rating, comment },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error("Error in updateReview:", error);
        res.status(500).json({ message: "Server error while updating review" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(deletedReview);
    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({ message: "Server error while deleting review" });
    }
};
