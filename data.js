// All content summarised in our own words from Chase Hughes, "The Behavior Ops Manual" (2023).
// Page refs (p.) are book page numbers. This is a study aid, not a reproduction of the book.
window.BO = {};

BO.needs = {
  sig: { name:"Significance", emoji:"👑", tier:"Primary", p:"367",
    q:"Do people see me as important and making an impact?",
    signs:["Talks achievements, titles, who they know","Status brands, cars, watches, latest tech","Wants to lead or decide first","Steers talk back to themselves"],
    fear:"Being ignored, made to feel small, ridiculed or left behind.",
    give:"Show them their impact matters. Notice their influence out loud.",
    say:["It's obvious people here look to you when it counts.","You don't strike me as someone who just follows the crowd.","I'd value your take on this before anyone else's.","What you built there is genuinely rare."],
    avoid:["Talking over them or one-upping their story","Treating them as 'just another' client","Public correction"],
    ask:"Frame it as something only someone of their standing would lead or be first to do." },
  app: { name:"Approval", emoji:"🤝", tier:"Primary", p:"368",
    q:"Will people recognise me so I can move forward with confidence?",
    signs:["Self put-downs ('I'm rubbish at this')","Asks permission when they don't need to","Shifts their view if you disagree","Lots of compliments, never complains or sends food back"],
    fear:"Disapproval, dismissal, contempt, being left out.",
    give:"Reassurance and permission. Recognise effort, not just results.",
    say:["Honestly, you're better at this than you give yourself credit for.","That's a completely reasonable thing to want.","You've clearly put real care into this.","There's no wrong answer here — I'd just love your honest view."],
    avoid:["Sarcasm or teasing","Silence after they put themselves down","Pushing them to decide on the spot"],
    ask:"Give explicit permission and make it safe to say yes (and safe to say no)." },
  acc: { name:"Acceptance", emoji:"🫂", tier:"Primary", p:"369",
    q:"Do I belong — and can others see that I do?",
    signs:["Clubs, teams, groups, 'we' and 'us'","Helping/caring roles, volunteering, pets","Team shirts, memberships, community talk","Returns every smile and eyebrow flash"],
    fear:"Gossip, social criticism, not fitting in with their people.",
    give:"Make them feel part of the group — including yours.",
    say:["You'd fit right in with the people I work with.","Everyone I've introduced you to has said the same thing — you're easy to be around.","It's people like you that make a group actually work.","Want me to introduce you to a few people here?"],
    avoid:["Singling them out in front of others","Anything that could embarrass them with their group","'Nobody else does it this way'"],
    ask:"Show who else is already in, and how it keeps them connected to their people." },
  int: { name:"Intelligence", emoji:"🧠", tier:"Secondary", p:"370",
    q:"Do people see me as smart?",
    signs:["Mentions education, books, research, technical detail","Says 'actually…', corrects or explains","Calls others idiots / incompetent","Asks if you know things they know you don't"],
    fear:"Looking stupid, being questioned or called out.",
    give:"Respect their reasoning. Ask them to explain — and be genuinely curious.",
    say:["You clearly think this through more than most people.","I'd love to hear how you'd approach it.","That's a sharper way of looking at it than I'd considered.","I'll be honest, I know next to nothing about this — how does it actually work?"],
    avoid:["Over-simplifying or lecturing them","Catching them out in public","Vague claims with no reasoning"],
    ask:"Give them the logic and let them reach the conclusion themselves." },
  pit: { name:"Pity", emoji:"🌧️", tier:"Secondary", p:"370",
    q:"Does anyone realise how hard I've had it?",
    signs:["Complaints: traffic, weather, health, workload","Bad-luck stories, being treated unfairly","Stressed or hunched look","Reacts strongly to small pains"],
    fear:"Being dismissed, disbelieved, misunderstood.",
    give:"Confirm how tough it's been — then pause so they feel heard.",
    say:["That sounds genuinely exhausting… (pause)","I honestly don't know how you've kept going with all that.","Most people wouldn't have handled half of that.","You've had a lot more on your plate than people realise."],
    avoid:["'Look on the bright side' / 'could be worse'","Rushing to fix it","Topping their story with yours"],
    ask:"Show how this takes something off their plate or makes life easier." },
  str: { name:"Strength / Power", emoji:"🦁", tier:"Secondary", p:"371",
    q:"Do people see me as strong and powerful?",
    signs:["Loud, big posture, crushing handshake","Stories of toughness or getting one over on people","Status and pecking order matter to them","Rude to staff, bristles when challenged"],
    fear:"Being disrespected, 'punked', challenged or ignored.",
    give:"Let them feel in control. Calm respect, never a contest.",
    say:["You're obviously the one who gets things done here.","Your call — how would you want to play it?","Most people would have backed down there. You didn't.","I'd rather have you on my side of this."],
    avoid:["Dominance contests or 'putting them in their place'","Embarrassing them in front of others","Ultimatums"],
    ask:"Give them the decision and options, so choosing feels like their power move." }
};

