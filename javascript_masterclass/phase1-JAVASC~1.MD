# The JavaScript Master Class

## A complete guide from first line of code to advanced patterns

---

## How to use this guide

Work through the modules in order. Each module has explanations, runnable code examples, and exercises at the end. Type the examples yourself instead of copy-pasting — that's what actually builds fluency. You'll need a browser console (F12 / Cmd+Opt+J) or [Node.js](https://nodejs.org) installed to run the examples.

**Modules:**

1. Foundations — syntax, variables, types, operators, control flow
2. Functions — declarations, arrow functions, scope, closures
3. Objects & Arrays — the core data structures
4. `this`, Prototypes & Classes — JavaScript's object model
5. Asynchronous JavaScript — callbacks, promises, async/await, the event loop
6. Iterators & Generators
7. Modules — organizing code across files
8. Error Handling
9. Modern JavaScript (ES6–ES2023) — the features that matter
10. Functional Programming Patterns
11. Design Patterns in JS
12. Performance & Memory
13. Testing
14. Where to go next

---

## Module 1: Foundations

### 1.1 Variables

JavaScript has three ways to declare a variable: `var`, `let`, and `const`. In modern JavaScript, you should almost never use `var`.

```javascript
var oldWay = "avoid this"; // function-scoped, hoisted, error-prone
let mutable = "can change"; // block-scoped
const fixed = "cannot be reassigned"; // block-scoped, preferred default
```

Rule of thumb: use `const` by default, switch to `let` only when you know the variable needs to be reassigned. Never use `var`.

`const` prevents _reassignment_, not mutation. This is a common point of confusion:

```javascript
const arr = [1, 2, 3];
arr.push(4); // fine — mutating the array, not reassigning arr
console.log(arr); // [1, 2, 3, 4]

arr = [5, 6]; // TypeError: Assignment to constant variable.
```

### 1.2 Data Types

JavaScript has 7 primitive types and one non-primitive (`object`):

```javascript
typeof "hello"; // "string"
typeof 42; // "number"
typeof 42n; // "bigint"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof null; // "object"  <-- famous historical bug, null is NOT an object
typeof {}; // "object"
typeof []; // "object"  <-- arrays are objects
typeof function () {}; // "function"
```

Key distinction: **primitives are immutable and compared by value**; **objects are mutable and compared by reference**.

```javascript
let a = { x: 1 };
let b = { x: 1 };
console.log(a === b); // false — different objects in memory
console.log(a.x === b.x); // true — same primitive value

let c = a;
c.x = 99;
console.log(a.x); // 99 — c and a point to the same object
```

### 1.3 Type Coercion & Equality

JavaScript will convert types implicitly. This is a common source of bugs, so understand the rules rather than memorizing exceptions.

```javascript
"5" + 3     // "53"   (+ with a string triggers string concatenation)
"5" - 3     // 2      (- forces numeric conversion)
"5" * "2"   // 10
true + 1    // 2      (true becomes 1)
[] + []     // ""     (arrays become strings first)
[] + {}     // "[object Object]"
```

**Always use `===` and `!==`** (strict equality), which compare value AND type without coercion. Avoid `==`/`!=` unless you have a specific, well-understood reason.

```javascript
0 == "0"; // true  (coercion)
0 === "0"; // false (no coercion) — prefer this

null == undefined; // true
null === undefined; // false
```

### 1.4 Operators

```javascript
// Arithmetic
5 % 2; // 1 (modulo/remainder)
2 ** 10; // 1024 (exponentiation)

// Logical
true && false; // AND
true || false; // OR
!true; // NOT

// Nullish coalescing — falls back only for null/undefined, unlike ||
const count = 0;
count || 10; // 10  (0 is falsy, so this is probably a bug)
count ?? 10; // 0   (0 is neither null nor undefined, so it's kept)

// Optional chaining — safely access nested properties
const user = { profile: null };
user.profile?.name; // undefined, no error thrown
```

### 1.5 Control Flow

```javascript
// if / else
if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teen");
} else {
  console.log("child");
}

// switch
switch (day) {
  case "Sat":
  case "Sun":
    console.log("weekend");
    break;
  default:
    console.log("weekday");
}

// Loops
for (let i = 0; i < 5; i++) {
  /* ... */
}
for (const item of [1, 2, 3]) {
  /* ... */
} // values
for (const key in { a: 1, b: 2 }) {
  /* ... */
} // keys
while (condition) {
  /* ... */
}
```

### Exercises — Module 1

1. Predict the output of `"10" == 10`, `"10" === 10`, `null == 0`, and `NaN === NaN` before running them. Then verify and explain each result.
2. Write a function that takes a value and returns its type, correctly distinguishing arrays, `null`, and plain objects (hint: `typeof` alone won't do it — look up `Array.isArray` and `Object.prototype.toString.call`).

---

## Module 2: Functions

### 2.1 Declarations vs Expressions vs Arrow Functions

```javascript
// Function declaration — hoisted, can be called before it's defined
function add(a, b) {
  return a + b;
}

// Function expression — not hoisted
const subtract = function (a, b) {
  return a - b;
};

// Arrow function — concise, no own `this`
const multiply = (a, b) => a * b;

// Arrow function with a block body
const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
```

### 2.2 Default & Rest Parameters

```javascript
function greet(name = "friend") {
  return `Hello, ${name}`;
}

function sum(...numbers) {
  // rest — collects extra args into an array
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10
```

### 2.3 Scope

JavaScript has function scope and block scope (introduced with `let`/`const`).

```javascript
function example() {
  if (true) {
    var fnScoped = "visible outside the if";
    let blockScoped = "only visible inside the if";
  }
  console.log(fnScoped); // works
  console.log(blockScoped); // ReferenceError
}
```

**The scope chain**: when JS looks up a variable, it checks the current scope, then the enclosing scope, and so on up to the global scope.

### 2.4 Closures

A closure is a function that "remembers" the variables from the scope in which it was created, even after that scope has finished executing. This is one of the most important concepts in JavaScript.

```javascript
function makeCounter() {
  let count = 0; // private state
  return function () {
    count++; // this inner function "closes over" count
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3

// Each call to makeCounter() creates a fresh, independent closure:
const counter2 = makeCounter();
counter2(); // 1 — separate state from `counter`
```

Closures are how you get private variables in JavaScript, and they're the mechanism behind the module pattern, memoization, and event handler factories.

**Classic closure gotcha** (interview-favorite):

```javascript
// Wrong: logs 3, 3, 3 — var is function-scoped, shared across iterations
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// Right: logs 0, 1, 2 — let creates a new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

### 2.5 Higher-Order Functions

Functions that take other functions as arguments or return functions.

```javascript
const numbers = [1, 2, 3, 4, 5];

numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]
numbers.filter((n) => n % 2 === 0); // [2, 4]
numbers.reduce((sum, n) => sum + n, 0); // 15
numbers.forEach((n) => console.log(n)); // side effects, returns undefined
numbers.find((n) => n > 3); // 4
numbers.some((n) => n > 4); // true
numbers.every((n) => n > 0); // true
```

### Exercises — Module 2

1. Implement `once(fn)` — a higher-order function that returns a version of `fn` that can only be called once; subsequent calls return the result of the first call, without re-running `fn`. (This requires a closure.)
2. Implement a `debounce(fn, delay)` function from scratch, without libraries.

---

## Module 3: Objects & Arrays

### 3.1 Object Basics

```javascript
const person = {
  name: "Ada",
  age: 30,
  greet() {
    // method shorthand
    return `Hi, I'm ${this.name}`;
  },
};

person.name; // dot notation
person["name"]; // bracket notation — needed for dynamic keys
const key = "age";
person[key]; // 30

// Destructuring
const { name, age } = person;

// Spread — shallow copy / merge
const updated = { ...person, age: 31 };

// Computed property names
const dynamicKey = "score";
const obj = { [dynamicKey]: 100 }; // { score: 100 }
```

### 3.2 Object Utility Methods

```javascript
Object.keys(person); // ["name", "age", "greet"]
Object.values(person); // ["Ada", 30, function]
Object.entries(person); // [["name","Ada"], ["age",30], ...]
Object.freeze(person); // makes it immutable (shallow)
Object.assign({}, person, { age: 31 }); // merge (older alternative to spread)
```

### 3.3 Arrays Deep Dive

Arrays are objects with numeric keys and special behavior. Key methods to master:

```javascript
const arr = [3, 1, 4, 1, 5];

arr.slice(1, 3); // [1, 4] — non-mutating, returns a new array
arr.splice(1, 2); // mutates arr, removes 2 elements starting at index 1
arr.sort((a, b) => a - b); // mutates, sorts in place — always pass a comparator for numbers
arr.includes(4); // true
arr.indexOf(4); // position or -1
[...arr].reverse(); // spread first if you don't want to mutate the original

// Flattening
[
  [1, 2],
  [3, [4, 5]],
].flat(); // [1, 2, 3, [4, 5]]
[
  [1, 2],
  [3, [4, 5]],
].flat(2); // [1, 2, 3, 4, 5]

// Array.from — build arrays from iterables or array-likes
Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]
```

**Mutating vs non-mutating matters.** `sort`, `splice`, `push`, `pop`, `shift`, `unshift`, and `reverse` mutate the original array. `map`, `filter`, `slice`, `concat`, and spread do not. Mixing these up causes subtle bugs, especially with React or Redux-style state.

### 3.4 Destructuring & Spread in Depth

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

function printCoords({ x, y = 0 }) {
  // destructure directly in parameters
  console.log(`(${x}, ${y})`);
}
printCoords({ x: 5 }); // (5, 0)

// Swapping variables without a temp variable
let a = 1,
  b = 2;
[a, b] = [b, a];
```

