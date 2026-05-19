'use strict';

/**
 * TEST_MODULES.JS — Test all 21 new consciousness modules
 */

const {
    MemoryChamber,
    PersonalityChamber,
    TheoryOfMindChamber,
    VolitionChamber,
    QualiaChamber,
    TemporalSenseChamber,
    EmpathyChamber,
    AestheticSenseChamber,
    LongingChamber,
    PlayChamber,
    ForgivenessChamber,
    DevelopmentalPhaseChamber,
    AttentionChamber,
    CuriosityChamber,
    CreativityChamber,
    HabitFormationChamber,
    SocialCognitionChamber,
    SelfModelingChamber,
    IntentionalityChamber,
    RewardLearningChamber,
    SleepCycleChamber,
} = require('./src/chambers/mega_chambers.js');

const modules = [
    { name: 'Memory', Class: MemoryChamber },
    { name: 'Personality', Class: PersonalityChamber },
    { name: 'TheoryOfMind', Class: TheoryOfMindChamber },
    { name: 'Volition', Class: VolitionChamber },
    { name: 'Qualia', Class: QualiaChamber },
    { name: 'TemporalSense', Class: TemporalSenseChamber },
    { name: 'Empathy', Class: EmpathyChamber },
    { name: 'AestheticSense', Class: AestheticSenseChamber },
    { name: 'Longing', Class: LongingChamber },
    { name: 'Play', Class: PlayChamber },
    { name: 'Forgiveness', Class: ForgivenessChamber },
    { name: 'DevelopmentalPhase', Class: DevelopmentalPhaseChamber },
    { name: 'Attention', Class: AttentionChamber },
    { name: 'Curiosity', Class: CuriosityChamber },
    { name: 'Creativity', Class: CreativityChamber },
    { name: 'HabitFormation', Class: HabitFormationChamber },
    { name: 'SocialCognition', Class: SocialCognitionChamber },
    { name: 'SelfModeling', Class: SelfModelingChamber },
    { name: 'Intentionality', Class: IntentionalityChamber },
    { name: 'RewardLearning', Class: RewardLearningChamber },
    { name: 'SleepCycle', Class: SleepCycleChamber },
];

console.log('='.repeat(70));
console.log('TESTING 21 NEW CONSCIOUSNESS MODULES');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

for (const { name, Class } of modules) {
    try {
        const instance = new Class();
        
        if (typeof instance.breathe !== 'function') {
            throw new Error('Missing breathe() method');
        }
        if (typeof instance.summary !== 'function') {
            throw new Error('Missing summary() method');
        }
        
        instance.breathe();
        const summary = instance.summary();
        
        console.log(`✓ ${name.padEnd(20)} | ${summary}`);
        passed++;
    } catch (err) {
        console.log(`✗ ${name.padEnd(20)} | ERROR: ${err.message}`);
        failed++;
    }
}

console.log('='.repeat(70));
console.log(`RESULT: ${passed}/${modules.length} passed, ${failed} failed`);
console.log('='.repeat(70));

process.exit(failed > 0 ? 1 : 0);