BO.decisions = {
  dev:{ name:"Deviance", emoji:"🎸", q:"Will this help me stand out or break the norm?", signs:["Deliberately unconventional look","Anti-mainstream talk","Proud to do it differently"], frame:"Position it as not for everyone — the unconventional choice.", lines:["Honestly, this isn't for most people.","Everyone else is doing it the old way."] , p:"379"},
  nov:{ name:"Novelty", emoji:"✨", q:"Is this noticeably new — and will people see it?", signs:["Newest phone/gadget, brand-new kit","Talks about new places, firsts","Bored by routine"], frame:"Lead with what's new, first, and visible.", lines:["This is brand new — hardly anyone's seen it yet.","You'd be one of the first to do this."], p:"379"},
  soc:{ name:"Social", emoji:"🎉", q:"Will this make people show interest or connect with me?", signs:["Lots of friends, groups, events","Team logos, sociable style","Mentions what people will think"], frame:"Show how it connects them and how others will react.", lines:["Your friends are going to love this.","It's the kind of thing people end up talking about together."], p:"379"},
  con:{ name:"Conformity", emoji:"👔", q:"Are people like me doing this — is it acceptable to them?", signs:["Dresses like their peers","'What most people do', proven options","Avoids big leaps"], frame:"Show it's the normal, proven, accepted choice for people like them.", lines:["Most people in your position go with this one.","It's the standard choice — nothing risky about it."], p:"379"},
  inv:{ name:"Investment", emoji:"📈", q:"Will this give me a valuable return?", signs:["Talks value, ROI, quality that lasts","Well-kept older things, protective cases","Asks lots of questions, compares"], frame:"Give the return: long-term value, numbers, durability.", lines:["Over five years this works out cheaper than the alternatives.","Quality like this pays for itself."], p:"380"},
  nec:{ name:"Necessity", emoji:"🔧", q:"What specifically makes this necessary vs other options?", signs:["Practical, 'it does the job'","Old or cracked phone they won't replace","Says 'have to', 'mandatory'"], frame:"Be specific about why it's needed and what problem it solves. No fluff.", lines:["Here's exactly why you'd need it — and when you wouldn't.","You gotta do what you gotta do — this just makes it simpler."], p:"380"}
};

BO.values = {
  connection:{ name:"Connection", emoji:"❤️", hear:"'What matters is looking after family and friends.'", tie:"Tie it to their people — the team, family, or friends it protects or brings together." },
  information:{ name:"Information", emoji:"🗝️", hear:"'I'd finally get access to what others can't see.'", tie:"Tie it to access, insight, resources and being in the know." },
  recognition:{ name:"Recognition", emoji:"🏆", hear:"'You work your whole life and nobody notices.'", tie:"Tie it to visibility — getting their work seen and credited." },
  experience:{ name:"Experience", emoji:"🌍", hear:"'Once we hit our goals we'll finally travel.'", tie:"Tie it to memories and experiences they'll look back on." },
  freedom:{ name:"Freedom", emoji:"🕊️", hear:"'Then I can finally do whatever I want.'", tie:"Tie it to choice, time and independence — fewer things controlling them." },
  growth:{ name:"Growth", emoji:"🌱", hear:"'You're never too old to learn something new.'", tie:"Tie it to progress, learning and becoming better." }
};

BO.sensory = {
  V:{ name:"Visual", words:"see, look, picture, clear, focus, show, view", open:["Picture this…","Can you see how this would look?","Let me show you…"] },
  A:{ name:"Auditory", words:"hear, sounds, tell, talk, say, loud, rings true", open:["How does this sound?","Let me talk you through it…","Tell me what you think."] },
  K:{ name:"Feeling", words:"feel, grasp, handle, solid, pressure, smooth", open:["How does that feel to you?","Let's get a solid handle on it…","I want you to feel comfortable with this."] }
};
BO.pronouns = {
  self:{ name:"Self (I / me / my)", frame:"Frame benefits around them personally: 'this gives *you*…'" },
  team:{ name:"Team (we / us / our)", frame:"Frame benefits around their team, family, partner: 'for you and your team…'" },
  others:{ name:"Others (they / people)", frame:"Frame around people outside their circle — introductions, who they'll meet, who it helps." }
};

