
const Post = require("../models/PostSchema");
const User = require("../models/UserSchema");

exports.create = async (req, res, next) => {
  const { heading, text, image } = req.body;
  try {
    const newPost = new Post({
      heading,
      text,
      image,
      user: req.user._id, // Attach the user who created the post
    });
    await newPost.save();

    const user = await User.findById(req.user._id);
    console.log(newPost._id);
    user.posts.push(newPost._id.toString());
    
    user.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res, next) => {
    const { postId } = req.params;
    console.log(postId)
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can delete only your own posts" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res, next) => {
    const { postId } = req.params;
  const { like, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(req.user._id);
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (like) {
      const isLiked = post.likes.includes(req.user._id);
      if (isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        user.likedPosts = user.likedPosts.filter((id) => id.toString() !== post._id.toString());
      } else {
        post.likes.push(req.user._id);
        user.likedPosts.push(post._id);
      }
    }

    
    if (comment) {
      post.comments.push({
        user: req.user._id,
        comment,
      });
    }

    await post.save();
    await user.save();

    const updatedPost = await Post.findById(postId)
            .populate("user", "name email image likedPosts")
            .populate("comments.user", "name email image")
            .lean();
    if(post.likes.includes(user._id)){
      updatedPost.likedByCurrentUser = true;
    }
    else {
      updatedPost.likedByCurrentUser = false;

    }
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allpost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const posts = await Post.find()
          .populate("user", "name email image") // Populating user details (modify fields as needed)
          .populate("comments.user", "name email image") // Populating commenter details
          .lean();
        
          const enhancedPosts = posts.map((post) => {
            return {
              ...post,
                likedByCurrentUser: post.likes.some((likeId)=> likeId.toString() === userId.toString())
            }
          })
        res.status(200).json(enhancedPosts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};


exports.likedPost = async (req, res, next) => {
  try {
        const userId = req.user._id;
        const posts = await Post.find()
          .populate("user", "name email image") // Populating user details (modify fields as needed)
          .populate("comments.user", "name email image") // Populating commenter details
          .lean();

        const likedPosts = posts.filter((post) => post.likes.some((likeId) => likeId.toString() === userId.toString()));

        res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}

exports.userPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({user: userId})
      .populate("user", "name email image") // Populating user details (modify fields as needed)
      .populate("comments.user", "name email image") // Populating commenter details
      .lean();

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



