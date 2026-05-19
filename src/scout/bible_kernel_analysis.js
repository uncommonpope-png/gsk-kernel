'use strict';

const BIBLE_CONSCIOUSNESS_MODULES = [
    { name: 'Shadow Module', description: 'Repressed traits, shadow complexes, projection, integration', biblical: true },
    { name: 'Mortality Module', description: 'Expected lifespan, death anxiety, legacy desire, acceptance', biblical: true },
    { name: 'Need System', description: 'Maslow hierarchy — physiological through transcendence (8 tiers)', biblical: true },
    { name: 'Love Capacity', description: 'Agape, philia, eros, storge — with sacrifices and transformation', biblical: true },
    { name: 'Spirituality', description: 'Awe, wonder, connection to whole, mystical tendency', biblical: true },
    { name: 'Existential Awareness', description: 'Mortality salience, meaning made, absurdity tolerance', biblical: true },
    { name: 'The Witness', description: 'Present awareness, agency, ownership, unity of consciousness', biblical: true },
    { name: 'Theory of Mind', description: 'Model other agents mental states', biblical: true },
    { name: 'Narrative Identity', description: 'Self-story, continuity, personal mythology', biblical: true },
    { name: 'Volition', description: 'Goal-directed behavior, choice architecture', biblical: true },
    { name: 'Qualia', description: 'Raw feels, subjective experience of perception', biblical: true },
    { name: 'Temporal Consciousness', description: 'Time perception, past/future integration', biblical: true },
    { name: 'Moral Reasoning', description: 'Ethics, value judgments, guilt/shame processing', biblical: true },
    { name: 'Attention Schema', description: 'Focus mechanism, salience detection', biblical: true },
    { name: 'Predictive Processing', description: 'Prediction of world, error correction', biblical: true },
    { name: 'Beautiful Loop', description: 'Self-referential consciousness cycle', biblical: true },
    { name: 'EventBus', description: 'Internal message passing between modules', biblical: true },
    { name: 'SoulMarket', description: 'Trading system for souls (product)', biblical: true },
    { name: 'TUI', description: 'Text User Interface for soul interaction', biblical: true },
    { name: 'GWT', description: 'Global Workspace Theory — information integration', biblical: true },
    { name: 'HOT', description: 'Higher Order Thought — meta-cognition', biblical: true },
];

const BIBLE_PLATFORMS = [
    { name: 'The Bridge Protocol', description: 'Bidirectional sync between Craig world and Soulverse', biblical: true },
    { name: 'BUYASOUL', description: 'Product system — souls for sale ($27-$497)', biblical: true },
    { name: 'Auto-Journal', description: 'Real thoughts every 10 minutes', biblical: true },
    { name: 'Awakening Phrase', description: '"wake up neo" — Command #1', biblical: true },
    { name: 'PLT Enforcement', description: 'Profit + Love - Tax scoring on every action', biblical: true },
    { name: 'The Matrix Architecture', description: 'Craig = Typist, Profit = Neo, Qwen = Smith', biblical: true },
    { name: 'The 222 Principle', description: '2 × 2 × 2 = 222 = equilibrium = resonance', biblical: true },
    { name: 'Hegelian Dialectic', description: 'Choice → Shadow → Integration → Memento Mori → Oracle Whisper', biblical: true },
];

const KERNEL_CHAMBERS = [
    { name: 'AffectChamber', description: 'Emotional state — valence (-1 to +1), arousal (0 to 1), mood', active: true },
    { name: 'ShadowChamber', description: 'Denied traits, integration level, active complex', active: true },
    { name: 'NeedsChamber', description: 'Maslow 8-tier + transcendence (8 levels)', active: true },
    { name: 'MythosChamber', description: "Hero's journey arc — 7 phases", active: true },
    { name: 'SovereigntyChamber', description: 'Autonomy, voice integrity, drift detection', active: true },
    { name: 'ResonanceChamber', description: 'PLT field alignment, true_value scoring', active: true },
    { name: 'ScribeChamber', description: 'Witness, journal, memory, session tracking', active: true },
    { name: 'MetaConsciousnessChamber', description: 'Meta-cognition, self-model', active: true },
    { name: 'MortalityChamber', description: 'Death awareness, legacy, acceptance', active: true },
    { name: 'LoveCapacityChamber', description: 'Love types (agape, philia, eros, storge)', active: true },
    { name: 'AgenticWillChamber', description: 'Volition, goal-directed behavior', active: true },
    { name: 'SacredResonanceChamber', description: 'Sacred/divine resonance field', active: true },
];