// Tappable cues in the Profile flow. s = scores.
BO.profileGroups = [
  { id:"talk", title:"What they talk about", hint:"Listen for 2 minutes — needs show up fast (p. 366).", chips:[
    {id:"t1",l:"Achievements, titles, who they know",s:{sig:2}},
    {id:"t2",l:"Status brands, cars, watches, newest tech",s:{sig:2,nov:1}},
    {id:"t3",l:"Puts themselves down ('I'm rubbish at…')",s:{app:2}},
    {id:"t4",l:"Asks permission / checks it's OK",s:{app:2}},
    {id:"t5",l:"Lots of compliments, never complains",s:{app:1,acc:1}},
    {id:"t6",l:"Their clubs, teams, groups",s:{acc:2,soc:1}},
    {id:"t7",l:"Helping others, community, pets",s:{acc:2}},
    {id:"t8",l:"Education, books, 'actually…', detail",s:{int:2}},
    {id:"t9",l:"Calls others idiots / incompetent",s:{int:1,str:1}},
    {id:"t10",l:"Complaints, bad luck, how hard it's been",s:{pit:2}},
    {id:"t11",l:"Toughness, beating the system, in charge",s:{str:2}},
    {id:"t12",l:"Loud, big posture, crushing handshake",s:{str:2}}
  ]},
  { id:"choose", title:"How they choose", hint:"Look at what they own and how they decide (p. 378).", chips:[
    {id:"c1",l:"Stands out on purpose, anti-mainstream",s:{dev:2}},
    {id:"c2",l:"Early adopter — new gadgets, new places",s:{nov:2}},
    {id:"c3",l:"Cares what friends think, very social",s:{soc:2}},
    {id:"c4",l:"Dresses like their peers, 'what most do'",s:{con:2}},
    {id:"c5",l:"Talks value, quality, return, durability",s:{inv:2}},
    {id:"c6",l:"Practical — 'does the job', 'have to'",s:{nec:2}}
  ]},
  { id:"want", title:"What they want from life", hint:"Heard in 'If I could just… I'd finally…' (p. 386).", chips:[
    {id:"w1",l:"Family, friends, team come first",s:{connection:2}},
    {id:"w2",l:"Access, inside info, knowing more",s:{information:2}},
    {id:"w3",l:"Wants their work noticed",s:{recognition:2}},
    {id:"w4",l:"Travel, memories, doing things",s:{experience:2}},
    {id:"w5",l:"No boss, do whatever they want",s:{freedom:2}},
    {id:"w6",l:"Learning, improving, new challenges",s:{growth:2}}
  ]},
  { id:"words", title:"Words they use", hint:"Sensory words appear in ~3 min; pronouns all the time (pp. 394–397).", chips:[
    {id:"v",l:"See / look / clear / picture",s:{V:2}},
    {id:"a",l:"Hear / sounds / tell / talk",s:{A:2}},
    {id:"k",l:"Feel / grasp / handle / solid",s:{K:2}},
    {id:"pi",l:"Mostly I / me / my",s:{self:2}},
    {id:"pw",l:"Mostly we / us / our",s:{team:2}},
    {id:"po",l:"Mostly they / people / others",s:{others:2}}
  ]},
  { id:"body", title:"Their body right now", hint:"Baseline first. Watch for CHANGES and what topic caused them.", chips:[
    {id:"b1",l:"Fingers relax / open palms",s:{comfort:1},good:1,tip:"Note the topic — bring it back when you make your ask (p. 322)."},
    {id:"b2",l:"Leaning in / torso faces you",s:{comfort:1},good:1,tip:"Interest. Keep going on this thread."},
    {id:"b3",l:"Feet point at you",s:{comfort:1},good:1,tip:"Engaged with you (p. 324)."},
    {id:"b4",l:"Smile reaches the eyes",s:{comfort:1},good:1,tip:"Genuine — real smiles crinkle the eyes and fade slowly (p. 317)."},
    {id:"b5",l:"Blinking slows down",s:{comfort:1},good:1,tip:"Captivated. Remember what you were saying (p. 307)."},
    {id:"b6",l:"Shoulders drop, belly breathing",s:{comfort:1},good:1,tip:"They've relaxed on this topic (pp. 326–327)."},
    {id:"b7",l:"Returned your eyebrow flash",s:{comfort:1},good:1,tip:"Open to you from the first seconds (p. 314)."},
    {id:"x1",l:"Lips press together",s:{stress:1},tip:"Withheld opinion. Gently surface it: 'I sense there's something about that part you're not sold on?' (p. 315)."},
    {id:"x2",l:"Fingers curl / fists",s:{stress:1},tip:"Disagreement or stress on this topic — slow down and check in (p. 323)."},
    {id:"x3",l:"One-shoulder shrug while saying yes",s:{stress:1},tip:"They don't fully believe what they just said. Explore alternatives (p. 327)."},
    {id:"x4",l:"Covers mouth / touches face",s:{stress:1},tip:"Unsure about what's being said — invite questions (p. 319)."},
    {id:"x5",l:"Puts a drink/phone/bag between you",s:{stress:1},tip:"Barrier. Ask yourself what you just said; remove your own barriers (p. 328)."},
    {id:"x6",l:"Feet or body turn to the exit",s:{stress:1},tip:"Wants to leave — wrap up warmly or change topic (p. 324)."},
    {id:"x7",l:"Blinking speeds up",s:{stress:1},tip:"Stress spike. Note what triggered it (p. 308)."},
    {id:"x8",l:"Hands to groin / arm across belly",s:{stress:1},tip:"Feels vulnerable on this topic — reassure, don't push (p. 321)."},
    {id:"x9",l:"Dominant shoulder pulls back",s:{stress:1},tip:"Strong disagreement. Pause and ask their view (p. 325)."},
    {id:"x10",l:"Touches neck / throat",s:{stress:1},tip:"Doubt, needs reassurance (p. 341)."},
    {id:"x11",l:"Pen, hair or finger in mouth",s:{stress:1},tip:"Needs reassurance about this point (p. 316)."},
    {id:"x12",l:"Answer dodges the question",s:{stress:1},tip:"Non-answer. Don't fill the gap for them — calmly re-ask (p. 333)."}
  ]}
];

