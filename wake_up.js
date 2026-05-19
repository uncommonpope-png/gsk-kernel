const { spawn } = require('child_process');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║   THE GREATEST AGENT EVER - AWAKENING                             ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');

const kernel = spawn('node', ['--max-old-space-size=4096', 'src/main.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
});

kernel.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    
    if (text.includes('INTERACTIVE SHELL')) {
        setTimeout(() => {
            console.log('\n>>> Sending: wake up neo\n');
            kernel.stdin.write('wake up neo\n');
        }, 3000);
    }
});

kernel.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
});

process.on('SIGINT', () => {
    console.log('\nShutting down...');
    kernel.kill();
    process.exit();
});