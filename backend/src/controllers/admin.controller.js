import { parse } from "dotenv";
import cloudinary from "../config/cloudinary.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {User} from "../models/user.model.js";

export async function createProduct(req, res) {
    try {
        const {name, description, price, stock, category} = req.body;
        if(!name || !description || !price || !stock || !category) {
            return res.status(400).json({message: "All fields are required"});
        }
        if (!req.files || !req.files.images || req.files.images.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }
        if (req.files.images.length > 3) {
            return res.status(400).json({ message: "Maximum of 3 images are allowed" });
        }

        constuploadPromises = req.files.images.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls,
        });

        res.status(201).json(product);

    } catch (error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function getAllProducts(req, res) {
    try {
    const{id}= req.params;
    const {name, description,price, stock,category}= req.body;
    const products = await Product.findById();
    
    if(name) products.name = name;
    if(description) products.description = description;
    if(price) products.price = parseFloat(price);
    if(stock) products.stock = products.stock = parseInt(stock);
    if(category) products.category = category;

    if(req.files && req.files.length > 0){
        if(req.files.length > 3){
            return res.status(400).json({message: "Maximum of 3 images are allowed"});
        }
    }

    const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
            folder: "products",
        });
    });

    const uploadResults = await Promise.all(uploadPromises);
    product.images = uploadResults.map(result => result.secure_url);

    await products.save();
    res.status(200).json(products);

  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProduct(req, res) {}

export async function getAllOrders(req, res) {
    try {
        constorders = await Order.find()
        .populate("user", "name email")
        .populate("orderItems.product")
        .sort({ createdAt: -1 })

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getAllOrders orders:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        if(!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)){
            return res.status(400).json({message: "Invalid status"});
        }
        
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }

        order.status = status;

        if(status === 'shipped' && !order.shippedAt){
            order.shippedAt = new Date();
        }
        if(status === 'delivered' && !order.deliveredAt){
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({message: "Order status updated successfully", order});
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getAllCustomers(req, res) {
    try {
    const customers = await User.find().sort({ createdAt: -1 }); // latest user first
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getDashboardStats(req, res) {
    try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

