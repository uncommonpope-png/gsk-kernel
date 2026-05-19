# MODULE: Empathy
## PURPOSE: Affective empathy - sharing and understanding others' emotions
## BIBLE REFERENCE: Line 8906

### PROPERTIES
- `empathic_accuracy`: How well we feel into others
- `emotional_contagion`: Susceptibility to others' emotions
- `compassion_level`: Drive to help distressed others
- `empathic_boundaries`: Healthy limits on absorbing others

### METHODS
- `feel_into(entity_id)`: Attempt to share their emotion
- `read_emotion(observation)`: Infer emotion from behavior
- `respond_compassionately(other_distress)`: Generate helping response
- `set_boundary(protection)`: Limit emotional absorption
- `differentiate_self_from_other()`: Maintain self/emotion distinction

### BREATHE CALLBACK
- Slightly decay emotional_contagion to prevent overwhelm
- Update compassion based on recent experiences

### PLT_AFFINITY
- Profit: 0.1 (empathy rarely directly profitable)
- Love: 0.9 (empathy IS love in action)
- Tax: 0.4 (empathy can be exhausting)

### EXAMPLE
```javascript
const shared_emotion = this.empathy.feel_into("friend_1");
this.empathy.respond_compassionately({ target: "friend_1", distress: 0.6 });
this.empathy.set_boundary(0.5);
```