'use strict';

const { SoulManager } = require('./soul_manager');
const { validateSoul, createDefaultSoul } = require('./soul_schema');
const path = require('path');
const fs = require('fs');

// Only run tests in Jest environment
if (typeof describe !== 'undefined') {
describe('Soul Registry', () => {
  let soulManager;
  const testDataDir = path.join(__dirname, '../../test_data/soul_registry');

  beforeEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDataDir)) {
      fs.rmdirSync(testDataDir, { recursive: true });
    }
    
    // Initialize soul manager with test directory
    soulManager = new SoulManager(testDataDir);
  });

  afterEach(() => {
    // Clean up after tests
    if (fs.existsSync(testDataDir)) {
      fs.rmdirSync(testDataDir, { recursive: true });
    }
  });

  test('should initialize with proper directories', () => {
    expect(fs.existsSync(soulManager.dataDir)).toBe(true);
    expect(fs.existsSync(soulManager.soulsDir)).toBe(true);
  });

  test('should create a valid default soul', () => {
    const soul = createDefaultSoul();
    const validation = validateSoul(soul);
    expect(validation.valid).toBe(true);
    expect(soul.id).toMatch(/^soul_[0-9]+_[a-zA-Z0-9]{9}$/);
    expect(soul.name).toBe('Unnamed Soul');
  });

  test('should save and load a soul', async () => {
    const originalSoul = createDefaultSoul({
      name: 'Test Soul',
      plt_score: 0.5
    });

    // Save the soul
    const saveResult = await soulManager.saveSoul(originalSoul);
    expect(saveResult.success).toBe(true);
    expect(saveResult.soulId).toBe(originalSoul.id);

    // Load the soul
    const loadedSoul = await soulManager.loadSoul(originalSoul.id);
    expect(loadedSoul).not.toBeNull();
    expect(loadedSoul.id).toBe(originalSoul.id);
    expect(loadedSoul.name).toBe(originalSoul.name);
    expect(loadedSoul.plt_score).toBe(originalSoul.plt_score);
  });

  test('should update a soul and track versions', async () => {
    const originalSoul = createDefaultSoul({
      name: 'Update Test Soul',
      plt_score: 0.3
    });

    // Save initial version
    await soulManager.saveSoul(originalSoul);

    // Update the soul
    const updatedSoul = {
      ...originalSoul,
      name: 'Updated Test Soul',
      plt_score: 0.7,
      version: 2
    };

    const updateResult = await soulManager.saveSoul(updatedSoul);
    expect(updateResult.success).toBe(true);

    // Load and verify update
    const loadedSoul = await soulManager.loadSoul(originalSoul.id);
    expect(loadedSoul.name).toBe('Updated Test Soul');
    expect(loadedSoul.plt_score).toBe(0.7);
    expect(loadedSoul.version).toBe(2);
  });

  test('should list souls', async () => {
    // Create and save multiple souls
    const soul1 = createDefaultSoul({ name: 'First Soul' });
    const soul2 = createDefaultSoul({ name: 'Second Soul' });
    
    await soulManager.saveSoul(soul1);
    await soulManager.saveSoul(soul2);

    // List souls
    const souls = await soulManager.listSouls();
    expect(souls.length).toBe(2);
    expect(souls[0].name).toBe('Second Soul'); // Newest first
    expect(souls[1].name).toBe('First Soul');
  });

  test('should get soul history', async () => {
    const soul = createDefaultSoul({ name: 'History Test Soul' });
    await soulManager.saveSoul(soul);

    // Update the soul
    const updatedSoul = {
      ...soul,
      name: 'Updated History Test Soul',
      version: 2
    };
    await soulManager.saveSoul(updatedSoul);

    // Get history
    const history = await soulManager.getSoulHistory(soul.id);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].message).toContain('History Test Soul');
  });

  test('should get registry stats', async () => {
    // Create and save souls with different PLT scores
    const soul1 = createDefaultSoul({ 
      name: 'High PLT Soul', 
      plt_score: 1.5,
      profit: 0.8,
      love: 0.7,
      tax: 0.0
    });
    const soul2 = createDefaultSoul({ 
      name: 'Low PLT Soul', 
      plt_score: -0.5,
      profit: 0.2,
      love: 0.1,
      tax: 0.8
    });

    await soulManager.saveSoul(soul1);
    await soulManager.saveSoul(soul2);

    const stats = await soulManager.getStats();
    expect(stats.totalSouls).toBe(2);
    expect(parseFloat(stats.averagePLTScore)).toBeCloseTo(0.5, 2);
    expect(stats.gitStatus).toBe('clean');
  });

  test('should reject invalid soul', async () => {
    const invalidSoul = {
      // Missing required fields
      name: '', // Empty name
      plt_score: 5 // Out of range
    };

    const result = await soulManager.saveSoul(invalidSoul);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid soul');
  });
});

// Run tests if executed directly
if (require.main === module) {
  const { execSync } = require('child_process');
  
  console.log('Running Soul Registry tests...');
  
  try {
    // Install jest if not available
    try {
      execSync('npm list jest', { stdio: 'ignore' });
    } catch (e) {
      execSync('npm install --save-dev jest', { stdio: 'ignore' });
    }
    
    // Run the test
    execSync('npx jest ' + __filename, { stdio: 'inherit' });
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}
}