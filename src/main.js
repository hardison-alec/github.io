import { loadFeed } from './feed.js';
import { createCaseBoard } from './caseBoard.js';
import { mountInteractiveGlobe } from './globe.js';

const feedList = document.querySelector('#feed-list');
const articleDetail = document.querySelector('#article-detail');
const pinButton = document.querySelector('#pin-article');
const caseItems = document.querySelector('#case-items');
const globeRoot = document.querySelector('#globe-root');

const caseBoard = createCaseBoard();
const destroyGlobe = mountInteractiveGlobe(globeRoot);

let selectedArticle = null;

function renderDetail(article) {
  if (!article) {
    articleDetail.textContent = 'Select an article from the feed.';
    return;
  }

  articleDetail.innerHTML = `
    <h3>${article.title}</h3>
    <p><strong>Source:</strong> ${article.source} | <strong>Region:</strong> ${article.region}</p>
    <p><strong>Summary:</strong> ${article.summary}</p>
    <p><strong>Entities:</strong> ${article.entities.join(', ')}</p>
    <p><strong>Classification:</strong> ${article.classification}</p>
  `;
}

function renderCaseBoard() {
  const items = caseBoard.list();
  caseItems.innerHTML = items.map((item) => `<li>${item.title} <span class="muted">(${item.source})</span></li>`).join('');
}

function renderFeed(articles) {
  feedList.innerHTML = '';

  articles.forEach((article) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.innerHTML = `<strong>${article.title}</strong><br /><small>${article.source} · ${article.region}</small>`;
    button.addEventListener('click', () => {
      selectedArticle = article;
      renderDetail(article);
      [...feedList.querySelectorAll('button')].forEach((el) => el.classList.remove('active'));
      button.classList.add('active');
    });
    li.appendChild(button);
    feedList.appendChild(li);
  });
}

pinButton.addEventListener('click', () => {
  caseBoard.pin(selectedArticle);
  renderCaseBoard();
});

loadFeed()
  .then((articles) => {
    renderFeed(articles);
    if (articles.length > 0) {
      selectedArticle = articles[0];
      renderDetail(articles[0]);
      const firstButton = feedList.querySelector('button');
      if (firstButton) firstButton.classList.add('active');
    }
  })
  .catch((error) => {
    articleDetail.textContent = `Failed to load feed: ${error.message}`;
  });

window.addEventListener('beforeunload', destroyGlobe);
