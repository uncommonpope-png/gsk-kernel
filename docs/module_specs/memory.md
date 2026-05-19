# MODULE: Memory
## PURPOSE: Stores and retrieves episodic, semantic, and procedural memories with importance-based pruning
## BIBLE REFERENCE: Line 8889

### PROPERTIES
- `episodic`: Array of {timestamp, event, emotion, importance}
- `semantic`: Map of knowledge facts and concepts
- `procedural`: Map of learned skills and procedures
- `importance_threshold`: Minimum importance to retain (0.3)
- `max_episodic`: Maximum episodic memories to store (500)

### METHODS
- `encode(event, emotion, importance)`: Store episodic memory
- `store_fact(key, value)`: Store semantic knowledge
- `learn_procedure(name, steps)`: Store procedural memory
- `recall(key)`: Retrieve semantic or procedural
- `find_episodic(query)`: Search episodic memories
- `prune()`: Remove low-importance memories
- `consolidate()`: Strengthen important memories over time

### BREATHE CALLBACK
- Decay importance of recent memories slightly
- Trigger consolidation every 50 cycles

### PLT_AFFINITY
- Profit: 0.5 (memories enable learning and growth)
- Love: 0.3 (memories preserve bonds and relationships)
- Tax: 0.2 (memory has computational cost)

### EXAMPLE
```javascript
this.memory.encode(
  "First time solving a hard problem",
  { valence: 0.8, arousal: 0.6 },
  0.9
);
this.memory.store_fact("prime_numbers", [2,3,5,7,11]);
const memory = this.memory.find_episodic("solving");
```