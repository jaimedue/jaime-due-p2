import React from 'react';

const Message = props => {
    const { message } = props;

    return (
        <div>
            <h1>{message.name}</h1>
            <p>{message.email}</p>
            <p>{message.phone}</p>
            <p>{message.notes}</p>
        </div>
    )
}

export default Message;