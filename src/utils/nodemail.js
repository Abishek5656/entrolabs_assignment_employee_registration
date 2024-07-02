import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'suryaabishekvarmapenemtsa@gmail.com',
//     pass: process.env.EMAIL_PASSWORD,  
//   },
//   secure: false,  // Set to true if using TLS
//   tls: {
//     rejectUnauthorized: false,  
//   },
// });

export const sendMailer = (usermail, username) => {
  console.log("usermail:", usermail, '#########');
  console.log('usermail',typeof(usermail));
  console.log("username:", username, '######');
  console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);  
  
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'suryaabishekvarmapenemtsa@gmail.com',
      pass: process.env.EMAIL_PASSWORD,  
    },
    secure: false,  // Set to true if using TLS
    tls: {
      rejectUnauthorized: false,  
    },
  });// Ensure the password is correct

  const mailOptions = {
    from: 'suryaabishekvarmapenemtsa@gmail.com',
    to: usermail,
    subject: `Welcome ${username}`,
    text: `Welcome to Our Organization ${username} `,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        console.log("data in the error");
        console.log(data);
      console.log('Error ' + err);
    } else {
      console.log('Email sent successfully');
    }
  });
};
