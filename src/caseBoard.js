export function createCaseBoard() {
  const pinned = [];

  return {
    pin(article) {
      if (!article || pinned.find((item) => item.id === article.id)) return pinned;
      pinned.push(article);
      return pinned;
    },
    list() {
      return pinned;
    },
  };
}
