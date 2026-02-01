import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Payment from '../models/Payment.js';

const computeTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ message: "Server error while fetching orders" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const items = await OrderItem.find({ order: order._id });
        res.status(200).json({ order, items });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        res.status(500).json({ message: "Server error while fetching order" });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { user, items, status, email, shippingAddress, paymentMethod, shippingFee } = req.body;
        const userId = req.userId || user;
        if (!userId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "user and items are required" });
        }

        const totalAmount = computeTotal(items);
        const order = new Order({
            user: userId,
            totalAmount,
            status,
            email,
            shippingAddress,
            paymentMethod,
            shippingFee,
        });
        const newOrder = await order.save();

        const orderItems = await OrderItem.insertMany(
            items.map((item) => ({
                order: newOrder._id,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
            }))
        );

        res.status(201).json({ order: newOrder, items: orderItems });
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ message: "Server error while creating order" });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { user, status, items, email, shippingAddress, paymentMethod, shippingFee } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (user) {
            order.user = user;
        }
        if (status) {
            order.status = status;
        }
        if (email !== undefined) {
            order.email = email;
        }
        if (shippingAddress !== undefined) {
            order.shippingAddress = shippingAddress;
        }
        if (paymentMethod) {
            order.paymentMethod = paymentMethod;
        }
        if (shippingFee !== undefined) {
            order.shippingFee = shippingFee;
        }

        let updatedItems = null;
        if (Array.isArray(items) && items.length > 0) {
            await OrderItem.deleteMany({ order: order._id });
            const totalAmount = computeTotal(items);
            order.totalAmount = totalAmount;
            updatedItems = await OrderItem.insertMany(
                items.map((item) => ({
                    order: order._id,
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price,
                }))
            );
        }

        const updatedOrder = await order.save();
        res.status(200).json({ order: updatedOrder, items: updatedItems });
    } catch (error) {
        console.error("Error in updateOrder:", error);
        res.status(500).json({ message: "Server error while updating order" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        await OrderItem.deleteMany({ order: deletedOrder._id });
        await Payment.deleteMany({ order: deletedOrder._id });
        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        res.status(500).json({ message: "Server error while deleting order" });
    }
};
