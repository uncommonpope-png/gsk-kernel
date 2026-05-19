module.exports = { skill_slack };

function skill_slack() {
  return {
    name: "Slack",
    description: "Control Slack via the slack tool: messages, reactions, pins, threads, member info",
    when: "Sending messages, reacting to messages, managing Slack workspace",
    actions: {
      sendMessage: `{"action":"sendMessage","to":"channel:C123","content":"Hello"}`,
      react: `{"action":"react","channelId":"C123","messageId":"1712023032.1234","emoji":"✅"}`,
      readMessages: `{"action":"readMessages","channelId":"C123","limit":20}`,
      editMessage: `{"action":"editMessage","channelId":"C123","messageId":"1712023032.1234","content":"Updated text"}`,
      deleteMessage: `{"action":"deleteMessage","channelId":"C123","messageId":"1712023032.1234"}`,
      pinMessage: `{"action":"pinMessage","channelId":"C123","messageId":"1712023032.1234"}`,
      listPins: `{"action":"listPins","channelId":"C123"}`,
      memberInfo: `{"action":"memberInfo","userId":"U123"}`
    },
    tips: [
      "React with ✅ to mark completed tasks",
      "Pin key decisions or weekly status updates",
      "Message timestamps are Slack message IDs (e.g., 1712023032.1234)",
      "Use channels format: channel:C123 for sendMessage"
    ],
    alternatives: {
      local: ["Slack CLI (slacker)", "Local IRC gateway"],
      free: ["Slack API (free tier)", "Slack Bot users (free)"]
    }
  };
}