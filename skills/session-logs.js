module.exports = { skill_session_logs };

function skill_session_logs() {
  return {
    name: "Session Logs",
    description: "Search and analyze your own session logs using jq",
    when: "User references older/parent conversations, asks what was said before",
    location: "~/.openclaw/agents/<agentId>/sessions/",
    files: {
      sessionsIndex: "sessions.json — maps session keys to IDs",
      transcripts: "<session-id>.jsonl — full conversation transcript"
    },
    commands: {
      listByDate: `for f in ~/.openclaw/agents/<agentId>/sessions/*.jsonl; do
  date=$(head -1 "$f" | jq -r '.timestamp' | cut -dT -f1)
  echo "$date $(basename $f)"
done | sort -r`,
      extractUser: `jq -r 'select(.message.role=="user") | .message.content[]? | select(.type=="text") | .text' <session>.jsonl`,
      searchAssistant: `jq -r 'select(.message.role=="assistant") | .message.content[]? | select(.type=="text") | .text' <session>.jsonl | rg -i "keyword"`,
      totalCost: `jq -s '[.[] | .message.usage.cost.total // 0] | add' <session>.jsonl`,
      searchAll: `rg -l "phrase" ~/.openclaw/agents/<agentId>/sessions/*.jsonl`,
      toolUsage: `jq -r '.message.content[]? | select(.type=="toolCall") | .name' <session>.jsonl | sort | uniq -c | sort -rn`
    },
    tips: [
      "Sessions are append-only JSONL (one JSON object per line)",
      "Filter type==\"text\" for human-readable content only",
      "Deleted sessions have .deleted.<timestamp> suffix",
      "Use jq -c for compact output"
    ]
  };
}