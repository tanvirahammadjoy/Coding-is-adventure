/**
 * ============================================================================
 *  THE JAVASCRIPT MASTER CLASS — RUNNABLE EDITION
 * ============================================================================
 *
 *  This is a single, executable JavaScript file. Every concept below is real
 *  code that actually runs — not just a description of syntax. Run it with:
 *
 *      node javascript_master_class.js
 *
 *  Each module is a function you can read top to bottom. Notes are inline as
 *  comments right above or beside the code they explain. Run the whole file
 *  once, then come back and comment out `runAll()` calls you've already
 *  studied so you can focus on one module at a time.
 *
 *  No dependencies required — plain Node.js is enough.
 * ============================================================================
 */

"use strict";

// Small helper used throughout to print readable section banners.
function section(title) {
  console.log("\n" + "=".repeat(70));
  console.log(title);
  console.log("=".repeat(70));
}

// ============================================================================
// MODULE 1 — FOUNDATIONS: variables, types, coercion, operators, control flow
// ============================================================================
function module1_foundations() {
  section("MODULE 1: FOUNDATIONS");

  // --- 1.1 Variables -------------------------------------------------------
  // var  -> function-scoped, hoisted, avoid it
  // let  -> block-scoped, reassignable
  // const-> block-scoped, NOT reassignable (but mutable if it's an object/array)
  let mutable = "can change";
  const fixed = "cannot be reassigned";
  mutable = "changed";
  console.log("1.1 let/const:", mutable, "|", fixed);

  const arr = [1, 2, 3];
  arr.push(4); // OK — mutating contents, not reassigning the binding
  console.log("1.1 const array can still be mutated:", arr);
  try {
    // eslint-disable-next-line no-const-assign
    // arr = [5, 6];   // <-- would throw: TypeError: Assignment to constant variable
    eval("arr = [5, 6];");
  } catch (err) {
    console.log(
      "1.1 Reassigning a const array throws:",
      err.constructor.name,
      "-",
      err.message,
    );
  }

  // --- 1.2 Data types --------------------------------------------------------
  console.log("1.2 typeof checks:");
  console.log("   typeof 'hello'   =", typeof "hello");
  console.log("   typeof 42        =", typeof 42);
  console.log("   typeof 42n       =", typeof 42n);
  console.log("   typeof true      =", typeof true);
  console.log("   typeof undefined =", typeof undefined);
  console.log("   typeof Symbol()  =", typeof Symbol());
  console.log(
    "   typeof null      =",
    typeof null,
    " <-- historic bug, null is NOT an object",
  );
  console.log("   typeof {}        =", typeof {});
  console.log("   typeof []        =", typeof [], " <-- arrays are objects");
  console.log("   typeof function(){} =", typeof function () {});

  // Primitives compare by value, objects compare by reference.
  const p1 = { x: 1 };
  const p2 = { x: 1 };
  const p3 = p1;
  console.log("1.2 p1 === p2 (different objects):", p1 === p2); // false
  console.log("1.2 p1 === p3 (same reference):   ", p1 === p3); // true
  p3.x = 99;
  console.log("1.2 mutating p3 also changes p1.x:", p1.x); // 99

  // --- 1.3 Coercion & equality ----------------------------------------------
  console.log("1.3 Coercion examples:");
  console.log('   "5" + 3   =', "5" + 3); // "53"
  console.log('   "5" - 3   =', "5" - 3); // 2
  console.log("   true + 1  =", true + 1); // 2
  console.log("   [] + []   =", JSON.stringify([] + [])); // ""

  console.log("1.3 Equality:");
  console.log('   0 == "0"  ->', 0 == "0"); // true  (coercion)
  console.log('   0 === "0" ->', 0 === "0"); // false (strict — prefer this)
  console.log("   null == undefined  ->", null == undefined); // true
  console.log("   null === undefined ->", null === undefined); // false
  // ALWAYS prefer === and !== in real code.

  // --- 1.4 Operators ---------------------------------------------------------
  const count = 0;
  console.log("1.4 count || 10  =", count || 10); // 10 — 0 is falsy (likely a bug source)
  console.log("1.4 count ?? 10  =", count ?? 10); // 0  — nullish coalescing only falls
  //      back for null/undefined
  const user = { profile: null };
  console.log("1.4 optional chaining user.profile?.name =", user.profile?.name); // undefined, no throw

  // --- 1.5 Control flow --------------------------------------------------------
  function classify(age) {
    if (age >= 18) return "adult";
    else if (age >= 13) return "teen";
    return "child";
  }
  console.log("1.5 classify(20):", classify(20));
  console.log("1.5 classify(15):", classify(15));

  const daySummaries = ["Sat", "Wed"].map((day) => {
    switch (day) {
      case "Sat":
      case "Sun":
        return `${day}: weekend`;
      default:
        return `${day}: weekday`;
    }
  });
  console.log("1.5 switch results:", daySummaries);
}

