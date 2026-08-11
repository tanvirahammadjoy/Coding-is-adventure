# Phase 2 · Module 1 — Closures & Lexical Scope

## 1. Learning Objectives

By the end of this module you will be able to:

- Explain lexical scoping and predict variable resolution in any nested function without running the code
- Define a closure precisely (not just "a function that remembers stuff") and explain _why_ it happens mechanically
- Read and reason about the scope chain and the internal `[[Environment]]` reference
- Identify and fix the classic loop/closure bug, in both its `var` and async-callback forms
- Use closures deliberately for data privacy, memoization, currying, and module patterns
- Recognize when closures cause memory leaks and how to avoid them
- Answer closure-related interview questions from junior to senior depth

---

## 2. Theory

### 2.1 Scope: the foundation

**Scope** is the region of code where a given variable binding is accessible. JavaScript uses **lexical (static) scoping**: scope is determined by _where functions and blocks are written in the source code_, not by how or from where they're called (that would be dynamic scoping, which languages like older Bash use).

Three scope-creating constructs in modern JS:

- **Global scope** — top level of a script/module
- **Function scope** — created by every `function` (and arrow function)
- **Block scope** — created by `{}` for `let`/`const`/`class` (not for `var` or `function` declarations, which are function-scoped)

```javascript
let x = "global";

function outer() {
  let x = "outer";
  function inner() {
    let x = "inner";
    console.log(x); // 'inner' — resolved lexically, by nesting position in source
  }
  inner();
}
outer();
```

### 2.2 The Scope Chain

When JS looks up a variable, it walks outward through **lexical environments**: current scope → enclosing scope → ... → global scope, stopping at the first match. This chain is fixed at **definition time**, not call time — this is the essence of "lexical."

Internally (per the ECMAScript spec), every function has an internal slot `[[Environment]]` that points to the **Lexical Environment** active at the moment the function was _created_. Every Lexical Environment has an **Environment Record** (where bindings actually live) and a reference to its **outer environment**. This chain of outer references _is_ the scope chain.

### 2.3 What a Closure Actually Is

> A closure is the combination of a function and the lexical environment within which that function was declared, such that the function retains access to variables from that environment even after the outer function has returned.

The critical, non-obvious part: **it's not that JS "remembers a value"** — it retains a **live reference to the binding itself**. This is why closures can be used to build mutable private state, and why the loop-variable bug exists.

```javascript
function makeCounter() {
  let count = 0; // lives in makeCounter's Environment Record
  return function increment() {
    count++; // closes over the *binding* count, not a copy of its value
    return count;
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 — separate environment, separate binding
```

`makeCounter`'s execution context is normally popped off the call stack when it returns. But because `increment` retains `[[Environment]]` pointing at `makeCounter`'s Lexical Environment, the garbage collector can't reclaim `count` — it's still reachable. This is the whole mechanism: **closures keep environments alive via reachability, not magic.**

### 2.4 Why Closures Exist (Design Rationale)

Closures aren't a bolted-on feature — they fall directly out of two design decisions: (1) functions are first-class values that can be returned/passed around, and (2) scoping is lexical. Once you have both, closures are unavoidable — the language _has_ to decide what happens when an inner function outlives its outer function, and "keep the binding alive" is the only choice that doesn't break lexical scoping's basic promise (a variable reference always means the same thing based on where it's written).

### 2.5 The Classic Loop Bug — and why it happens

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs 3, 3, 3 — not 0, 1, 2
```

`var` is function/global-scoped, so there is **one single `i` binding** shared by all three closures. By the time the callbacks run (after the loop finishes, since `setTimeout` is async), `i` is 3 for all of them.

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs 0, 1, 2
```

`let` is block-scoped, and critically, **the spec defines that `for` creates a fresh lexical binding of the loop variable for each iteration**, copying the previous value forward. Each closure captures its own `i`. This isn't a coincidence — it was specifically designed into `let`'s `for`-loop semantics to fix this exact footgun.

### 2.6 Visual: the Scope Chain / Environment Chain

