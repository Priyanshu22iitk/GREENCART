import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';


const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Verify seller session on component mount
    useEffect(() => {
        const verifySeller = async () => {
            try {
                const { data } = await axios.get('/api/seller/verify');
                if (data.success) {
                    setIsSeller(true);
                    navigate('/seller/dashboard');
                }
            } catch (error) {
                setIsSeller(false);
            }
        };
        verifySeller();
    }, []);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const { data } = await axios.post('/api/seller/login', { 
                email, 
                password 
            });

            if (data.success) {
                // Store token in httpOnly cookie (handled by backend)
                setIsSeller(true);
                navigate('/seller/dashboard');
                toast.success('Login successful');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast .error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSeller) {
        return null; // Or redirect immediately
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
                <p className='text-2xl font-medium m-auto'>
                    <span className="text-primary">Seller</span> Login
                </p>
                
                <div className="w-full">
                    <p>Email</p>
                    <input 
                        type="email" 
                        placeholder="enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-green-500'
                        required
                    />
                </div>
                
                <div className="w-full">
                    <p>Password</p>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="enter your password"
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-green-500' 
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`bg-green-500 hover:bg-green-600 transition-all text-white w-full py-2 rounded-md cursor-pointer ${
                        isLoading ? 'opacity-70' : ''
                    }`}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </form>
    );
};

export default SellerLogin;