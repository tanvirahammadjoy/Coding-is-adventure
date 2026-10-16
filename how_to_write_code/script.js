import readeline from "readlin";

const rl = readeline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("what is your name? ", (hello) => {
  console.log(`hello ${hello}`);
  rl.close();
});

console.log("hello");
