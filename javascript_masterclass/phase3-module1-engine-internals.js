/**
 * ============================================================================
 * PHASE 3 · MODULE 1 — JAVASCRIPT ENGINE INTERNALS (V8)
 * ============================================================================
 * Run with:  node phase3-module1-engine-internals.js
 *
 * LEARNING OBJECTIVES
 * --------------------
 * By the end of this file you will be able to:
 *  - Describe the V8 pipeline: Parser -> AST -> Ignition (bytecode interpreter)
 *    -> TurboFan (optimizing JIT compiler)
 *  - Explain "hidden classes" (a.k.a. Maps/Shapes) and why object shape
 *    consistency matters for performance
 *  - Explain "inline caching" and how it lets V8 skip repeated property
 *    lookups
 *  - Reproduce, with your own benchmark, the real performance gap between
 *    monomorphic and polymorphic/megamorphic function calls
 *  - Know when this knowledge matters in production and when it's a
 *    premature-optimization trap
 * ============================================================================
 */

"use strict";

// ----------------------------------------------------------------------------
// 1. THEORY — read this before running anything
// ----------------------------------------------------------------------------
//
// WHAT HAPPENS TO YOUR CODE, STEP BY STEP:
//
//   Source code
//        |
//        v
//   [Parser] --------> Abstract Syntax Tree (AST)
//        |
//        v
//   [Ignition] -------> Bytecode (a fast-to-generate, compact intermediate
//        |               representation). Ignition INTERPRETS this bytecode
//        |               immediately — this is why V8 can start running your
//        |               code almost instantly, without waiting to fully
//        |               optimize it first.
//        v
//   [Profiling] ------> While Ignition runs your bytecode, V8 collects type
//        |               feedback: "what shapes of objects have I actually
//        |               seen passed into this function so far?"
//        v
//   [TurboFan] -------> If a function is "hot" (called often) AND its type
//                        feedback is stable (same shapes every time), TurboFan
//                        compiles it down to highly optimized machine code.
//                        If your assumptions get violated later (a new shape
//                        shows up), V8 "deoptimizes" back to bytecode.
//
// WHY THIS DESIGN EXISTS:
//   Pure interpretation is slow. Pure ahead-of-time compilation (like C) can't
//   work for JS because types aren't known until runtime and can change.
//   V8's answer: start fast (interpret), watch what actually happens
//   (profile), then specialize aggressively once you have evidence (JIT).
//   This "optimistic compilation with deoptimization as a safety net" pattern
//   is the core idea behind almost every modern dynamic-language engine
//   (V8, SpiderMonkey, JVM's HotSpot, etc.) — not just JS-specific trivia.

console.log("=== SECTION 1: Engine Pipeline (conceptual — no code to run) ===");
console.log(
  "Parser -> AST -> Ignition (bytecode) -> profiling -> TurboFan (JIT)\n",
);

// ----------------------------------------------------------------------------
// 2. HIDDEN CLASSES ("Maps" / "Shapes") — the real mechanism, demonstrated
// ----------------------------------------------------------------------------
//
// V8 does NOT store objects as generic hash maps of string -> value the way
// you might assume. That would make every property access a hash lookup —
// too slow. Instead, V8 assigns every object a "hidden class" (internally
// called a Map, unrelated to the JS `Map` type) that describes its SHAPE:
// which properties it has, in which order, and at which memory offsets.
//
// Objects that are built the same way, in the same order, SHARE a hidden
// class. This lets V8 treat property access almost like accessing a fixed
// struct field in C — an offset lookup, not a dictionary lookup.
//
// THE RULE THAT MATTERS IN PRACTICE:
//   Adding properties to an object in a different ORDER creates a DIFFERENT
//   hidden class, even if the final property set is identical.

function demonstrateHiddenClasses() {
  console.log("=== SECTION 2: Hidden Classes ===");

  // These two objects end up with the SAME hidden class,
  // because x then y is added in the same order both times.
  function makePointGood(x, y) {
    const p = {};
    p.x = x; // property added first  -> same transition path
    p.y = y; // property added second -> same transition path
    return p;
  }

  // This one creates a DIFFERENT hidden class from makePointGood's objects,
  // because the properties are added in the opposite order.
  function makePointBad(x, y) {
    const p = {};
    p.y = y; // y added first this time
    p.x = x; // x added second
    return p;
  }

  const a = makePointGood(1, 2);
  const b = makePointGood(3, 4);
  const c = makePointBad(5, 6);

  console.log("a and b were built identically -> same hidden class internally");
  console.log(
    "c was built with properties in a different order -> different hidden class",
  );
  console.log({ a, b, c });
  console.log(
    'Practical takeaway: always initialize objects of the "same kind" the ' +
      "same way (same constructor, same property order) so V8 can reuse one " +
      "hidden class instead of creating many.\n",
  );
}

