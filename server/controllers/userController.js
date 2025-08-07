import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
 
// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Input Validation (with trimmed values)
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and password are required' 
            });
        }

        // 2. Normalize email (case-insensitive check)
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user (with normalized email)
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        // 5. Generate JWT
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // 6. Set secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        // 7. Return success (excluding password)
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({ 
            success: true, 
            user: userWithoutPassword 
        });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate email error (even if unique index exists)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });


    }
};   
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.json({ success: false, message: 'Invalid email or password' });
}

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
});

res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
});

return res.json({ success: true,user: { emaoil: user.email, name: user.name} });

        // Rest of your original logic here...
        // (Add password comparison, JWT, cookie, etc.)

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
// Check Auth : /api/user/is-auth
// isAuth controller - Updated (only this changes)
export const isAuth = async (req, res) => {
    try {
        // 1. Get token from cookies (no frontend changes needed)
        const token = req.cookies.token;
        if (!token) {
            return res.json({ success: false, message: 'Not authenticated' });
        }

        // 2. Verify token (same secret as login/register)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find user (same as before, but uses decoded.id instead of req.body)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // 4. Return same response format as before
        return res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: 'Not authenticated' });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};  