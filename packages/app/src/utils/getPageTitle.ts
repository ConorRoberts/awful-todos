export const getPageTitle = (title?: string) => {
  if (title) {
    return `${title} - Awful Todos`;
  }

  return `Awful Todos`;
};