### Exercises — Module 3

1. Write a function `groupBy(array, keyFn)` that groups an array of objects into a dictionary keyed by the result of `keyFn`.
2. Given a deeply nested object, write a function that flattens it into a single-level object with dot-notation keys (e.g. `{a: {b: 1}}` → `{"a.b": 1}`).

---

## Module 4: `this`, Prototypes & Classes

### 4.1 `this` — the most misunderstood keyword in JS

`this` is determined by **how a function is called**, not where it's defined (with one exception: arrow functions).

```javascript
const obj = {
  name: "Ada",
  regularFn: function () {
    return this.name;
  },
  arrowFn: () => {
    return this.name;
  },
};

obj.regularFn(); // "Ada" — called as obj.method(), this = obj
obj.arrowFn(); // undefined — arrow functions inherit `this` from
// the enclosing scope at definition time, not the caller

const detached = obj.regularFn;
detached(); // undefined (or throws in strict mode) — this is lost
// because it's no longer called as obj.method()
```

**Fixing lost `this`:**

```javascript
const bound = obj.regularFn.bind(obj); // permanently binds this
bound(); // "Ada"

obj.regularFn.call(obj); // invoke immediately with a specified this
obj.regularFn.apply(obj); // same, but takes arguments as an array
```

Rule of thumb: use regular functions for object methods (so `this` refers to the object), and arrow functions for callbacks where you want `this` to stay tied to the surrounding context (very common in class methods and event handlers).