```Bash
Global Lexical Environment
  └─ outer() Lexical Environment (x: 'outer')
       └─ inner() Lexical Environment (x: 'inner')
            [[Environment]] of inner → points here
```

Each arrow is a real, traversable reference the engine follows on identifier lookup — think of it as a linked list terminating at global.

---

## 3. Real-World Examples

**1. Data privacy / module pattern (pre-`class` private fields):**

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // truly private — no external access path
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance: () => balance,
  };
}
const acct = createBankAccount(100);
acct.deposit(50);
console.log(acct.getBalance()); // 150
// no way to read/write `balance` except through the exposed methods
```

**2. Memoization:**

```javascript
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

**3. Event handler factories:**

```javascript
function makeClickLogger(label) {
  return function handleClick(event) {
    console.log(`${label} clicked at`, event.clientX, event.clientY);
  };
}
button.addEventListener("click", makeClickLogger("Submit Button"));
```

**4. Currying / partial application:**

```javascript
const multiply = (a) => (b) => a * b;
const double = multiply(2);
double(5); // 10
```

---

## 4. Best Practices

- Prefer `let`/`const` over `var` — it sidesteps the entire loop-closure bug class by design
- Use closures for genuine encapsulation, not as a habit — if a `class` with a private field (`#field`) reads more clearly for the same job, prefer it in modern codebases
- Keep closed-over state minimal — only capture what you need; capturing large objects "just because they're in scope" keeps them alive unnecessarily
- Name your factory functions and returned functions descriptively (`makeCounter`/`increment`, not `f`/`g`) — closures already add a layer of indirection to reasoning about state
- When a closure captures a mutable value that will be read much later (timers, event listeners), be explicit about _why_ — add a comment if the "gotcha" isn't obvious to a future reader

## 5. Common Mistakes

