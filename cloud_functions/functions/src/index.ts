declare var require: any; // I get tsc errors on the require imports otherwise
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

async function _sendToTopic(title: string, body: string, topic: string) {
  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };
  const response = await admin.messaging().sendToTopic(topic, payload);
  if (response.messageId) {
    functions.logger.log(
      `Successfully sent message: ${JSON.stringify(payload)} to topic ${topic}`
    );
    return true;
  } else {
    functions.logger.log(
      `Failed to send message ${JSON.stringify(payload)} to topic ${topic}`
    );
    return false;
  }
}

export const sendToTopic = functions.https.onRequest(
  async (req: any, res: any) => {
    const title = req.body.title;
    const body_text = req.body.body_text;
    const topic = req.body.topic;
    if (!(title && body_text && topic)) {
      res.send(
        "Need valid strings for title, body_text, and topic." +
          `Got: ${req.body.title} ${req.body.body_text} ${req.body.topic}`
      );
      return;
    }
    functions.logger.log("request title", title);
    functions.logger.log("request body", body_text);
    functions.logger.log("request topic", topic);
    const result = await _sendToTopic(title, body_text, topic);
    res.send(result ? "Success" : "failure");
  }
);

export const subscribeTokenToTopics = functions.https.onCall(
  async (data: any, context: any) => {
    const token = data.token;
    const topics = data.topics;

    if (!(token && topics)) {
      return {
        message:
          "Need valid strings for token and topic." +
          `Got: ${data.token} ${data.topic}`,
      };
    }
    try {
      topics.map(async (topic: string) => {
        await admin.messaging().subscribeToTopic([token], topic);
      });
    } catch (err) {
      return { message: err };
    }
    return { message: "Success" };
  }
);

// export const unsubscribeTokenToTopics = functions.https.onCall(
//   async (data: any, context: any) => {
//     const token = data.token;
//     const topics = data.topics;

//     if (!(token && topics)) {
//       return {
//         message:
//           "Need valid strings for token and topic." +
//           `Got: ${data.token} ${data.topic}`,
//       };
//     }
//     try {
//       topics.map(async (topic: string) => {
//         await admin.messaging().unsubscribeToTopic([token], topic);
//       });
//     } catch (err) {
//       return { message: err };
//     }
//     return { message: "Success" };
//   }
// );