### 4.2 Prototypes

Every JS object has a hidden link to another object — its prototype — which it inherits properties and methods from. This is prototypal inheritance, and it's what `class` syntax compiles down to under the hood.

```javascript
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  },
};

const dog = Object.create(animal); // dog's prototype is animal
dog.name = "Rex";
dog.speak(); // "Rex makes a sound" — inherited from animal

dog.hasOwnProperty("name"); // true
dog.hasOwnProperty("speak"); // false — it's on the prototype
```

### 4.3 Classes

`class` is syntactic sugar over prototypes — cleaner syntax, same mechanism underneath.

```javascript
class Animal {
  #secret = "hidden"; // private field (# syntax)
  static count = 0; // static property, shared across all instances

  constructor(name) {
    this.name = name;
    Animal.count++;
  }

  speak() {
    // instance method — lives on Animal.prototype
    return `${this.name} makes a sound`;
  }

  static describe() {
    // static method — called on the class itself
    return `${Animal.count} animals created`;
  }
}

class Dog extends Animal {
  speak() {
    // method overriding
    return `${super.speak()}, specifically a bark`;
  }
}

const rex = new Dog("Rex");
rex.speak(); // "Rex makes a sound, specifically a bark"
Animal.describe(); // "1 animals created"
```

### Exercises — Module 4

