import dotenv from "dotenv";

// This file's only job is to be the FIRST thing server.js imports.
//
// Why this needs to exist: ES module imports are hoisted and fully
// evaluated before any of the importing file's own top-level statements
// run - including statements written textually *above* the import. So
// `dotenv.config()` called in server.js, even on line 1, would still run
// *after* `import app from './app.js'` finishes evaluating - and app.js
// (transitively, via cloudinary.js and auth.controller.js too) reads
// process.env values at its own module top level. Those reads would see
// undefined, silently.
//
// Importing this module first sidesteps the problem: import-vs-import
// ordering (unlike import-vs-non-import) *is* sequential, so as long as
// this is the first import in server.js, dotenv.config() completes
// before anything else gets a chance to import app.js.
dotenv.config();
