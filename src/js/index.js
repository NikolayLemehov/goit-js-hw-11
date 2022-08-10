import '../css/styles.css';
import '../css/gallery.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearchImage, ITEMS_PER_PAGE } from './api';
import { photoCardTemplate } from './templates/photo-card.template';
import { Notify } from 'notiflix';

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

  removeChildren(refs.gallery);
  const inputValue = refs.formInput.value.trim();
  // const inputValue = 'towel';
  if (inputValue === '') {
    Notify.warning(`Enter, please, any value in the field.`);

    return false;
  }
  return loadingImages(1, inputValue)();
}

function loadingImages(page, value) {
  return async () => {
    removeMoreEvent(onClickLoadMoreBtn);

    try {
      const data = await getSearchImage({ page, value });
      if (data.totalHits === 0 && page === 1) {
        Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
      }
      if (page === 1) {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
      renderGalleryList(data.hits);

      const isVisibleBtn = getIsVisibleLoadMoreBtn({
        totalHits: data.totalHits,
        page,
        perPage: ITEMS_PER_PAGE,
      });

      if (isVisibleBtn) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        onClickLoadMoreBtn = loadingImages(page + 1, value);
        refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn,
          { once: true });
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(`We're sorry, but you've reached the end of search results.`);
      }
    } catch (e) {
      Notify.failure(e.message);
    }
  };
}

function removeMoreEvent(onEvent) {
  if (onEvent) {
    refs.loadMoreBtn.removeEventListener('click', onEvent);
    onEvent = null;
  }
}

function renderGalleryList(images) {
  const templates = images.map(img => photoCardTemplate(img)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', templates);
  if (gallery) {
    gallery.refresh();
  } else {
    gallery = new SimpleLightbox('.gallery a');
  }
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