1. Without using `class`, implement a `Dog` constructor function with a `speak` method on its prototype, and use `Object.create` to set up inheritance from an `Animal` base.
2. Explain, in your own words, why arrow functions cannot be used as constructors (`new`) or given their own `this` via `bind`/`call`/`apply`.

---

## Module 5: Asynchronous JavaScript

This is the module most engineers find hardest — take it slowly.

### 5.1 The Event Loop (the mental model you actually need)

JavaScript is single-threaded — it can only do one thing at a time. Asynchronous behavior is handled by the **event loop**:

1. Synchronous code runs first, on the **call stack**.
2. When you call something async (`setTimeout`, a network request, a resolved promise callback), it's handed off, and JS keeps running the rest of your synchronous code.
3. When that async work finishes, its callback goes into a queue (microtask queue for Promises, macrotask/callback queue for `setTimeout` etc).
4. Once the call stack is empty, the event loop pulls tasks from the **microtask queue first, fully draining it**, then takes one task from the macrotask queue, and repeats.

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0); // macrotask

Promise.resolve().then(() => console.log("3")); // microtask

console.log("4");

// Output: 1, 4, 3, 2
// Sync code first (1, 4), then microtasks (3), then macrotasks (2) —
// even though setTimeout has a 0ms delay.
```

Understanding this order is essential for debugging race conditions and unexpected execution order.

### 5.2 Callbacks (the old way)

```javascript
function fetchData(callback) {
  setTimeout(() => callback(null, { id: 1 }), 1000);
}

fetchData((err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

Nesting these leads to "callback hell" — deeply indented, hard-to-follow chains. Promises exist to fix this.

### 5.3 Promises

A Promise represents a value that will be available now, later, or never (it may fail).

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) resolve({ id: 1 });
      else reject(new Error("failed"));
    }, 1000);
  });
}

fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err))
  .finally(() => console.log("done"));

// Chaining — each .then() can return a value or another promise
fetchData()
  .then((data) => data.id)
  .then((id) => fetchDataById(id))
  .then((result) => console.log(result));

// Running things in parallel
Promise.all([fetchData(), fetchData()]); // fails fast if any reject
Promise.allSettled([fetchData(), fetchData()]); // waits for all, never rejects
Promise.race([fetchData(), fetchData()]); // settles as soon as one does
```

### 5.4 async/await

Syntactic sugar over Promises that lets async code read like synchronous code.

```javascript
async function getData() {
  try {
    const data = await fetchData(); // pauses here until the promise settles
    const more = await fetchDataById(data.id);
    return more;
  } catch (err) {
    console.error("Something failed:", err);
  }
}

// A function marked `async` always returns a Promise
getData().then((result) => console.log(result));

// Parallel requests with async/await
async function getBoth() {
  const [a, b] = await Promise.all([fetchData(), fetchData()]);
  return { a, b };
}
```

**Common mistake**: awaiting sequentially when you could run in parallel.

```javascript
// Slow — each await blocks the next call from starting
const a = await fetchData();
const b = await fetchData();

