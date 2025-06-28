const Blog = require("../models/Blog");
const slugify = require("../utils/slugify");




exports.createBlog = async (req, res) => {
  try {
    const { title, description, author, createdAt } = req.body;

    const baseSlug = slugify(title, { lower: true });
    const uniqueSlug = `${baseSlug}-${Date.now()}`; // 👈 ensure unique slug

    const newBlog = new Blog({
      title,
      description,
      author: req.user.id, // ✅ Use req.user.id for author
      createdAt: createdAt || new Date(),
      slug: uniqueSlug,
      image: req.file?.path, // ✅ Cloudinary URL
    });

    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const excludeUser = req.query.excludeUser;

    let query = {};
    if (excludeUser) {
      query.author = { $ne: excludeUser }; // exclude blogs by this user
    }

    const blogs = await Blog.find(query).populate("author", "name");
    const blogsWithAuthorNameOnly = blogs.map(blog => ({
      ...blog.toObject(),
      author: blog.author.name,
    }));

    res.json(blogsWithAuthorNameOnly);
  } catch (err) {
    res.status(500).json({ message: "Fetching blogs failed", error: err.message });
  }
};


exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const blogWithAuthorName = {
      ...blog.toObject(),
      author: blog.author.name, // ✅ Only the author's name
    };

    res.json(blogWithAuthorName);
  } catch (err) {
    res.status(500).json({ message: "Fetching blog failed", error: err.message });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await blog.deleteOne(); // ✅ fixed here
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// This code defines the blog controller for handling blog-related operations such as creating, fetching, updating, and deleting blogs in a Node.js application using Express.js and Mongoose.
// It includes functions to create a blog, get all blogs, get a blog by its slug