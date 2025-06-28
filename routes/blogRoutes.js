const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ Correct import
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");


const router = express.Router();

router.route("/").get(getAllBlogs);

// ✅ This now works properly
router.post("/create", protect, upload.single("image"), createBlog);

router
  .route("/:slug")
  .get(getBlogBySlug)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