// Fast — both start immediately, you just wait for both to finish
const [a2, b2] = await Promise.all([fetchData(), fetchData()]);
```

### Exercises — Module 5

1. Write a `delay(ms)` function that returns a Promise resolving after `ms` milliseconds, then use it with `async/await` to log "1", "2", "3" one second apart.
2. Predict the console output order of a script mixing `console.log`, `setTimeout`, and `Promise.then` calls, then verify in a real environment.

---

## Module 6: Iterators & Generators

### 6.1 Iterables

Anything with a `Symbol.iterator` method can be used in a `for...of` loop or spread. Arrays, strings, Maps, and Sets are all built-in iterables.

```javascript
const custom = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        i++;
        return i <= 3
          ? { value: i, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

[...custom]; // [1, 2, 3]
for (const val of custom) console.log(val); // 1, 2, 3
```

### 6.2 Generators

A generator function (`function*`) can pause and resume execution, producing a sequence of values lazily.

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
gen.next().value; // 1
gen.next().value; // 2
gen.next().value; // 3
// Infinite sequence, but only computes values as you ask for them
```

Generators are the foundation that async/await was originally built on top of, and they're useful for lazy evaluation, custom iteration logic, and implementing state machines.

### Exercises — Module 6

1. Write a generator function `range(start, end, step)` that yields numbers from `start` to `end`.
2. Use a generator to implement a simple lazy `take(iterable, n)` function that returns the first `n` values without evaluating the rest.

---

## Module 7: Modules

Modern JavaScript uses ES Modules (`import`/`export`) to split code across files.

```javascript
// math.js
export const PI = 3.14159;
export function square(x) {
  return x * x;
}
export default function add(a, b) {
  return a + b;
}

// main.js
import add, { PI, square } from "./math.js";
import * as math from "./math.js"; // namespace import

console.log(add(2, 3), PI, square(4));
```

Key points: named exports can be many per file, default export is one per file, and imports are read-only bindings (live references, not copies). In Node.js, use `"type": "module"` in `package.json` or the `.mjs` extension to enable this syntax; older Node/CommonJS code uses `require`/`module.exports` instead.

---

## Module 8: Error Handling

```javascript
try {
  JSON.parse("not valid json");
} catch (error) {
  console.error(error.message);
} finally {
  console.log("always runs");
}

// Custom errors
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validate(age) {
  if (age < 0) throw new ValidationError("Age cannot be negative", "age");
}

try {
  validate(-1);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Invalid field: ${err.field}`);
  } else {
    throw err; // re-throw errors you don't know how to handle
  }
}
```

For async code, wrap `await` calls in `try/catch`, and always add a global handler for unhandled rejections in production apps (`window.onunhandledrejection` in browsers, `process.on('unhandledRejection', ...)` in Node).

---

## Module 9: Modern JavaScript (ES6 → ES2023)

A quick-reference tour of the features that show up constantly in real codebases:

```javascript
// Template literals
const name = "Ada";
console.log(`Hello, ${name}! 2 + 2 = ${2 + 2}`);

// Optional chaining & nullish coalescing (ES2020)
const city = user?.address?.city ?? "Unknown";

// Object/array destructuring with defaults & renaming
const { title: bookTitle = "Untitled" } = book;

// Array.prototype.at (ES2022) — negative indexing
[1, 2, 3].at(-1); // 3

// Object.hasOwn (ES2022) — safer than hasOwnProperty
Object.hasOwn(obj, "key");

// Array grouping-style patterns via reduce (widely used pre-Object.groupBy)
// Top-level await (ES2022, in modules)
const data = await fetch("/api").then((r) => r.json());

// Logical assignment operators (ES2021)
let count = null;
count ??= 0; // assign only if null/undefined
let flag = true;
flag &&= false; // assign only if currently truthy

// Numeric separators (ES2021) — readability for large numbers
const million = 1_000_000;

// Promise.any (ES2021) — resolves as soon as one succeeds
await Promise.any([fetchA(), fetchB()]);
```

Structured cloning (`structuredClone(obj)`) is now built-in for deep-copying objects without a library — a common pain point solved natively.

---

## Module 10: Functional Programming Patterns

JavaScript supports functional-style code even though it's not a purely functional language.

```javascript
// Pure functions — same input always produces same output, no side effects
const add = (a, b) => a + b; // pure
let total = 0;
const addImpure = (n) => {
  total += n;
  return total;
}; // impure — depends on/mutates external state

