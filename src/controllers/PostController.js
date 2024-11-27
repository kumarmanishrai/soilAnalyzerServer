
const Post = require("../models/PostSchema");

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

    if (like) {
      const isLiked = post.likes.includes(req.user._id);
      if (isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
      } else {
        post.likes.push(req.user._id);
      }
    }

    
    if (comment) {
      post.comments.push({
        user: req.user._id,
        comment,
      });
    }

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allpost = async (req, res, next) => {
    try {
        const posts = await Post.find()
          .populate("user", "name email") // Populating user details (modify fields as needed)
          .populate("comments.user", "name email") // Populating commenter details
          .exec();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};
