import type { Gear, GearCategory, GearSpec, GearStatus } from './gear-schema';

export const categoryLabels: Record<GearCategory, string> = {
  camera: 'Camera', lens: 'Lens', 'film-camera': 'Film camera', accessory: 'Accessory',
};
export const statusLabels: Record<GearStatus, string> = {
  owned: 'Owned', 'previously-owned': 'Previously owned', borrowed: 'Borrowed', wishlist: 'Wishlist',
};
export function formatSpec(spec: GearSpec): string {
  const value = typeof spec.value === 'boolean' ? (spec.value ? 'Yes' : 'No') : String(spec.value);
  return spec.unit ? `${value} ${spec.unit}` : value;
}
export function lensMount(gear: Gear): string {
  const spec = gear.specs.find(({ key }) => key === 'lens-mount');
  return spec ? formatSpec(spec) : '';
}
