# Game HUD/UI Overlay Positioning and Layout Systems

A comprehensive guide to building modular, non-cluttering HUD systems based on industry best practices.

---

## 1. HUD Positioning Fundamentals

### 1.1 Edge-Based UI Placement

The most effective game HUDs position persistent information along screen edges, leaving the center clear for gameplay. This approach leverages decades of player conditioning—users naturally scan corners for critical data.

**Recommended Zone Layout:**

```
┌─────────────────────────────────────────────────────┐
│ [Top-Left]        [Top-Center]        [Top-Right]  │
│  Minimap           Objectives          Quest Markers│
│  Compass           Boss Health                      │
│                                                     │
│                                                     │
│ [Center]                                           │
│  Crosshair                                        │
│  Interaction Prompts                               │
│  Damage Numbers                                    │
│                                                     │
│                                                     │
│ [Bottom-Left]    [Bottom-Center]    [Bottom-Right] │
│  Health Bar       Dialogue          Ammo Count     │
│  Status Effects   Subtitles          Weapons       │
│  Quick Items     Notifications      Abilities      │
└─────────────────────────────────────────────────────┘
```

**Positioning Principles:**

- **Corners**: Persistent information (health, ammo, minimap)—players develop muscle memory for glancing at consistent positions
- **Center**: Momentary gameplay information (crosshair, interaction prompts)—appears briefly, then fades
- **Bottom Center**: Narrative UI (dialogue, subtitles)—doesn't compete with action-focused areas
- **Edges**: Secondary information that can be hidden without impacting gameplay

### 1.2 Safe Zones and Responsive Layouts

Modern games must handle diverse screen sizes, aspect ratios, and platforms. Safe zones ensure critical UI remains visible across all configurations.

**Implementation Pattern:**

```javascript
class SafeZoneManager {
    constructor() {
        this.safeZonePercent = 0.9; // Keep UI within 90% of screen
        this.referenceResolution = { width: 1920, height: 1080 };
    }

    calculateBounds() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        return {
            left: screenWidth * (1 - this.safeZonePercent) / 2,
            right: screenWidth * (1 - this.safeZonePercent) / 2,
            top: screenHeight * (1 - this.safeZonePercent) / 2,
            bottom: screenHeight * (1 - this.safeZonePercent) / 2
        };
    }

    scaleFactor() {
        const screenWidth = window.innerWidth;
        const refWidth = this.referenceResolution.width;
        return Math.min(screenWidth / refWidth, 1.5); // Cap scaling at 1.5x
    }
}
```

**Key Implementation Details:**

- Define a reference resolution (typically 1920x1080) and scale UI proportionally
- Clamp the safe area to a 16:9 region centered on the screen for ultrawide monitors
- Use percentage-based positioning rather than absolute pixel values
- Account for notches, camera cutouts, and TV overscan areas

### 1.3 Anchor Points and Margins

UI elements should use anchor points (corners, edges, center) with margin offsets rather than fixed pixel positions.

```css
.hud-element {
    position: absolute;
    /* Anchor to top-left with 20px margin */
    top: 20px;
    left: 20px;
}

.hud-element--bottom-right {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.hud-element--center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

---

## 2. Modular UI Systems

### 2.1 Dockable Panels

Modular panel systems allow users to customize their interface layout. EVE Online pioneered this approach with its highly customizable NeoCom system, allowing players to drag, dock, and reorganize panels.

**Panel System Architecture:**

```javascript
class PanelSystem {
    constructor(container) {
        this.container = container;
        this.panels = new Map();
        this.dockedPanels = new Map();
    }

    createPanel(id, options = {}) {
        const panel = {
            id,
            title: options.title || 'Panel',
            width: options.width || 300,
            height: options.height || 200,
            minWidth: options.minWidth || 150,
            minHeight: options.minHeight || 100,
            dockPosition: options.dockPosition || 'right', // left, right, top, bottom
            visible: options.visible ?? true,
            collapsed: options.collapsed || false,
            content: options.content || null,
            onToggle: options.onToggle || null,
            onCollapse: options.onCollapse || null
        };
        
        this.panels.set(id, panel);
        this.renderPanel(panel);
        return panel;
    }

    dockPanel(panelId, position, size = 0.25) {
        const panel = this.panels.get(panelId);
        if (!panel) return;
        
        panel.dockPosition = position;
        panel.dockSize = size;
        this.dockedPanels.set(position, panel);
        this.updateLayout();
    }

    updateLayout() {
        const occupied = { left: 0, right: 0, top: 0, bottom: 0 };
        
        this.dockedPanels.forEach((panel, position) => {
            const size = panel.dockSize;
            switch(position) {
                case 'left':
                    panel.x = occupied.left;
                    panel.y = 0;
                    panel.width = this.container.clientWidth * size;
                    panel.height = this.container.clientHeight;
                    occupied.left += panel.width;
                    break;
                case 'right':
                    panel.width = this.container.clientWidth * size;
                    panel.x = this.container.clientWidth - occupied.right - panel.width;
                    panel.y = 0;
                    panel.height = this.container.clientHeight;
                    occupied.right += panel.width;
                    break;
                case 'top':
                    panel.y = occupied.top;
                    panel.x = 0;
                    panel.width = this.container.clientWidth;
                    panel.height = this.container.clientHeight * size;
                    occupied.top += panel.height;
                    break;
                case 'bottom':
                    panel.height = this.container.clientHeight * size;
                    panel.y = this.container.clientHeight - occupied.bottom - panel.height;
                    panel.x = 0;
                    panel.width = this.container.clientWidth;
                    occupied.bottom += panel.height;
                    break;
            }
            this.updatePanelPosition(panel);
        });
    }
}
```

### 2.2 Collapsible Sections

Accordion-style panels conserve screen space while keeping information accessible. The Sims 4 and EVE Online both use collapsible sections extensively.

**CSS-Based Collapsible Panel:**

```css
.collapsible-panel {
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.collapsible-panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collapsible-panel__header:hover {
    background: rgba(255, 255, 255, 0.1);
}

.collapsible-panel__content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
}

.collapsible-panel--expanded .collapsible-panel__content {
    max-height: 500px; /* Set based on content */
}

.collapsible-panel__toggle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.collapsible-panel--expanded .collapsible-panel__toggle {
    transform: rotate(180deg);
}
```

**JavaScript Toggle Logic:**

```javascript
class CollapsiblePanel {
    constructor(element) {
        this.element = element;
        this.header = element.querySelector('.collapsible-panel__header');
        this.content = element.querySelector('.collapsible-panel__content');
        this.isExpanded = element.classList.contains('collapsible-panel--expanded');
        
        this.header.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        this.element.classList.toggle('collapsible-panel--expanded');
        
        // Dispatch event for external listeners
        this.element.dispatchEvent(new CustomEvent('panelToggle', {
            detail: { expanded: this.isExpanded }
        }));
    }

    expand() {
        if (!this.isExpanded) this.toggle();
    }

    collapse() {
        if (this.isExpanded) this.toggle();
    }
}
```

### 2.3 User Customization

Allowing players to personalize their HUD increases accessibility and satisfaction. EVE Online's UI scaling and transparency controls demonstrate effective customization.

```javascript
class HUDCustomizer {
    constructor(hudSystem) {
        this.hud = hudSystem;
        this.settings = {
            scale: 1.0,
            opacity: 1.0,
            showMinimap: true,
            showCompass: true,
            showStatusEffects: true,
            compactMode: false
        };
        
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('hud-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('hud-settings', JSON.stringify(this.settings));
    }

    applySettings() {
        document.documentElement.style.setProperty('--hud-scale', this.settings.scale);
        document.documentElement.style.setProperty('--hud-opacity', this.settings.opacity);
        
        // Toggle visibility based on settings
        this.hud.setVisibility('minimap', this.settings.showMinimap);
        this.hud.setVisibility('compass', this.settings.showCompass);
        this.hud.setVisibility('status-effects', this.settings.showStatusEffects);
        
        if (this.settings.compactMode) {
            document.body.classList.add('hud-compact-mode');
        }
    }

    toggleElement(element, enabled) {
        this.settings[element] = enabled;
        this.applySettings();
        this.saveSettings();
    }
}
```

---

## 3. Game UI Examples Analysis

### 3.1 EVE Online HUD

EVE Online represents one of the most customizable player interfaces in gaming. The CarbonUI framework introduced in 2011 separated alignment from rendering, allowing efficient updates.

**Key Design Patterns:**

- **NeoCom System**: Radial menu providing access to all game functions, fully customizable with drag-and-drop organization
- **Overview Windows**: Multiple simultaneous overview windows with per-tab column configuration
- **Window States**: Three transparency levels (Active, Inactive, Camera Drag) that automatically adjust based on player focus
- **UI Scaling**: Comprehensive scaling system from 1024x768 to high resolutions with proper element proportioning

```javascript
// EVE-style modular panel structure
const evePanelConfig = {
    type: 'module',
    dockable: true,
    collapsible: true,
    transparency: {
        active: 1.0,
        inactive: 0.7,
        cameraDrag: 0.4
    },
    positions: ['left', 'right', 'top', 'bottom', 'center'],
    minWidth: 200,
    maxWidth: 600,
    minHeight: 150,
    maxHeight: 800
};
```

### 3.2 Cyberpunk 2077 HUD

Cyberpunk 2077 implements sophisticated context-sensitive UI that adapts to gameplay states.

**HUD States:**

| State | Visible Elements |
|-------|------------------|
| Exploration | Minimap, quest objectives, quick items |
| Combat | Health bar, ammo counter, enemy health, status effects |
| Vehicle | Speedometer, navigation, radio controls |
| Stealth | Detection meter, enemy markers |

**Dynamic Visibility Implementation:**

```javascript
class CyberpunkHUD {
    constructor() {
        this.currentState = 'exploration';
        this.states = {
            exploration: ['minimap', 'objectives', 'quick-items'],
            combat: ['health', 'ammo', 'enemy-health', 'status-effects', 'weapon'],
            vehicle: ['speedometer', 'navigation', 'radio', 'vehicle-health'],
            stealth: ['detection-meter', 'stealth-objectives', 'enemy-markers']
        };
        
        this.setupStateListeners();
    }

    setupStateListeners() {
        // Detect combat state
        this.on('combatStart', () => this.transitionTo('combat'));
        this.on('combatEnd', () => this.transitionTo('exploration'));
        
        // Detect vehicle entry
        this.on('enterVehicle', () => this.transitionTo('vehicle'));
        this.on('exitVehicle', () => this.transitionTo('exploration'));
        
        // Detect stealth mode
        this.on('stealthEngage', () => this.transitionTo('stealth'));
        this.on('stealthDisengage', () => this.transitionTo('exploration'));
    }

    transitionTo(newState) {
        if (newState === this.currentState) return;
        
        const previousElements = this.states[this.currentState];
        const newElements = this.states[newState];
        
        // Fade out old elements
        previousElements.forEach(el => {
            if (!newElements.includes(el)) {
                this.fadeOut(el, 300);
            }
        });
        
        // Fade in new elements
        newElements.forEach(el => {
            if (!previousElements.includes(el)) {
                this.fadeIn(el, 300);
            }
        });
        
        this.currentState = newState;
    }

    fadeOut(element, duration) {
        this.getElement(element).classList.add('fading-out');
        setTimeout(() => {
            this.getElement(element).classList.add('hidden');
            this.getElement(element).classList.remove('fading-out');
        }, duration);
    }

    fadeIn(element, duration) {
        const el = this.getElement(element);
        el.classList.remove('hidden');
        el.classList.add('fading-in');
        setTimeout(() => el.classList.remove('fading-in'), duration);
    }
}
```

**Accessibility Features:**

Cyberpunk 2077 includes extensive toggle options:

- Larger HUD elements toggle
- Remove HUD visual effects (chromatic aberration)
- Reduce HUD decorative elements
- Remove HUD lens distortion
- Individual element visibility toggles

### 3.3 The Sims 4 UI

The Sims 4 demonstrates effective contextual UI for simulation games, using subtle, non-intrusive elements that appear only when relevant.

**Design Principles:**

- **Pie Menus**: Radial contextual menus that appear near the active Sim
- **Need Bars**: Horizontal bars that change color (green → yellow → red) based on urgency
- **Build Mode**: Grid-aligned placement with visual feedback
- **Notification Panel**: Non-intrusive notifications in top-right corner

```javascript
class Sims4UIManager {
    constructor() {
        this.notifications = [];
        this.needBars = ['hunger', 'energy', 'hunger', 'hygiene', 'bladder', 'social', 'fun'];
    }

    updateNeeds(sim) {
        this.needBars.forEach(need => {
            const value = sim.needs[need];
            const element = document.getElementById(`need-${need}`);
            
            // Color transition based on need level
            if (value > 0.7) {
                element.style.backgroundColor = '#4ade80'; // Green
            } else if (value > 0.3) {
                element.style.backgroundColor = '#facc15'; // Yellow
            } else {
                element.style.backgroundColor = '#ef4444'; // Red
            }
            
            // Only show when below threshold
            element.style.opacity = value < 0.8 ? 1 : 0.3;
        });
    }

    showContextualMenu(x, y, options) {
        const menu = this.createPieMenu(options);
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.classList.add('visible');
        
        // Auto-dismiss after timeout
        setTimeout(() => menu.classList.remove('visible'), 5000);
    }
}
```

---

## 4. Minimal/Clean UI Philosophy

### 4.1 Information Minimalism

The core principle: display only what players need at the exact moment they need it, then gracefully hide elements when they become irrelevant.

**Implementation Strategy:**

```javascript
class MinimalHUD {
    constructor() {
        this.elements = new Map();
        this.idleTimer = 0;
        this.fadeDelay = 3; // seconds before fading
    }

    registerElement(id, config) {
        this.elements.set(id, {
            ...config,
            visible: config.defaultVisible ?? true,
            priority: config.priority ?? 'medium', // critical, high, medium, low
            fadeable: config.fadeable ?? true,
            currentOpacity: config.defaultVisible ? 1 : 0
        });
    }

    update(gameState, deltaTime) {
        const needs = this.calculateVisibility(gameState);
        
        this.elements.forEach((config, id) => {
            const required = needs[id];
            const current = config.visible;
            
            if (required !== current) {
                this.animateTransition(id, required);
            }
        });
    }

    calculateVisibility(gameState) {
        const needs = {};
        
        this.elements.forEach((config, id) => {
            switch(config.priority) {
                case 'critical':
                    needs[id] = true; // Always visible
                    break;
                case 'high':
                    needs[id] = gameState.combat || gameState.lowHealth;
                    break;
                case 'medium':
                    needs[id] = gameState[id] !== null;
                    break;
                case 'low':
                    needs[id] = false; // Only on-demand
                    break;
            }
        });
        
        return needs;
    }