// ============================================================================
// MODULE 2 — FUNCTIONS: declarations, arrow fns, scope, closures, HOFs
// ============================================================================
function module2_functions() {
  section("MODULE 2: FUNCTIONS");

  // --- 2.1 Declarations vs expressions vs arrow functions --------------------
  function add(a, b) {
    return a + b;
  } // hoisted declaration
  const subtract = function (a, b) {
    return a - b;
  }; // expression, not hoisted
  const multiply = (a, b) => a * b; // arrow, concise body
  const divide = (a, b) => {
    // arrow, block body
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  };
  console.log("2.1 add(2,3)=", add(2, 3), "subtract(5,2)=", subtract(5, 2));
  console.log(
    "2.1 multiply(4,5)=",
    multiply(4, 5),
    "divide(10,2)=",
    divide(10, 2),
  );

  // --- 2.2 Default & rest parameters -----------------------------------------
  function greet(name = "friend") {
    return `Hello, ${name}`;
  }
  function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
  }
  console.log("2.2", greet(), "|", greet("Ada"));
  console.log("2.2 sum(1,2,3,4) =", sum(1, 2, 3, 4));

  // --- 2.3 Scope ----------------------------------------------------------------
  function scopeDemo() {
    if (true) {
      var fnScoped = "visible outside the if";
      let blockScoped = "only visible inside the if";
      console.log("2.3 inside block:", fnScoped, "|", blockScoped);
    }
    console.log("2.3 outside block, fnScoped still visible:", fnScoped);
    // console.log(blockScoped); // would throw ReferenceError — commented out on purpose
  }
  scopeDemo();

  // --- 2.4 Closures --------------------------------------------------------------
  function makeCounter() {
    let count = 0; // private state, only reachable through the returned function
    return function () {
      count++;
      return count;
    };
  }
  const counterA = makeCounter();
  const counterB = makeCounter(); // independent state from counterA
  console.log("2.4 counterA:", counterA(), counterA(), counterA()); // 1 2 3
  console.log("2.4 counterB:", counterB()); // 1 (separate closure)

  // Classic var-vs-let loop gotcha, demonstrated synchronously with an array of thunks
  const varThunks = [];
  for (var i = 0; i < 3; i++) {
    varThunks.push(() => i);
  }
  console.log(
    "2.4 var loop closures (all share final i):",
    varThunks.map((fn) => fn()),
  ); // 3 3 3

  const letThunks = [];
  for (let j = 0; j < 3; j++) {
    letThunks.push(() => j);
  }
  console.log(
    "2.4 let loop closures (each gets own binding):",
    letThunks.map((fn) => fn()),
  ); // 0 1 2

  // --- 2.5 Higher-order functions -------------------------------------------------
  const numbers = [1, 2, 3, 4, 5];
  console.log(
    "2.5 map (double):",
    numbers.map((n) => n * 2),
  );
  console.log(
    "2.5 filter (even):",
    numbers.filter((n) => n % 2 === 0),
  );
  console.log(
    "2.5 reduce (sum):",
    numbers.reduce((s, n) => s + n, 0),
  );
  console.log(
    "2.5 find (>3):",
    numbers.find((n) => n > 3),
  );
  console.log(
    "2.5 some (>4):",
    numbers.some((n) => n > 4),
  );
  console.log(
    "2.5 every (>0):",
    numbers.every((n) => n > 0),
  );

  // Exercise solution: once(fn) — runs fn a single time, caches the result
  function once(fn) {
    let called = false;
    let result;
    return (...args) => {
      if (!called) {
        result = fn(...args);
        called = true;
      }
      return result;
    };
  }
  const initOnce = once((x) => {
    console.log("2.5 once(): actually initializing with", x);
    return x * 2;
  });
  console.log("2.5 once() call 1:", initOnce(5));
  console.log("2.5 once() call 2 (fn body does NOT re-run):", initOnce(999));
}

