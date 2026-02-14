import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const PostcodeAreaMap = () => {
    const [mapData, setMapData] = useState(null);
    const [postcodes, setPostcodes] = useState([]);
    const [selectedPostcode, setSelectedPostcode] = useState('');
    const [deliveryGroups, setDeliveryGroups] = useState([]);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await Axios.get('/api/mapdata'); // API to fetch map data
                setMapData(response.data);
            } catch (error) {
                console.error('Error fetching map data:', error);
            }
        };

        const fetchPostcodes = async () => {
            try {
                const response = await Axios.get('/api/postcodes'); // API to fetch postcodes
                setPostcodes(response.data);
            } catch (error) {
                console.error('Error fetching postcodes:', error);
            }
        };

        const fetchDeliveryGroups = async () => {
            try {
                const response = await Axios.get('/api/deliverygroups'); // API to fetch delivery groups
                setDeliveryGroups(response.data);
            } catch (error) {
                console.error('Error fetching delivery groups:', error);
            }
        };

        fetchMapData();
        fetchPostcodes();
        fetchDeliveryGroups();
    }, []);

    const handlePostcodeChange = (event) => {
        setSelectedPostcode(event.target.value);
    };

    return (
        <div>
            <h1>Postcode Area Map</h1>
            <div className="map"> {/* Render map component here */} </div>
            <select value={selectedPostcode} onChange={handlePostcodeChange}>
                <option value="">Select a postcode</option>
                {postcodes.map((postcode) => (
                    <option key={postcode} value={postcode}>{postcode}</option>
                ))}
            </select>
            <div>
                <h2>Delivery Groups</h2>
                <ul>
                    {deliveryGroups.map((group) => (
                        <li key={group.id}>{group.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostcodeAreaMap;