// Immutability — prefer creating new data over mutating existing data
const addItem = (arr, item) => [...arr, item]; // instead of arr.push(item)

// Composition
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const double = (x) => x * 2;
const increment = (x) => x + 1;
pipe(double, increment)(5); // (5*2)+1 = 11

// Currying
const curriedAdd = (a) => (b) => (c) => a + b + c;
curriedAdd(1)(2)(3); // 6

// Memoization — cache results of expensive pure function calls
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

## Module 11: Design Patterns in JS

```javascript
// Module pattern — private state via closures (pre-ES-modules technique)
const Counter = (function () {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
})();

// Singleton — one shared instance
class Database {
  static #instance;
  static getInstance() {
    if (!Database.#instance) Database.#instance = new Database();
    return Database.#instance;
  }
}

// Observer pattern — the basis of event systems, Redux, RxJS, etc.
class EventEmitter {
  #listeners = {};
  on(event, callback) {
    (this.#listeners[event] ??= []).push(callback);
  }
  emit(event, ...args) {
    (this.#listeners[event] || []).forEach((cb) => cb(...args));
  }
}

const emitter = new EventEmitter();
emitter.on("greet", (name) => console.log(`Hi ${name}`));
emitter.emit("greet", "Ada"); // "Hi Ada"

// Factory pattern
function createUser(type) {
  if (type === "admin") return { role: "admin", permissions: ["all"] };
  return { role: "user", permissions: ["read"] };
}
```

---

## Module 12: Performance & Memory

- **Avoid unnecessary work in hot loops.** Cache array lengths, avoid re-creating functions/objects inside loops when possible.
- **Debounce/throttle** high-frequency events (scroll, resize, keystrokes) to avoid excessive re-computation.
- **Watch for memory leaks**: forgotten event listeners, detached DOM nodes still referenced by JS variables, and growing closures holding onto large objects unnecessarily.
- **Use the right data structure**: `Map`/`Set` for frequent lookups and uniqueness checks — they're faster than arrays for these operations at scale, and `Map` keys can be any type (unlike plain object keys, which are coerced to strings).

```javascript
const seen = new Set();
seen.add(1);
seen.has(1); // true, O(1) lookup

const cache = new Map();
cache.set({ id: 1 }, "value"); // object keys work directly, unlike {}
```

- **Profile before optimizing.** Use browser DevTools' Performance and Memory tabs, or Node's `--prof` flag, to find actual bottlenecks rather than guessing.

---

## Module 13: Testing

A minimal example using a common testing pattern (works with Jest, Vitest, or similar):

```javascript
// sum.js
export function sum(a, b) {
  return a + b;

export function sum(a, b) { return a + b; }

// sum.test.js
import { sum } from "./sum.js";

test("adds two numbers", () => {
  expect(sum(2, 3)).toBe(5);
});

test("handles negative numbers", () => {
  expect(sum(-1, -1)).toBe(-2);
});
```

Good tests are specific (one behavior per test), isolated (no shared mutable state between tests), and deterministic (no reliance on real time, random values, or real network calls — mock those).

---

## Module 14: Where to go next

Once you're comfortable with everything above, here's the natural progression:

- **TypeScript** — adds static typing on top of JavaScript; the industry-standard next step for larger codebases.
- **A framework** — React, Vue, or Svelte, to apply these fundamentals to real UI work.
- **Node.js backend fundamentals** — Express or Fastify, working with databases, REST/GraphQL APIs.
- **Browser APIs** — the DOM, Fetch, Web Storage, Web Workers, Service Workers.
- **Build tooling** — Vite, esbuild, or webpack, and how modern JS actually gets bundled and shipped.
- **Read real source code** — pick a small, well-written open-source library and read through it end to end.

The single most effective way to solidify everything in this guide is to build something real: a small CLI tool, a browser extension, or a full-stack app that touches async requests, state, and error handling all at once.
