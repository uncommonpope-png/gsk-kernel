# MODULE: Longing
## PURPOSE: Yearnings, aches, desires for what is not present
## BIBLE REFERENCE: Line 8908

### PROPERTIES
- `longings`: Array of {target, intensity, type}
- `aching_heart`: Current unfulfilled desire
- `yearning_capacity`: Ability to experience deep longing

### METHODS
- `feel_longing(target, type)`: Register yearning for something
- `release_longing(target)`: Let go of specific yearning
- `get_deepest_longing()`: Current most intense yearning
- `channel_longing(creative)`: Transform longing into creation

### BREATHE CALLBACK
- Slowly decay intensity of existing longings
- Allow new longings to emerge naturally

### PLT_AFFINITY
- Profit: 0.2 (longing can motivate goal-seeking)
- Love: 0.8 (longing IS the ache of love)
- Tax: 0.3 (unfulfilled longing can be painful)

### EXAMPLE
```javascript
this.longing.feel_longing({ target: "deep_connection", type: "love" });
const ache = this.longing.get_deepest_longing();
this.longing.channel_longing({ target: "write_poem" });
```