// ----------------------------------------------------------------------------
// 3. INLINE CACHING — why calling the same function with the same SHAPE
//    of argument is fast, and why mixing shapes is slow
// ----------------------------------------------------------------------------
//
// When a function repeatedly accesses `obj.x` and `obj` always has the same
// hidden class, V8's inline cache "remembers" exactly where `x` lives
// (the offset) and skips the lookup entirely on future calls. This is called
// being MONOMORPHIC (one shape seen at this call site).
//
// If the call site sees 2-4 different shapes, it becomes POLYMORPHIC
// (still fairly fast — V8 keeps a small list of known shapes).
//
// If it sees many different shapes, it becomes MEGAMORPHIC and V8 gives up
// on the inline cache, falling back to a much slower generic lookup.

function demonstrateInlineCachingBenchmark() {
  console.log("=== SECTION 3: Monomorphic vs Megamorphic — live benchmark ===");

  const ITERATIONS = 5_000_000;

  // A function whose call site will ALWAYS receive the same object shape.
  function getX(point) {
    return point.x; // this property access is the "call site" being profiled
  }

  // --- Monomorphic case: every object has the identical shape { x, y } ---
  const monoPoints = [];
  for (let i = 0; i < ITERATIONS; i++) {
    monoPoints.push({ x: i, y: i }); // same construction order every time
  }

  // --- Megamorphic case: shapes vary — sometimes {x,y}, sometimes {y,x},
  //     sometimes {x,y,z}, sometimes a class instance ---
  class PointClass {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  const polyPoints = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const variant = i % 4;
    if (variant === 0) polyPoints.push({ x: i, y: i });
    else if (variant === 1)
      polyPoints.push({ y: i, x: i }); // reordered
    else if (variant === 2)
      polyPoints.push({ x: i, y: i, z: i }); // extra prop
    else polyPoints.push(new PointClass(i, i)); // different constructor
  }

  // Warm up BOTH call sites first so the JIT has already made its
  // monomorphic/polymorphic classification before we start the actual timed
  // run. Without this, the first pass over each array partly measures
  // "cold start" cost rather than steady-state IC behavior.
  function timeRun(arr) {
    let sum = 0;
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < arr.length; i++) sum += getX(arr[i]);
    const t1 = process.hrtime.bigint();
    return { sum, ms: Number(t1 - t0) / 1e6 };
  }

  // Note: getX is a SEPARATE function object for each warm-up/measurement
  // pair below so that warming up on one dataset doesn't pollute the other
  // call site's IC state — each `getX` here is its own call site.
  function makeGetX() {
    return function getX(point) {
      return point.x;
    };
  }

  const getXForMono = makeGetX();
  const getXForMega = makeGetX();

  function timeRunWith(fn, arr) {
    let sum = 0;
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < arr.length; i++) sum += fn(arr[i]);
    const t1 = process.hrtime.bigint();
    return { sum, ms: Number(t1 - t0) / 1e6 };
  }

  timeRunWith(getXForMono, monoPoints); // warm-up pass, discarded
  timeRunWith(getXForMega, polyPoints); // warm-up pass, discarded

  const mono = timeRunWith(getXForMono, monoPoints); // measured pass
  const mega = timeRunWith(getXForMega, polyPoints); // measured pass

  console.log(
    `Monomorphic access:  ${mono.ms.toFixed(2)} ms  (sum=${mono.sum})`,
  );
  console.log(
    `Megamorphic access:  ${mega.ms.toFixed(2)} ms  (sum=${mega.sum})`,
  );

  const ratio = mega.ms / mono.ms;
  if (ratio > 1.05) {
    console.log(`Megamorphic was ~${ratio.toFixed(2)}x SLOWER on this run.\n`);
  } else if (ratio < 0.95) {
    console.log(
      `Megamorphic was actually ~${(1 / ratio).toFixed(2)}x FASTER on this ` +
        `run. This is a real and important result to sit with: modern V8 has\n` +
        `gotten much better at optimizing megamorphic call sites over the\n` +
        `years, and on a single short run, GC timing and warm-up noise can\n` +
        `dominate the signal. Don't trust one run of any microbenchmark.\n`,
    );
  } else {
    console.log("No significant difference on this run (within noise).\n");
  }
  console.log(
    "NOTE: this benchmark is illustrative, not authoritative. Real profiling " +
      "requires many trials, statistical treatment, and ideally --trace-opt / " +
      "--trace-deopt or a CPU profiler — see Section 10's challenge exercise. " +
      "The MECHANISM (hidden classes, inline caches, deopt) is real and stable " +
      "across V8 versions even when a single wall-clock benchmark is noisy.\n",
  );
}

// ----------------------------------------------------------------------------
// 4. WHEN THIS MATTERS IN PRODUCTION (and when it doesn't)
// ----------------------------------------------------------------------------
//
// WHEN TO CARE:
//  - Hot paths: a function called millions of times per second (a game loop,
//    a data-processing pipeline, a hot request handler under heavy load)
//  - Libraries/frameworks used by thousands of downstream apps, where a small
//    per-call improvement compounds enormously
//
// WHEN NOT TO CARE (most of the time):
//  - Application-level business logic called a handful of times per request
//  - Anywhere readability/maintainability would suffer to chase a
//    microbenchmark win the user will never perceive
//  - This is the textbook definition of premature optimization if applied
//    everywhere by default — profile first, optimize the actual bottleneck
//
// TRADE-OFF: writing "shape-consistent" code (always assign properties in the
// same order, prefer classes/factory functions over ad-hoc object literals
// for anything performance-sensitive) is a small discipline cost. It's worth
// paying in libraries and hot loops; it's not worth obsessing over in a
// one-off admin dashboard's request handler.

