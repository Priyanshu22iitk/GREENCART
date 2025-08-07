import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {toast} from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials =true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Set the base URL for axios
export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const [loadingUser, setLoadingUser] = useState(true); // NEW

    const currency = import.meta.env.VITE_CURRENCY ; // Default to Indian Rupee if not set
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Fetch Seller Status
const fetchSeller = async () => {
    try {
        const { data } = await axios.get('/api/seller/is-auth');
        if (data.success) {
            setIsSeller(true);  
        } else {
            setIsSeller(false);
        }
    } catch (error) {
        setIsSeller(false);
    }
};
// Fetch User Auth Status, User Data and Cart Items
const fetchUser = async () => {
    try {
        const res = await axios.get('/api/user/is-auth');
        if (res.data.success) {
            setUser(res.data.user);
        } else {
            setUser(false); // so components know user is not logged in
        }
    } catch (err) {
        setUser(false); // handle as unauthenticated
    } finally {
        setLoadingUser(false); // ✅ ensure loading ends
    }
};



   // Fetch All Products
const fetchProducts = async () => {
    try {
        const { data } = await axios.get('/api/product/list');
        if (data.success) {
            setProducts(data.products);
        } else {
            toast.error(data.message );
        }
    } catch (error) {
        toast.error( error.message );
    }
};

    const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
        cartData[itemId] += 1;
    } else {
        cartData[itemId] = 1;
    }
    
    setCartItems(cartData);
    toast.success("Added to Cart");  
}
// Update Cart Item Quantity
const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
}

// Remove Product from Cart
const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
        cartData[itemId] -= 1;
        if (cartData[itemId] === 0) {
            delete cartData[itemId];
        }
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
    setCartItems(cartData);
}


const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
        totalCount += cartItems[item];
    }
    return totalCount;
};

// Get Cart Total Amount
const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        const itemInfo = products.find(product => product._id === itemId);
        if (itemInfo && cartItems[itemId] > 0) {
            totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
    }
    return Math.floor(totalAmount * 100) / 100; // Round to 2 decimal places
};
    useEffect(() => {
        fetchSeller()
        fetchProducts() 
        fetchUser()
        
    }, []);


    useEffect(() => {
    const updateCart = async () => {
        try {
            const { data } = await axios.post('/api/cart/update', { cartItems });
            if (!data.success) {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error( error.message);
        }
    };

    if (user) {
        updateCart();
    }
}, [cartItems]); // Add user to dependency array
    const value = {navigate, user, setUser, setIsSeller, isSeller,showUserLogin, setShowUserLogin,products, currency,updateCartItem ,removeFromCart,addToCart,cartItems,searchQuery,setSearchQuery,setRelatedProducts,relatedProducts,getCartAmount,getCartCount,axios,fetchProducts,setCartItems,loadingUser};
        
    return <AppContext.Provider value={value}> 
    {children}
    </AppContext.Provider>
}   

export const useAppContext = ()=>{
    return useContext(AppContext)
}