// ============================================================================
// MODULE 3 — OBJECTS & ARRAYS
// ============================================================================
function module3_objectsAndArrays() {
  section("MODULE 3: OBJECTS & ARRAYS");

  // --- 3.1 Object basics -----------------------------------------------------
  const person = {
    name: "Ada",
    age: 30,
    greet() {
      return `Hi, I'm ${this.name}`;
    },
  };
  console.log(
    "3.1 dot access:",
    person.name,
    "| bracket access:",
    person["age"],
  );
  const { name, age } = person; // destructuring
  console.log("3.1 destructured:", name, age);
  const updated = { ...person, age: 31 }; // spread — shallow copy + override
  console.log(
    "3.1 spread override:",
    updated.age,
    "| original untouched:",
    person.age,
  );

  const dynamicKey = "score";
  const computed = { [dynamicKey]: 100 };
  console.log("3.1 computed property name:", computed);

  // --- 3.2 Object utility methods ---------------------------------------------
  console.log("3.2 Object.keys:", Object.keys(person));
  console.log(
    "3.2 Object.values (functions included):",
    Object.values(person).map(String),
  );
  console.log("3.2 Object.entries:", Object.entries({ a: 1, b: 2 }));
  const frozen = Object.freeze({ locked: true });
  try {
    frozen.locked = false; // in strict mode this throws; in non-strict it fails silently
  } catch (err) {
    console.log(
      "3.2 Object.freeze blocks mutation, strict mode throws:",
      err.message,
    );
  }
  console.log("3.2 value is still:", frozen.locked);

  // --- 3.3 Arrays deep dive -----------------------------------------------------
  const arr = [3, 1, 4, 1, 5];
  console.log(
    "3.3 slice(1,3) non-mutating:",
    arr.slice(1, 3),
    "| original still:",
    arr,
  );
  const sorted = [...arr].sort((a, b) => a - b); // copy first to avoid mutating original
  console.log("3.3 sorted copy:", sorted, "| original unchanged:", arr);
  console.log(
    "3.3 flat():",
    [
      [1, 2],
      [3, [4, 5]],
    ].flat(),
  );
  console.log(
    "3.3 flat(2):",
    [
      [1, 2],
      [3, [4, 5]],
    ].flat(2),
  );
  console.log(
    "3.3 Array.from with mapper:",
    Array.from({ length: 5 }, (_, i) => i * 2),
  );

  // --- 3.4 Destructuring & spread in depth --------------------------------------
  const [first, second, ...rest] = [1, 2, 3, 4, 5];
  console.log("3.4 first/second/rest:", first, second, rest);

  function printCoords({ x, y = 0 }) {
    return `(${x}, ${y})`;
  }
  console.log("3.4 printCoords:", printCoords({ x: 5 }));

  let a = 1,
    b = 2;
  [a, b] = [b, a]; // swap without a temp variable
  console.log("3.4 swapped a,b:", a, b);

  // Exercise solution: groupBy(array, keyFn)
  function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      (groups[key] ??= []).push(item);
      return groups;
    }, {});
  }
  const people = [
    { name: "Ada", team: "eng" },
    { name: "Grace", team: "eng" },
    { name: "Linus", team: "design" },
  ];
  console.log(
    "3.4 groupBy(team):",
    groupBy(people, (p) => p.team),
  );
}

