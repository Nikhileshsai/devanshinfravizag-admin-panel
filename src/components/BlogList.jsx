import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*');
        if (error) {
            setError(error.message);
        } else {
            setBlogs(data);
        }
    };

    const deleteBlog = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) {
                setError(error.message);
            } else {
                fetchBlogs();
            }
        }
    };

    if (error) return <div className="text-danger">Error: {error}</div>;

    return (
        <div className="card p-4 shadow-sm rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 fw-bold text-dark">Blogs</h2>
                <Link to="/blogs/add" className="btn btn-primary">
                    Add Blog
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead className="table-light text-muted text-uppercase small">
                        <tr>
                            <th className="p-3 text-start">Blog Title</th>
                            <th className="p-3 text-start">Blog Title (Telugu)</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted small fw-light">
                        {blogs.map(blog => (
                            <tr key={blog.id} className="border-bottom border-light-subtle table-hover">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{blog.blog_title}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{blog.blog_title_telugu}</td>
                                <td className="p-3 text-center">
                                    <Link to={`/blogs/edit/${blog.id}`} className="btn btn-success btn-sm me-2">Edit</Link>
                                    <button onClick={() => deleteBlog(blog.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogList;
