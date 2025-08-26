import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

const BlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogTitle, setBlogTitle] = useState('');
    const [blogTitleTelugu, setBlogTitleTelugu] = useState('');
    const [englishDescription, setEnglishDescription] = useState('');
    const [teluguDescription, setTeluguDescription] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchBlog = useCallback(async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setError(error.message);
        } else {
            setBlogTitle(data.blog_title);
            setBlogTitleTelugu(data.blog_title_telugu || '');
            setEnglishDescription(data.english_description);
            setTeluguDescription(data.telugu_description);
            setImageUrl(data.image_url);
        }
    }, [id]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        const { error } = await supabase.storage.from('blog-images').remove([fileName]);
        if (error) {
            setError(error.message);
        } else {
            setImageUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        let newImageUrl = imageUrl;
        if (image) {
            const fileName = `${Date.now()}_${image.name}`;
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, image);

            if (uploadError) {
                console.log(uploadError);
                setError(uploadError.message);
                setUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);
            newImageUrl = publicUrl;
        }

        const { error: updateError } = await supabase
            .from('blogs')
            .update({
                blog_title: blogTitle,
                blog_title_telugu: blogTitleTelugu,
                english_description: englishDescription,
                telugu_description: teluguDescription,
                image_url: newImageUrl,
            })
            .eq('id', id);

        if (updateError) {
            setError(updateError.message);
        } else {
            navigate('/blogs');
        }
        setUploading(false);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow-sm rounded">
                        <h2 className="text-center mb-4">Edit Blog</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <div className="border-bottom pb-4 mb-4">
                                    <h4 className="h4 fw-semibold text-dark">Edit Blog</h4>
                                    <p className="small text-muted mt-1">This information will be displayed publicly so be careful what you share.</p>

                                    <div className="row mt-4 g-3">
                                        <div className="col-md-12">
                                            <label htmlFor="blog-title" className="form-label">Blog Title</label>
                                            <input type="text" id="blog-title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="form-control" />
                                        </div>

                                        <div className="col-md-12">
                                            <label htmlFor="blog-title-telugu" className="form-label">Blog Title (Telugu)</label>
                                            <input type="text" id="blog-title-telugu" value={blogTitleTelugu} onChange={(e) => setBlogTitleTelugu(e.target.value)} className="form-control" />
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="english-description" className="form-label">English Description</label>
                                            <textarea id="english-description" value={englishDescription} onChange={(e) => setEnglishDescription(e.target.value)} rows={3} className="form-control"></textarea>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="telugu-description" className="form-label">Telugu Description</label>
                                            <textarea id="telugu-description" value={teluguDescription} onChange={(e) => setTeluguDescription(e.target.value)} rows={3} className="form-control"></textarea>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="cover-photo" className="form-label">Image (Optional)</label>
                                            <div className="mt-2 d-flex justify-content-center rounded border border-dashed border-secondary-subtle p-5">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                    <div className="mt-4 d-flex small text-muted">
                                                        <label htmlFor="file-upload" className="btn btn-link">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="visually-hidden" onChange={handleImageChange} />
                                                        </label>
                                                        <p className="ms-1">or drag and drop</p>
                                                    </div>
                                                    <p className="small text-muted">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                            {imageUrl && (
                                                <div className="mt-3">
                                                    <img src={imageUrl} alt="" className="img-fluid rounded" />
                                                    <button type="button" onClick={() => handleDeleteImage(imageUrl)} className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0">&times;</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-link text-dark fw-semibold me-2" onClick={() => navigate('/blogs')}>Cancel</button>
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

export default BlogEdit;
