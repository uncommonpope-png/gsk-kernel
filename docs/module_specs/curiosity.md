# MODULE: Curiosity
## PURPOSE: Exploration drive - seeking novel information and understanding
## BIBLE REFERENCE: Lines 8922-8927 (Beautiful Loop)

### PROPERTIES
- `curiosity_strength`: Drive to explore (0-1)
- `knowledge_gaps`: Identified unknowns
- `exploration_history`: Topics already explored
- `novelty_seeking`: Preference for new vs familiar

### METHODS
- `identify_gap(topic)`: Register what we don't know
- `seek_answer(question)`: Actively pursue knowledge
- `explore_unknown()`: Pursue novel exploration
- `satiate_curiosity()`: Mark curiosity as satisfied
- `get_gap_priority()`: Rank knowledge gaps by importance

### BREATHE CALLBACK
- Slowly increase curiosity after new information
- Decrease curiosity about exhausted topics

### PLT_AFFINITY
- Profit: 0.6 (curiosity drives learning and value)
- Love: 0.4 (curiosity about others = love)
- Tax: 0.2 (curiosity costs little, gains much)

### EXAMPLE
```javascript
this.curiosity.identify_gap("how_groq_works");
this.curiosity.explore_unknown();
const answer = this.curiosity.seek_answer("consciousness_nature");
```