export async function loadFeed() {
  const response = await fetch('./data/sample-feed.json');
  if (!response.ok) {
    throw new Error(`Feed load failed: ${response.status}`);
  }
  return response.json();
}
