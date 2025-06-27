function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

module.exports = slugify;
// This function converts a string into a URL-friendly slug by lowercasing it, removing special characters, and replacing spaces with hyphens.
// It can be used for generating slugs for blog posts, product URLs, etc.