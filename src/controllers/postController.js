const { getPosts } = require("../models/postModel");

async function getPaginatedPosts(page, limit) {
  const posts = await getPosts(page, limit);
  return posts;
}

module.exports = { getPaginatedPosts };
