const Blog = require("../models/Blog");
const slugify = require("../utils/slugify");

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const slug = slugify(title);

    const blog = await Blog.create({
      title,
      content,
      slug,
      author: req.user.id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Blog creation failed", error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Fetching blogs failed", error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
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

    await blog.remove();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
// This code defines the blog controller for handling blog-related operations such as creating, fetching, updating, and deleting blogs in a Node.js application using Express.js and Mongoose.
// It includes functions to create a blog, get all blogs, get a blog by its slug