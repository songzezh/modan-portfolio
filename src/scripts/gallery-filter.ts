const enhanced = new WeakSet<HTMLElement>();

/** Enhance server-rendered content only after all controls have been found. */
export function initializeGalleryFilter(gallery: HTMLElement): void {
  if (enhanced.has(gallery)) return;
  const controls = gallery.querySelector<HTMLElement>('[data-filter-controls]');
  const list = gallery.querySelector<HTMLElement>('[data-filter-list]');
  const status = gallery.querySelector<HTMLElement>('[data-filter-status]');
  const empty = gallery.querySelector<HTMLElement>('[data-filter-empty]');
  if (!controls || !list || !status || !empty) return;
  const buttons = [...controls.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const items = [...list.querySelectorAll<HTMLElement>('[data-categories]')];
  if (!buttons.length) return;
  enhanced.add(gallery);
  let selected = 'all';
  let animation: Animation | undefined;

  controls.addEventListener('click', (event) => {
    const button = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('button[data-filter]') : null;
    if (!button || !buttons.includes(button)) return;
    const filter = button.dataset.filter!;
    if (filter === selected) return;
    selected = filter;
    animation?.cancel();
    let count = 0;
    for (const item of items) {
      const matches = filter === 'all' || item.dataset.categories?.split(' ').includes(filter);
      item.hidden = !matches;
      item.classList.toggle('series--alternate', Boolean(matches && count % 2));
      if (matches) count++;
    }
    buttons.forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
    const label = button.textContent?.trim() ?? filter;
    status.textContent = `${label}: ${count} series shown.`;
    empty.hidden = count !== 0;
    empty.textContent = filter === 'all' ? 'New photography series will appear here.'
      : `No ${label.toLowerCase()} series yet. Choose another filter or view All.`;
    list.hidden = count === 0;
    if (count && !matchMedia('(prefers-reduced-motion: reduce)').matches && typeof list.animate === 'function') {
      const duration = parseFloat(getComputedStyle(gallery).getPropertyValue('--duration-fast')) || 0;
      animation = list.animate([{ opacity: 0.8 }, { opacity: 1 }], { duration, easing: 'ease-out' });
    }
  });
  controls.hidden = false;
}
