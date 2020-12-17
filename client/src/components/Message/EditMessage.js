import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const EditMessage = ({ token, message, onMessageUpdated }) => {
    let history = useHistory();
    const [messageData, setMessageData] = useState({
        name: message.name,
        email: message.email,
        phone: message.phone,
        notes: message.notes
    });
    const { name, email, phone, notes } = messageData;

    const onChange = e => {
        const { name, value } = e.target;

        setMessageData({
            ...messageData,
            [name]: value
        });
    };

    const update = async () => {
        if (!name || !email || !phone) {
            console.log('Name, email, and phone required');
        } else {
            const newMessage = {
                name: name,
                email: email,
                phone: phone,
                notes: notes
            };

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(newMessage);
                const res = await axios.put(
                    `http://localhost:5000/api/posts/${message._id}`,
                    body,
                    config
                );

                onMessageUpdated(res.data);
                history.push('/');
            } catch (error) {
                console.error(`Error creating contact: ${error.response.data}`);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Add Contact Information</h2>
            <label for="name">Name:</label>
            <input
            name="name"
            type="text"
            placeholder=""
            value={name}
            onChange={e => onChange(e)}
            />
            <label for="email">Email:</label>
            <input
            name="email"
            type="text"
            placeholder=""
            value={email}
            onChange={e => onChange(e)}
            />
            <label for="phone">Phone:</label>
            <input
            name="phone"
            type="text"
            placeholder=""
            value={phone}
            onChange={e => onChange(e)}
            />
            <label for="notes">Notes:</label>
            <textarea
                name="notes"
                cols="30"
                rows="10"
                value={notes}
                onChange={e => onChange(e)}
            ></textarea>
            <button onClick={() => update()}>Submit</button>
        </div>
    );
    
};

export default EditMessage;