import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const CreateMessage = ({ token, onMessageCreated }) => {
    let history = useHistory();
    const [messageData, setMessageData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const { name, email, phone, notes } = messageData;

    const onChange = e => {
        const { name, value } = e.target;

        setMessageData({
            ...messageData,
            [name]: value
        });
    };

    const create = async () => {
        if(!name || !email || !phone) {
            console.log("name, email, and phone are required");
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

                //Create the post
                const body = JSON.stringify(newMessage);
                const res = await axios.post(
                    'http://localhost:5000/api/messages',
                    body,
                    config
                );

                onMessageCreated(res.data);
                history.push('/');
            } catch (error) {
                console.error(`Error creating post: ${error.response.data}`);
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
            <button onClick={() => create()}>Send</button>
        </div>
    );
};

export default CreateMessage;