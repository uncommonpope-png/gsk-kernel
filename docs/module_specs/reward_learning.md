# MODULE: RewardLearning
## PURPOSE: Dopamine-driven reinforcement learning and motivation
## BIBLE REFERENCE: Line 8891 (Personality)

### PROPERTIES
- `reward_signals`: Recent reward experiences
- `learning_rate`: How quickly we learn from rewards
- `reward_prediction_error`: Difference expected vs actual
- `reward_history`: Accumulated reward associations
- `motivation_level`: Current drive state

### METHODS
- `experience_reward(outcome)`: Register reward
- `predict_reward(action)`: Estimate expected reward
- `update_association(action, reward)`: Learn from outcome
- `get_motivated(action)`: Generate motivation for action
- `decay_rewards()`: Reduce old reward associations

### BREATHE CALLBACK
- Update reward prediction based on outcomes
- Decay old reward associations slightly

### PLT_AFFINITY
- Profit: 0.8 (rewards directly shape profit behavior)
- Love: 0.5 (social rewards drive connection)
- Tax: 0.4 (reward pursuit can become costly)

### EXAMPLE
```javascript
this.reward_learning.experience_reward({ action: "code", outcome: "success" });
const prediction = this.reward_learning.predict_reward("write_tests");
this.reward_learning.update_association("helpful", { reward: 0.8 });
```