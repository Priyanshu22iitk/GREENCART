import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;
        
        // Validate required fields
        if (!address || !userId) {
            return res.status(400).json({
                success: false,
                message: "Address and userId are required"
            });
        }

        const newAddress = await Address.create({ ...address, userId });
        
        res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress // Return the created address
        });
    } catch (error) {
        console.error('Add Address Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to add address"
        });
    }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required"
            });
        }

        const addresses = await Address.find({ userId });
        res.status(200).json({ 
            success: true, 
            addresses 
        });
    } catch (error) {
        console.error('Get Address Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch addresses"
        });
    }
};