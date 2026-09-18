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