// ----------------------------------------------------------------------------
// 5. COMMON MISTAKES
// ----------------------------------------------------------------------------
//  - Assuming ALL objects should be shape-consistent — this is only worth
//    the effort on measured hot paths
//  - Deleting object properties (`delete obj.x`) in hot code — this forces
//    V8 into a slower "dictionary mode" for that object, abandoning hidden
//    classes entirely. Prefer setting to `undefined`/`null` if you must keep
//    a "deleted" semantic and the code is hot.
//  - Adding properties conditionally after creation:
//      const obj = {}; if (cond) obj.extra = 1;
//    This creates two different hidden classes for the "same" object type
//    depending on `cond`. Prefer always initializing every property (even to
//    `undefined`) in the constructor/factory, in the same order.

// ----------------------------------------------------------------------------
// 6. SECURITY CONSIDERATIONS
// ----------------------------------------------------------------------------
//  - Engine internals aren't a typical attack surface directly, BUT
//    megamorphic/deoptimized code paths are sometimes exploited in timing
//    side-channel research (this is how some JS-based Spectre-class attacks
//    were demonstrated). You don't need to defend against this in normal app
//    code — it's relevant mainly if you maintain a JS engine or a sandboxed
//    execution environment (e.g., a serverless platform running untrusted
//    user code).

// ----------------------------------------------------------------------------
// 7. HANDS-ON EXERCISES (uncomment and try in this file)
// ----------------------------------------------------------------------------
// EXERCISE 1: Modify `demonstrateHiddenClasses` to add a THIRD factory
//   function that builds points via `Object.assign({}, {x, y})` and predict
//   (in a comment) whether it shares a hidden class with makePointGood.
//
// EXERCISE 2: In `demonstrateInlineCachingBenchmark`, change ITERATIONS to
//   500_000 and re-run. Does the relative gap (megaMs/monoMs) stay roughly
//   the same, shrink, or grow? Write down your hypothesis before running.
//
// EXERCISE 3: Write a new function `demonstrateDeleteDeopt()` that builds
//   1,000,000 objects, times a loop of property reads, then does the same
//   thing but calls `delete obj.someProp` on each object first. Compare timings.

// ----------------------------------------------------------------------------
// 8. MINI PROJECT
// ----------------------------------------------------------------------------
// Build `benchmarkShapeConsistency(factoryFns, iterations)` — a small
// reusable benchmarking utility that takes an array of object-factory
// functions, builds `iterations` objects with each, times how long it takes
// to read one property off every object via a single shared accessor
// function, and prints a ranked report. This turns Section 3's one-off demo
// into a tool you can reuse to test any future "does object shape matter
// here?" question.

// ----------------------------------------------------------------------------
// 9. INTERVIEW QUESTIONS
// ----------------------------------------------------------------------------
// Junior:
//   - What is the difference between an interpreter and a JIT compiler?
// Mid:
//   - What is a "hidden class" in V8 and why does it exist?
//   - What does "monomorphic" mean in the context of a function call site?
// Senior:
//   - Explain the full V8 pipeline from source to optimized machine code,
//     including what triggers deoptimization and why it's necessary.
//   - Why does adding/deleting properties dynamically hurt performance more
//     than you'd expect from "just one extra property"?
//   - How would you investigate whether a specific hot function in a Node
//     service is failing to get optimized by TurboFan? (Hint: --trace-opt,
//     --trace-deopt flags, or the `v8-profiler` / Chrome DevTools CPU
//     profiler attached to Node via --inspect.)

// ----------------------------------------------------------------------------
// 10. CHALLENGE EXERCISE
// ----------------------------------------------------------------------------
// Using `node --trace-deopt phase3-module1-engine-internals.js`, find a real
// deoptimization event in this file's output (there may or may not be one
// depending on your Node/V8 version — that's part of the exercise: learn to
// read the trace output either way). Explain in a comment what triggered it.

// ----------------------------------------------------------------------------
// RUN EVERYTHING
// ----------------------------------------------------------------------------
demonstrateHiddenClasses();
demonstrateInlineCachingBenchmark();

console.log("=== GLOSSARY ADDITIONS THIS MODULE ===");
console.log(`
- Hidden Class (Map/Shape): internal V8 structure describing an object's
  property layout, enabling fast offset-based property access
- Inline Cache (IC): a cache attached to a property-access call site that
  remembers the last-seen shape(s) to skip repeated lookups
- Monomorphic / Polymorphic / Megamorphic: how many distinct shapes a given
  call site has observed (1 / 2-4 / many)
- Ignition: V8's bytecode interpreter — runs code immediately, no wait for
  optimization
- TurboFan: V8's optimizing JIT compiler — specializes hot, stable-shape code
- Deoptimization: falling back from optimized machine code to bytecode when
  a runtime assumption (e.g., object shape) is violated
`);
