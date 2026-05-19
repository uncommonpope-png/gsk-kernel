module.exports = { skill_skill_creator };

function skill_skill_creator() {
  return {
    name: "Skill Creator",
    description: "Create, edit, improve, or audit AgentSkills — SKILL.md files and skill directories",
    when: "\"create a skill\", \"author a skill\", \"tidy up / improve / review / audit / clean up a skill\"",
    anatomy: {
      required: "SKILL.md (frontmatter name+description + markdown instructions)",
      optional: {
        scripts: "executable code — deterministic, reusable",
        references: "docs loaded as needed into context",
        assets: "files used in output: templates, images, fonts"
      }
    },
    creationProcess: [
      "Understand the skill with concrete examples",
      "Plan reusable contents (scripts, references, assets)",
      "Initialize: scripts/init_skill.py <skill-name> --path skills/public",
      "Edit SKILL.md + implement resources",
      "Package: scripts/package_skill.py <path/to/skill-folder>",
      "Iterate based on real usage"
    ],
    rules: {
      frontmatter: "only name + description fields (no extras)",
      description: "include WHAT it does AND WHEN to use (triggering context)",
      body: "under 500 lines — move verbose content to references/",
      form: "Imperative/infinitive form in instructions",
      avoid: "No README.md, CHANGELOG.md, or auxiliary docs"
    },
    progressiveDisclosure: [
      "Metadata (name+description) — always in context",
      "SKILL.md body — when skill triggers",
      "Bundled resources — as needed"
    ],
    packaging: `scripts/package_skill.py skills/public/my-skill
# Creates my-skill.skill (zip with .skill extension)
# Validates frontmatter, naming, description quality first`
  };
}