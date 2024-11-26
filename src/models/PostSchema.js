const postSchema = new mongoose.Schema({
  uploadTime: { 
        type: Date, default: Date.now 
    },
  user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
  heading: { 
        type: String, 
        required: true 
    },
  text: { 
        type: String, 
        required: true 
    },
  image: { 
        type: String 
    },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], 
  likesCount: { 
        type: Number, 
        default: 0 
    },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


// Pre-save hook to update the like count
postSchema.pre('save', function(next) {
    this.likesCount = this.likes.length;
    next();
});

module.exports = mongoose.model("Post", postSchema);
