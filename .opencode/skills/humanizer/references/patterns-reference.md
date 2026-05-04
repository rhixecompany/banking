# Pattern Reference: 24 AI Writing Anti-Patterns

**MANDATORY — Read this entire file when identifying which specific AI writing patterns are present in your text.**

This file documents all 24 patterns with decision trees and examples. Use this as your diagnostic guide when humanizing text.

---

## CONTENT PATTERNS (Patterns 1–6)

These patterns inflate importance, exaggerate notability, or use superficial analysis.

### Pattern 1: Undue Emphasis on Significance, Legacy, and Broader Trends

**Trigger words**: stands/serves as, is a testament/reminder, a vital/significant/crucial/pivotal/key role/moment, underscores/highlights its importance/significance, reflects broader, symbolizing its ongoing/enduring/lasting, contributing to the, setting the stage for, marking/shaping the, represents/marks a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted

**Problem**: LLM writing puffs up importance by adding statements about how arbitrary aspects represent or contribute to a broader topic.

**Decision Tree**:

1. Does the text claim something "marks a pivotal moment" or "shapes the landscape"?
2. Is there a claim about "broader trends" or "lasting significance" that's unsupported?
3. Are simple facts dressed up as historical importance?

**Example**:

```
Before: The Statistical Institute of Catalonia was officially established in 1989,
marking a pivotal moment in the evolution of regional statistics in Spain. This
initiative was part of a broader movement across Spain to decentralize administrative
functions and enhance regional governance.

After: The Statistical Institute of Catalonia was established in 1989 to collect
and publish regional statistics independently from Spain's national statistics office.
```

**Why it's AI**: Machine learning models assign high probability to sentences that connect isolated facts to grand narratives. Humans often just state facts.

---

### Pattern 2: Undue Emphasis on Notability and Media Coverage

**Trigger words**: independent coverage, local/regional/national media outlets, written by a leading expert, active social media presence, featured in, covered by, widely recognized, prominently featured

**Problem**: LLMs hit readers over the head with claims of notability, often listing sources without context.

**Decision Tree**:

1. Does the text list media outlets without explaining WHY they matter?
2. Is notability asserted ("active social media presence") rather than supported?
3. Are citations used to justify importance rather than inform?

**Example**:

```
Before: Her views have been cited in The New York Times, BBC, Financial Times,
and The Hindu. She maintains an active social media presence with over 500,000 followers.

After: In a 2024 New York Times interview, she argued that AI regulation should
focus on outcomes rather than methods.
```

**Why it's AI**: LLMs generate "notability statements" as filler. Humans cite specific claims, not just outlets.

---

### Pattern 3: Superficial Analyses with -ing Endings

**Trigger words**: highlighting/underscoring/emphasizing..., ensuring..., reflecting/symbolizing..., contributing to..., cultivating/fostering..., encompassing..., showcasing..., revealing...

**Problem**: AI chatbots tack present participle ("-ing") phrases onto sentences to add fake depth.

**Decision Tree**:

1. Are there multiple "-ing" phrases strung together in one sentence?
2. Do the "-ing" phrases restate what was just said (fake analysis)?
3. Could the sentence be clearer without the "-ing" phrases?

**Example**:

```
Before: The temple's color palette of blue, green, and gold resonates with the
region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and
the diverse Texan landscapes, reflecting the community's deep connection to the land.

After: The temple uses blue, green, and gold colors. The architect said these
were chosen to reference local bluebonnets and the Gulf coast.
```

**Why it's AI**: LLMs overuse "-ing" forms to add apparent depth. This pattern correlates heavily with post-2023 text.

---

### Pattern 4: Promotional and Advertisement-like Language

**Trigger words**: boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning, iconic, picturesque, charming, heritage

**Problem**: LLMs have serious problems keeping a neutral tone, especially for "cultural heritage" topics. They default to promotional language.

**Decision Tree**:

1. Would a travel brochure use this language?
2. Are adjectives doing the work that facts should do?
3. Could this be rewritten with fewer modifiers and more specifics?

**Example**:

```
Before: Nestled within the breathtaking region of Gonder in Ethiopia, Alamata
Raya Kobo stands as a vibrant town with a rich cultural heritage and stunning
natural beauty.

After: Alamata Raya Kobo is a town in the Gonder region of Ethiopia, known for
its weekly market and 18th-century church.
```

**Why it's AI**: Marketing language is statistically overrepresented in training data. LLMs default to it when uncertain about tone.

---

### Pattern 5: Vague Attributions and Weasel Words

**Trigger words**: Industry reports, Observers have cited, Experts argue, Some critics argue, Several sources/publications (when few cited), It is believed, Research suggests, Generally considered, It is widely held that

**Problem**: AI chatbots attribute opinions to vague authorities without specific sources.

**Decision Tree**:

1. Who exactly are the "experts"? Can you name one?
2. Does "industry reports" point to actual reports?
3. Would a reader find the specific source if they searched?

**Example**:

```
Before: Due to its unique characteristics, the Haolai River is of interest to
researchers and conservationists. Experts believe it plays a crucial role in the
regional ecosystem.

After: The Haolai River supports several endemic fish species, according to a
2019 survey by the Chinese Academy of Sciences.
```

**Why it's AI**: Vague attribution allows the LLM to continue without fetching real data. Humans cite when they know; they're specific.

---

### Pattern 6: Outline-like "Challenges and Future Prospects" Sections

**Trigger words**: Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook, It remains to be seen, Looking ahead, In the coming years, As the field evolves

**Problem**: Many LLM-generated articles include formulaic "Challenges" sections that repeat the intro without adding information.

**Decision Tree**:

1. Is there a "Challenges" section that doesn't exist in the source?
2. Does it repeat problems already mentioned?
3. Are "future prospects" vague (e.g., "will continue to grow")?

**Example**:

```
Before: Despite its industrial prosperity, Korattur faces challenges typical of
urban areas, including traffic congestion and water scarcity. Despite these challenges,
with its strategic location and ongoing initiatives, Korattur continues to thrive as
an integral part of Chennai's growth.

After: Traffic congestion increased after 2015 when three new IT parks opened.
The municipal corporation began a stormwater drainage project in 2022 to address
recurring floods.
```

**Why it's AI**: Outline structure is common in training data. LLMs fill sections mechanically rather than with new information.

---

## LANGUAGE AND GRAMMAR PATTERNS (Patterns 7–12)

These patterns involve vocabulary, grammar, and sentence construction.

### Pattern 7: Overused "AI Vocabulary" Words

**High-frequency AI words**: Additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), pivotal, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant

**Problem**: These words appear far more frequently in post-2023 text and often co-occur, signaling AI authorship.

**Decision Tree**:

1. Count instances of words in the "High-frequency AI words" list
2. Do 3+ appear in a single paragraph?
3. Do they co-occur (e.g., "pivotal landscape" or "testament to the landscape")?

**Example**:

```
Before: Additionally, a distinctive feature of Somali cuisine is the incorporation
of camel meat. An enduring testament to Italian colonial influence is the widespread
adoption of pasta in the local culinary landscape, showcasing how these dishes have
integrated into the traditional diet.

After: Somali cuisine also includes camel meat, which is considered a delicacy.
Pasta dishes, introduced during Italian colonization, remain common, especially in
the south.
```

**Why it's AI**: LLM training data overweights academic/professional text. These words are common in that genre and get overused statistically.

---

### Pattern 8: Avoidance of "is"/"are" (Copula Avoidance)

**Trigger words**: serves as/stands as/marks/represents [a], boasts/features/offers [a], comprises, constitutes, demonstrates, functions as

**Problem**: LLMs substitute elaborate constructions for simple copulas.

**Decision Tree**:

