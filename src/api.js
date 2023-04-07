import axios from 'axios';
export default class ApiServer {
  constructor() {
    this.searchQ = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async requestApi() {
    console.log(this);
    const MY_KEY = '35162356-3adee6cd6c753927eb601dc6e';
    const BASE_URL = 'https://pixabay.com/api/';

    const response = await axios.get(
      `${BASE_URL}?key=${MY_KEY}&q=${this.searchQ}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    console.log(response);

    this.totalHits = response.data.totalHits;
    if (!response.data.hits) {
      throw new Error('Error');
    }

    return response.data.hits;
  }

  totalHitsMessage() {
    return this.perPage * this.page;
  }

  incrementPage() {
    this.page += 1;
  }

  updatePage() {
    this.page = 1;
  }

  get query() {
    return this.searchQ;
  }

  set query(newQuery) {
    this.searchQ = newQuery;
  }
}