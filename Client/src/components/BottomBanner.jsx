import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
    return (
        <div className='relative mt-24'>
            {/* Banner Images with adjusted positioning */}
            <div className='relative h-[300px] md:h-[500px] overflow-hidden'>
                <img 
                    src={assets.bottom_banner_image} 
                    alt="banner" 
                    className='w-full h-full hidden md:block object-cover object-left' /* Focus image left */
                />
                <img 
                    src={assets.bottom_banner_image_sm} 
                    alt="banner" 
                    className='w-full h-full md:hidden object-cover object-left' /* Focus image left */
                />
            </div>
            
            {/* Content Box - Now positioned to avoid overlap */}
            <div className='absolute top-1/2 -translate-y-1/2 right-4 md:right-8 w-full max-w-[280px] md:max-w-[320px]'>
                <div className='bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                    <h1 className='text-xl md:text-2xl font-semibold text-green-600 mb-3'>
                        Why We Are the Best?
                    </h1>
                    
                    <div className='space-y-3'>
                        {features.map((feature, index) => (
                            <div key={index} className='flex items-start gap-2'>
                                <img 
                                    src={feature.icon} 
                                    alt={feature.title} 
                                    className='w-6 mt-0.5 flex-shrink-0'
                                />
                                <div>
                                    <h3 className='text-base font-semibold'>{feature.title}</h3>
                                    <p className='text-gray-600 text-xs'>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BottomBanner