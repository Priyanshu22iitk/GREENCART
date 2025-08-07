import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { axios } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare product data
            const productData = {
                name,
                description: description.split('\n').filter(line => line.trim() !== ''),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice)
            };

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            
            // Add only valid files
            files.filter(file => file).forEach(file => {
                formData.append('images', file);
            });

            // Submit to backend
            const { data } = await axios.post('/api/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Product added successfully!', { 
                    position: 'bottom-center',
                    style: {
                        background: '#4BB543',
                        color: 'white',
                    }
                });
                
                // Reset form
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            } else {
                toast.error(data.message || 'Failed to add product');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (index, file) => {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                {/* Product Images */}
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill(null).map((_, index) => (
                            <label key={index} htmlFor={`image-upload-${index}`} className="cursor-pointer">
                                <input
                                    id={`image-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    className="hidden"
                                />
                                <img
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                    alt={files[index] ? `Preview ${index + 1}` : 'Upload area'}
                                    className="max-w-24 h-24 object-cover border border-gray-200 rounded"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label htmlFor="product-name" className="text-base font-medium">
                        Product Name
                    </label>
                    <input
                        id="product-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Product Description */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label htmlFor="product-description" className="text-base font-medium">
                        Product Description
                    </label>
                    <textarea
                        id="product-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Type here (use new lines for bullet points)"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        required
                    />
                </div>

                {/* Category */}
                <div className="w-full flex flex-col gap-1">
                    <label htmlFor="category" className="text-base font-medium">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((item) => (
                            <option key={item.path} value={item.path}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label htmlFor="product-price" className="text-base font-medium">
                            Product Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label htmlFor="offer-price" className="text-base font-medium">
                            Offer Price
                        </label>
                        <input
                            id="offer-price"
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-2.5 bg-indigo-500 text-white font-medium rounded ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600'
                    }`}
                >
                    {isSubmitting ? 'Adding Product...' : 'ADD'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;