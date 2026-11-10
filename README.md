# Read & Connect: a field guide based on Chase Hughes

**Live:** https://mhccog.github.io/behavior-ops/

This is a mobile-first pocket app for **profiling someone, reading their body language and talking to them their way**. It's built as a study aid for Chase Hughes' *The Behavior Ops Manual* (2023).

- **Profile:** tap what you notice: what they talk about, how they choose, what they want, their words and their body. A live card builds their **need**, **decision style**, **value**, **sensory preference** and **comfort/stress**. It then gives you lines to say, things to avoid, how to frame a request, and what their body is telling you.
- **Body:** a searchable cue library sorted by body region, with a stress level and page references for each cue.
  Most cues (69 of 90) have a **▶ Show me in 3D** button. It opens an animated, realistic 3D person (an open-source Microsoft Rocketbox model, MIT licence) who starts at a neutral baseline, acts out the cue, holds it and goes back. You can turn and zoom it, replay it, slow it down, and step to the next cue. The "Voice & words" cues are about speech, so they have no figure. Four others (tossing things, moving furniture, the hard swallow, buttoning a jacket) have no figure either because they don't come across well in 3D.
- **Talk:** step-by-step playbooks for rapport, opening up, persuading, calming someone, handling objections, getting the truth and handling a challenge. There are also cards for each need, decision style and value, and the conflict "animals".
- **People:** saved profiles live in your browser's localStorage only, with export and import.

Installable as a PWA and works offline.

## How the 3D figures work
- `figure/cues3d.js`: one entry per cue (pose, camera, highlighted body part, timing). It is small and loads with the page so the site knows which cues have a demo.
- `figure/viewer.js`: the scene, camera, timeline and an invisible skeleton that the poses are written for.
- `figure/person.js`: loads `figure/model/person.glb` (the Rocketbox model) and makes it copy that skeleton, including face expressions.
- These files, the model and three.js only download the first time someone opens a figure. Credits and licences: [CREDITS.md](CREDITS.md).
- See [CREDITS.md](CREDITS.md) for licences.

## Credit & copyright
All frameworks belong to **Chase Hughes**. Everything here is a paraphrased summary with page references (p.), so you can go back to the book. No text from the book is reproduced. Please buy the book.

## Ethics
This guide is for understanding people and building genuine rapport. It is not for manipulation. The book's coercive material is deliberately left out: interrogation and "enhanced" tactics, false memory, covert hypnosis and recruitment formulas. No single cue proves deception. Always baseline first, look for clusters, and consider context.
