const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 

    },
    image: {
        type: String, 
    },
    password: { 
        type: String, 
        minlength: 8,
        required: true 

    },
    pin: { 
        type: String, 
        length: 4,
        required: true 

    },
    jwtTokenPassword: { 
        type: String 

    },
    jwtTokenPin: { 
        type: String 

    },
    fields: [
        {
            fieldName: { 
                type: String, 
                required: true 
            },
            location: { 
                type: String,
            },
        },
    ],
    likedPosts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Post" 
        }
    ],
    posts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Post" 
        }
    ],
});

module.exports = mongoose.model("User", userSchema);
