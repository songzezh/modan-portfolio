# Gear Kits

Store one JSON file per saved kit here, named after its `slug`. The collection is
intentionally empty until actual gear records and kit combinations are available.
Light Travel Kit, Tokyo Street Kit, Night Walk Kit, and Portrait Kit are possible
names, not predefined combinations or recommendations.

The model is defined in `src/lib/gear-kit-schema.ts`, with inferred `GearKit` and
`GearKitInput` types. `getGearKits()` resolves equipment and derives weight at build
time. `/gear/kits` renders the result as static HTML with no JavaScript required.

| Field | Content |
| --- | --- |
| `slug` | Lowercase, hyphen-separated identifier matching the JSON filename |
| `name` | Nonempty kit name |
| `description` | Nonempty description of the saved combination |
| `scenarios` | At least one nonempty photography situation |
| `gearItemSlugs` | At least one existing gear slug; no duplicates |
| `notes` | Array of nonempty note paragraphs; defaults to an empty array |

Reference `src/content/gear` entries by slug; never copy names, specifications,
prices, or weights into kit records. Missing references fail the page build with
the kit and equipment slugs in the error. Equipment follows the authored slug
order. Kits use slug order for a stable sequence, without ranking.

Total weight is calculated only when **every** referenced item has a `weight`
specification with a finite, nonnegative numeric value and a `g` or `kg` unit.
Kilograms are converted to grams and the sum is displayed in grams (up to three
decimal places). Zero is a recorded value; omitted data is not zero. Text such as
`"about 500"`, unitless numbers, and unsupported units leave the total unavailable.
The sum describes the recorded equipment weights, not a measured packed bag.
There are no rankings, optimization rules, or recommendations.