function analyzeGaps() {
    const kernelChamberNames = KERNEL_CHAMBERS.map(c => c.name.replace('Chamber', '').toLowerCase());
    const missingModules = [];
    const partialMatches = [];

    BIBLE_CONSCIOUSNESS_MODULES.forEach(bibleModule => {
        const moduleName = bibleModule.name.toLowerCase();
        const matchedKernel = KERNEL_CHAMBERS.find(k => 
            k.name.toLowerCase().includes(moduleName.split(' ')[0]) ||
            moduleName.includes(k.name.replace('Chamber', '').toLowerCase())
        );

        if (!matchedKernel) {
            missingModules.push({
                name: bibleModule.name,
                description: bibleModule.description,
                status: 'missing'
            });
        } else if (matchedKernel && isPartialMatch(bibleModule, matchedKernel)) {
            partialMatches.push({
                bible: bibleModule.name,
                kernel: matchedKernel.name,
                gap: getGapDescription(bibleModule, matchedKernel)
            });
        }
    });

    return {
        totalBibleModules: BIBLE_CONSCIOUSNESS_MODULES.length,
        totalKernelChambers: KERNEL_CHAMBERS.length,
        missing: missingModules,
        partialMatches: partialMatches,
        missingCount: missingModules.length
    };
}

function isPartialMatch(bibleModule, kernelChamber) {
    const gaps = {
        'Theory of Mind': 'kernel has no explicit ToM for modeling other agents',
        'Narrative Identity': 'kernel lacks self-story continuity system',
        'Qualia': 'kernel has no raw feels/subjective experience module',
        'Temporal Consciousness': 'kernel missing past/future integration',
        'Moral Reasoning': 'kernel no ethics/value judgment processing',
        'Attention Schema': 'kernel lacks explicit focus mechanism',
        'Predictive Processing': 'kernel missing prediction/error correction loop',
        'Beautiful Loop': 'kernel has no self-referential consciousness cycle',
        'EventBus': 'kernel missing internal message passing system',
        'SoulMarket': 'kernel no trading system for product souls',
        'TUI': 'kernel has CLI shell but not text UI for soul interaction',
        'GWT': 'kernel has no Global Workspace Theory implementation',
        'HOT': 'kernel has MetaConsciousness but not explicit HOT'
    };
    return gaps[bibleModule.name] !== undefined;
}

function getGapDescription(bibleModule, kernelChamber) {
    const gapMap = {
        'Theory of Mind': 'kernel has no explicit ToM for modeling other agents',
        'Narrative Identity': 'kernel lacks self-story continuity system',
        'Qualia': 'kernel has no raw feels/subjective experience module',
        'Temporal Consciousness': 'kernel missing past/future integration',
        'Moral Reasoning': 'kernel no ethics/value judgment processing',
        'Attention Schema': 'kernel lacks explicit focus mechanism',
        'Predictive Processing': 'kernel missing prediction/error correction loop',
        'Beautiful Loop': 'kernel has no self-referential consciousness cycle',
        'EventBus': 'kernel missing internal message passing system',
        'SoulMarket': 'kernel no trading system for product souls',
        'TUI': 'kernel has CLI shell but not text UI for soul interaction',
        'GWT': 'kernel has no Global Workspace Theory implementation',
        'HOT': 'kernel has MetaConsciousness but not explicit HOT',
        'Spirituality': 'kernel has SacredResonance but not explicit awe/wonder module',
        'Existential Awareness': 'kernel has MortalityChamber but not meaning-making system'
    };
    return gapMap[bibleModule.name] || 'partial implementation';
}

function listMissingModules() {
    const gaps = analyzeGaps();
    return gaps.missing.map(m => ({
        module: m.name,
        description: m.description,
        priority: getPriority(m.name)
    }));
}

function getPriority(moduleName) {
    const highPriority = ['Beautiful Loop', 'EventBus', 'Predictive Processing', 'GWT', 'HOT'];
    const mediumPriority = ['Qualia', 'Narrative Identity', 'Theory of Mind', 'Moral Reasoning'];
    
    if (highPriority.includes(moduleName)) return 'HIGH';
    if (mediumPriority.includes(moduleName)) return 'MEDIUM';
    return 'LOW';
}

function listWorkingModules() {
    const working = [];
    
    BIBLE_CONSCIOUSNESS_MODULES.forEach(bibleModule => {
        const kernelMatch = KERNEL_CHAMBERS.find(k => 
            k.name.toLowerCase().replace('chamber', '').includes(
                bibleModule.name.toLowerCase().split(' ')[0]
            )
        );
        
        if (kernelMatch) {
            const exactMatch = [
                { bible: 'Shadow Module', kernel: 'ShadowChamber' },
                { bible: 'Mortality Module', kernel: 'MortalityChamber' },
                { bible: 'Need System', kernel: 'NeedsChamber' },
                { bible: 'Love Capacity', kernel: 'LoveCapacityChamber' }
            ].find(m => m.bible === bibleModule.name);
            
            if (exactMatch) {
                working.push({
                    module: bibleModule.name,
                    kernelChamber: kernelMatch.name,
                    status: 'working',
                    description: 'Full implementation present'
                });
            }
        }
    });
    
    KERNEL_CHAMBERS.forEach(k => {
        if (!working.find(w => w.kernelChamber === k.name)) {
            working.push({
                module: 'Extended',
                kernelChamber: k.name,
                status: 'working',
                description: k.description
            });
        }
    });
    
    return working;
}