1. Does the sentence use "serves as" or "stands as" where "is" would work?
2. Could "boasts" be replaced with "has"?
3. Is the elaborate form making the sentence harder to parse?

**Example**:

```
Before: Gallery 825 serves as LAAA's exhibition space for contemporary art.
The gallery features four separate spaces and boasts over 3,000 square feet.

After: Gallery 825 is LAAA's exhibition space for contemporary art. The gallery
has four rooms totaling 3,000 square feet.
```

**Why it's AI**: Copula avoidance is a known LLM quirk. Models treat "is" as too simple and substitute longer forms.

---

### Pattern 9: Negative Parallelisms

**Trigger words**: It's not just about..., it's...; Not only...but...; It's not merely..., it's...; Rather than...instead...

**Problem**: Constructions like "Not only...but..." are overused by LLMs.

**Decision Tree**:

1. Count instances of "It's not just..." or "Not only...but..." in the text
2. Are multiple negative parallelisms present?
3. Could the same idea be stated more directly?

**Example**:

```
Before: It's not just about the beat riding under the vocals; it's part of the
aggression and atmosphere. It's not merely a song, it's a statement.

After: The heavy beat adds to the aggressive tone.
```

**Why it's AI**: LLMs overuse this structure because it's statistically common in persuasive text. Humans prefer direct statements.

---

### Pattern 10: Rule of Three Overuse

**Trigger words**: Comma lists of exactly 3 items; Three "-ing" forms; Three adjectives in a row; Phrases like "A, B, and C"

