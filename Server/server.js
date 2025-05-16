require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Use environment variable or allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Increase JSON body size limit to 10mb (or higher if needed)
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error("Could not connect to MongoDB server. Please check your connection string and network.");
    }
  });

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  food: { type: String, required: true },
  photoPath: { type: String, required: true }, // Store the path to the image
}, {
  timestamps: true, // Add createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Add full URL to the photo
      if (ret.photoPath) {
        ret.photoUrl = `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${ret.photoPath}`;
      }
      return ret;
    }
  }
});

const Order = mongoose.model("Order", orderSchema);

// Handle file upload for new orders
app.post("/order", upload.single('photo'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a food photo" });
    }

    // Log the request body and file to debug
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file.filename);

    // Create new order with file path
    const orderData = {
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city,
      pincode: req.body.pincode,
      food: req.body.food,
      photoPath: req.file.filename // Store just the filename
    };

    // Validate that all required fields are present
    const requiredFields = ['name', 'phone', 'city', 'pincode', 'food', 'photoPath'];
    const missingFields = requiredFields.filter(field => !orderData[field]);

    if (missingFields.length > 0) {
      // Delete the uploaded file since we're not saving the order
      if (req.file) {
        fs.removeSync(path.join(uploadsDir, req.file.filename));
      }
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.removeSync(path.join(uploadsDir, req.file.filename));
    }

    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    console.error('Error creating order:', err);
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

// Handle file upload for updating orders
app.put("/order", upload.single('photo'), async (req, res) => {
  try {
    const { _id, ...updateFields } = req.body;

    if (!_id) {
      return res.status(400).json({ error: "Order _id required for update" });
    }

    // Log the request body and file to debug
    console.log('Update request body:', req.body);
    console.log('Update file:', req.file ? req.file.filename : 'No file uploaded');

    // Find the existing order
    const existingOrder = await Order.findById(_id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create update object with explicit fields
    const update = {
      name: updateFields.name,
      phone: updateFields.phone,
      city: updateFields.city,
      pincode: updateFields.pincode,
      food: updateFields.food
    };

    // If a new file was uploaded, update the photo path and delete the old file
    if (req.file) {
      // Delete the old file if it exists
      if (existingOrder.photoPath) {
        const oldFilePath = path.join(uploadsDir, existingOrder.photoPath);
        if (fs.existsSync(oldFilePath)) {
          fs.removeSync(oldFilePath);
        }
      }

      // Update with new file path
      update.photoPath = req.file.filename;
    } else {
      // If no new file was uploaded, require the existing photo
      if (!existingOrder.photoPath) {
        return res.status(400).json({ error: "Photo is required" });
      }
    }

    // Validate that all required fields are present
    const requiredFields = ['name', 'phone', 'city', 'pincode', 'food'];
    const missingFields = requiredFields.filter(field => !update[field]);

    if (missingFields.length > 0) {
      // Delete the uploaded file if there was one
      if (req.file) {
        fs.removeSync(path.join(uploadsDir, req.file.filename));
      }
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(_id, update, { new: true });
    res.json(order);
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.removeSync(path.join(uploadsDir, req.file.filename));
    }

    console.error('Error updating order:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/order", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: "Order _id required for deletion" });
    }

    // Find the order first to get the photo path
    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete the associated image file if it exists
    if (order.photoPath) {
      const filePath = path.join(uploadsDir, order.photoPath);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
      }
    }

    // Delete the order from the database
    await Order.findByIdAndDelete(_id);

    res.json({ message: "Order deleted", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
