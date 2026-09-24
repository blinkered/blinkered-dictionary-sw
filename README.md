# Blinkered dictionary: Swahili

The Swahili word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Swahili.

**16,596 of 28,300 candidates proved, 58.6%**, across 9 independent
families, 8 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Swahili, and why those
ATTESTATIONS.tsv   the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
searched.tsv       publishers fetched directly: per page, which candidates it held and how often
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Swahili list, which lives in
[`blinkered-attestation/candidates/sw`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/sw).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Swahili

**The families.** Swahili Wikipedia, which also ordered the candidates; two Leipzig packages
holding just 40,000 sentences between them; Tatoeba; two eBible translations (the Unlocked
Literal Bible and the contemporary Neno); the Internet Archive's Swahili shelf; and four
publishers fetched directly. There is no Swahili Wikisource and no Gutenberg shelf. The Bibles
matter more here than anywhere else in the game: after Wikipedia and the
Archive they are the best third family.

**The publishers count as fewer families than there are publishers.** `co.tz` and `co.ke` are not
in the registry's list of public suffixes, so `mwananchi.co.tz` counts as a publisher called
`co.tz` and `taifaleo.nation.co.ke` as one called `co.ke`. Every Tanzanian or Kenyan site under
those suffixes would be pooled into one family. That errs the safe way, under-counting
independence rather than inventing it, and it is why the harvest took one site from each.

**English in the list, and what came out.** Some candidates were plain English that the
hunspell validator let through, and Swahili Wikipedia, publishers and the Archive all quote English,
so the first build shipped SAID, YOU, SCHOOL, WORLD and MUSIC on real evidence. The candidate list
was cut on 2026-09-23 (see `candidates/sw/PROVENANCE.md` and `english.tsv` in
blinkered-attestation): 702 words went, 95 of which had been shipping, and the list now keeps 58.6%
of a 28,300-word list. Swahili words en.wiktionary has not reached were kept: EWE ("O you!"), NIPA
("give me"), PELE, KOA.

**Where the drop list points.** The first build read 89 Archive texts and kept 50.8%; this one
read 216 (45 of them legible) and kept 57.6%, reusing everything else from the record. 5,876 of
the 7,203 words still one family short are attested by the Archive and Wikipedia, and 784 by the
Bibles and Wikipedia. Swahili's missing register is modern prose from someone other than
Wikipedia: more publishers, and a larger news corpus than Leipzig has.

**Tiles.** Every tile spells some shipped word; V (821) and C (861) are the rarest.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list. It has to be re-measured before this list reaches the game, and
`status.json` says `"ships": "pending"` until somebody decides otherwise. Nobody has yet played
the boards this list deals.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `LGPL-2.1-or-later` | `dropped.tsv`, which is **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms, here `LGPL-2.1-or-later`.
