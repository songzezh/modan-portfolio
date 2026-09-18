# Lightbox

`lightbox.ts` exports `initializeLightbox(dialog)`. The matching Astro component
initializes it once per dialog and ships JavaScript only where it is included.

To reuse it, render `<Lightbox id="unique-viewer" label="Project photographs" />`
and link each thumbnail to its full image using
`<a href="/image.webp" data-lightbox="unique-viewer" data-caption="Optional caption">`.
Each link must contain an image with meaningful alt text. Without JavaScript,
the link still opens the original image. Modified clicks retain normal behavior.

Native modal dialog behavior makes the page behind it inert. Focus starts on
Close, cycles among controls, and returns to the original link. Escape, Close,
and backdrop taps dismiss it. Previous/next, arrow keys, and horizontal touch
swipes cycle through the group; navigation is hidden for a single image.
Scroll position and existing inline body styles are restored when closing.

Images use object-fit contain. Tapping letterboxing counts as a backdrop tap;
tapping the photograph does not close it. Vertical gestures and pinch zoom
are retained. Controls remain visible and no animated transitions are used,
including when reduced motion is requested. Failed images expose a status
message while navigation and closing remain available.

## Gallery filtering

`gallery-filter.ts` exports `initializeGalleryFilter(gallery)`. `/work` supplies
static series with space-separated `data-categories` values. The module reveals
hidden filter controls only after it can initialize successfully. Without
JavaScript, all content and project links remain usable.

Native buttons support Tab, Enter, and Space, expose `aria-pressed`, and keep
focus in the controls while results change. A polite status announces the
category and count. Nonmatching entries use `hidden`, removing their links from
keyboard navigation. Empty results offer a message; All restores every entry.
Visible rows retain alternating alignment and original series numbers.

Filtering uses a short token-based opacity change, cancels in-progress effects
on rapid selections, and skips animation under reduced motion. No library,
network request, or page reload is required.
