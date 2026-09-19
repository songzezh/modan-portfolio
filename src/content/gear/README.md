# Gear Archive data

Add one JSON file per item here. The filename must match its lowercase,
hyphen-separated `slug` (for example, `example-camera.json`). This directory is
intentionally empty of gear records until real archive details are supplied.
The collection feeds `/gear`, `/gear/archive`, and `/gear/[slug]`.
The slugs `archive`, `compare`, and `kits` are reserved for gear pages and must not be used for items.
The first two specifications appear in archive rows; put identifying details first.
For mount filtering, use the specification key `lens-mount` with a text value
(for example `Fujifilm X`). Use consistent brand, mount, and usage scenario wording:
filters match these values exactly and combine all selected filters.

Archive filters appear only when the collection provides values. Category, brand,
and status are always derived from their fields; other filters live under “More
filters”. All entries remain visible and linked when JavaScript is unavailable.

| Archive filter | Source |
| --- | --- |
| Mount | `lens-mount` spec (or `mount` when absent) |
| Focal length | `focal-length` spec, including its unit; use `mm` for numeric values or text such as `24–70` with `mm` for zooms |
| Usage scenario | Each entry in `usageScenarios` |
| Stabilization | `stabilization` spec (or `image-stabilization` when absent) |
| Weather sealing | `weather-sealing` spec (or `weather-sealed` when absent) |
| Weight range | Numeric nonnegative `weight` in `g` or `kg` |

Use booleans for explicit yes/no specifications; false is shown as “No”, while
missing data is never inferred to mean “No”. Descriptive text is also supported.
Focal-length options match recorded values, including full zoom ranges; no lens
equivalence or range overlap is inferred. Weight bins are under 250 g,
250–<500 g, 500–<1,000 g, 1,000–<2,000 g, and 2,000 g and above. Only populated
bins appear. Missing or unsupported weights remain visible under “All” but do
not match a weight range. All filters combine with AND; Clear filters restores
every item, including those with missing specifications.

`/gear/compare` compares two to four entries and restores selections from
`?items=slug-a,slug-b`. Specifications align by their stable `key`, not their label
or array position. Use the same key for equivalent fields and consistent labels.
Units remain as recorded; no conversion, scoring, or recommendations are applied.
Missing values are shown as “Not recorded”; entirely empty rows are omitted.
Personal notes and purchase history are not included in the product comparison.

`src/lib/gear-schema.ts` defines runtime validation and inferred TypeScript types.
Use `GearInput` when authoring input in TypeScript, `Gear` for parsed data, and
`GearEntry` / `getGear()` from `src/lib/gear.ts` for Astro collection access.

Required fields: `slug`, `name`, `brand`, `category`, `status`, and `summary`.

- Categories: `camera`, `lens`, `film-camera`, `accessory`.
- Statuses: `owned`, `previously-owned`, `borrowed`, `wishlist`.
- `releaseYear`: optional integer year from 1800 to 9999.
- `image`: optional `{ "src": "/images/gear/example.jpg", "alt": "Description" }`.
  Sources accept root-relative public asset paths or HTTPS URLs.
- `specs`: array of `{ "key": "weight", "label": "Weight", "value": 500, "unit": "g" }`.
  Keys are unique slugs within an item; values may be text, numbers, or booleans.
  Units are optional. Add specification keys as needed for any category.
  Kit totals require a numeric, nonnegative `weight` value with unit `g` or `kg`
  on every included item. Missing or unsupported measurements suppress the total.
- `usageScenarios` and `personalNotes`: arrays of nonempty text entries.
- `ownershipDates`: optional object with optional `acquired` and `relinquished`
  dates in `YYYY-MM-DD` format. The end date cannot precede the start date.
- `purchasePrice`: optional nonnegative number in major currency units;
  zero means free, while omission means unknown or not applicable.
- `currency`: optional uppercase three-letter currency code (for example `CNY`),
  required when a purchase price is present. Code shape is validated, not membership
  in a currency registry.
- `relatedProjectSlugs`: array of project slugs matching JSON filenames in
  `src/content/projects`. Slug format is validated; project existence is not checked.

All arrays default to empty. Omit unknown optional fields instead of inventing
values or using empty strings. Status does not imply known ownership dates or a
purchase. Keep factual specifications and personal writing in their respective
fields. The model has no ratings, scores, rankings, pros/cons, or recommendation logic.