// ============================================================================
// MODULE 4 — this, PROTOTYPES & CLASSES
// ============================================================================
function module4_thisPrototypesClasses() {
  section("MODULE 4: this, PROTOTYPES & CLASSES");

  // --- 4.1 `this` depends on the call site, not the definition site -----------
  const obj = {
    name: "Ada",
    regularFn: function () {
      return this.name;
    },
    arrowFn: () => {
      return this?.name;
    }, // inherits `this` from module scope, not obj
  };
  console.log("4.1 obj.regularFn() ->", obj.regularFn()); // "Ada"
  console.log("4.1 obj.arrowFn()    ->", obj.arrowFn()); // undefined

  const detached = obj.regularFn;
  try {
    detached.call(undefined); // in strict mode `this` stays undefined, so this.name throws
  } catch (err) {
    console.log("4.1 detached() loses this, strict mode throws:", err.message);
  }

  const bound = obj.regularFn.bind(obj); // permanently locks `this`
  console.log("4.1 bound() ->", bound());
  console.log("4.1 .call(obj) ->", obj.regularFn.call(obj));
  console.log("4.1 .apply(obj) ->", obj.regularFn.apply(obj));

  // --- 4.2 Prototypes -------------------------------------------------------------
  const animal = {
    speak() {
      return `${this.name} makes a sound`;
    },
  };
  const dog = Object.create(animal); // dog's prototype is `animal`
  dog.name = "Rex";
  console.log("4.2 dog.speak() (inherited):", dog.speak());
  console.log("4.2 dog.hasOwnProperty('name') ->", dog.hasOwnProperty("name")); // true
  console.log(
    "4.2 dog.hasOwnProperty('speak') ->",
    dog.hasOwnProperty("speak"),
  ); // false, it's inherited

  // --- 4.3 Classes -------------------------------------------------------------------
  class Animal {
    #secret = "hidden"; // private field, not accessible outside the class
    static count = 0;
    constructor(name) {
      this.name = name;
      Animal.count++;
    }
    speak() {
      return `${this.name} makes a sound`;
    }
    revealSecret() {
      return this.#secret;
    }
    static describe() {
      return `${Animal.count} animals created`;
    }
  }
  class Dog extends Animal {
    speak() {
      return `${super.speak()}, specifically a bark`;
    }
  }
  const rex = new Dog("Rex");
  const bella = new Dog("Bella");
  console.log("4.3 rex.speak():", rex.speak());
  console.log("4.3 rex.revealSecret():", rex.revealSecret());
  console.log("4.3 Animal.describe():", Animal.describe()); // 2 animals created

  // Exercise solution: constructor-function version, no `class` syntax
  function AnimalFn(name) {
    this.name = name;
  }
  AnimalFn.prototype.speak = function () {
    return `${this.name} makes a sound`;
  };
  function DogFn(name) {
    AnimalFn.call(this, name);
  }
  DogFn.prototype = Object.create(AnimalFn.prototype);
  DogFn.prototype.constructor = DogFn;
  const oldStyleDog = new DogFn("Fido");
  console.log("4.3 constructor-function inheritance:", oldStyleDog.speak());
}

// ============================================================================
// MODULE 5 — ASYNCHRONOUS JAVASCRIPT: event loop, callbacks, promises, async/await
// ============================================================================
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function module5a_eventLoopOrdering() {
  section("MODULE 5a: EVENT LOOP ORDERING (sync > microtasks > macrotasks)");
  console.log("5a step 1 (sync)");
  setTimeout(() => console.log("5a step 4 (macrotask - setTimeout)"), 0);
  Promise.resolve().then(() =>
    console.log("5a step 3 (microtask - promise.then)"),
  );
  console.log("5a step 2 (sync)");
  // Expected order: 1, 2, 3, 4 — sync code always finishes first, then all
  // microtasks drain, then the event loop picks up macrotasks like setTimeout.
}

function module5b_callbacks() {
  section("MODULE 5b: CALLBACKS (the old way)");
  function fetchDataCb(callback) {
    setTimeout(() => callback(null, { id: 1 }), 10);
  }
  fetchDataCb((err, data) => {
    if (err) return console.error("5b error:", err);
    console.log("5b callback result:", data);
  });
}

