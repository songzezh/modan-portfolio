JOURNAL AUTHORING

Add a lowercase-hyphenated .md file here. Its filename becomes the URL slug,
for example at-the-waterline.md -> /journal/at-the-waterline.

Required frontmatter: title, date (quoted YYYY-MM-DD), description, coverImage,
and location (text or null if unknown). Optional: tags (text array), draft
(defaults false), placeholder (defaults false). Drafts are excluded from both
the index and generated routes. Dates are editorial publication dates, displayed
in UTC to avoid changing days across time zones. Entries sort newest first.

coverImage uses the shared image schema: id, src, width, height, orientation,
alt, optional caption, and optional sources [{src, width}]. Use optimized
public assets or HTTPS sources. Supply accurate intrinsic dimensions and alt
text. See the two clearly labeled sample entries for complete examples.

Write the Markdown body after the closing frontmatter delimiter. Start headings
at ## because the template renders the entry title as h1. Standard paragraphs,
links, images, lists, quotes, and tables are supported. Raw HTML figures may be
used when a body image needs width/height attributes or a figcaption.

All pages are static and ship no client-side JavaScript. Replace sample content,
dates, and placeholder photography before publication. Location is left unknown
in the samples rather than inferred from placeholder images.
