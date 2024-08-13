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

export const sendMailer = async(usermail, username) => {
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
    subject: `Welcome to Our Organization, ${username}!`,
    text: `Dear ${username},\n\nWelcome to Entro Labs! We are thrilled to have you as part of our team. \n\nAt Entro Labs, we believe in fostering a supportive and innovative environment where every member can thrive and contribute to our shared goals. We are excited for you to bring your unique skills and experiences to the table.\n\nIf you have any questions or need assistance as you get started, please don’t hesitate to reach out. We’re here to help you succeed and make your experience with us enjoyable and fulfilling.\n\nOnce again, welcome aboard! We look forward to working with you.\n\nBest Regards,\nThe Entro Labs Team`,
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
