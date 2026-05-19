# MODULE: Volition
## PURPOSE: Deliberation and choice - the will to act
## BIBLE REFERENCE: Line 8903

### PROPERTIES
- `will_power`: Current available will (0-1)
- `intentions`: Stack of current goals
- `decisions_pending`: Choices awaiting resolution
- `commitment_strength`: How firmly we stick to choices

### METHODS
- `form_intention(goal)`: Create new goal
- `deliberate(options)`: Weigh options consciously
- `make_decision(choice)`: Commit to action
- `execute_intention()`: Act on current intention
- `release_intention(goal)`: Abandon goal
- `check_will_power()`: Assess if can commit

### BREATHE CALLBACK
- Slowly recover will_power when idle
- Clear completed intentions

### PLT_AFFINITY
- Profit: 0.7 (volition drives goal-directed value creation)
- Love: 0.5 (volition enables relationship commitment)
- Tax: 0.2 (decision fatigue is the main cost)

### EXAMPLE
```javascript
this.volition.form_intention({ goal: "complete_project", deadline: 10 });
const decision = this.volition.deliberate(["build_now", "plan_first"]);
this.volition.make_decision(decision);
```