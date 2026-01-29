import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "paid", "shipped", "completed", "cancelled"],
    },
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);
