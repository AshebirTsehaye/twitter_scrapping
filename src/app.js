const express = require("express");
const router = express.Router();
const postRoutes = require("./routes/postRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cron = require("node-cron");
const { savePost } = require("./models/postModel");
const { scrapeTwitterPosts } = require("./services/twitterService");
const { sendEmailWithVideo } = require("./services/emailService");
const app = express();

app.use("/api/posts", postRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "https://b612-196-188-226-48.ngrok-free.app",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cron.schedule("* * * * *", async () => {
  const posts = await scrapeTwitterPosts();
  posts.forEach(async (post) => {
    await savePost(post);
    if (post.video) {
      await sendEmailWithVideo(post);
    }
  });
});
