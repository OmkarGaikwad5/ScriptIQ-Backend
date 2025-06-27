const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getAllBlogs).post(protect, createBlog);
router
  .route("/:slug")
  .get(getBlogBySlug)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
// This code defines the routes for blog-related operations in a Node.js application using Express.