- The `var` in a loop + async callback bug (above) — still shows up constantly in real codebases with `setTimeout`, `addEventListener` in loops, and array iteration with async callbacks
- Assuming closures copy values — they capture bindings; mutating a closed-over variable later changes what earlier-created closures see, if they share the same environment
- Creating closures inside hot loops/render functions unnecessarily (e.g., defining a new function inside a React component body when it doesn't need fresh closure state each render) — leads to needless re-renders/GC churn
- Forgetting that closures over DOM elements or large data structures in event listeners can prevent garbage collection if the listener is never removed

## 6. Performance Considerations

- Each closure instance carries a reference to its outer environment; creating thousands of closures (e.g., one per row in a large list, each closing over a different large object) has real memory cost — profile before assuming it's free
- V8 optimizes closures well in general, but a function that's _sometimes_ called as a plain function and _sometimes_ used as a closure factory can be harder for the JIT to optimize consistently (deoptimization from polymorphic use) — not a top-priority concern, but relevant at scale
- Avoid recreating identical closures on every call/render when the closure doesn't need to change — hoist it out, or memoize the factory (this is exactly what `useCallback` addresses in React, as one framework-level example)

## 7. Security Considerations

- Closures are one of the only real mechanisms for **true private state** pre-ES2022 private class fields — use them when building anything that must not be tamperable from outside code (e.g., a token store, a rate limiter's internal counters) since object properties can always be reassigned or enumerated by external code, but closed-over variables cannot
- Be careful closing over sensitive data (API keys, tokens) in code that ships to the browser — the closure hides the variable from casual property access, but it is **not** a security boundary against someone reading your shipped JS source; never treat "closure privacy" as equivalent to "not sent to the client"

---

## 8. Hands-On Exercises

1. Predict the output of this snippet before running it, then verify:

   ```javascript
   function outer() {
     let a = 1;
     return function () {
       let b = 2;
       return function () {
         console.log(a, b);
       };
     };
   }
   outer()()();
   ```

2. Fix this buggy loop using three different techniques (`let`, an IIFE, and `.bind`):

   ```javascript
   for (var i = 1; i <= 5; i++) {
     setTimeout(function () {
       console.log("Task " + i);
     }, i * 1000);
   }
   ```

3. Write `once(fn)` — a function that wraps `fn` so it can only ever run one time; subsequent calls return the first call's cached result.
4. Write a `createIdGenerator()` factory that returns a function producing sequential unique IDs (`id1`, `id2`, ...) starting from a configurable prefix.

## 9. Mini Projects

- **Private Counter Library**: build `createCounter({ start, step, min, max })` returning `{ increment, decrement, reset, value }`, with all internal state fully closure-private and bounds-checked.
- **Debounce & Throttle from Scratch**: implement both `debounce(fn, delay)` and `throttle(fn, interval)` using closures to track timers/last-call-time, then wire one of them to a real search input to prevent excessive API calls.
- **Mini Event Emitter**: build a `createEmitter()` with `on`, `off`, `emit`, storing listeners in a closure-private structure (not a public property), supporting multiple listeners per event.

## 10. Interview Questions

**Junior**

- What is a closure? Give a simple example.
- What's the difference between `var`, `let`, and `const` with respect to scope?

**Mid**

- Why does the classic `var` loop + `setTimeout` bug happen, and how do you fix it?
- How would you use a closure to create a private variable in JavaScript?
- What's the difference between lexical scope and dynamic scope?

**Senior**

- Explain, at the spec/engine level, what keeps a closed-over variable alive after its containing function has returned.
- Walk through how you'd detect and fix a memory leak caused by closures retaining references to detached DOM nodes.
- Compare closures vs. ES2022 private class fields (`#field`) for encapsulation — when would you choose one over the other in a production codebase?
- How does `let` in a `for` loop achieve per-iteration bindings under the hood? What would you have to do manually to replicate that with `var`?

## 11. Challenge Exercises

1. Implement a `curry(fn)` utility that works for any function arity, without using a library, supporting partial application in any grouping (`curry(add)(1)(2)(3)` and `curry(add)(1,2)(3)` both work).
2. Build a `lazyChain` utility where each closure-returned step only computes when finally "resolved," similar in spirit to how generators defer execution — no generators allowed, closures only.
3. Diagnose (in writing, no code needed) why the following pattern leaks memory in a long-running Node server, and rewrite it to fix the leak:

   ```javascript
   const cache = [];
   function handleRequest(largePayload) {
     cache.push(() => console.log(largePayload.id));
   }
   ```

---

## 12. Glossary Additions (this module)

- What is a closure? Give a simple example.
- What's the difference between `var`, `let`, and `const` with respect to scope?

**Mid**

- Why does the classic `var` loop + `setTimeout` bug happen, and how do you fix it?
- How would you use a closure to create a private variable in JavaScript?
- What's the difference between lexical scope and dynamic scope?

**Senior**

- Explain, at the spec/engine level, what keeps a closed-over variable alive after its containing function has returned.
- Walk through how you'd detect and fix a memory leak caused by closures retaining references to detached DOM nodes.
- Compare closures vs. ES2022 private class fields (`#field`) for encapsulation — when would you choose one over the other in a production codebase?
- How does `let` in a `for` loop achieve per-iteration bindings under the hood? What would you have to do manually to replicate that with `var`?

## 11. Challenge Exercises

1. Implement a `curry(fn)` utility that works for any function arity, without using a library, supporting partial application in any grouping (`curry(add)(1)(2)(3)` and `curry(add)(1,2)(3)` both work).
2. Build a `lazyChain` utility where each closure-returned step only computes when finally "resolved," similar in spirit to how generators defer execution — no generators allowed, closures only.
3. Diagnose (in writing, no code needed) why the following pattern leaks memory in a long-running Node server, and rewrite it to fix the leak:

   ```javascript
   const cache = [];
   function handleRequest(largePayload) {
     cache.push(() => console.log(largePayload.id));
   }
   ```

---

## 12. Glossary Additions (this module)

- **Lexical scope** — scope determined by source-code position at write time
- **Scope chain** — the ordered sequence of enclosing lexical environments searched during identifier resolution
- **Lexical Environment / Environment Record** — spec-level structures holding variable bindings and a reference to the outer environment
- **Closure** — a function bundled with a live reference to its defining lexical environment
- **IIFE** — Immediately Invoked Function Expression, a historical pattern for creating an isolated scope
