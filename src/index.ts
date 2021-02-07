const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";

const accessToken = PropertiesService.getScriptProperties().getProperty(
  "ACCESS_TOKEN"
);
const userId = PropertiesService.getScriptProperties().getProperty("USER_ID");
const targetFrom = PropertiesService.getScriptProperties().getProperty(
  "FROM_MAIL"
);

const main = () => {
  const after = (new Date().getTime() - 10 * 60 * 1000) / 1000;
  const searchTarget = "in:inbox is:unread after:" + after;

  GmailApp.search(searchTarget).forEach((mail) => {
    mail.getMessages().forEach((message) => {
      console.log(message.getFrom());
      if (message.getFrom().includes(targetFrom || "")) {
        send(message.getPlainBody());
      }
    });
    mail.markRead();
  });
};

function send(message: string) {
  UrlFetchApp.fetch(LINE_PUSH_URL, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
    method: "post",
    payload: JSON.stringify({
      to: userId,
      messages: [
        {
          type: "text",
          text: `${message}`,
        },
      ],
    }),
  });
}
