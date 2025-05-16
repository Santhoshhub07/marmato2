const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add this line
const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*', // Accept requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Add this line
// Increase JSON body size limit to 10mb (or higher if needed)
app.use(express.json({ limit: '10mb' }));

mongoose.connect("mongodb+srv://santhosh:san123@mernprj.z56d80z.mongodb.net/?retryWrites=true&w=majority&appName=MERNPRJ");

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  food: { type: String, required: true },
  photo: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/order", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/order", async (req, res) => {
  try {
    const { _id, ...update } = req.body;
    if (!_id)
      return res.status(400).json({ error: "Order _id required for update" });
    const order = await Order.findByIdAndUpdate(_id, update, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/order", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id)
      return res.status(400).json({ error: "Order _id required for deletion" });
    const order = await Order.findByIdAndDelete(_id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
