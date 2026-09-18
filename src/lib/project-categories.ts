export const projectCategories = ['street', 'portrait', 'travel'] as const;
export const projectCategoryLabels: Record<typeof projectCategories[number], string> = {
  street: 'Street', portrait: 'Portrait', travel: 'Travel',
};
