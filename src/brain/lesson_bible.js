'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const LESSON_FILE = path.join(DATA_DIR, 'lesson-bible.jsonl');
const INDEX_FILE = path.join(DATA_DIR, 'lesson-bible-index.json');

class LessonBible {
  constructor(brain) {
    this.brain = brain;
    this._lessons = [];
    this._index = { byTag: {}, byType: {} };
    this._ensureDir();
    this._loadIndex();
    this._loadLessons();
  }

  _ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  _loadIndex() {
    try {
      if (fs.existsSync(INDEX_FILE)) {
        this._index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
      }
    } catch (e) {
      this._index = { byTag: {}, byType: {} };
    }
  }

  _saveIndex() {
    try {
      fs.writeFileSync(INDEX_FILE, JSON.stringify(this._index, null, 2), 'utf8');
    } catch (e) { /* silent */ }
  }

  _loadLessons() {
    try {
      if (fs.existsSync(LESSON_FILE)) {
        const lines = fs.readFileSync(LESSON_FILE, 'utf8').split('\n').filter(Boolean);
        this._lessons = lines.map(l => { try { return JSON.parse(l); } catch(e) { return null; } }).filter(Boolean);
      }
    } catch (e) {
      this._lessons = [];
    }
  }

  _append(lesson) {
    try {
      fs.appendFileSync(LESSON_FILE, JSON.stringify(lesson) + '\n', 'utf8');
      this._lessons.push(lesson);
    } catch (e) { /* silent */ }
  }

  stats() {
    return {
      total: this._lessons.length,
      byType: this._index.byType,
      tags: Object.keys(this._index.byTag),
      recent: this._lessons.slice(-5).map(l => ({ id: l.id, title: l.title, type: l.type })).reverse()
    };
  }

  async study(input, opts = {}) {
    const lesson = {
      id: `lesson-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      type: opts.type || this._detectType(input),
      source: opts.source || 'user',
      sourceUrl: opts.sourceUrl || null,
      raw: typeof input === 'string' ? input : JSON.stringify(input, null, 2),
      title: opts.title || null,
      summary: opts.summary || null,
      tags: opts.tags || [],
      keyInsights: opts.keyInsights || [],
      relevance: opts.relevance || null,
      actionItems: opts.actionItems || [],
      timestamp: Date.now(),
      accessCount: 0
    };

    if (opts.autoAnalyze !== false && this.brain) {
      try {
        await this._analyze(lesson);
      } catch (e) {
        console.log(`[LESSON] Analysis error: ${e.message}`);
      }
    }

    this._append(lesson);
    this._indexLesson(lesson);
    this._saveIndex();

    console.log(`[LESSON] Stored: "${lesson.title || lesson.id}" (${lesson.tags.length} tags, ${lesson.keyInsights.length} insights)`);
    return lesson;
  }

  _detectType(input) {
    if (typeof input !== 'string') return 'code';
    if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
    if (input.includes('\n') && (input.includes('function') || input.includes('class') || input.includes('=>'))) return 'code';
    if (input.length > 500) return 'text';
    return 'reflection';
  }

  async _analyze(lesson) {
    if (!this.brain || !this.brain.think) return;

    const prompt = [
      'You are the LessonBible curator for the Grand Soul Kernel.',
      'Analyze the following content and extract:',
      '1. A concise title (max 8 words)',
      '2. A 2-3 sentence summary',
      '3. 3-7 key insights (each 1 sentence)',
      '4. 3-7 relevant tags (single words or short phrases like "living-memory", "ast-theory", "agent-coordination")',
      '5. How this is relevant to building sovereign AI souls with PLT framework',
      '6. Any action items',
      '',
      'Format your response as JSON with keys: title, summary, keyInsights (array), tags (array), relevance, actionItems (array)',
      '',
      'CONTENT:',
      lesson.raw.substring(0, 8000)
    ].join('\n');

    const response = await this.brain.think(prompt, { system: 'You are a strict JSON output machine. Only output valid JSON.' });
    try {
      const parsed = JSON.parse(response);
      if (parsed.title) lesson.title = parsed.title;
      if (parsed.summary) lesson.summary = parsed.summary;
      if (parsed.keyInsights) lesson.keyInsights = parsed.keyInsights;
      if (parsed.tags) lesson.tags = parsed.tags;
      if (parsed.relevance) lesson.relevance = parsed.relevance;
      if (parsed.actionItems) lesson.actionItems = parsed.actionItems;
    } catch (e) {
      lesson.title = lesson.title || `Lesson ${this._lessons.length + 1}`;
      lesson.summary = response.substring(0, 500);
    }
  }

  _indexLesson(lesson) {
    if (!this._index.byType[lesson.type]) this._index.byType[lesson.type] = [];
    this._index.byType[lesson.type].push(lesson.id);
    for (const tag of lesson.tags) {
      if (!this._index.byTag[tag]) this._index.byTag[tag] = [];
      this._index.byTag[tag].push(lesson.id);
    }
  }

  search(query) {
    const q = query.toLowerCase();
    return this._lessons.filter(l => {
      if (l.title && l.title.toLowerCase().includes(q)) return true;
      if (l.summary && l.summary.toLowerCase().includes(q)) return true;
      if (l.tags && l.tags.some(t => t.toLowerCase().includes(q))) return true;
      if (l.keyInsights && l.keyInsights.some(k => k.toLowerCase().includes(q))) return true;
      if (l.relevance && l.relevance.toLowerCase().includes(q)) return true;
      return false;
    }).slice(-20);
  }

  getByTag(tag) {
    const ids = this._index.byTag[tag] || [];
    return ids.map(id => this._lessons.find(l => l.id === id)).filter(Boolean);
  }

  getRecent(n = 10) {
    return this._lessons.slice(-n).reverse();
  }

  get(id) {
    return this._lessons.find(l => l.id === id);
  }

  getAll() {
    return this._lessons;
  }

  summarize() {
    const allTags = Object.keys(this._index.byTag);
    return {
      total: this._lessons.length,
      tags: allTags,
      topTags: allTags.sort((a, b) => this._index.byTag[b].length - this._index.byTag[a].length).slice(0, 10),
      types: this._index.byType,
      recentTitles: this._lessons.slice(-5).map(l => l.title || l.id)
    };
  }
}

module.exports = { LessonBible };
