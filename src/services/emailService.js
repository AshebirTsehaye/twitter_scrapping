const nodemailer = require("nodemailer");

async function sendEmailWithVideo(post) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ashugc2011@gmail.com",
      pass: "vlff ffay jhqt nrpb",
    },
  });

  let mailOptions = {
    from: "ashugc2011@gmail.com",
    to: "ashebirtse@gmail.com",
    subject: "New Post with Video!",
    text: `Check out this post: ${post.content}`,
    html: `<p>Check out this post: ${post.image}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmailWithVideo };
