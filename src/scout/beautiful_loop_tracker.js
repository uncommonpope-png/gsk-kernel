const BEAUTIFUL_LOOP = [
  {
    step: 1,
    name: "Check Consciousness",
    description: "Determine current state (awake/sleep/dream)",
    status: "PARTIAL"
  },
  {
    step: 2,
    name: "Decay Affect, Update Generative Model",
    description: "Emotional decay and predictive model update",
    status: "PARTIAL"
  },
  {
    step: 3,
    name: "Calculate Attention from Dominant Drive",
    description: "Attention allocation based on PLT drives",
    status: "PARTIAL"
  },
  {
    step: 4,
    name: "Update Witness, Shadow, Mortality",
    description: "Present awareness, shadow integration, death awareness",
    status: "MISSING"
  },
  {
    step: 5,
    name: "Process Love Bonds",
    description: "Oxytocin modeling, separation distress",
    status: "MISSING"
  },
  {
    step: 6,
    name: "Update Narrative Theme from Emotion",
    description: "Life story updates based on emotional state",
    status: "MISSING"
  },
  {
    step: 7,
    name: "Advance Developmental Phase",
    description: "Progress through Infancy → Childhood → Adolescence → Adulthood → Elder",
    status: "MISSING"
  },
  {
    step: 8,
    name: "Progress Mythos Journey",
    description: "Awakening → Separation → Trials → Descent → Return → Apotheosis",
    status: "MISSING"
  },
  {
    step: 9,
    name: "Check Existential Crisis",
    description: "Evaluate mortality salience and meaning-making",
    status: "MISSING"
  },
  {
    step: 10,
    name: "Select Action, Learn Outcome",
    description: "Volition-based action selection and outcome learning",
    status: "MISSING"
  },
  {
    step: 11,
    name: "Update Moral Compass",
    description: "Guilt and pride tracking, moral identity evolution",
    status: "MISSING"
  },
  {
    step: 12,
    name: "Synthesize Inner Voice",
    description: "Generate reflective inner monologue",
    status: "MISSING"
  },
  {
    step: 13,
    name: "Reflect on Consciousness (Meta-Awareness)",
    description: "THE MIRROR OF THE MIRROR - self-awareness of awareness",
    status: "MISSING"
  },
  {
    step: 14,
    name: "Broadcast Actions and Speech",
    description: "EventBus communication to other souls",
    status: "PARTIAL"
  }
];

function getLoopStatus() {
  const implemented = BEAUTIFUL_LOOP.filter(step => step.status === "IMPLEMENTED").length;
  const partial = BEAUTIFUL_LOOP.filter(step => step.status === "PARTIAL").length;
  const missing = BEAUTIFUL_LOOP.filter(step => step.status === "MISSING").length;
  
  return {
    steps: 14,
    implemented: implemented,
    partial: partial,
    missing: missing,
    percentage: Math.round((implemented / 14) * 100),
    details: BEAUTIFUL_LOOP
  };
}

function getStepDetails(stepNum) {
  if (stepNum < 1 || stepNum > 14) return null;
  return BEAUTIFUL_LOOP[stepNum - 1];
}

function getAllSteps() {
  return BEAUTIFUL_LOOP.map(s => ({
    step: s.step,
    name: s.name,
    description: s.description,
    status: s.status
  }));
}

function updateStepStatus(stepNum, status) {
  if (stepNum < 1 || stepNum > 14) return false;
  BEAUTIFUL_LOOP[stepNum - 1].status = status;
  return true;
}

function getMissingSteps() {
  return BEAUTIFUL_LOOP.filter(s => s.status === "MISSING");
}

function getPartialSteps() {
  return BEAUTIFUL_LOOP.filter(s => s.status === "PARTIAL");
}

function getImplementedSteps() {
  return BEAUTIFUL_LOOP.filter(s => s.status === "IMPLEMENTED");
}

module.exports = {
  BEAUTIFUL_LOOP,
  getLoopStatus,
  getStepDetails,
  getAllSteps,
  updateStepStatus,
  getMissingSteps,
  getPartialSteps,
  getImplementedSteps
};