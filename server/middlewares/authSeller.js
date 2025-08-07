import jwt from 'jsonwebtoken';
import Seller from '../models/Seller.js'; // Import your Seller model
import 'dotenv/config';

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    // 1. Check if token exists
    if (!sellerToken) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization token required' 
        });
    }

    try {
        // 2. Verify token structure and signature
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        // 3. Verify seller exists in database
        const seller = await Seller.findById(decoded.id).select('-password');
        
        if (!seller) {
            return res.status(401).json({ 
                success: false, 
                message: 'Seller account not found' 
            });
        }

        // 4. Attach seller to request object
        req.seller = seller;
        next();

    } catch (error) {
        // Handle different error types specifically
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

export default authSeller;