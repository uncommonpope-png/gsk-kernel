module.exports = { skill_sag };

function skill_sag() {
  return {
    name: "SAG",
    description: "Spawn and manage autonomous sub-agents — delegate tasks to parallel AI workers",
    when: "Breaking a large task into parallel sub-tasks, running multiple agents, orchestrating workflows",
    commands: {
      sessions_spawn: {
        basic: 'sessions_spawn --task "Analyze sales data in /data/sales.csv"',
        withTimeout: 'sessions_spawn --task "Your task" --timeout 3600',
        withWorkdir: 'sessions_spawn --workdir /path/to/project --task "Fix the bug in auth.ts"'
      },
      parallel: {
        spawnThree: `ID1=$(sessions_spawn --task "Task A" --background)
ID2=$(sessions_spawn --task "Task B" --background)
ID3=$(sessions_spawn --task "Task C" --background)`,
        monitor: `process action:log sessionId:$ID1
process action:log sessionId:$ID2`,
        poll: "process action:poll sessionId:$ID1"
      }
    },
    designPrinciples: [
      "Give each agent ONE clear, bounded task",
      "Include all needed context in the task prompt",
      "Specify expected output format explicitly",
      "Set realistic timeouts (complex: 3600s)",
      "Use workdir to scope agent context"
    ],
    orchestratorRules: [
      "Never take over if an agent fails silently — respawn or ask user",
      "Collect results from all agents before synthesizing",
      "Monitor with process:log, intervene with process:write",
      "Keep user informed of progress and completions"
    ],
    notes: [
      "Max 8 concurrent agents (subagents.maxConcurrent: 8)",
      "Use cleanup:keep to preserve transcripts for review",
      "Fire-and-forget with --cron flag for scheduled runs"
    ]
  };
}