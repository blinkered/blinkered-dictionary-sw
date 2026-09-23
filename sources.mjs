/**
 * The collections that attest Kiswahili, and where each comes from.
 *
 * Kiswahili has a 29,002-word candidate list, ordered by Swahili Wikipedia and checked against the
 * Jambo hunspell dictionary. Wikipedia proposed the candidates, so it attests nearly all of them
 * by construction; every word still needs two families that had no say in the list.
 *
 * Those are thin for Swahili. Leipzig has only 40,000 news sentences, Tatoeba a few thousand,
 * and there is no Wikisource and no Gutenberg shelf. What carries the list is two eBible
 * translations and the Internet Archive, which catalogues several thousand Swahili texts.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly — the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
    harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'sw'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// News only, and all Leipzig has: 30,000 sentences of 2020 news and 10,000 of a 2011 crawl. The
// Leipzig Wikipedia packages are deliberately absent: they are Wikipedia text wearing a Leipzig
// label, so including one would corroborate `wiki:sw` while looking like another family.
const LEIPZIG = [
  'swa_news_2020_30K',
  'swa_newscrawl_2011_10K',
]

// Two translations, one family. The Unlocked Literal Bible is a word-for-word rendering and Neno
// a contemporary one, so between them they reach both a formal and an everyday register.
const EBIBLE = ['swhulb', 'swhonen']

const ALL = [
  {
    id: 'wiki:sw',
    what: 'Swahili Wikipedia — modern encyclopedic prose, and the list that proposed the candidates',
    needs: `${CACHE}swwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}swwiki.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg} — modern news, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/swh/swh_sentences.tsv.bz2',
    what: 'Tatoeba Swahili — contemporary and conversational, and small',
    needs: `${CACHE}swh_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}swh_sentences.tsv`),
  },
  ...EBIBLE.map((translation) => ({
    id: `ebible:${translation}`,
    from: `https://ebible.org/Scriptures/${translation}_vpl.zip`,
    what: `eBible ${translation} — a family nothing else here belongs to`,
    needs: `${CACHE}ebible-${translation}/${translation}_vpl.txt`,
    documents: () => verseDocuments(`${CACHE}ebible-${translation}/${translation}_vpl.txt`),
  })),
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Swahili books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-sw`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Swahili%22+OR+language%3A%22swa%22+OR+language%3A%22swh%22%29',
    documents: () => {
      const dir = `${CACHE}archive-sw`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Swahili publishers, for the harvest.
 *
 * Chosen because they publish in Swahili rather than because they are large. A harvester reads
 * whatever it fetches and has no idea what language it is in, so a domain that publishes mostly
 * in English would attest English words against these candidates. Every one answered when probed.
 *
 * `co.tz` and `co.ke` are not in the registry's list of public suffixes, so every Tanzanian and
 * Kenyan newspaper under them would count as a single publisher. That errs the safe way, losing
 * independence rather than inventing it, and is why only one of each is listed.
 */
export const DOMAINS = [
  'voaswahili.com', 'bongo5.com', 'millardayo.com', 'mwananchi.co.tz', 'taifaleo.nation.co.ke',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
