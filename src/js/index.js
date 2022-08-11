import '../css/styles.css';
import '../css/gallery.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearchImage, ITEMS_PER_PAGE } from './api';
import { photoCardTemplate } from './templates/photo-card.template';
import { Notify } from 'notiflix';

import { btnValue, initSwitchBtn } from './switchBtn';

let hasMoreButton = true;
let gallery = null;
let onClickLoadMoreBtn = null;
let currentPage = null;
const refs = {
  form: document.querySelector('.search-form'),
  formInput: document.querySelector('.search-form [name="searchQuery"]'),
  formBtn: document.querySelector('.search-form button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

initSwitchBtn();
refs.form.addEventListener('submit', onSubmitForm);
window.addEventListener('toggleLoadingType', (e) => {
  console.log(e.detail.type)
  switch (e.detail.type) {
    case btnValue.BUTTON:
      hasMoreButton = true;
      break;
    case btnValue.SCROLL:
      hasMoreButton = false;
      break;
  }
})

async function onSubmitForm(e) {
  e.preventDefault();

  removeChildren(refs.gallery);
  // const inputValue = refs.formInput.value.trim();
  const inputValue = 'towel';
  if (inputValue === '') {
    Notify.warning(`Enter, please, any value in the field.`);

    return false;
  }
  return loadingImages(1, inputValue)();
}

function loadingImages(page, value) {
  currentPage = page;
  return async () => {
    removeMoreEvent(onClickLoadMoreBtn);
    let data;

    try {
      data = await getSearchImage({ page, value });
    } catch (e) {
      Notify.failure(e.message);
    }

    if (data.totalHits === 0 && page === 1) {
      Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
    }
    if (page === 1) {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
    }

    renderGalleryList(data.hits)

    const isMoreItems = getIsVisibleLoadMoreBtn({
      totalHits: data.totalHits,
      page,
      perPage: ITEMS_PER_PAGE,
    });

    if (isMoreItems) {
      if (hasMoreButton) {
        addLoadMoreBtn(page, value);
      } else {
        addObserver(() => loadingImages(page + 1, value)());
      }
    } else {
      removeLoadMoreBtn();
    }
  };
}

// function implementLoadingType() {
//
// }

function addLoadMoreBtn(page, value) {
  refs.loadMoreBtn.classList.remove('is-hidden');
  onClickLoadMoreBtn = loadingImages(page + 1, value);
  refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn,
    { once: true });
}

function removeLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
  Notify.info(`We're sorry, but you've reached the end of search results.`);
}

function addObserver(cb) {
  const options = {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
  };
  const callback = (entries, observer) => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    cb();
    // observer.destroy();
    observer.unobserve(entry.target);
    // observer.observe(refs.gallery.lastElementChild);
  });
  const observer = new IntersectionObserver(callback, options);
  observer.observe(refs.gallery.lastElementChild);
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