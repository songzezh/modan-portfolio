import { matchesGearFilters, type GearFacets, type GearFilterKey } from '../lib/gear-filters';

/** Enhance the complete server-rendered list; never fetch or recreate its content. */
export function initializeGearFilter(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-gear-filters]');
  const count = root.querySelector<HTMLElement>('[data-gear-count]');
  const empty = root.querySelector<HTMLElement>('[data-gear-empty]');
  if (!form || !count || !empty) return;
  const selects = Array.from(form.querySelectorAll<HTMLSelectElement>('select'));
  const additionalCount = form.querySelector<HTMLElement>('[data-gear-additional-count]');
  const additionalSelects = Array.from(form.querySelectorAll<HTMLSelectElement>('details select'));
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-gear-item]')).map(element => ({
    element, facets: JSON.parse(element.dataset.facets ?? '{}') as GearFacets,
  }));
  function update() {
    let shown = 0;
    const selections = Object.fromEntries(selects.map(select => [select.name, select.value])) as Partial<Record<GearFilterKey, string>>;
    for (const { element, facets } of items) {
      const matches = matchesGearFilters(facets, selections);
      element.hidden = !matches;
      if (matches) shown++;
    }
    count!.textContent = `${shown} of ${items.length} ${items.length === 1 ? 'item' : 'items'} shown`;
    empty!.hidden = shown !== 0;
    const active = additionalSelects.filter(select => select.value).length;
    if (additionalCount) additionalCount.textContent = active ? `(${active} active)` : '';
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => {
    // Reset explicitly before updating; the native reset happens after this event.
    selects.forEach(select => { select.value = ''; });
    update();
  });
  update();
  form.hidden = false;
}
