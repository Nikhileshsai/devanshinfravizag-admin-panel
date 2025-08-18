import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

const PropertyForm = () => {
    const [projectName, setProjectName] = useState('');
    const [projectNameTe, setProjectNameTe] = useState('');
    const [location, setLocation] = useState('');
    const [googleMapsEmbed, setGoogleMapsEmbed] = useState('');
    const [areaSqYards, setAreaSqYards] = useState('');
    const [price, setPrice] = useState('');
    const [pricePerSqYard, setPricePerSqYard] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionTe, setDescriptionTe] = useState('');
    const [amenities, setAmenities] = useState('');
    const [investmentFeatures, setInvestmentFeatures] = useState('');
    const [connectivityInfo, setConnectivityInfo] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const imageUrls = [];
        for (const image of images) {
            const fileName = `${Date.now()}_${image.name}`;
            const { data, error } = await supabase.storage
                .from('property-images')
                .upload(fileName, image);

            if (error) {
                setError(error.message);
                setUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(fileName);
            imageUrls.push(publicUrl);
        }

        const amenitiesArray = amenities.split(',').map(item => item.trim());
        const investmentFeaturesArray = investmentFeatures.split(',').map(item => item.trim());
        const connectivityInfoArray = connectivityInfo.split(',').map(item => item.trim());

        const { data, error } = await supabase.from('properties').insert([{
            project_name: projectName,
            project_name_te: projectNameTe,
            location,
            google_maps_embed: googleMapsEmbed,
            area_sq_yards: areaSqYards,
            price,
            price_per_sq_yard: pricePerSqYard,
            description,
            description_te: descriptionTe,
            amenities: amenitiesArray,
            investment_features: investmentFeaturesArray,
            connectivity_info: connectivityInfoArray,
            image_urls: imageUrls,
        }]);

        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setUploading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Property Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">Project Name</label>
                            <div className="mt-2">
                                <input type="text" id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="project-name-te" className="block text-sm font-medium leading-6 text-gray-900">Project Name (Telugu)</label>
                            <div className="mt-2">
                                <input type="text" id="project-name-te" value={projectNameTe} onChange={(e) => setProjectNameTe(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">Location</label>
                            <div className="mt-2">
                                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                            <div className="mt-2">
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description-te" className="block text-sm font-medium leading-6 text-gray-900">Description (Telugu)</label>
                            <div className="mt-2">
                                <textarea id="description-te" value={descriptionTe} onChange={(e) => setDescriptionTe(e.target.value)} rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Cover photo</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} multiple />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Details</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="area" className="block text-sm font-medium leading-6 text-gray-900">Area (sq yards)</label>
                            <div className="mt-2">
                                <input type="number" id="area" value={areaSqYards} onChange={(e) => setAreaSqYards(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                            <div className="mt-2">
                                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="price-per-sq-yard" className="block text-sm font-medium leading-6 text-gray-900">Price per sq yard</label>
                            <div className="mt-2">
                                <input type="number" id="price-per-sq-yard" value={pricePerSqYard} onChange={(e) => setPricePerSqYard(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="google-maps" className="block text-sm font-medium leading-6 text-gray-900">Google Maps Embed</label>
                            <div className="mt-2">
                                <textarea id="google-maps" value={googleMapsEmbed} onChange={(e) => setGoogleMapsEmbed(e.target.value)} rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="amenities" className="block text-sm font-medium leading-6 text-gray-900">Amenities (comma-separated)</label>
                            <div className="mt-2">
                                <input type="text" id="amenities" value={amenities} onChange={(e) => setAmenities(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="investment-features" className="block text-sm font-medium leading-6 text-gray-900">Investment Features (comma-separated)</label>
                            <div className="mt-2">
                                <input type="text" id="investment-features" value={investmentFeatures} onChange={(e) => setInvestmentFeatures(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="connectivity-info" className="block text-sm font-medium leading-6 text-gray-900">Connectivity Info (comma-separated)</label>
                            <div className="mt-2">
                                <input type="text" id="connectivity-info" value={connectivityInfo} onChange={(e) => setConnectivityInfo(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => navigate('/')}>Cancel</button>
                <button type="submit" disabled={uploading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {uploading ? 'Uploading...' : 'Save'}
                </button>
            </div>
            {error && <div className="mt-4 text-red-500">Error: {error}</div>}
        </form>
    );
};

export default PropertyForm;
