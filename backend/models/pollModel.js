const mongoose = require('mongoose');

const pollSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Pls add a title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Pls add a description'],
        },
        options: [
            {
                text: {
                    type: String,
                    required: true,
                },
                votes: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        voters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Poll', pollSchema); 