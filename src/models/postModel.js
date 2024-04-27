const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "twitter_scrapping",
  password: "123456",
  port: 5432,
});

async function savePost(post) {
  const query = {
    text: "INSERT INTO posts(content, image) VALUES($1, $2)",
    values: [post.content, post.image],
  };
  await pool.query(query);
  saveImageToLocal(post.image, "test_name");
}

async function getPosts(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const query = {
    text: "SELECT * FROM posts ORDER BY id OFFSET $1 LIMIT $2",
    values: [offset, limit],
  };
  const result = await pool.query(query);
  return result.rows;
}

async function saveImageToLocal(url, fileName) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    const directory = path.join(__dirname, "public", "images");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const filePath = path.join(directory, fileName);

    response.data.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        resolve(filePath);
      });
      response.data.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = { savePost, getPosts };
