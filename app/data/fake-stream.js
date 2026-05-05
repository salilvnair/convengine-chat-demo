/**
 * fake-stream.js
 *
 * Mock VERBOSE event sequences for the demo SSE stream.
 * Each sequence is fired by the message route after a user sends a message,
 * simulating the real ConvEngine VERBOSE step events.
 *
 * Format: [{ text: string, delay: number (ms before this event fires) }]
 */

export const VERBOSE_SEQUENCES = [
  [
    { text: '🔍 Parsing your intent…',        delay: 150 },
    { text: '🧠 Matching dialogue act…',       delay: 550 },
    { text: '⚙️  Running ConvEngine step…',    delay: 650 },
    { text: '✍️  Generating response…',         delay: 500 },
  ],
  [
    { text: '📡 Routing to ConvEngine…',       delay: 120 },
    { text: '🧩 Evaluating rule set…',          delay: 500 },
    { text: '🤖 LLM composing answer…',         delay: 700 },
    { text: '📦 Packaging payload…',            delay: 400 },
  ],
  [
    { text: '🔎 Searching knowledge base…',    delay: 200 },
    { text: '📋 Selecting relevant context…',  delay: 600 },
    { text: '🛠️  Applying post-processing…',   delay: 500 },
    { text: '✅  Finalising response…',          delay: 350 },
  ],
  [
    { text: '💬 Received user input…',         delay: 100 },
    { text: '🎯 Intent classified…',            delay: 480 },
    { text: '📊 Fetching relevant data…',       delay: 620 },
    { text: '🚀 Sending reply…',                delay: 400 },
  ],
];
