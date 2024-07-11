const AWS = require('aws-sdk');
const ses = new AWS.SES();

module.exports.createContact = async (event) => {
  console.log("Received::", event);
  const { to, from, subject, message } = JSON.parse(event.body);

  if (!to || !from || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing required fields',
        success: false,
      }),
    };
  }

  // SES parameters
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: from,
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result,
        success: true
      })
    };
  } catch (err) {
    console.error('Error sending email:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error sending email',
        success: false,
      }),
    };
  }
};
