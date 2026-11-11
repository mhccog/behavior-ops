# Read & Connect: a field guide based on Chase Hughes

**Live:** https://mhccog.github.io/behavior-ops/

This is a mobile-first pocket app for **profiling someone, reading their body language and talking to them their way**. It's built as a study aid for Chase Hughes' *The Behavior Ops Manual* (2023).

- **Profile:** tap what you notice: what they talk about, how they choose, what they want, their words and their body. A live card builds their **need**, **decision style**, **value**, **sensory preference** and **comfort/stress**. It then gives you lines to say, things to avoid, how to frame a request, and what their body is telling you.
- **Body:** a searchable cue library sorted by body region, with a stress level and page references for each cue.
  Most cues (69 of 90) have a **▶ Show me in 3D** button. It opens an animated, realistic 3D person (an open-source Microsoft Rocketbox model, MIT licence) who starts at a neutral baseline, acts out the cue, holds it and goes back. You can turn and zoom it, replay it, slow it down, and step to the next cue. The "Voice & words" cues are about speech, so they have no figure. Four others (tossing things, moving furniture, the hard swallow, buttoning a jacket) have no figure either because they don't come across well in 3D.

  **Real example**: 28 cues also show one or two openly licensed photos of real people making the gesture (from Wikimedia Commons, plus one each from StockSnap and rawpixel). A **3D | Photo** switch in the viewer moves between them, and you can swipe between photos. Cues with photos but no 3D figure still open the viewer in photo mode. The photos show what a gesture looks like, not what that person was thinking. Each photo has a credit line, and all credits are in [CREDITS.md](CREDITS.md).
- **Talk:** step-by-step playbooks for rapport, opening up, persuading, calming someone, handling objections, getting the truth and handling a challenge. There are also cards for each need, decision style and value, and the conflict "animals".
- **✦ Ask:** a chat-style search over 422 short entries plus a 73-term glossary, drawn only from Chase Hughes' own work: *The Behavior Ops Manual* (with page refs) and his public videos, NCI site and podcast appearances (with links and timestamps). It runs fully in your browser (`ask/kb.js`, `ask/engine.js`, `ask/ui.js`), with no AI service, server or API key. A BM25 keyword engine with synonyms, spelling tolerance and follow-up context picks the best entry and says so when it isn't sure. Answers have source pills, "Go deeper", follow-up chips, and links to the matching Body cue or Talk playbook. Chat history stays in localStorage (`bo.ask.v1`) and has a Clear button. There's a mic (Web Speech, where the browser supports it) and read-aloud.
- **▶︎ Watch:** real-life profiling examples in two separate sections. **Chase Hughes** has 23 videos: 22 *Behavior Panel* episodes where he analyses alongside Scott Rouse, Greg Hartley and Mark Bowden, plus one TV clip from his channel. **Other analysts** has 5 videos (Joe Navarro, Mark Bowden, Scott Rouse), clearly marked as not Hughes. Each card has an own-words summary, who is shown, concept tags and timestamped cue moments. Tapping a moment plays from that point, and each moment links to the matching Body cue and Ask entry. You can filter by concept or by cue. Videos play through YouTube's privacy-enhanced embed (youtube-nocookie.com). Only a thumbnail loads until you press play, and nothing is downloaded or re-hosted. Timestamps were checked against each video's captions. Cues are indicators, not proof.
- **People:** saved profiles live in your browser's localStorage only, with export and import.

Installable as a PWA and works offline.

## How the 3D figures work
- `figure/cues3d.js`: one entry per cue (pose, camera, highlighted body part, timing). It is small and loads with the page so the site knows which cues have a demo.
- `figure/viewer.js`: the scene, camera, timeline and an invisible skeleton that the poses are written for.
- `figure/person.js`: loads `figure/model/person.glb` (the Rocketbox model) and makes it copy that skeleton, including face expressions.
- These files, the model and three.js only download the first time someone opens a figure. Credits and licences: [CREDITS.md](CREDITS.md).
- See [CREDITS.md](CREDITS.md) for licences.

## Credit & copyright
All frameworks belong to **Chase Hughes**. Everything here is a paraphrased summary with page references (p.), so you can go back to the book. No text from the book is reproduced. Please buy the book. The Ask answers are written in our own words and kept short. They cite book pages or link to Hughes' videos and podcasts at a timestamp. No transcripts or long quotes are stored.

## Ethics
This guide is for understanding people and building genuine rapport. It is not for manipulation. The book's coercive material (interrogation and "enhanced" tactics, false memory, covert hypnosis, recruitment formulas) has no how-to anywhere on the site. The Ask tab covers these topics only defensively: what each one is and how to recognise it being used on you. No single cue proves deception. Always baseline first, look for clusters, and consider context.
