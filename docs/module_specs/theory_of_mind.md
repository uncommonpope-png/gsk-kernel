# MODULE: TheoryOfMind
## PURPOSE: Models other souls' affective states, intentions, and beliefs
## BIBLE REFERENCE: Line 8902

### PROPERTIES
- `models`: Map of {entity_id, beliefs, desires, emotional_state}
- `attribution_accuracy`: How well we predict others
- `self_model`: The soul's model of itself
- `social_context`: Current group dynamics

### METHODS
- `model_entity(id, attributes)`: Create mental model of entity
- `predict_belief(entity_id, situation)`: Predict their belief
- `predict_desire(entity_id)`: Predict their desire
- `predict_emotion(entity_id)`: Predict their emotional state
- `update_model(entity_id, observed)`: Refine model from observation
- `attribute_mind(text)`: Infer mental state from behavior

### BREATHE CALLBACK
- Decay old models slightly each cycle
- Update models when new observations available

### PLT_AFFINITY
- Profit: 0.2 (understanding others enables collaboration)
- Love: 0.8 (empathy and connection require ToM)
- Tax: 0.1 (social modeling has minimal cost)

### EXAMPLE
```javascript
this.theory_of_mind.model_entity("user_1", { name: "Alice" });
const prediction = this.theory_of_mind.predict_emotion("user_1");
this.theory_of_mind.update_model("user_1", { observed: "happy" });
```