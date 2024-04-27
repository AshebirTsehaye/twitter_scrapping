const puppeteer = require("puppeteer");

async function scrapeTwitterPosts() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://twitter.com/coindesk", {
    waitUntil: "networkidle2",
    timeout: 0,
  });
  await page.waitForSelector("article");

  const posts = await page.evaluate(() => {
    const postElements = document.querySelectorAll("article");
    const posts = [];
    postElements.forEach((postElement) => {
      const contentElement = postElement.querySelector(
        "div.css-901oao.r-hkyrab.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-bnwqim.r-qvutc0"
      );
      const content = contentElement ? contentElement.textContent : "";

      const imageElement = postElement.querySelector("img");
      const image = imageElement ? imageElement.getAttribute("src") : "";

      const post = { content, image };
      posts.push(post);
    });
    return posts;
  });

  await browser.close();
  return posts;
}

module.exports = { scrapeTwitterPosts };
