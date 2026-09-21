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
  let selected: string | undefined;
  const selectCategory = (button?: HTMLButtonElement): void => {
    const filter = button?.dataset.filter === selected ? undefined : button?.dataset.filter;
    selected = filter;
    if (filter) controls.dataset.selected = filter;
    else delete controls.dataset.selected;
    let count = 0;
    for (const item of items) {
      const matches = !filter || item.dataset.categories?.split(' ').includes(filter);
      item.hidden = !matches;
      item.classList.toggle('series--alternate', Boolean(matches && count % 2));
      if (matches) count++;
    }
    let position = 0;
    buttons.forEach((control) => {
      const active = control.dataset.filter === filter;
      control.setAttribute('aria-pressed', String(active));
      if (control.parentElement) {
        control.parentElement.dataset.cloudPosition = active ? 'selected' : position++ === 0 ? 'before' : 'after';
      }
    });
    const label = filter ? button!.textContent?.trim() ?? filter : 'All';
    status.textContent = `${label}: ${count} series shown.`;
    empty.hidden = count !== 0;
    empty.textContent = filter ? `No ${label.toLowerCase()} series yet. Choose another category.` : 'New photography series will appear here.';
    list.hidden = count === 0;
  };
  controls.addEventListener('click', (event) => {
    const button = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('button[data-filter]') : null;
    if (!button || !buttons.includes(button)) return;
    selectCategory(button);
  });
  selectCategory();
  controls.hidden = false;
}
