import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createMarkup from './markup';
import Notiflix from 'notiflix';
import ApiServer from './api';
import LoadMoreBtn from './load-more-btn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMore: document.querySelector('.load-more'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});
console.log(loadMoreBtn);

const apiServer = new ApiServer();
const lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onClickBtn);

async function onSearch(evt) {
  evt.preventDefault();
  apiServer.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (apiServer.query === '') {
    return;
  }
  clearGallery();
  apiServer.updatePage();
  try {
    const hits = await apiServer.requestApi();
    requestApiMarkup(hits);
    if (apiServer.totalHits !== 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${apiServer.totalHits} images.`
      );
    }

    lightbox.refresh();
    loadMoreBtn.show();
    apiServer.incrementPage();
    emptyArray();
  } catch (error) {
    console.log(error);
  }
}

async function onClickBtn() {
  if (apiServer.query === '') {
    return;
  } else if (apiServer.totalHits <= apiServer.totalHitsMessage()) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreBtn.hide();
    return;
  }

  try{
  const hits = await apiServer.requestApi();
  requestApiMarkup(hits);
  lightbox.refresh();
  apiServer.incrementPage();
  }
  catch (error) {
    console.log(error);
  }
}

function requestApiMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function emptyArray() {
  if (apiServer.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.hide();
  }
}
