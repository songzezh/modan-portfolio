import { comparisonRows, parseComparisonSelection, type ComparisonItem } from '../lib/gear-comparison';

export function initializeGearComparison(root: HTMLElement): void {
  const items: ComparisonItem[] = JSON.parse(root.dataset.items ?? '[]');
  const selects = Array.from(root.querySelectorAll<HTMLSelectElement>('[data-compare-select]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-compare-remove]'));
  const controls = root.querySelector<HTMLElement>('[data-compare-controls]')!;
  const output = root.querySelector<HTMLElement>('[data-compare-output]')!;
  const status = root.querySelector<HTMLElement>('[data-compare-status]')!;
  const head = root.querySelector<HTMLTableSectionElement>('[data-compare-head]')!;
  const body = root.querySelector<HTMLTableSectionElement>('[data-compare-body]')!;
  if (items.length < 2) return;

  function render() {
    const slugs = selects.map(select => select.value).filter(Boolean);
    const selected = slugs.map(slug => items.find(item => item.slug === slug)!);
    selects.forEach((select, index) => {
      Array.from(select.options).forEach(option => {
        option.disabled = !!option.value && option.value !== select.value && slugs.includes(option.value);
      });
      buttons[index].disabled = !select.value;
      buttons[index].setAttribute('aria-label', select.value
        ? `Remove ${items.find(item => item.slug === select.value)!.name} from item ${index + 1}`
        : `Remove item ${index + 1}`);
    });
    head.replaceChildren();
    body.replaceChildren();
    output.hidden = selected.length < 2;
    status.textContent = selected.length < 2
      ? `${selected.length} selected. Choose ${2 - selected.length} more ${selected.length === 1 ? 'item' : 'items'} to compare.`
      : `Comparing ${selected.length} items. Selections are saved in the page address.`;
    if (selected.length < 2) return;
    const heading = document.createElement('tr');
    const corner = document.createElement('th');
    corner.scope = 'col';
    corner.textContent = 'Field';
    heading.append(corner);
    selected.forEach(item => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      const link = document.createElement('a');
      link.href = `/gear/${item.slug}`;
      link.textContent = item.name;
      cell.append(link);
      heading.append(cell);
    });
    head.append(heading);
    comparisonRows(selected).forEach(row => {
      const tr = document.createElement('tr');
      const label = document.createElement('th');
      label.scope = 'row';
      label.textContent = row.label;
      tr.append(label);
      row.values.forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value || 'Not recorded';
        tr.append(cell);
      });
      body.append(tr);
    });
  }

  function saveURL(replace = false) {
    const url = new URL(window.location.href);
    const slugs = selects.map(select => select.value).filter(Boolean);
    if (slugs.length) url.searchParams.set('items', slugs.join(','));
    else url.searchParams.delete('items');
    if (url.href !== window.location.href) {
      if (replace) window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
    }
  }
  function readURL() {
    const slugs = parseComparisonSelection(window.location.search, items);
    selects.forEach((select, index) => { select.value = slugs[index] ?? ''; });
    render();
    saveURL(true);
  }
  selects.forEach(select => select.addEventListener('change', () => { render(); saveURL(); }));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    selects[index].value = '';
    render();
    saveURL();
    selects[index].focus();
  }));
  window.addEventListener('popstate', readURL);
  readURL();
  controls.hidden = false;
}
