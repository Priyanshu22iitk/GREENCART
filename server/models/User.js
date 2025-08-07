import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    cartItems: { 
        type: Object, 
        default: {} 
    }
}, { 
    minimize: false,    
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Check if model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('user', userSchema);

export default User;