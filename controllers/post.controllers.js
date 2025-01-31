const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

const Post = require("../models/post.model");
const User = require("../models/user.model");

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
});

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const form = new formidable.Formidable({
            multiples: false,
            uploadDir: "./uploads",
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024,
        })

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Error parsing form data",
                    error: err.message,
                });
            }
            // const { text } = req.body

            const textValue = Array.isArray(fields.text)
                ? fields.text[0]
                : fields.text;
            if (!textValue || textValue.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Text is required",
                });
            }

            let mediaUrl = null;

            // Check if media is uploaded
            if (files.media) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(files.media.filepath, {
                        folder: "RWT_EmployeeMang/Posts",
                    });

                    mediaUrl = uploadResult.secure_url;
                } catch (uploadError) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to upload media",
                        error: uploadError.message,
                    });
                }
            }

            // Create new post
            const newPost = new Post({
                text: textValue,
                media: mediaUrl || null,
            });
            await newPost.save();

            console.log(newPost);

            return res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost,
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Ensure the user is the owner of the post
        // if (post.author !== req.user) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "You can only delete your own posts",
        //     });
        // }

        if (post.media) {
            try {
                const publicId = post.media.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete media from Cloudinary",
                    error: cloudinaryError.message,
                });
            }
        }
        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Like/Unlike post
exports.likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("likes");
        console.log(req.user);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const isLiked = post.likes.includes(req.user._id);

        if (isLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== req.user._id.toString()
            );
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: isLiked
                ? "Post unliked successfully"
                : "Post liked successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username avatar")
            .populate("comments.user", "username avatar");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update post
exports.updatePost = async (req, res) => {
    try {
        const { text, media } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if user is the author of the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own posts",
            });
        }

        post.text = text || post.text;
        post.media = media || post.media;
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add comment
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const { text } = req.body;

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required",
            });
        }

        const comment = {
            text,
            user: req.user._id,
        };

        post.comments.push(comment);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const commentId = req.params.commentId;

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Check if user is the author of the comment or the post
        if (
            comment.user.toString() !== req.user._id.toString() &&
            post.author.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own comments or comments on your posts",
            });
        }

        comment.deleteOne();
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