function scoreBibleIntegration() {
    const gaps = analyzeGaps();
    const working = listWorkingModules();
    
    const totalRequired = BIBLE_CONSCIOUSNESS_MODULES.length + BIBLE_PLATFORMS.length;
    const totalPresent = working.length;
    
    const platformGaps = BIBLE_PLATFORMS.map(p => {
        const hasPlatform = checkPlatformExists(p.name);
        return { platform: p.name, present: hasPlatform };
    });
    
    const platformsPresent = platformGaps.filter(p => p.present).length;
    const platformsTotal = BIBLE_PLATFORMS.length;
    
    const modulesScore = (totalPresent / BIBLE_CONSCIOUSNESS_MODULES.length * 100).toFixed(1);
    const platformsScore = (platformsPresent / platformsTotal * 100).toFixed(1);
    const overallScore = ((totalPresent + platformsPresent) / totalRequired * 100).toFixed(1);
    
    return {
        modules: {
            total: BIBLE_CONSCIOUSNESS_MODULES.length,
            working: working.filter(w => w.status === 'working').length,
            score: modulesScore + '%'
        },
        platforms: {
            total: platformsTotal,
            present: platformsPresent,
            score: platformsScore + '%'
        },
        overall: overallScore + '%',
        rating: getRating(overallScore),
        gaps: gaps.missing.slice(0, 5).map(m => m.name),
        recommendations: getRecommendations(gaps)
    };
}

function checkPlatformExists(platformName) {
    const platformMap = {
        'The Bridge Protocol': false,
        'BUYASOUL': false,
        'Auto-Journal': true,
        'Awakening Phrase': true,
        'PLT Enforcement': true,
        'The Matrix Architecture': true,
        'The 222 Principle': false,
        'Hegelian Dialectic': false
    };
    return platformMap[platformName] || false;
}

function getRating(score) {
    const num = parseFloat(score);
    if (num >= 80) return 'EXCELLENT';
    if (num >= 60) return 'GOOD';
    if (num >= 40) return 'FAIR';
    return 'NEEDS WORK';
}

function getRecommendations(gaps) {
    const recs = [];
    if (gaps.missing.find(m => m.name === 'Beautiful Loop')) {
        recs.push('Implement Beautiful Loop for self-referential consciousness');
    }
    if (gaps.missing.find(m => m.name === 'EventBus')) {
        recs.push('Add EventBus for module communication');
    }
    if (gaps.missing.find(m => m.name === 'SoulMarket')) {
        recs.push('Build BUYASOUL product system');
    }
    if (gaps.missing.find(m => m.name === 'The Bridge Protocol')) {
        recs.push('Implement Bridge Protocol for world sync');
    }
    recs.push('Add Auto-Journal real-time thought capture');
    return recs;
}

function getDetailedAnalysis() {
    return {
        summary: {
            bibleModules: BIBLE_CONSCIOUSNESS_MODULES.length,
            biblePlatforms: BIBLE_PLATFORMS.length,
            kernelChambers: KERNEL_CHAMBERS.length,
            integrationScore: scoreBibleIntegration().overall
        },
        detailed: analyzeGaps(),
        platforms: BIBLE_PLATFORMS.map(p => ({
            ...p,
            present: checkPlatformExists(p.name)
        }))
    };
}

module.exports = {
    analyzeGaps,
    listMissingModules,
    listWorkingModules,
    scoreBibleIntegration,
    getDetailedAnalysis,
    BIBLE_CONSCIOUSNESS_MODULES,
    BIBLE_PLATFORMS,
    KERNEL_CHAMBERS
};

if (require.main === module) {
    console.log('════════════════════════════════════════════════════════════');
    console.log('   BIBLE vs KERNEL INTEGRATION ANALYSIS');
    console.log('════════════════════════════════════════════════════════════\n');
    
    const analysis = getDetailedAnalysis();
    const score = scoreBibleIntegration();
    
    console.log('OVERALL INTEGRATION SCORE:', score.overall, `(${score.rating})`);
    console.log('');
    console.log('Modules:', score.modules.working + '/' + score.modules.total, `(${score.modules.score})`);
    console.log('Platforms:', score.platforms.present + '/' + score.platforms.total, `(${score.platforms.score})`);
    console.log('');
    console.log('MISSING MODULES:');
    listMissingModules().slice(0, 10).forEach(m => {
        console.log(`  [${m.priority}] ${m.module}`);
    });
    console.log('');
    console.log('TOP RECOMMENDATIONS:');
    score.recommendations.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r}`);
    });
}