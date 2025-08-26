import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import PropertyForm from './PropertyForm';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('*');
        if (error) {
            setError(error.message);
        } else {
            setProperties(data);
        }
    };

    const deleteProperty = async (id) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) {
                setError(error.message);
            } else {
                fetchProperties();
            }
        }
    };

    const handlePropertyAdded = () => {
        setShowForm(false);
        fetchProperties();
    };

    if (error) return <div className="text-danger">Error: {error}</div>;

    return (
        <div className="card p-4 shadow-sm rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 fw-bold text-dark">Properties</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : 'Add Property'}
                </button>
            </div>
            {showForm && <PropertyForm onPropertyAdded={handlePropertyAdded} />}
            <div className="table-responsive">
                <table className="table">
                    <thead className="table-light text-muted text-uppercase small">
                        <tr>
                            <th className="p-3 text-start">Project Name</th>
                            <th className="p-3 text-start">Location</th>
                            <th className="p-3 text-center">Price</th>
                            <th className="p-3 text-center">Area (sq yards)</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted small fw-light">
                        {properties.map(property => (
                            <tr key={property.id} className="border-bottom border-light-subtle table-hover">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{property.project_name}</td>
                                <td className="p-3 text-start">{property.location}</td>
                                <td className="p-3 text-center">{property.price}</td>
                                <td className="p-3 text-center">{property.area_sq_yards}</td>
                                <td className="p-3 text-center">
                                    <Link to={`/properties/edit/${property.id}`} className="btn btn-success btn-sm me-2">Edit</Link>
                                    <button onClick={() => deleteProperty(property.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertyList;