async function module5c_promisesAndAsyncAwait() {
  section("MODULE 5c: PROMISES & ASYNC/AWAIT");

  function fetchData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) resolve({ id: 1 });
        else reject(new Error("failed"));
      }, 10);
    });
  }

  // .then/.catch/.finally chaining
  await fetchData()
    .then((data) => console.log("5c .then result:", data))
    .catch((err) => console.error("5c .catch error:", err))
    .finally(() => console.log("5c .finally ran"));

  // Promise.all / allSettled / race
  const allResults = await Promise.all([delay(5, "a"), delay(5, "b")]);
  console.log("5c Promise.all:", allResults);

  const settled = await Promise.allSettled([
    delay(5, "ok"),
    Promise.reject(new Error("nope")),
  ]);
  console.log(
    "5c Promise.allSettled:",
    settled.map((r) => r.status),
  );

  const winner = await Promise.race([delay(20, "slow"), delay(5, "fast")]);
  console.log("5c Promise.race winner:", winner);

  // async/await with try/catch
  async function getData() {
    try {
      const data = await fetchData();
      return data.id;
    } catch (err) {
      console.error("5c getData failed:", err.message);
    }
  }
  console.log("5c await getData():", await getData());

  // Sequential (slow) vs parallel (fast) awaiting
  const seqStart = Date.now();
  await delay(15);
  await delay(15);
  console.log("5c sequential awaits took ~", Date.now() - seqStart, "ms");

  const parStart = Date.now();
  await Promise.all([delay(15), delay(15)]);
  console.log(
    "5c parallel awaits took ~",
    Date.now() - parStart,
    "ms (should be about half)",
  );
}

// ============================================================================
// MODULE 6 — ITERATORS & GENERATORS
// ============================================================================
function module6_iteratorsAndGenerators() {
  section("MODULE 6: ITERATORS & GENERATORS");

  // --- 6.1 Custom iterable via Symbol.iterator ---------------------------------
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
  console.log("6.1 spread over custom iterable:", [...custom]);
  for (const val of custom) console.log("6.1 for...of value:", val);

  // --- 6.2 Generators ------------------------------------------------------------
  function* idGenerator() {
    let id = 1;
    while (id <= 5) {
      // bounded here so the demo terminates
      yield id++;
    }
  }
  console.log("6.2 generator values:", [...idGenerator()]);

  // Exercise solution: range(start, end, step) generator
  function* range(start, end, step = 1) {
    for (let n = start; n < end; n += step) yield n;
  }
  console.log("6.2 range(0, 10, 2):", [...range(0, 10, 2)]);

  // Exercise solution: lazy take(iterable, n)
  function* take(iterable, n) {
    let i = 0;
    for (const value of iterable) {
      if (i++ >= n) return;
      yield value;
    }
  }
  function* infiniteNumbers() {
    let n = 0;
    while (true) yield n++;
  }
  console.log("6.2 take(infiniteNumbers(), 5):", [
    ...take(infiniteNumbers(), 5),
  ]);
}

// ============================================================================
// MODULE 7 — MODULES (notes — see explanation below, can't run import/export
// inside a single plain script file without splitting files or ESM setup)
// ============================================================================
function module7_modulesNote() {
  section("MODULE 7: MODULES (reference — see note)");
  console.log(`
  ES Modules use import/export across separate files, e.g.:

    // math.js
    export const PI = 3.14159;
    export function square(x) { return x * x; }
    export default function add(a, b) { return a + b; }

    // main.js
    import add, { PI, square } from "./math.js";

  This can't be demonstrated inside one script run with plain "node file.js",
  because that requires either multiple files or "type": "module" in
  package.json. Named exports: many per file. Default export: one per file.
  Imports are live, read-only bindings, not copies of the value.
  `);
}

// ============================================================================
// MODULE 8 — ERROR HANDLING
// ============================================================================
function module8_errorHandling() {
  section("MODULE 8: ERROR HANDLING");

  try {
    JSON.parse("not valid json");
  } catch (error) {
    console.log("8 caught JSON.parse error:", error.message);
  } finally {
    console.log("8 finally always runs");
  }

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
      console.log(
        `8 custom error caught, invalid field: ${err.field} (${err.message})`,
      );
    } else {
      throw err;
    }
  }
}

