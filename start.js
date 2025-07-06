// Startup script to run both backend and frontend servers
import { spawn } from 'child_process';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}Starting HealFitness Zone application...${colors.reset}\n`);

// Start backend server
console.log(`${colors.bright}${colors.green}Starting backend server...${colors.reset}`);
const backend = spawn('node', ['server.cjs'], { 
  stdio: 'pipe',
  shell: true
});

// Start frontend server
console.log(`${colors.bright}${colors.blue}Starting frontend server...${colors.reset}`);
const frontend = spawn('npm', ['run', 'dev'], { 
  stdio: 'pipe',
  shell: true
});

// Handle backend output
backend.stdout.on('data', (data) => {
  console.log(`${colors.green}[Backend] ${colors.reset}${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`${colors.red}[Backend Error] ${colors.reset}${data.toString().trim()}`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  console.log(`${colors.blue}[Frontend] ${colors.reset}${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`${colors.yellow}[Frontend Warning] ${colors.reset}${data.toString().trim()}`);
});

// Handle process exit
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.cyan}Shutting down servers...${colors.reset}`);
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

// Handle server exit
backend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.log(`${colors.red}Backend server exited with code ${code}${colors.reset}`);
  }
});

frontend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.log(`${colors.yellow}Frontend server exited with code ${code}${colors.reset}`);
  }
});

console.log(`${colors.bright}${colors.cyan}Both servers are starting up...${colors.reset}`);
console.log(`${colors.cyan}Press Ctrl+C to stop both servers${colors.reset}`);