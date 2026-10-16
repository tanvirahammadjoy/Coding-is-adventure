import readline from "readline"; 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("what is your name? ", (hello) => {
  function sayHello() {
    console.log(`Hello ${hello} !`);
  }
  sayHello();
  rl.close();
});
sayHello();
