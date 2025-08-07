import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard.jsx';



const ProductDetails = () => {
    const { products, currency, addToCart } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [thumbnail, setThumbnail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            const productsCopy = products.filter(
                (item) => product.category === item.category && item._id !== product._id
            );
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

     useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product]);

    if (!product) {
        return <div className="p-4">Product not found</div>;
    }

    return (
        <div className="mt-12">
            {/* Breadcrumb Navigation */}
            <p className="text-sm text-gray-600">
                <Link to="/" className="hover:text-indigo-500">Home</Link> /
                <Link to="/products" className="hover:text-indigo-500">Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-indigo-500">
                    {product.category}
                </Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            {/* Product Content */}
            <div className="flex flex-col md:flex-row gap-16 mt-4">
                {/* Image Gallery */}
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.images?.map((image, index) => (
                            <div 
                                key={`thumbnail-${index}`}
                                onClick={() => setThumbnail(image)} 
                                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                            >
                                <img 
                                    src={image} 
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = assets.placeholder_image;
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img 
                            src={thumbnail || assets.placeholder_image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = assets.placeholder_image;
                                e.target.onerror = null;
                            }}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img 
                                key={`star-${i}`}
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                                alt={i < 4 ? "filled star" : "empty star"}
                                className="md:w-4 w-3.5"
                            />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    {/* Pricing */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    {/* Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description?.map((desc, index) => (
                            <li key={`desc-${index}`}>{desc}</li>
                        ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button 
                            onClick={() => addToCart(product._id)} 
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => {
                                addToCart(product._id);
                                navigate('/cart');
                            }} 
                            className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-16 flex flex-col items-center">
    <div className="flex flex-col items-center w-max">
        <h2 className="text-2xl font-medium uppercase">Related Products</h2>
        <div className="w-20 h-1 bg-green-500 rounded-full mt-2"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
    {relatedProducts
        .filter((product) => product.inStock)
        .map((product, index) => (
            <ProductCard key={index} product={product} />
        ))
    }
</div>

<button 
    onClick={() => { 
        navigate('/products'); 
        window.scrollTo(0, 0); 
    }}
    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
>
    See more
</button>
</div>
        </div>
    );
};

export default ProductDetails;