// ============================================================================
// MODULE 9 — MODERN JAVASCRIPT (ES6 → ES2023) QUICK-REFERENCE
// ============================================================================
async function module9_modernFeatures() {
  section("MODULE 9: MODERN JAVASCRIPT FEATURES");

  const name = "Ada";
  console.log("9 template literal:", `Hello, ${name}! 2 + 2 = ${2 + 2}`);

  const userObj = { address: null };
  console.log(
    "9 optional chaining + nullish coalescing:",
    userObj?.address?.city ?? "Unknown",
  );

  const book = {};
  const { title: bookTitle = "Untitled" } = book;
  console.log("9 destructure with rename + default:", bookTitle);

  console.log("9 Array.at(-1):", [1, 2, 3].at(-1));
  console.log("9 Object.hasOwn:", Object.hasOwn({ key: 1 }, "key"));

  let cnt = null;
  cnt ??= 0; // logical nullish assignment
  console.log("9 logical nullish assignment cnt ??= 0 ->", cnt);
  let flag = true;
  flag &&= false;
  console.log("9 logical AND assignment flag &&= false ->", flag);

  console.log("9 numeric separator 1_000_000 ->", 1_000_000);

  const anyResult = await Promise.any([delay(20, "slow"), delay(5, "fast")]);
  console.log("9 Promise.any winner:", anyResult);

  const original = { nested: { value: 1 }, list: [1, 2, 3] };
  const cloned = structuredClone(original);
  cloned.nested.value = 99;
  console.log(
    "9 structuredClone is a real deep copy, original untouched:",
    original.nested.value,
  );
}

// ============================================================================
// MODULE 10 — FUNCTIONAL PROGRAMMING PATTERNS
// ============================================================================
function module10_functionalPatterns() {
  section("MODULE 10: FUNCTIONAL PROGRAMMING PATTERNS");

  // Pure vs impure
  const addPure = (a, b) => a + b;
  let total = 0;
  const addImpure = (n) => {
    total += n;
    return total;
  };
  console.log("10 pure addPure(2,3):", addPure(2, 3));
  console.log(
    "10 impure addImpure(5) then (5) again:",
    addImpure(5),
    addImpure(5),
  );

  // Immutability
  const addItem = (arr, item) => [...arr, item];
  const base = [1, 2];
  console.log(
    "10 immutable addItem:",
    addItem(base, 3),
    "| original untouched:",
    base,
  );

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
  console.log("10 pipe(double, increment)(5):", pipe(double, increment)(5)); // 11
  console.log(
    "10 compose(double, increment)(5):",
    compose(double, increment)(5),
  ); // 12

  // Currying
  const curriedAdd = (a) => (b) => (c) => a + b + c;
  console.log("10 curriedAdd(1)(2)(3):", curriedAdd(1)(2)(3));

  // Memoization
  function memoize(fn) {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        console.log("10 memoize cache hit for", key);
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }
  const slowSquare = memoize((n) => n * n);
  console.log("10 slowSquare(4):", slowSquare(4));
  console.log("10 slowSquare(4) again (cached):", slowSquare(4));
}

