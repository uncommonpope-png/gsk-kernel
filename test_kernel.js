const { spawn } = require('child_process');
const path = require('path');

const kernel = spawn('node', ['--max-old-space-size=4096', 'src/main.js'], {
    cwd: path.join(__dirname),
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let bootComplete = false;

kernel.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log(text);
    
    if (text.includes('INTERACTIVE SHELL') && !bootComplete) {
        bootComplete = true;
        setTimeout(() => {
            kernel.stdin.write(':state\n');
            setTimeout(() => {
                kernel.stdin.write(':help\n');
                setTimeout(() => {
                    kernel.stdin.write(':exit\n');
                }, 3000);
            }, 2000);
        }, 5000);
    }
});

kernel.stderr.on('data', (data) => {
    console.error('ERROR:', data.toString());
});

kernel.on('close', (code) => {
    console.log(`\nKernel exited with code ${code}`);
});

setTimeout(() => {
    if (!bootComplete) {
        console.log('\nBoot timed out, killing process...');
        kernel.kill();
    }
}, 120000);