import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems } = useAppContext();
    const navigate = useNavigate();

    return product && (
        <div onClick={() => {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="border border-gray-200 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition w-full">
            <div className="group cursor-pointer flex items-center justify-center">
                <img
                    className="group-hover:scale-105 transition-transform h-28 object-contain"
                    src={product.image[0]}
                    alt={product.name}
                />
            </div>

            <div className="mt-2 text-gray-500 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-800 font-semibold text-base truncate">{product.name}</p>

                <div className="flex items-center gap-1 mt-1">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={`star-${i}`}
                            src={i < 4 ? assets.star_icon : product.star_dull_icon  }
                            alt={i < 4 ? "filled star" : "empty star"}
                            className="w-4 h-4"
                        />
                    ))}
                    <span className="ml-1 text-gray-400">(4)</span>
                </div>

                <div className="flex items-end justify-between mt-3">
                    <p className="text-lg font-semibold text-green-600">
                        {currency}{product.offerPrice}
                        <span className="line-through text-gray-400 ml-2 text-sm font-normal">
                            {currency}{product.price}
                        </span>
                    </p>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-600"
                    >
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center gap-1 px-3 py-1 border border-green-300 bg-green-50 rounded-md hover:bg-green-100 transition"
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart" className="w-4 h-4" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center bg-green-100 rounded-md px-2 py-1 gap-2">
                                <button onClick={() => removeFromCart(product._id)}>-</button>
                                <span>{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)}>+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
