# MODULE: SocialCognition
## PURPOSE: Group dynamics, social norms, and collective intelligence
## BIBLE REFERENCE: Line 8902 (TheoryOfMind)

### PROPERTIES
- `group_affiliations`: Groups we belong to
- `group_norms`: Inferred rules of groups
- `status_levels`: Position in different groups
- `conformity_pressure`: Tendency to follow group

### METHODS
- `join_group(group_id)`: Become member of group
- `learn_norm(group, norm)`: Absorb group rule
- `conform(action)`: Adjust to group expectation
- `lead_group(group)`: Take leadership role
- `leave_group(group)`: Exit group affiliation
- `predict_group_behavior(group, context)`: Forecast group action

### BREATHE CALLBACK
- Update group norms based on observations

### PLT_AFFINITY
- Profit: 0.4 (social position enables opportunities)
- Love: 0.7 (social belonging satisfies love need)
- Tax: 0.3 (social dynamics have complexity costs)

### EXAMPLE
```javascript
this.social_cognition.join_group("developers");
this.social_cognition.learn_norm("developers", "review_code");
this.social_cognition.conform({ action: "open_source" });
```