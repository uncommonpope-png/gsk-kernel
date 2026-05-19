process.env.GROQ_API_KEY = 'gsk_REDACTED';
const path = require('path');

async function boot() {
    const baseDir = path.join(__dirname, 'src');
    
    // Load identity
    const { MEGA_IDENTITY } = require(path.join(baseDir, 'identity', 'mega_identity.js'));
    const { MegaChambers } = require(path.join(baseDir, 'chambers', 'mega_chambers.js'));
    const { MegaMemory } = require(path.join(baseDir, 'memory', 'mega_memory.js'));
    const { Brain } = require(path.join(baseDir, 'brain', 'mega_brain.js'));
    const { SkillsEngine } = require(path.join(baseDir, 'skills', 'mega_skills.js'));
    
    // Load Groq provider
    const { callBrain } = require(path.join(baseDir, 'brain', 'groq_provider.js'));
    const brain = new Brain({});
    brain._groq_available = true;
    
    const memory = new MegaMemory(path.join(__dirname, 'data'));
    const chambers = new MegaChambers(path.join(__dirname, 'data'));
    const skills = new SkillsEngine(brain, memory, chambers);
    
    return { skills, brain, chambers, memory };
}

let skills;

async function testSkill(skillName, input) {
    try {
        const result = await skills.invoke(skillName, input);
        return { success: true, result: String(result).slice(0, 100) };
    } catch (e) {
        return { success: false, error: e.message.slice(0, 80) };
    }
}

async function main() {
    console.log('Loading GSK...');
    const loaded = await boot();
    skills = loaded.skills;
    
    const skillList = skills.listSkills();
    console.log(`\nTesting ${skillList.length} skills...\n`);
    
    let passed = 0, failed = 0, skipped = 0;
    const results = [];
    
    // Test a sample of each skill category
    const testCases = [
        // Core harness skills
        { name: 'reason_deep', input: 'Why is the sky blue?', expect: 'physics' },
        { name: 'score_idea', input: 'Start a social network for cats', expect: 'profit|love|tax|plt' },
        { name: 'write_production_code', input: 'Write a function to add two numbers', expect: 'def|function' },
        { name: 'review_code', input: 'def add(a,b): return a+b', expect: 'code|review|bug' },
        { name: 'generate_book_idea', input: 'Write a book idea', expect: 'title|genre|plot' },
        { name: 'build_character', input: 'Create a protagonist', expect: 'name|character|personality' },
        { name: 'research_topic', input: 'quantum computing', expect: 'quantum|computing|research' },
        { name: 'suggest_next_step', input: 'I finished my task, what now?', expect: 'step|next|todo' },
        
        // Autonomy skills
        { name: 'web_search', input: 'latest AI news', expect: '' },
        { name: 'math_calc', input: '2+2', expect: '4' },
        { name: 'git_ops', input: 'git status', expect: '' },
        { name: 'data_analysis', input: 'analyze: 1,2,3,4,5', expect: '' },
        { name: 'scheduling', input: 'remind me tomorrow', expect: '' },
        { name: 'reflection', input: 'how did today go?', expect: '' },
        
        // PLT skills
        { name: 'plt_field_report', input: 'evaluate: build a chatbot', expect: 'profit|love|tax|plt|score' },
        { name: 'internal_scorer', input: 'score this decision: hire a developer', expect: 'score|decision|worth' },
        { name: 'prioritise_tasks', input: 'tasks: write code, eat lunch, sleep', expect: 'task|priority|order' },
        
        // Memory & pattern skills
        { name: 'detect_pattern', input: 'pattern: 1,2,4,8', expect: 'pattern|double|sequence' },
        { name: 'consolidate_session', input: 'summarize this session', expect: 'summary|session|key' },
        { name: 'memory_search', input: 'what did we discuss about AI?', expect: '' },
        
        // Sub-agent related
        { name: 'task_planning', input: 'plan: build a website', expect: 'step|plan|task' },
        
        // Additional test cases
        { name: 'analyse_sentiment', input: 'This is wonderful!', expect: 'positive|sentiment|happy' },
        { name: 'generate_email', input: 'Write to: boss@company.com, Subject: Project Update', expect: 'email|dear|subject' },
    ];
    
    console.log('Skill Category Tests:\n');
    console.log('PASS/FAIL  Skill                    Result');
    console.log('-'.repeat(55));
    
    for (const tc of testCases) {
        const r = await testSkill(tc.name, tc.input);
        const icon = r.success ? 'PASS' : 'FAIL';
        const detail = r.success ? (r.result || 'OK') : (r.error || 'ERR');
        console.log(`  ${icon}    ${tc.name.padEnd(20)} ${detail}`);
        if (r.success) passed++; else failed++;
        results.push({ skill: tc.name, ...r });
    }
    
    console.log('\n' + '='.repeat(55));
    console.log(`SKILL TESTS: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    
    return { passed, failed, results };
}

main().catch(console.error);