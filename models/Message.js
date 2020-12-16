import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: 'ObjectId',
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('message', MessageSchema);

export default Message;