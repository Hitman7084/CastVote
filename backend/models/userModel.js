const mongoose = require('mongoose');
const bcrypt = require('bcrypt.js');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Pls add the name'],
        },
        email: {
            type: String,
            required: [true, 'Pls add the email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Pls add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Pls add a password'],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        votedPolls: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll',
        }]    
    },
    {
        timestamps: true,
    }
);

// bcrypt code for envryption
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }

    const ran = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, ran)
})


module.exports = mongoose.model('User', userSchema)

