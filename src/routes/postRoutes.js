const express = require("express");
const router = express.Router();
const {
  fetchAndSavePosts,
  getPaginatedPosts,
} = require("../controllers/postController");

router.get("/fetch-posts", async (req, res) => {
  try {
    await fetchAndSavePosts();
    res.status(200).json({ message: "Posts fetched and saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Fetch posts
 *     description: Fetch posts.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: limit of the page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         description: page number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lists of posts.
 *       500:
 *         description: Internal server error.
 */
router.get("", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const posts = await getPaginatedPosts(page, limit);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
