
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
app.use(bodyParser.json());

/**
 * this method is to connect DB
 * 
 */

const connectToDB = async () => {
    try {
        const uri = 'mongodb+srv://venkatesh:Vk%40848381@cluster2.g5fip.mongodb.net/myDatabase?retryWrites=true&w=majority';
        const connectionInstance = await mongoose.connect(uri)
        console.log(`\n MongoDB connected !! DB HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`mongoDB connection error \nError:${error.message}`)
    }
}

connectToDB();

//  User model
const UserSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    isAdmin: { type: Boolean, default: false } 
});


const User = mongoose.model('User', UserSchema);

//  Product model
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    quantity: { type: Number, default: 0 },
    image: String

});

const Product = mongoose.model('Product', ProductSchema);

//  Order model
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cartItems: [{
        name: String,
        price: Number,
        quantity: Number,
        description: String,
        image: String
    }],
    totalPrice: Number,
    shippingDetails: {
        name: String,
        address: String,
        phone: String,
        email: String
    },
    paymentDetails: {
        cardNumber: String,
        expiryDate: String,
        cvv: String,
        upiId: String
    },
    selectedPaymentMethod: String,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token)
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

//for profile 
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Fetch user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Route to handle user registration
app.post('/api/users/signup', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Validate input data
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = new User({ fullName, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Route to handle user sign-in
app.post('/api/users/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Sign in successful', user, token });
    } catch (err) {
        console.error('Error signing in user:', err);
        res.status(500).json({ error: 'Failed to sign in user' });
    }
});


// Route to add a new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, category, quantity, image } = req.body;
        const product = new Product({ name, price, description, category, quantity, image });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Route to get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Route to update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, quantity, image } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name, price, description, category, quantity, image
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Route to delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Route to get product categories
app.get('/api/products/categories', (req, res) => {
    try {
        // Assuming categories are predefined and not stored in the database
        const categories = ['Veg', 'Non-vej', 'Snacks & Treats', 'Drinks & Beverages'];
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// const mongoose = require('mongoose');
// const Order = require('./models/Order');  // Assuming your Order model is in a file named Order.js

// Route to create a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orderData = req.body;

        // Validate required fields
        if (!orderData.shippingDetails.email) {
            return res.status(400).json({ error: 'Email is required in shipping details' });
        }

        // Properly instantiate ObjectId with 'new'
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Create a new order object with the userId
        const order = new Order({
            ...orderData,
            userId: userId  // Ensure this is an ObjectId
        });

        // Save the order to the database
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
});


// Route to get orders for the logged-in user
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Route to get a specific order by ID for the logged-in user
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: 'Order not found or access denied' });
        }
        res.json(order);
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
