import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: 'ObjectId',
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    }
});

const Message = mongoose.model('message', MessageSchema);

export default Message;