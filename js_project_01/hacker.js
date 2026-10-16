"use strict";

const readline = require("node:readline");

const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  brightGreen: "\x1b[92m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  white: "\x1b[97m",
  magenta: "\x1b[35m",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (items) => items[randomInt(0, items.length - 1)];

function color(text, shade = C.green) {
  return shade + text + C.reset;
}

function print(text = "") {
  console.log(text);
}

async function typeText(text, delay = 15, shade = C.green) {
  for (const character of text) {
    process.stdout.write(color(character, shade));
    await sleep(delay);
  }
  console.log();
}

async function progressBar(label, duration = 1000) {
  const width = 28;
  const steps = 20;

  for (let step = 0; step <= steps; step++) {
    const percent = Math.round((step / steps) * 100);
    const filled = Math.round((step / steps) * width);
    const bar = "#".repeat(filled) + "-".repeat(width - filled);

    process.stdout.write(
      "\r" +
        color(label.padEnd(24), C.cyan) +
        color("[" + bar + "] ", C.brightGreen) +
        String(percent).padStart(3) +
        "%",
    );

    await sleep(duration / steps);
  }

  console.log();
}

function randomHex(length = 8) {
  const digits = "0123456789ABCDEF";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += digits[randomInt(0, digits.length - 1)];
  }

  return result;
}

function showBanner() {
  console.clear();
  print(color("==============================================", C.green));
  print(color("             CYBER TERMINAL v1.0", C.brightGreen));
  print(color("         JAVASCRIPT SIMULATION MODE", C.cyan));
  print(color("==============================================", C.green));
  print(color("  SIMULATION ONLY - NO REAL HACKING", C.yellow));
  print();
}

async function bootSequence() {
  const messages = [
    "[BOOT] Initializing virtual terminal...",
    "[SYS] Loading simulated system modules...",
    "[MEM] Allocating fictional memory...",
    "[NET] Preparing virtual network model...",
    "[SEC] Loading simulated security checks...",
  ];

  for (const message of messages) {
    await typeText(message, randomInt(5, 14));
    await sleep(randomInt(120, 300));
  }

  print();
  await progressBar("Starting terminal", 700);
  await progressBar("Loading virtual modules", 900);
  await progressBar("Preparing simulation", 700);

  print(color("[OK] Virtual environment ready.", C.brightGreen));
}

async function fakeScan() {
  print();
  print(color("========== VIRTUAL SYSTEM SCAN ==========", C.cyan));
  print(color("Fictional results only. No real ports scanned.", C.gray));
  print();

  const ports = [22, 53, 80, 443, 3000, 8080];

  for (const port of ports) {
    const status = pick(["SIMULATED", "FILTERED", "MOCK RESPONSE"]);

    print(
      color("[SCAN] ", C.cyan) +
        "Virtual port " +
        String(port).padEnd(5) +
        color(status, C.yellow),
    );

    await sleep(randomInt(180, 420));
  }

  print(color("[OK] Virtual scan completed.", C.brightGreen));
}

async function generateDataStream() {
  print();
  print(color("========== VIRTUAL DATA STREAM ==========", C.magenta));
  print();

  for (let i = 0; i < 12; i++) {
    print(
      color("[0x" + randomHex(8) + "] ", C.cyan) +
        color(randomHex(16), C.brightGreen),
    );

    await sleep(randomInt(60, 150));
  }
}

async function securityCheck() {
  print();
  print(color("========== SECURITY DIAGNOSTICS ==========", C.cyan));
  print();

  const checks = [
    "Virtual firewall",
    "Mock authentication",
    "Encryption simulator",
    "Access control model",
    "System integrity model",
  ];

  for (const item of checks) {
    await sleep(randomInt(180, 400));

    print(
      color("[CHECK] ", C.gray) +
        item.padEnd(27) +
        color("PASSED", C.brightGreen),
    );
  }

  print(color("[OK] All simulated checks passed.", C.brightGreen));
}

async function randomCodeEffect() {
  print();
  print(color("========== RANDOM CODE GENERATOR ==========", C.green));
  print();

  const digits = "0123456789ABCDEF";

  for (let row = 0; row < 8; row++) {
    let output = "";

    for (let column = 0; column < 44; column++) {
      output += digits[randomInt(0, digits.length - 1)];
    }

    print(color(output, pick([C.green, C.brightGreen, C.cyan])));
    await sleep(100);
  }
}

async function runSimulation() {
  showBanner();

  await bootSequence();
  await sleep(250);
  await fakeScan();
  await sleep(250);
  await generateDataStream();
  await sleep(250);
  await securityCheck();
  await sleep(250);
  await randomCodeEffect();

  print();
  print(color("==============================================", C.green));
  print(color("             SIMULATION COMPLETE", C.brightGreen));
  print(color("==============================================", C.green));
  print(color("[STATUS] All virtual systems operational.", C.cyan));
  print(color("[RESULT] No real systems accessed or changed.", C.cyan));
  print(color("[TIME]   " + new Date().toLocaleTimeString(), C.cyan));
  print();

  await typeText("Welcome back, cyber explorer!", 25, C.brightGreen);
  print();
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function showRandomCodes() {
  print();
  print(color("========== RANDOM HEXADECIMAL CODES ==========", C.cyan));

  for (let i = 0; i < 10; i++) {
    print(color("0x" + randomHex(16), C.brightGreen));
  }

  print();
  await ask("Press Enter to return to the menu...");
}

async function showSecurityReport() {
  print();
  print(color("========== FAKE SECURITY REPORT ==========", C.cyan));
  print("Real devices scanned:     0");
  print("Real ports accessed:      0");
  print("Real files modified:      0");
  print("Simulation status:        SUCCESS");
  print();

  await ask("Press Enter to return to the menu...");
}

async function main() {
  try {
    let running = true;

    while (running) {
      await runSimulation();

      print(color("Choose your next action:", C.white));
      print("  1. Run simulation again");
      print("  2. Generate random hexadecimal codes");
      print("  3. Show fake security report");
      print("  4. Exit");
      print();

      const choice = await ask(color("cyber@terminal > ", C.brightGreen));

      switch (choice) {
        case "1":
          break;
        case "2":
          await showRandomCodes();
          break;
        case "3":
          await showSecurityReport();
          break;
        case "4":
          running = false;
          print();
          await typeText("Disconnecting from simulation...", 20, C.cyan);
          print(color("Goodbye, cyber explorer!", C.brightGreen));
          break;
        default:
          print(color("Invalid option. Enter 1, 2, 3, or 4.", C.yellow));
          await sleep(1000);
      }
    }
  } catch (error) {
    console.error(color("Unexpected error: " + error.message, C.yellow));
    process.exitCode = 1;
  }
}

main();
