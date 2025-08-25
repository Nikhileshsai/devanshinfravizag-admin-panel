import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

const PropertyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [imageUrls, setImageUrls] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchProperty = useCallback(async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setError(error.message);
        } else {
            setProjectName(data.project_name);
            setProjectNameTe(data.project_name_te);
            setLocation(data.location);
            setGoogleMapsEmbed(data.google_maps_embed);
            setAreaSqYards(data.area_sq_yards);
            setPrice(data.price);
            setPricePerSqYard(data.price_per_sq_yard);
            setDescription(data.description);
            setDescriptionTe(data.description_te);
            setAmenities(data.amenities ? data.amenities.join(', ') : '');
            setInvestmentFeatures(data.investment_features ? data.investment_features.join(', ') : '');
            setConnectivityInfo(data.connectivity_info ? data.connectivity_info.join(', ') : '');
            setImageUrls(data.image_urls || []);
        }
    }, [id]);

    useEffect(() => {
        fetchProperty();
    }, [fetchProperty]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        const { error } = await supabase.storage.from('property-images').remove([fileName]);
        if (error) {
            setError(error.message);
        } else {
            setImageUrls(imageUrls.filter(url => url !== imageUrl));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const newImageUrls = [...imageUrls];
        for (const image of images) {
            const fileName = `${Date.now()}_${image.name}`;
            const { error } = await supabase.storage
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
            newImageUrls.push(publicUrl);
        }

        const amenitiesArray = amenities.split(',').map(item => item.trim());
        const investmentFeaturesArray = investmentFeatures.split(',').map(item => item.trim());
        const connectivityInfoArray = connectivityInfo.split(',').map(item => item.trim());

        const { error } = await supabase
            .from('properties')
            .update({
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
                image_urls: newImageUrls,
            })
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setUploading(false);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow-sm rounded">
                        <h2 className="text-center mb-4">Edit Property</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <div className="border-bottom pb-4 mb-4">
                                    <h4 className="h4 fw-semibold text-dark">Edit Property</h4>
                                    <p className="small text-muted mt-1">This information will be displayed publicly so be careful what you share.</p>

                                    <div className="row mt-4 g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="project-name" className="form-label">Project Name</label>
                                            <div className="mt-2">
                                                <input type="text" id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="project-name-te" className="form-label">Project Name (Telugu)</label>
                                            <div className="mt-2">
                                                <input type="text" id="project-name-te" value={projectNameTe} onChange={(e) => setProjectNameTe(e.target.value)} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="location" className="form-label">Location</label>
                                            <div className="mt-2">
                                                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <div className="mt-2">
                                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="form-control"></textarea>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="description-te" className="form-label">Description (Telugu)</label>
                                            <div className="mt-2">
                                                <textarea id="description-te" value={descriptionTe} onChange={(e) => setDescriptionTe(e.target.value)} rows={3} className="form-control"></textarea>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="cover-photo" className="form-label">Cover photo</label>
                                            <div className="mt-2 d-flex justify-content-center rounded border border-dashed border-secondary-subtle p-5">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                    <div className="mt-4 d-flex small text-muted">
                                                        <label htmlFor="file-upload" className="btn btn-link">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="visually-hidden" onChange={handleImageChange} multiple />
                                                        </label>
                                                        <p className="ms-1">or drag and drop</p>
                                                    </div>
                                                    <p className="small text-muted">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                            <div className="row mt-3 g-3">
                                                {imageUrls.map(url => (
                                                    <div key={url} className="col-6 col-md-3 position-relative">
                                                        <img src={url} alt="" className="img-fluid rounded" />
                                                        <button type="button" onClick={() => handleDeleteImage(url)} className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0">&times;</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-bottom pb-4 mb-4">
                                <h4 className="h4 fw-semibold text-dark">Details</h4>
                                <div className="row mt-4 g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="area" className="form-label">Area (sq yards)</label>
                                        <div className="mt-2">
                                            <input type="number" id="area" value={areaSqYards} onChange={(e) => setAreaSqYards(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <div className="mt-2">
                                            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="price-per-sq-yard" className="form-label">Price per sq yard</label>
                                        <div className="mt-2">
                                            <input type="number" id="price-per-sq-yard" value={pricePerSqYard} onChange={(e) => setPricePerSqYard(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="google-maps" className="form-label">Google Maps Embed</label>
                                        <div className="mt-2">
                                            <textarea id="google-maps" value={googleMapsEmbed} onChange={(e) => setGoogleMapsEmbed(e.target.value)} rows={3} className="form-control"></textarea>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="amenities" className="form-label">Amenities (comma-separated)</label>
                                        <div className="mt-2">
                                            <input type="text" id="amenities" value={amenities} onChange={(e) => setAmenities(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="investment-features" className="form-label">Investment Features (comma-separated)</label>
                                        <div className="mt-2">
                                            <input type="text" id="investment-features" value={investmentFeatures} onChange={(e) => setInvestmentFeatures(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="connectivity-info" className="form-label">Connectivity Info (comma-separated)</label>
                                        <div className="mt-2">
                                            <input type="text" id="connectivity-info" value={connectivityInfo} onChange={(e) => setConnectivityInfo(e.target.value)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-link text-dark fw-semibold me-2" onClick={() => navigate('/')}>Cancel</button>
                                <button type="submit" disabled={uploading} className="btn btn-primary">
                                    {uploading ? 'Uploading...' : 'Save'}
                                </button>
                            </div>
                            {error && <div className="mt-3 text-danger">Error: {error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyEdit;
