const initialized = new WeakSet<HTMLDialogElement>();

/** Enhance matching image links; no global keyboard handlers or framework runtime. */
export function initializeLightbox(dialog: HTMLDialogElement): void {
  if (initialized.has(dialog) || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')]
    .filter((link) => link.dataset.lightbox === dialog.id);
  if (!links.length) return;
  initialized.add(dialog);

  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const stage = dialog.querySelector<HTMLElement>('[data-lightbox-stage]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]')!;
  const error = dialog.querySelector<HTMLElement>('[data-lightbox-error]')!;
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')!;
  const previous = dialog.querySelector<HTMLButtonElement>('[data-lightbox-previous]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;
  previous.hidden = next.hidden = links.length < 2;

  let index = 0;
  let opener: HTMLElement | null = null;
  let restoreScroll: (() => void) | undefined;
  let start: { x: number; y: number } | undefined;
  let backdropStart = false;

  function show(newIndex: number) {
    index = (newIndex + links.length) % links.length;
    const link = links[index];
    const thumbnail = link.querySelector('img')!;
    image.hidden = false;
    error.hidden = true;
    stage.setAttribute('aria-busy', 'true');
    image.alt = thumbnail.alt;
    caption.textContent = link.dataset.caption ?? '';
    caption.hidden = !caption.textContent;
    counter.textContent = `Photograph ${index + 1} of ${links.length}`;
    image.src = link.href;
  }

  image.addEventListener('load', () => stage.setAttribute('aria-busy', 'false'));
  image.addEventListener('error', () => {
    stage.setAttribute('aria-busy', 'false');
    image.hidden = true;
    error.hidden = false;
  });

  function open(newIndex: number, trigger: HTMLElement) {
    if (dialog.open) return;
    opener = trigger;
    show(newIndex);
    dialog.showModal();
    const x = window.scrollX;
    const y = window.scrollY;
    const bodyStyle = document.body.getAttribute('style');
    const rootOverflow = document.documentElement.style.overflow;
    const rootScrollBehavior = document.documentElement.style.scrollBehavior;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight);
    Object.assign(document.body.style, {
      position: 'fixed', top: `${-y}px`, left: `${-x}px`, width: '100%',
      paddingRight: `${padding + scrollbar}px`,
    });
    document.documentElement.style.overflow = 'hidden';
    restoreScroll = () => {
      if (bodyStyle === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', bodyStyle);
      document.documentElement.style.overflow = rootOverflow;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(x, y);
      document.documentElement.style.scrollBehavior = rootScrollBehavior;
    };
    closeButton.focus({ preventScroll: true });
  }

  links.forEach((link, position) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(position, link);
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  // Activate deliberate touch taps directly, including immediately after a swipe.
  // Cancel the synthesized click so navigation cannot advance twice.
  for (const button of [closeButton, previous, next]) {
    let tap: { x: number; y: number } | undefined;
    button.addEventListener('touchstart', (event) => {
      tap = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined;
    }, { passive: true });
    button.addEventListener('touchend', (event) => {
      const end = event.changedTouches[0];
      if (tap && !event.touches.length && Math.hypot(end.clientX - tap.x, end.clientY - tap.y) < 10) {
        event.preventDefault();
        button.click();
      }
      tap = undefined;
    }, { passive: false });
    button.addEventListener('touchcancel', () => { tap = undefined; });
  }
  dialog.addEventListener('close', () => {
    restoreScroll?.();
    restoreScroll = undefined;
    start = undefined;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (links.length > 1) show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === 'Tab') {
      const controls = [closeButton, previous, next].filter((button) => !button.hidden);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  function isBackdrop(event: PointerEvent): boolean {
    if (event.target === dialog || event.target === stage) return true;
    if (event.target !== image || !image.naturalWidth) return false;
    // object-fit: contain leaves clickable letterboxing around the actual photo.
    const rect = image.getBoundingClientRect();
    const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    return Math.abs(event.clientX - (rect.left + rect.width / 2)) > width / 2
      || Math.abs(event.clientY - (rect.top + rect.height / 2)) > height / 2;
  }
  dialog.addEventListener('pointerdown', (event) => { backdropStart = isBackdrop(event); });
  dialog.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'mouse' && backdropStart && isBackdrop(event)) dialog.close();
  });
  // Touch listeners preserve vertical scrolling and pinch zoom. Only deliberate
  // single-finger horizontal swipes navigate; taps on letterboxing close.
  dialog.addEventListener('touchstart', (event) => {
    start = event.touches.length === 1 && (event.target === image || event.target === stage || event.target === dialog)
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined;
  }, { passive: true });
  dialog.addEventListener('touchend', (event) => {
    if (!start || event.touches.length) { start = undefined; return; }
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    start = undefined;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (links.length > 1) show(index + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && backdropStart) dialog.close();
  }, { passive: true });
  dialog.addEventListener('touchcancel', () => { start = undefined; });
}