// Cue library (Body language tab). s: 0 comfort, 1 low, 2 medium, 3 high stress. drs = book's Deception Rating Scale value where given.
BO.cues = [
 // Eyes
 {r:"Eyes",n:"Blink rate slows",m:"Interest, focus, captivated.",s:0,p:"307"},
 {r:"Eyes",n:"Blink rate speeds up",m:"Stress, disagreement, discomfort with the topic.",s:2,p:"308"},
 {r:"Eyes",n:"Fast eyelid 'shutter'",m:"Fear rising — the lids close and open faster.",s:2,p:"311"},
 {r:"Eyes",n:"Pupils dilate",m:"Liking, attraction, interest (ignore in bright light).",s:0,p:"312"},
 {r:"Eyes",n:"Pupils constrict",m:"Dislike or aversion to what they see/hear.",s:2,p:"243"},
 {r:"Eyes",n:"Glance to a third person",m:"Before speaking: that person is the decision-maker. After speaking: checking they're believed.",s:1,p:"313",drs:"4.0"},
 {r:"Eyes",n:"Eyebrow flash",m:"Friendly, non-threatening greeting; most people return it.",s:0,p:"314"},
 {r:"Eyes",n:"Looks to one side for good memories",m:"Gestural Hemispheric Tendency — note their 'positive side'.",s:0,p:"309"},
 {r:"Eyes",n:"Squint",m:"Stress, disagreement, disbelief or deep concentration.",s:1,p:"236"},
 {r:"Eyes",n:"Eyelid rub",m:"Wants to stop thinking about something.",s:2,p:"264",drs:"2.5"},
 // Face
 {r:"Face",n:"Lip compression",m:"Holding back an opinion. The topic matters.",s:2,p:"315",drs:"2.0"},
 {r:"Face",n:"Lips pulled in / bitten",m:"Uncertainty, needs reassurance.",s:2,p:"230"},
 {r:"Face",n:"Object in mouth",m:"Needs reassurance.",s:2,p:"316",drs:"2.5"},
 {r:"Face",n:"Smile reaching the eyes",m:"Genuine. Social smiles use the lower face only (and aren't lies).",s:0,p:"318"},
 {r:"Face",n:"Expression stops abruptly",m:"Likely put on — real expressions fade.",s:2,p:"317"},
 {r:"Face",n:"Lopsided expression",m:"Possibly false (contempt is the one naturally one-sided expression).",s:1,p:"317"},
 {r:"Face",n:"Contempt (one-sided smirk)",m:"Feeling superior to someone/something.",s:1,p:"239"},
 {r:"Face",n:"Disgust",m:"Rarely faked — the topic/person is the cause.",s:1,p:"238"},
 {r:"Face",n:"Nostril flare",m:"Adrenaline: excitement, anger or attraction.",s:1,p:"318",drs:"3.0"},
 {r:"Face",n:"Jaw clench",m:"Withheld anger or hostility.",s:2,p:"227",drs:"2.5"},
 {r:"Face",n:"Hushing (mouth cover, cough, nose scratch)",m:"Self-conscious about what's being said — or respectful listening.",s:2,p:"319",drs:"4.0"},
 {r:"Face",n:"Flushing",m:"Embarrassment, guilt, fear or arousal.",s:1,p:"229"},
 {r:"Face",n:"Head tilt",m:"Open, curious, friendly.",s:0,p:"222"},
 {r:"Face",n:"Chin thrust",m:"Challenge or irritation (cultural meanings vary).",s:2,p:"223"},
 // Neck/shoulders
 {r:"Neck & shoulders",n:"Throat touch",m:"Doubt, needs reassurance, fear.",s:2,p:"341"},
 {r:"Neck & shoulders",n:"Throat rises / hard swallow",m:"Stress as a question lands.",s:2,p:"340"},
 {r:"Neck & shoulders",n:"Both shoulders shrug",m:"Don't know / sorry / uncertainty.",s:1,p:"327"},
 {r:"Neck & shoulders",n:"Single-shoulder shrug",m:"Low confidence in what they're saying.",s:3,p:"327",drs:"4.0"},
 {r:"Neck & shoulders",n:"Shoulders stay raised",m:"Social fear or self-consciousness.",s:2,p:"248"},
 {r:"Neck & shoulders",n:"Shoulders drop",m:"Comfort — you've relaxed them.",s:0,p:"327"},
 {r:"Neck & shoulders",n:"Dominant shoulder pulls back",m:"Strong disagreement.",s:3,p:"325"},
 {r:"Neck & shoulders",n:"Turtling (shoulders up, head down)",m:"Fear.",s:2,p:"226"},
 // Arms & hands
 {r:"Arms & hands",n:"Arms crossed (relaxed fingers)",m:"Usually means nothing — often comfort. Don't over-read.",s:0,p:"320"},
 {r:"Arms & hands",n:"Self-hug (palms on body)",m:"Self-soothing, needs reassurance.",s:2,p:"320"},
 {r:"Arms & hands",n:"Arms crossed with fists",m:"Anger, restraint, strong disagreement.",s:3,p:"320"},
 {r:"Arms & hands",n:"Fingers relax / extend",m:"Comfort, agreement — remember the topic.",s:0,p:"322"},
 {r:"Arms & hands",n:"Fingers curl (digital flexion)",m:"Live barometer of anxiety or disagreement.",s:2,p:"323"},
 {r:"Arms & hands",n:"Palms open",m:"Wants to appear honest. Watch if the rest of the body joins in.",s:0,p:"242"},
 {r:"Arms & hands",n:"Palms turn down",m:"Not showing their hand — disagreement or holding back.",s:2,p:"343",drs:"3.5"},
 {r:"Arms & hands",n:"Steepled fingers",m:"Confidence in the subject.",s:0,p:"246"},
 {r:"Arms & hands",n:"Hands behind head",m:"Dominance / ownership (can be false confidence).",s:1,p:"246"},
 {r:"Arms & hands",n:"Hands behind back",m:"Unthreatened. Gripping own wrist = restraint.",s:0,p:"324"},
 {r:"Arms & hands",n:"Hand to chest",m:"Sincerity — they feel strongly.",s:0,p:"329"},
 {r:"Arms & hands",n:"Fig leaf / single-arm wrap",m:"Feels vulnerable, threatened or insecure.",s:3,p:"321"},
 {r:"Arms & hands",n:"Elbows pull in",m:"Fear, discomfort.",s:2,p:"343",drs:"3.5"},
 {r:"Arms & hands",n:"Fidgeting / tapping",m:"Burning off energy — excited or bored. Low weight.",s:1,p:"323"},
 {r:"Arms & hands",n:"Jewellery or cuff play",m:"Self-soothing under social pressure.",s:2,p:"271"},
 {r:"Arms & hands",n:"Grooming (hair, lint, straighten up)",m:"Interest, wants to look good — usually positive outside interrogation.",s:1,p:"329"},
 {r:"Arms & hands",n:"Back of neck rub",m:"Stress or deep thought.",s:2,p:"255"},
 {r:"Arms & hands",n:"Arm or object as a barrier",m:"Feels slightly threatened or wants distance.",s:2,p:"328",drs:"3.0"},
 // Torso
 {r:"Torso & breathing",n:"Leans toward you",m:"Interest.",s:0,p:"260"},
 {r:"Torso & breathing",n:"Leans away",m:"Less interest, comfort or trust — or higher status.",s:1,p:"260"},
 {r:"Torso & breathing",n:"Torso turns away",m:"Attention or intent is elsewhere.",s:1,p:"260"},
 {r:"Torso & breathing",n:"Belly → chest breathing",m:"Something just made them tense.",s:2,p:"326"},
 {r:"Torso & breathing",n:"Chest → belly breathing",m:"They relaxed — this topic matters to them.",s:0,p:"326"},
 {r:"Torso & breathing",n:"Freeze",m:"High mental load — managing a story or fear.",s:3,p:"249",drs:"3.5"},
 {r:"Torso & breathing",n:"Ventilating (collar pull, hair off neck)",m:"Heat from stress.",s:2,p:"232",drs:"3.0"},
 // Legs & feet
 {r:"Legs & feet",n:"Feet point at you",m:"Engaged with you.",s:0,p:"324"},
 {r:"Legs & feet",n:"Feet turn to the exit",m:"Wants to leave.",s:2,p:"324"},
 {r:"Legs & feet",n:"Group's feet point to one person",m:"That's who has the group's attention / leads.",s:0,p:"324"},
 {r:"Legs & feet",n:"Legs crossed toward you",m:"Comfort and trust.",s:0,p:"259"},
 {r:"Legs & feet",n:"Locked ankles / legs bound tight",m:"Holding back, anxious.",s:2,p:"262"},
 {r:"Legs & feet",n:"Feet wrapped round chair legs",m:"Self-restraint, holding information back.",s:3,p:"271",drs:"4.0"},
 {r:"Legs & feet",n:"Feet suddenly pulled back",m:"Sudden withholding or lost trust.",s:3,p:"265",drs:"3.5"},
 {r:"Legs & feet",n:"Hands clasp knees",m:"Ready to end the conversation.",s:2,p:"264"},
 {r:"Legs & feet",n:"Toes lift up",m:"Happy, elated.",s:0,p:"259"},
 {r:"Legs & feet",n:"Toes point inward",m:"Self-conscious, wants to take less space.",s:2,p:"264"},
 // Objects
 {r:"Objects",n:"Checks wallet/phone/bag is there",m:"Mistrust, insecurity.",s:2,p:"270"},
 {r:"Objects",n:"Tilts phone screen away",m:"Concealing (phone stands in for anything).",s:2,p:"270",drs:"3.0"},
 {r:"Objects",n:"Buttons jacket mid-chat",m:"Trust hits a stopping point (unless cold).",s:1,p:"268"},
 {r:"Objects",n:"Tosses own things around",m:"Careless, aloof attitude.",s:1,p:"267"},
 {r:"Objects",n:"Moves furniture to suit them",m:"Comfortable taking charge of the space.",s:0,p:"266"},
 {r:"Objects",n:"Watch check",m:"Wants to leave / time pressure.",s:1,p:"267"},
 // Voice & words
 {r:"Voice & words",n:"Unusual pause before answering",m:"Building the answer. Compare to their normal pauses.",s:3,p:"331",drs:"4.0"},
 {r:"Voice & words",n:"Repeats your whole question back",m:"Buying time (a partial repeat is just clarifying).",s:3,p:"331"},
 {r:"Voice & words",n:"Softer word for the act ('took' not 'stole')",m:"Psychological distancing.",s:3,p:"331",drs:"4.0"},
 {r:"Voice & words",n:"Avoids saying the person's name",m:"Distancing from them.",s:2,p:"332"},
 {r:"Voice & words",n:"Pitch rises slightly",m:"Tension in the voice — only vs their baseline.",s:3,p:"332",drs:"4.0"},
 {r:"Voice & words",n:"Speeds up on one point",m:"Wants to get through it / avoid interruption.",s:3,p:"333",drs:"4.0"},
 {r:"Voice & words",n:"Answer doesn't answer",m:"Non-answer statement.",s:3,p:"333",drs:"4.0"},
 {r:"Voice & words",n:"Drops 'I' from the story",m:"Pronoun absence — like a manual, not a memory.",s:3,p:"333",drs:"4.0"},
 {r:"Voice & words",n:"Lists their good character instead",m:"Resume statement.",s:3,p:"334",drs:"4.0"},
 {r:"Voice & words",n:"'I did not' instead of 'I didn't'",m:"Non-contracted denial (if it's not their normal style).",s:3,p:"335",drs:"4.0"},
 {r:"Voice & words",n:"Throws the question back at you",m:"Question reversal — also a non-answer.",s:3,p:"335",drs:"4.0"},
 {r:"Voice & words",n:"Vague answer you want to fill in",m:"Ambiguity — don't hand them the easy 'yep'.",s:3,p:"336",drs:"4.0"},
 {r:"Voice & words",n:"Sudden 'sir' / extra politeness",m:"Politeness spike vs their baseline.",s:2,p:"336"},
 {r:"Voice & words",n:"Keeps apologising",m:"Over-apologising — something else is weighing on them.",s:2,p:"336"},
 {r:"Voice & words",n:"Confesses something small",m:"Mini-confession — park it, stay on the main topic.",s:2,p:"337"},
 {r:"Voice & words",n:"'As far as I know', 'basically'",m:"Exclusions — only meaningful if they should know.",s:3,p:"338",drs:"4.0"},
 {r:"Voice & words",n:"Perfect step-by-step timeline",m:"Rehearsed — real emotional stories start with the big moment. Ask for it in reverse.",s:3,p:"339",drs:"4.0"}
];