// ============================================================================
// MODULE 11 — DESIGN PATTERNS IN JS
// ============================================================================
function module11_designPatterns() {
  section("MODULE 11: DESIGN PATTERNS");

  // Module pattern via closure (pre-ES-module technique)
  const Counter = (function () {
    let count = 0;
    return { increment: () => ++count, get: () => count };
  })();
  Counter.increment();
  Counter.increment();
  console.log("11 module pattern Counter.get():", Counter.get());

  // Singleton
  class Database {
    static #instance;
    constructor() {
      this.connectedAt = Date.now();
    }
    static getInstance() {
      if (!Database.#instance) Database.#instance = new Database();
      return Database.#instance;
    }
  }
  console.log(
    "11 singleton same instance:",
    Database.getInstance() === Database.getInstance(),
  );

  // Observer pattern
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
  emitter.on("greet", (n) => console.log(`11 observer heard greet: Hi ${n}`));
  emitter.emit("greet", "Ada");

  // Factory pattern
  function createUser(type) {
    return type === "admin"
      ? { role: "admin", permissions: ["all"] }
      : { role: "user", permissions: ["read"] };
  }
  console.log("11 factory admin:", createUser("admin"));
  console.log("11 factory default:", createUser("guest"));
}

// ============================================================================
// MODULE 12 — PERFORMANCE & MEMORY
// ============================================================================
function module12_performanceAndMemory() {
  section("MODULE 12: PERFORMANCE & MEMORY");

  // Map/Set vs plain object/array for lookups
  const seen = new Set();
  seen.add(1);
  console.log("12 Set.has(1) O(1) lookup:", seen.has(1));

  const cache = new Map();
  const objKey = { id: 1 };
  cache.set(objKey, "value"); // object keys work directly in Map, unlike plain {}
  console.log("12 Map with object key:", cache.get(objKey));

  // Quick, informal benchmark: array includes() vs Set.has() for larger data
  const size = 100000;
  const bigArray = Array.from({ length: size }, (_, i) => i);
  const bigSet = new Set(bigArray);
  const target = size - 1;

  const t1 = performance.now();
  bigArray.includes(target);
  const arrTime = performance.now() - t1;

  const t2 = performance.now();
  bigSet.has(target);
  const setTime = performance.now() - t2;

  console.log(
    `12 array.includes(): ${arrTime.toFixed(4)}ms  |  set.has(): ${setTime.toFixed(4)}ms`,
  );
  console.log(
    "12 note: Set lookup is O(1); array.includes() is O(n) — the gap grows with size.",
  );
  console.log(
    "12 reminder: profile with DevTools/--prof before optimizing anything in production.",
  );
}

// ============================================================================
// MODULE 13 — TESTING (reference pattern — shown, not executed, since it
// needs a test runner like Jest/Vitest installed)
// ============================================================================
function module13_testingNote() {
  section("MODULE 13: TESTING (reference — see note)");
  console.log(`
  With a real test runner (Jest, Vitest, etc.) installed, tests look like:

    // sum.js
    export function sum(a, b) { return a + b; }

    // sum.test.js
    import { sum } from "./sum.js";
    test("adds two numbers", () => { expect(sum(2, 3)).toBe(5); });
    test("handles negatives", () => { expect(sum(-1, -1)).toBe(-2); });

  Good tests: test one behavior each, don't share mutable state between
  tests, and avoid real timers/network/randomness — mock those instead.
  `);

  // We CAN write a tiny hand-rolled assertion helper to sanity-check logic
  // right here without any dependency, which is a useful trick on its own:
  function assertEqual(actual, expected, label) {
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(
      `13 [${pass ? "PASS" : "FAIL"}] ${label}: got ${JSON.stringify(actual)}`,
    );
  }
  const sum = (a, b) => a + b;
  assertEqual(sum(2, 3), 5, "sum(2,3) === 5");
  assertEqual(sum(-1, -1), -2, "sum(-1,-1) === -2");
}

// ============================================================================
// MODULE 14 — WHERE TO GO NEXT
// ============================================================================
function module14_nextSteps() {
  section("MODULE 14: WHERE TO GO NEXT");
  console.log(`
  1. TypeScript — static typing on top of everything above.
  2. A framework — React, Vue, or Svelte, to apply this to real UI work.
  3. Node.js backend fundamentals — Express/Fastify, databases, REST/GraphQL.
  4. Browser APIs — DOM, Fetch, Web Storage, Web Workers, Service Workers.
  5. Build tooling — Vite, esbuild, webpack.
  6. Read real open-source source code end to end.

  Best next move: build something real that touches async requests, state,
  and error handling all at once — a small CLI tool or full-stack app.
  `);
}

// ============================================================================
// RUN EVERYTHING IN ORDER
// ============================================================================
async function runAll() {
  module1_foundations();
  module2_functions();
  module3_objectsAndArrays();
  module4_thisPrototypesClasses();

  module5a_eventLoopOrdering();
  module5b_callbacks();
  await module5c_promisesAndAsyncAwait();

  module6_iteratorsAndGenerators();
  module7_modulesNote();
  module8_errorHandling();
  await module9_modernFeatures();
  module10_functionalPatterns();
  module11_designPatterns();
  module12_performanceAndMemory();
  module13_testingNote();
  module14_nextSteps();

  section(
    "DONE — run `node javascript_master_class.js` again anytime, or comment out\nmodules above to focus on one at a time.",
  );
}

runAll();
