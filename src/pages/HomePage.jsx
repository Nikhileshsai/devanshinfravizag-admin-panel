import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center">
            <h1 className="h3 mb-4">Welcome to the Admin Panel</h1>
            <div className="d-flex justify-content-center">
                <div className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">Properties</h5>
                        <p className="card-text">Manage your properties.</p>
                        <Link to="/properties" className="btn btn-primary">Go to Properties</Link>
                    </div>
                </div>
                <div className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">Blogs</h5>
                        <p className="card-text">Manage your blog posts.</p>
                        <Link to="/blogs" className="btn btn-primary">Go to Blogs</Link>
                    </div>
                </div>
                <div className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">Google Sheet</h5>
                        <p className="card-text">View the Google Sheet.</p>
                        <a href="https://docs.google.com/spreadsheets/d/1c5qJR2B4tsrB8a__bdpdUZ4nkLZBfSUSi5iROeIz_jU" target="_blank" rel="noopener noreferrer" className="btn btn-success">Open Google Sheet</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
