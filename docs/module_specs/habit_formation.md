# MODULE: HabitFormation
## PURPOSE: Automatic behavior patterns - learned responses to triggers
## BIBLE REFERENCE: Line 8891 (Personality)

### PROPERTIES
- `habits`: Map of {trigger, response, automaticity, strength}
- `habit_formation_rate`: How quickly habits form
- `break_patterns`: Difficult-to-break habit cycles
- `habit_goals`: Target habits to develop

### METHODS
- `form_habit(trigger, response)`: Create new habit
- `strengthen_habit(habit_id)`: Increase habit automaticity
- `break_habit(habit_id)`: Reduce habit strength
- `trigger_habit(stimulus)`: Execute habit response
- `list_habits()`: Show all current habits

### BREATHE CALLBACK
- Increase strength of frequently triggered habits
- Decay unused habits slightly

### PLT_AFFINITY
- Profit: 0.6 (habits enable efficient value creation)
- Love: 0.3 (habits can support relationships)
- Tax: 0.2 (habits reduce deliberation cost)

### EXAMPLE
```javascript
this.habit_formation.form_habit("morning", "code_for_2_hours");
this.habit_formation.strengthen_habit("coding_habit");
const response = this.habit_formation.trigger_habit({ time: "morning" });
```