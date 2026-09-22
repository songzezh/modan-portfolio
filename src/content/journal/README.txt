JOURNAL AUTHORING

Add a lowercase-hyphenated .md file here. Its filename becomes the URL slug,
for example at-the-waterline.md -> /journal/at-the-waterline.

Required frontmatter: title, date (quoted YYYY-MM-DD), description, and location
(text or null if unknown). Optional: work, tags (text array), draft (defaults
false), and placeholder (defaults false). Drafts are excluded from both the
index and generated routes. Dates are editorial publication dates, displayed in
UTC to avoid changing days across time zones. Entries sort newest first.

work is an optional, one-way reference to photography maintained in the Work
collection:

  work:
    project: at-the-edge
    image: shoreline

The project value matches a JSON filename/slug in src/content/projects; image
matches an image id inside that project. The build fails when either target is
missing. Journal pages read the photograph, alt text, dimensions, responsive
sources, and caption from Work, so image metadata is never duplicated here.
Omit work for a text-only journal entry. A reference links to the photograph's
detail route; that photograph page derives a backlink to the Journal at build
time without storing Journal metadata in the Work content file.

Write the Markdown body after the closing frontmatter delimiter. Start headings
at ## because the template renders the entry title as h1. Standard paragraphs,
links, images, lists, quotes, and tables are supported. Raw HTML figures may be
used when a body image needs width/height attributes or a figcaption.

All pages are static and ship no client-side JavaScript. Replace sample content,
dates, and placeholder photography before publication. Location is left unknown
in the samples rather than inferred from placeholder images.