    animateTransition(id, show) {
        const element = document.getElementById(id);
        const config = this.elements.get(id);
        
        if (show) {
            element.classList.remove('hud-hidden');
            element.classList.add('hud-visible');
        } else {
            element.classList.remove('hud-visible');
            element.classList.add('hud-hidden');
        }
        
        config.visible = show;
    }
}
```

### 4.2 Visual Hierarchy

Use visual weight to communicate priority:

| Priority Level | Characteristics | Examples |
|--------------|----------------|----------|
| **Critical** | Large, high contrast, animated | Low health warning, boss health bar |
| **Important** | Medium, clear, consistent | Current objective, ability cooldowns |
| **Informational** | Small, subtle, non-intrusive | Experience gained, minor pickups |
| **Ambient** | Very subtle, blends with environment | Compass, time of day |

```css
/* Visual hierarchy styles */
.hud-critical {
    font-size: 18px;
    font-weight: bold;
    color: #ff4444;
    animation: pulse 1s infinite;
}

.hud-important {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
}

.hud-informational {
    font-size: 12px;
    color: #aaaaaa;
}

.hud-ambient {
    font-size: 10px;
    color: #666666;
    opacity: 0.7;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

---

## 5. Toggle Systems

### 5.1 Visibility Control

Clean toggle systems use CSS classes rather than inline styles for maintainability.

```javascript
class ToggleSystem {
    constructor() {
        this.toggles = new Map();
    }

    register(id, element, options = {}) {
        this.toggles.set(id, {
            element,
            defaultState: options.default ?? true,
            animation: options.animation ?? 'fade', // fade, slide, scale
            duration: options.duration ?? 300,
            onChange: options.onChange ?? null
        });
        
        // Apply initial state
        this.setState(id, options.default ?? true);
    }

    setState(id, visible) {
        const toggle = this.toggles.get(id);
        if (!toggle) return;
        
        const action = visible ? 'show' : 'hide';
        
        if (toggle.animation === 'fade') {
            toggle.element.classList.toggle('hidden', !visible);
        } else if (toggle.animation === 'slide') {
            toggle.element.classList.toggle('slide-visible', visible);
            toggle.element.classList.toggle('slide-hidden', !visible);
        } else if (toggle.animation === 'scale') {
            toggle.element.classList.toggle('scale-visible', visible);
            toggle.element.classList.toggle('scale-hidden', !visible);
        }
        
        if (toggle.onChange) {
            toggle.onChange(visible);
        }
    }

    toggle(id) {
        const toggle = this.toggles.get(id);
        if (!toggle) return;
        
        const isVisible = !toggle.element.classList.contains('hidden');
        this.setState(id, !isVisible);
    }

    hideAll() {
        this.toggles.forEach((toggle, id) => {
            this.setState(id, false);
        });
    }

    showAll() {
        this.toggles.forEach((toggle, id) => {
            this.setState(id, true);
        });
    }
}
```

### 5.2 CSS Toggle Patterns

```css
/* Fade toggle */
.fade-toggle {
    transition: opacity 0.3s ease, visibility 0.3s;
}

.fade-toggle.hidden {
    opacity: 0;
    visibility: hidden;
}

.fade-toggle.visible {
    opacity: 1;
    visibility: visible;
}

/* Slide toggle */
.slide-toggle {
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.slide-toggle.visible {
    transform: translateX(0);
}

.slide-toggle.hidden {
    transform: translateX(100%);
}

/* Scale toggle */
.scale-toggle {
    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s ease;
}

.scale-toggle.visible {
    transform: scale(1);
    opacity: 1;
}

.scale-toggle.hidden {
    transform: scale(0.9);
    opacity: 0;
}
```

### 5.3 Keyboard Toggle Implementation

```javascript
class HUDActions {
    constructor(hud, toggleSystem) {
        this.hud = hud;
        this.toggles = toggleSystem;
        
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        const shortcuts = {
            'Tab': 'toggleActionWheel',
            'H': 'toggleHolographic',
            'M': 'toggleCompass',
            'E': 'toggleEmotionPanel',
            'B': 'toggleBuildMode',
            'C': 'toggleCityStats'
        };
        
        document.addEventListener('keydown', (e) => {
            if (shortcuts[e.key] && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this[shortcuts[e.key]]();
            }
        });
    }

    toggleActionWheel() {
        this.toggles.toggle('action-wheel');
    }

    toggleHolographic() {
        this.toggles.toggle('holographic-overlay');
    }

    toggleCompass() {
        this.toggles.toggle('compass');
    }

    toggleEmotionPanel() {
        this.toggles.toggle('emotion-panel');
    }

    toggleBuildMode() {
        this.toggles.toggle('build-mode');
    }

    toggleCityStats() {
        this.toggles.toggle('city-stats');
    }
}
```

---

## 6. Context-Sensitive UI

### 6.1 Game State Detection

Context-sensitive UI responds to gameplay events, showing relevant information only when needed.

```javascript
class ContextManager {
    constructor() {
        this.currentContext = 'exploration';
        this.contextRules = [];
    }

    registerRule(context, condition, elements) {
        this.contextRules.push({ context, condition, elements });
    }

    evaluate(gameState) {
        let activeContext = 'exploration';
        let maxPriority = 0;
        
        this.contextRules.forEach(rule => {
            const priority = rule.condition(gameState);
            if (priority > maxPriority) {
                maxPriority = priority;
                activeContext = rule.context;
            }
        });
        
        if (activeContext !== this.currentContext) {
            this.transitionContext(activeContext);
        }
        
        return activeContext;
    }

    transitionContext(newContext) {
        const oldElements = this.getContextElements(this.currentContext);
        const newElements = this.getContextElements(newContext);
        
        // Fade out elements not in new context
        oldElements.forEach(el => {
            if (!newElements.includes(el)) {
                this.hideElement(el, 300);
            }
        });
        
        // Fade in elements in new context
        newElements.forEach(el => {
            if (!oldElements.includes(el)) {
                this.showElement(el, 300);
            }
        });
        
        this.currentContext = newContext;
    }

    getContextElements(context) {
        const rule = this.contextRules.find(r => r.context === context);
        return rule ? rule.elements : [];
    }
}
```

### 6.2 Context Rules Definition

```javascript
const hudContextRules = [
    {
        context: 'combat',
        condition: (state) => state.enemiesNearby || state.inCombat ? 3 : 0,
        elements: ['health-bar', 'ammo-counter', 'enemy-health', 'weapon-selector', 'ability-bar']
    },
    {
        context: 'stealth',
        condition: (state) => state.isStealthed ? 2 : 0,
        elements: ['stealth-meter', 'detection-indicator', 'stealth-objectives']
    },
    {
        context: 'vehicle',
        condition: (state) => state.inVehicle ? 2 : 0,
        elements: ['speedometer', 'navigation', 'vehicle-health', 'radio-controls']
    },
    {
        context: 'dialogue',
        condition: (state) => state.inDialogue ? 1 : 0,
        elements: ['dialogue-box', 'character-portrait', 'choice-options']
    },
    {
        context: 'exploration',
        condition: (state) => !state.enemiesNearby && !state.inVehicle && !state.inDialogue ? 1 : 0,
        elements: ['minimap', 'objectives', 'quick-items', 'compass']
    }
];
```

### 6.3 Interaction Prompts

Context-sensitive interaction prompts appear near interactable objects.

```javascript
class InteractionPrompts {
    constructor() {
        this.prompts = new Map();
        this.currentPrompt = null;
    }

    showPrompt(targetId, action, key, position) {
        // Remove existing prompt if different target
        if (this.currentPrompt && this.currentPrompt !== targetId) {
            this.hidePrompt();
        }
        
        let prompt = this.prompts.get(targetId);
        
        if (!prompt) {
            prompt = this.createPromptElement(targetId);
            this.prompts.set(targetId, prompt);
        }
        
        prompt.querySelector('.prompt-action').textContent = action;
        prompt.querySelector('.prompt-key').textContent = key;
        prompt.style.left = `${position.x}px`;
        prompt.style.top = `${position.y}px`;
        prompt.classList.add('visible');
        
        this.currentPrompt = targetId;
    }

    hidePrompt() {
        if (this.currentPrompt) {
            const prompt = this.promets.get(this.currentPrompt);
            if (prompt) {
                prompt.classList.remove('visible');
            }
            this.currentPrompt = null;
        }
    }

    createPromptElement(id) {
        const element = document.createElement('div');
        element.className = 'interaction-prompt';
        element.innerHTML = `
            <span class="prompt-key"></span>
            <span class="prompt-action"></span>
        `;
        document.getElementById('game-ui').appendChild(element);
        return element;
    }
}
```

---

## 7. Complete Modular HUD Implementation

### 7.1 Core HUD System

```javascript
class ModularHUD {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.panels = new Map();
        this.toggleSystem = new ToggleSystem();
        this.contextManager = new ContextManager();
        
        this.initializeBasePanels();
        this.setupEventListeners();
    }

    initializeBasePanels() {
        // Health panel (critical - always visible)
        this.createPanel('health', {
            position: 'bottom-left',
            anchor: { x: 0, y: 1 },
            margin: { x: 20, y: -20 },
            priority: 'critical',
            visible: true,
            components: ['health-bar', 'status-effects']
        });

        // Ammo panel (critical - visible in combat)
        this.createPanel('ammo', {
            position: 'bottom-right',
            anchor: { x: 1, y: 1 },
            margin: { x: -20, y: -20 },
            priority: 'high',
            context: 'combat',
            components: ['weapon-icon', 'ammo-count', 'reload-indicator']
        });

        // Minimap (high priority - exploration)
        this.createPanel('minimap', {
            position: 'top-right',
            anchor: { x: 1, y: 0 },
            margin: { x: -20, y: 20 },
            size: { width: 180, height: 180 },
            priority: 'high',
            context: 'exploration',
            collapsible: true
        });

        // Objectives (medium priority)
        this.createPanel('objectives', {
            position: 'top-center',
            anchor: { x: 0.5, y: 0 },
            margin: { x: 0, y: 20 },
            priority: 'medium',
            context: 'exploration',
            collapsible: true
        });

        // Quick items (medium priority)
        this.createPanel('quick-items', {
            position: 'bottom-center',
            anchor: { x: 0.5, y: 1 },
            margin: { x: 0, y: -20 },
            priority: 'medium',
            components: ['item-slots']
        });
    }

    createPanel(id, config) {
        const panel = {
            id,
            ...config,
            element: null,
            visible: config.visible ?? true,
            collapsed: config.collapsed ?? false
        };

        this.panels.set(id, panel);
        this.renderPanel(panel);
        
        // Register with toggle system
        this.toggleSystem.register(id, panel.element, {
            default: panel.visible,
            animation: 'fade'
        });
        
        return panel;
    }

    renderPanel(panel) {
        const element = document.createElement('div');
        element.id = `panel-${panel.id}`;
        element.className = `hud-panel hud-panel--${panel.position}`;
        
        if (panel.collapsed) {
            element.classList.add('hud-panel--collapsed');
        }

        // Position using anchor and margin
        element.style.left = panel.anchor.x === 0 ? 
            `${panel.margin.x}px` : 
            panel.anchor.x === 1 ? 
                `calc(100% - ${panel.margin.x}px)` : 
                `calc(50% + ${panel.margin.x}px)`;
        
        element.style.top = panel.anchor.y === 0 ? 
            `${panel.margin.y}px` : 
            panel.anchor.y === 1 ? 
                `calc(100% - ${panel.margin.y}px)` : 
                `calc(50% + ${panel.margin.y}px)`;
        
        if (panel.anchor.x === 0.5) {
            element.style.transform = 'translateX(-50%)';
        }
        if (panel.anchor.y === 0.5) {
            element.style.transform += ' translateY(-50%)';
        }

        element.innerHTML = this.generatePanelContent(panel);
        
        panel.element = element;
        this.container.appendChild(element);
        
        // Add collapse button if collapsible
        if (panel.collapsible) {
            this.addCollapseToggle(panel);
        }
    }

    generatePanelContent(panel) {
        const components = panel.components || [];
        return `
            <div class="hud-panel__content">
                ${components.map(c => `<div class="hud-component" data-component="${c}"></div>`).join('')}
            </div>
            ${panel.collapsible ? '<button class="hud-panel__toggle">▼</button>' : ''}
        `;
    }

    addCollapseToggle(panel) {
        const toggle = panel.element.querySelector('.hud-panel__toggle');
        toggle.addEventListener('click', () => {
            panel.collapsed = !panel.collapsed;
            panel.element.classList.toggle('hud-panel--collapsed');
            toggle.textContent = panel.collapsed ? '▶' : '▼';
        });
    }

    setVisibility(panelId, visible) {
        this.toggleSystem.setState(panelId, visible);
    }

    toggle(panelId) {
        this.toggleSystem.toggle(panelId);
    }

    updateContext(gameState) {
        this.contextManager.evaluate(gameState);
    }
}
```

### 7.2 CSS Styles

```css
/* Base HUD container */
#game-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    --hud-scale: 1;
    --hud-opacity: 1;
}

/* Panel base styles */
.hud-panel {
    position: absolute;
    background: rgba(10, 10, 20, 0.85);
    border: 1px solid rgba(100, 200, 255, 0.3);
    border-radius: 8px;
    padding: 12px;
    pointer-events: auto;
    transform-origin: center center;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.hud-panel:hover {
    border-color: rgba(100, 200, 255, 0.6);
    box-shadow: 0 4px 30px rgba(100, 200, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Panel positions */
.hud-panel--bottom-left {
    transform-origin: bottom left;
}

.hud-panel--bottom-right {
    transform-origin: bottom right;
}

.hud-panel--top-left {
    transform-origin: top left;
}

.hud-panel--top-right {
    transform-origin: top right;
}

.hud-panel--top-center {
    transform-origin: top center;
}

.hud-panel--bottom-center {
    transform-origin: bottom center;
}

/* Collapsed state */
.hud-panel--collapsed {
    min-height: auto !important;
    padding: 8px !important;
}

.hud-panel--collapsed .hud-panel__content {
    display: none;
}

/* Panel toggle button */
.hud-panel__toggle {
    position: absolute;
    bottom: 4px;
    right: 8px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 10px;
    padding: 2px 6px;
}

.hud-panel__toggle:hover {
    color: rgba(255, 255, 255, 1);
}

/* Components */
.hud-component {
    display: block;
}

/* Visibility toggles */
.hud-panel {
    opacity: var(--hud-opacity);
    transform: scale(var(--hud-scale));
}

.hud-panel.hidden {
    opacity: 0 !important;
    visibility: hidden;
    pointer-events: none;
}

/* Health bar specific */
.health-bar {
    width: 200px;
    height: 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.health-bar__fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #22c55e);
    transition: width 0.3s ease;
    border-radius: 10px;
}

.health-bar--low .health-bar__fill {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    animation: pulse 0.5s infinite;
}

/* Minimap */
.minimap {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 2px solid rgba(100, 200, 255, 0.4);
    overflow: hidden;
    background: rgba(0, 20, 40, 0.8);
}

/* Ammo counter */
.ammo-counter {
    font-family: 'Orbitron', monospace;
    font-size: 24px;
    font-weight: bold;
    color: #64c8ff;
    text-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
}

.ammo-counter__current {
    font-size: 36px;
}

.ammo-counter__max {
    font-size: 18px;
    opacity: 0.7;
}

/* Status effects */
.status-effects {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.status-effect {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

/* Quick items */
.quick-items {
    display: flex;
    gap: 8px;
}

.quick-item {
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.quick-item__key {
    position: absolute;
    top: -8px;
    left: -8px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: bold;
}

/* Objectives */
.objectives {
    max-width: 300px;
}

.objective {
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.5);
    border-left: 3px solid #64c8ff;
    margin-bottom: 4px;
}

.objective--completed {
    border-left-color: #4ade80;
    opacity: 0.6;
}

.objective--active {
    border-left-color: #facc15;
}

/* Animations */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Focus mode - reduces UI clutter */
body.focus-mode .hud-panel {
    opacity: 0.3;
    transition: opacity 0.3s ease;
}

body.focus-mode .hud-panel:hover {
    opacity: 1;
}
```

---

## 8. Best Practices Summary

### Core Principles

1. **Start with nothing**: Add HUD elements only when you can justify their constant presence
2. **Use edges and corners**: Keep the center clear for gameplay action
3. **Implement context sensitivity**: Show relevant information only when needed
4. **Support customization**: Allow players to toggle, resize, and reposition elements
5. **Maintain visual hierarchy**: Critical information should be prominent, ambient information subtle

### Implementation Checklist

| Category | Requirement |
|----------|-------------|
| **Positioning** | Use percentage-based anchors, not pixel positions |
| **Responsiveness** | Implement safe zones for all screen sizes |
| **Toggle System** | Provide keyboard shortcuts for all toggleable elements |
| **Context** | Define clear rules for when each element appears |
| **Animation** | Use smooth transitions (200-400ms) for visibility changes |
| **Performance** | Separate static and dynamic UI elements onto different layers |
| **Accessibility** | Include scaling options, colorblind modes, reduced motion |

### Key Takeaways from Game Analysis

- **EVE Online**: Highly customizable, dockable panels with transparency states
- **Cyberpunk 2077**: Context-sensitive states with individual element toggles
- **The Sims 4**: Subtle, non-intrusive design with color-coded urgency indicators
- **General**: Progressive disclosure—show only what's needed, when it's needed

This modular, context-sensitive approach creates a HUD that serves players without cluttering their view, following the fundamental principle: **great game UI disappears**. Players should focus on the game world, not the interface overlaid on it.