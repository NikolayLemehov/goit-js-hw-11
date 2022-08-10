import '../css/styles.css';
import '../css/gallery.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearchImage, ITEMS_PER_PAGE } from './api';
import { photoCardTemplate } from './templates/photo-card.template';

let gallery = null;
let onClickLoadMoreBtn = null;
const refs = {
  form: document.querySelector('.search-form'),
  formInput: document.querySelector('.search-form [name="searchQuery"]'),
  formBtn: document.querySelector('.search-form button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(e) {
  e.preventDefault();

  removeChildren(refs.gallery)
  const inputValue = refs.formInput.value.trim();
  // const inputValue = 'towel';
  if (inputValue === '') {
    return;
  }
  loadingImages(1, inputValue)().catch(console.log)
}

function loadingImages(page, value) {
  return async () => {
    if (onClickLoadMoreBtn) {
      refs.loadMoreBtn.removeEventListener('click', onClickLoadMoreBtn);
      onClickLoadMoreBtn = null;
    }
    try {
      const data = await getSearchImage({ page, value });
      renderGalleryList(data.hits);

      const isVisibleBtn = getIsVisibleLoadMoreBtn({
        totalHits: data.totalHits,
        page,
        perPage: ITEMS_PER_PAGE,
      });

      if (isVisibleBtn) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        onClickLoadMoreBtn = loadingImages(page + 1, value)
        refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn,
          { once: true });
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    } catch {}
  }
}

function renderGalleryList(images) {
  const templates = images.map(img => photoCardTemplate(img)).join('')
  if (gallery) {
    gallery.destroy();
  }
  refs.gallery.insertAdjacentHTML('beforeend', templates)
  gallery = new SimpleLightbox('.gallery a');
}

function removeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function getIsVisibleLoadMoreBtn({ totalHits, page, perPage }) {
  const pages = Math.ceil(totalHits / perPage);
  return pages > page;
}