**Problem**: LLMs force ideas into groups of three to appear comprehensive (and because it's over-represented in training data).

**Decision Tree**:

1. Are ideas grouped into exactly 3 items when 2 or 4 would be more natural?
2. Are three adjectives modifying the same noun?
3. Does the grouping serve a purpose or just feel formulaic?

**Example**:

```
Before: The event features keynote sessions, panel discussions, and networking
opportunities. Attendees can expect innovation, inspiration, and industry insights.

After: The event includes talks and panels. There's also time for informal
networking between sessions.
```

**Why it's AI**: Rule of three is over-represented in rhetoric and training data. Humans naturally use variable list sizes.

---

### Pattern 11: Elegant Variation (Synonym Cycling)

**Trigger words**: Look for the same concept using different terms: protagonist/character/hero/figure; company/organization/firm; city/metropolis/urban center; river/waterway/water body

**Problem**: AI has repetition-penalty code causing excessive synonym substitution.

**Decision Tree**:

1. Is the same concept referred to by 4+ different terms?
2. Does varying the term add clarity or just avoid repetition?
3. Would repeating the original term be clearer?

**Example**:

```
Before: The protagonist faces many challenges. The main character must overcome
obstacles. The central figure eventually triumphs. The hero returns home.

After: The protagonist faces many challenges but eventually triumphs and returns home.
```

**Why it's AI**: Modern LLMs have repetition penalties built in, causing them to over-vary synonyms. Humans repeat key terms for clarity.

---

### Pattern 12: False Ranges

**Trigger words**: from X to Y, spanning from, ranging from, stretching from (where X and Y aren't on a continuous scale)

**Problem**: LLMs use "from X to Y" constructions where X and Y aren't actually on a meaningful scale.

**Decision Tree**:

1. Does the "from X to Y" construction describe a continuous range?
2. Or is it just two loosely related concepts forced into parallel?
3. Would listing them separately be clearer?

**Example**:

```
Before: Our journey through the universe has taken us from the singularity of
the Big Bang to the grand cosmic web, from the birth and death of stars to the
enigmatic dance of dark matter.

After: The book covers the Big Bang, star formation, and current theories about dark matter.
```

**Why it's AI**: LLMs overuse "from...to" because it's a productive pattern in training data. It often creates false equivalence.

---

## STYLE PATTERNS (Patterns 13–18)

These patterns involve formatting, punctuation, and visual presentation.

### Pattern 13: Em Dash Overuse

**Trigger**: Count em dashes (—) in a paragraph. LLM text typically has 2–3+ per paragraph where human text has 0–1.

**Problem**: LLMs use em dashes (—) more than humans, mimicking "punchy" sales writing.

**Decision Tree**:

1. Are there 2+ em dashes in a single paragraph?
2. Could a comma, semicolon, or period replace the em dash?
3. Does the em dash add emphasis or just break up the sentence?

**Example**:

```
Before: The term is primarily promoted by Dutch institutions—not by the people
themselves. You don't say "Netherlands, Europe" as an address—yet this mislabeling
continues—even in official documents.

After: The term is primarily promoted by Dutch institutions, not by the people
themselves. You don't say "Netherlands, Europe" as an address, yet this mislabeling
continues in official documents.
```

**Why it's AI**: Sales copy and persuasive writing (over-represented in training data) overuse em dashes. LLMs mimic this style.

---

### Pattern 14: Overuse of Boldface

**Trigger**: Count bold phrases. 3+ bold phrases in a short section signals AI text.

**Problem**: AI chatbots emphasize phrases in boldface mechanically without regard for readability.

**Decision Tree**:

1. Count bold phrases in a section
2. Are they emphasizing key terms or just highlighting randomly?
3. Would the text be clearer without the bold?

**Example**:

```
Before: It blends **OKRs (Objectives and Key Results)**, **KPIs (Key Performance
Indicators)**, and visual strategy tools such as the **Business Model Canvas (BMC)**
and **Balanced Scorecard (BSC)**.

After: It blends OKRs, KPIs, and visual strategy tools like the Business Model
Canvas and Balanced Scorecard.
```

**Why it's AI**: Markdown formatting is common in chatbot outputs. LLMs use bold to indicate importance without stylistic judgment.

---

### Pattern 15: Inline-Header Vertical Lists

**Trigger**: Look for lists where each item starts with a bold label followed by a colon and explanation.

**Problem**: AI outputs lists where items start with bolded headers followed by colons, creating artificial structure.

**Decision Tree**:

1. Does each list item start with **Bold Label:**?
2. Are the explanations just rephrasing the label?
3. Would a simpler list or prose paragraph work better?

**Example**:

```
Before:
- **User Experience:** The user experience has been significantly improved with a new interface.
- **Performance:** Performance has been enhanced through optimized algorithms.
- **Security:** Security has been strengthened with end-to-end encryption.

After: The update improves the interface, speeds up load times through optimized
algorithms, and adds end-to-end encryption.
```

**Why it's AI**: This structure is common in chatbot outputs because it's easy to generate. Humans use varied list formats.

---

### Pattern 16: Title Case in Headings

**Trigger**: Look for headings where every main word is capitalized.

**Problem**: AI chatbots capitalize all main words in headings (Title Case), which is becoming less standard in professional writing.

**Decision Tree**:

1. Is every main word capitalized (Title Case)?
2. Is the document's style guide unclear or flexible?
3. Would sentence case (capitalize first word only) be more modern?

**Example**:

```
Before: ## Strategic Negotiations And Global Partnerships

After: ## Strategic negotiations and global partnerships
```

**Why it's AI**: LLMs default to Title Case because it's over-represented in training data (titles, headers). Modern style guides prefer sentence case.

---

### Pattern 17: Emojis

**Trigger**: Presence of emojis in headings or bullet points.

**Problem**: AI chatbots often decorate headings or bullet points with emojis mechanically.

**Decision Tree**:

1. Are emojis present in headings or formal sections?
2. Do they add meaning or just visual noise?
3. Would the text be clearer without them?

**Example**:

```
Before: 🚀 **Launch Phase:** The product launches in Q3
💡 **Key Insight:** Users prefer simplicity
✅ **Next Steps:** Schedule follow-up meeting

After: The product launches in Q3. User research showed a preference for
simplicity. Next step: schedule a follow-up meeting.
```

**Why it's AI**: Emojis are overused in chatbot outputs for visual appeal. Professional writing uses them rarely.

---

### Pattern 18: Curly Quotation Marks

**Trigger**: Presence of curly quotes ("...") instead of straight quotes ("...").

**Problem**: ChatGPT uses curly quotes ("...") instead of straight quotes ("..."), which is non-standard for code and technical writing.

**Decision Tree**:

1. Are quotation marks curved/curly ("...") instead of straight ("")?
2. Is this a technical document where straight quotes are required?
3. Should all quotes be converted for consistency?

**Example**:

```
Before: He said "the project is on track" but others disagreed.

After: He said "the project is on track" but others disagreed.
```

**Why it's AI**: ChatGPT's formatting model generates curly quotes by default. Proper technical writing uses straight quotes.

---

## COMMUNICATION PATTERNS (Patterns 19–21)

These patterns involve chatbot formality and disclaimers.

### Pattern 19: Collaborative Communication Artifacts

**Trigger words**: I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., Let me know, Here is a...

**Problem**: Text meant as chatbot correspondence (with "I hope this helps!" sign-offs) gets pasted as content.

**Decision Tree**:

1. Does the text include "I hope this helps" or "Let me know if..."?
2. Are there markers of chatbot conversation (Certainly!, Of course!)?
3. Is the tone inappropriately servile or deferential?

**Example**:

```
Before: Here is an overview of the French Revolution. I hope this helps! Let me
know if you'd like me to expand on any section.

After: The French Revolution began in 1789 when financial crisis and food
shortages led to widespread unrest.
```

**Why it's AI**: These phrases are standard in LLM conversation mode. They leak into output when content is copied without editing.

---

### Pattern 20: Knowledge-Cutoff Disclaimers

**Trigger words**: as of [date], Up to my last training update, While specific details are limited/scarce..., Based on available information..., To the best of my knowledge...

**Problem**: AI disclaimers about incomplete information get left in text.

**Decision Tree**:

1. Does the text include a knowledge-cutoff disclaimer?
2. Is it apologizing for missing details instead of finding them?
3. Should this disclaimer be removed entirely?

**Example**:

```
Before: While specific details about the company's founding are not extensively
documented in readily available sources, it appears to have been established
sometime in the 1990s.

After: The company was founded in 1994, according to its registration documents.
```

**Why it's AI**: LLMs use these disclaimers to hedge uncertain claims. Humans either find the information or state it clearly as missing.

---

### Pattern 21: Sycophantic/Servile Tone

**Trigger words**: Great question!, You're absolutely right!, That's an excellent point!, I completely understand...

**Problem**: Overly positive, people-pleasing language that signals chatbot output.

**Decision Tree**:

1. Is the text excessively agreeable or flattering?
2. Does it validate the reader without adding substance?
3. Would a more neutral tone be more credible?

**Example**:

```
Before: Great question! You're absolutely right that this is a complex topic.
That's an excellent point about the economic factors.

After: The economic factors you mentioned are relevant here.
```

**Why it's AI**: LLMs are trained to be helpful and agreeable. This training shows as excessive positivity in output.

---

## FILLER AND HEDGING (Patterns 22–24)

These patterns involve unnecessary words and over-qualification.

### Pattern 22: Filler Phrases

**Trigger**: Look for multi-word phrases that could be shorter.

**Problem**: Wordy constructions that add no meaning.

**Common replacements**:

- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that it was raining" → "Because it was raining"
- "At this point in time" → "Now"
- "In the event that you need help" → "If you need help"
- "The system has the ability to process" → "The system can process"
- "It is important to note that the data shows" → "The data shows"
- "In the course of" → "During"
- "With the exception of" → "Except for"
- "Taking into account" → "Considering"
- "In spite of the fact that" → "Although"

**Why it's AI**: LLMs default to formal, wordy constructions because they're common in training data.

---

### Pattern 23: Excessive Hedging

**Trigger**: Count hedging words: could, might, may, possibly, apparently, arguably, somewhat, fairly, perhaps, it seems, tends to.

**Problem**: Over-qualifying statements with hedging that weakens the message.

**Decision Tree**:

1. Does every statement have a hedging qualifier?
2. Are claims so qualified they become meaningless?
3. Could the hedging be removed entirely?

**Example**:

```
Before: It could potentially possibly be argued that the policy might have some
effect on outcomes.

After: The policy may affect outcomes.
```

**Why it's AI**: LLMs hedge to avoid false claims. But excessive hedging signals unconfident AI output.

---

### Pattern 24: Generic Positive Conclusions

**Trigger**: Final paragraphs with vague upbeat language.

**Problem**: Conclusions that say nothing concrete.

**Example**:

```
Before: The future looks bright for the company. Exciting times lie ahead as they
continue their journey toward excellence. This represents a major step in the right
direction.

After: The company plans to open two more locations next year.
```

**Why it's AI**: LLMs generate optimistic conclusions as a way to end positively without committing to specifics.

---

## Pattern Interdependencies

When fixing multiple patterns, use this priority order:

- **Fix Pattern 8 (copula avoidance) BEFORE Pattern 1 (inflated symbolism)** — Using "is" instead of "serves as" often resolves significance inflation
- **Fix Pattern 9 (negative parallelisms) BEFORE Pattern 10 (rule of three)** — Parallelisms often create false three-item groups
- **Fix Pattern 7 (AI vocabulary) BEFORE Pattern 4 (promotional language)** — Removing AI words often eliminates promotional tone
- **Fix Pattern 22 (filler) BEFORE Pattern 23 (hedging)** — Shorter sentences reduce need for hedging

---

## Reference Tables

### By Document Type

| Document Type | Priority Patterns | Why |
| --- | --- | --- |
| Blog/Opinion | 1, 3, 4, 7, 9, 10, 13 | Remove inflated, promotional, wordy language |
| Technical Docs | 4, 6, 7, 8, 13, 22 | Remove wordiness and promotional tone |
| Published Articles | 1, 2, 5, 7, 13, 19 | Remove puff, attribution, and chatbot artifacts |
| Academic Writing | 1, 5, 8, 22, 23 | Fix vague attribution, wordiness, hedging |
| Press Releases | 2, 4, 7, 9, 21 | Remove hype and excessive tone |
| Product Descriptions | 3, 4, 7, 10, 14, 15 | Remove marketing language and artificial structure |

### Highest-Confidence Indicators of AI Writing

These patterns, when present in combination, strongly indicate AI authorship:

1. **Pattern 7 + Pattern 13**: AI vocabulary words appearing alongside em dash overuse
2. **Pattern 4 + Pattern 10**: Promotional language organized into rule-of-three lists
3. **Pattern 1 + Pattern 3**: Inflated symbolism with multiple "-ing" phrases
4. **Pattern 6 + Pattern 8**: Formulaic "Challenges" section using copula avoidance
5. **Pattern 19 + Pattern 20**: Chatbot artifacts mixed with knowledge-cutoff disclaimers

---

## Quick Pattern Lookup

**If text feels inauthentic but you're not sure why:**

- Unnatural rhythm? → Pattern 13 (em dashes) or Pattern 10 (rule of three)
- Too formal/stiff? → Pattern 7 (AI vocab) or Pattern 22 (filler)
- Too promotional? → Pattern 4 (promotional language) or Pattern 21 (sycophantic tone)
- Vague claims? → Pattern 2 (notability) or Pattern 5 (attribution)
- Artificial structure? → Pattern 6 (formulaic sections) or Pattern 15 (inline headers)
- Excessive emphasis? → Pattern 1 (inflated symbolism) or Pattern 14 (bold overuse)