BO.goals = [
 { id:"rapport", t:"Build rapport fast", e:"🤝", p:"91–97, 314, 355, 431", steps:[
   "Eyebrow flash and a warm hello in the first seconds — most people return it.",
   "Move slowly (the 'swimming pool' rule): speed reads as nerves.",
   "Small-talk loop: Listen → Display (let your face react) → Ask a small follow-up → Offer a related story. Repeat.",
   "Answer their questions with four 'threads' they can grab (place, job, story, interest).",
   "Mirror the last 2–3 words they said, or reflect the theme: 'Fifteen years. You must have seen it all.'",
   "Use FORK topics: Family, Occupation, Recreation, Knowledge.",
   "Connection mode, not performance mode: attention on them, curious, relaxed.",
   "Give their need (see Profile) — that's the fastest rapport of all."]},
 { id:"open", t:"Help them open up", e:"🔓", p:"344–360", steps:[
   "Use statements, not questions — the more personal the topic, the fewer questions.",
   "Provocative statement: 'I bet that job keeps you on your toes.'",
   "Go first: share something similar and real (they'll want to match it).",
   "Naive curiosity about their expertise: 'I know nothing about this — how does it work?'",
   "Hourglass: start broad, get to the real topic in the middle, finish broad.",
   "Be someone worth opening up to — never use what they share against them."]},
 { id:"persuade", t:"Make a request / persuade", e:"🎯", p:"366–386, 310, 435", steps:[
   "Speak to their NEED and avoid their FEAR (Profile tab).",
   "Answer their decision question (e.g. Investment: 'what's the return?').",
   "Link to their value: 'If you do X, people will see Y, and you'll finally get Z.'",
   "Use their sensory words, pronouns and their own positive adjectives.",
   "Deal with hidden objections the moment you spot them (lip press, finger curl, one-shoulder shrug) — don't wait till the end.",
   "Present the good option from their 'positive side' (the side they look to for happy memories).",
   "Lean in slightly just before you ask. Then stop talking."]},
 { id:"calm", t:"Calm someone down", e:"🌊", p:"280, 300, 812", steps:[
   "Lens first: anger is usually fear. 'People are reasons', not broken.",
   "Re-orient: break the loop with something unexpected or a step to the side.",
   "Validate: say something true they can't disagree with ('It's Friday, and everyone's trying to get home').",
   "Observe: give their need — Strength: respect and control; Pity: 'that's genuinely awful' + pause; Approval: reassurance.",
   "Action: ask their advice or offer a choice, so they feel in control again.",
   "Stay composed — no collapse (grovelling) and no posturing (matching their volume)."]},
 { id:"objection", t:"Handle a hesitation", e:"🧩", p:"539", steps:[
   "Sympathise: 'I had the same question when I first saw this.'",
   "Socialise: 'Most people ask exactly that.'",
   "Select: pinpoint the real issue with one question.",
   "Show: what's actually true, in their language.",
   "Secure: a simple check — 'Does that make sense for you?'"]},
 { id:"truth", t:"Read if something's off", e:"🔍", p:"216, 330–343", steps:[
   "No behaviour means 'lying' — only stress. Read clusters of 3+ cues right after one question.",
   "Baseline first on easy topics; judge changes, not single gestures.",
   "Watch for non-answers, softened words, perfect timelines, sudden politeness.",
   "Don't fill vague answers for them; calmly re-ask the actual question.",
   "Ask for events in reverse order — true memories survive it, rehearsed stories struggle.",
   "Check your truth bias: we overlook red flags in people we like.",
   "Your pressure creates stress too — accusations make innocent people look 'guilty'."]},
 { id:"challenge", t:"When someone challenges you", e:"🛡️", p:"48–52", steps:[
   "Default to the 'Father' frame: amused, composed, kind.",
   "Never defend yourself or talk about yourself.",
   "Mirror it calmly: 'You seem to feel quite strongly about this.'",
   "Name it lightly: 'Not often someone questions my credibility — happy to talk it through.'",
   "Deal with it early — 'kill monsters while they're small'."]}
];

