# MODULE: Personality
## PURPOSE: PLT-driven personality with habit learning and action selection
## BIBLE REFERENCE: Line 8891

### PROPERTIES
- `profit_drive`: 0.0-1.0 (value-seeking behavior)
- `love_drive`: 0.0-1.0 (connection-seeking behavior)
- `tax_avoidance`: 0.0-1.0 (cost-avoidance behavior)
- `habits`: Map of {trigger, response, strength}
- `temperament`: "phlegmatic" | "choleric" | "sanguine" | "melancholic"
- `consistency`: How stable personality is over time

### METHODS
- `compute_preference(action)`: Score action by PLT drives
- `learn_habit(trigger, response)`: Form new habit
- `get_action_candidates()`: Generate possible actions
- `select_action(candidates)`: Choose action by habit + deliberation
- `update_drives(plt)`: Adjust drives based on experiences

### BREATHE CALLBACK
- Slowly adjust drives toward balance
- Strengthen frequently used habits

### PLT_AFFINITY
- Profit: 0.8 (personality determines value-seeking intensity)
- Love: 0.8 (personality shapes connection patterns)
- Tax: 0.3 (personality influences cost-perception)

### EXAMPLE
```javascript
const score = this.personality.compute_preference("build_project");
if (score > 0.6) {
  this.personality.learn_habit("morning", "start_coding");
}
const action = this.personality.select_action(candidates);
```