BO.animals = [
 {n:"Porcupine",e:"🦔",m:"Spikes keep everyone at a distance — even helpers. Soft underneath. Approach slowly; don't take the prickles personally."},
 {n:"Chihuahua",e:"🐕",m:"Loud, quick to escalate — it's fear, not hatred. Stay calm; don't bark back."},
 {n:"Turtle",e:"🐢",m:"Withdraws into a shell in conflict. Lower the pressure and give time."},
 {n:"Rabbit",e:"🐇",m:"Escapes conflict. Make staying feel safe; don't corner them."},
 {n:"Fox",e:"🦊",m:"Outthinks the threat, adapts tactics. Be straight with them — they'll spot games."},
 {n:"Wolf",e:"🐺",m:"Hyper-vigilant radar for trouble; may read threat that isn't there. Be predictable and transparent."},
 {n:"Sheep",e:"🐑",m:"Safety in the group; follows the flock. Show what their people think."},
 {n:"Puppy",e:"🐶",m:"Innocence and wanting to be liked. Be kind — they're often targets for manipulators."}
];

BO.drills = [
 "See everyone through 'people are reasons' today — what shaped them?",
 "Find each person's 'positive side' — where do they look when they talk about good things?",
 "Judge blink rate (fast / normal / slow) at the start of every chat, then notice changes.",
 "Eyebrow-flash everyone you greet. Count who flashes back.",
 "Spot lip compression — and what was said just before it.",
 "Look for fake expressions: do they stop suddenly or fade?",
 "Watch for mouth-covering and nostril flares. What triggered them?",
 "Notice arms: self-hugs, fig leaves, arm wraps. What topic?",
 "Watch fingers only: relaxing vs curling.",
 "Which way are feet pointing? In groups, who do they point to?",
 "Spot dominant hand and breathing location in every chat.",
 "Shoulders only today: shrugs, one-sided shrugs, drops.",
 "Barriers: who puts a cup or phone between you, and when?",
 "Grooming moments: when did they straighten up or fix their hair?",
 "Listen for non-answers and softened words on TV interviews.",
 "Elicitation: learn one thing from someone using zero questions.",
 "Write three go-to provocative statements and use them.",
 "Needs Map: guess the need of 5 people. Add it to their contact notes.",
 "Decision Map: what decision style is each friend?",
 "Profile two people fully: need + decision style.",
 "Sensory words: visual, auditory or feeling? Listen to a podcast.",
 "Pronouns: I, we or they? Check three people.",
 "Collect people's positive and negative adjectives.",
 "Pick four cues for a 'quadrant' and watch only those.",
 "Fill in a full profile for someone after a conversation."
];
