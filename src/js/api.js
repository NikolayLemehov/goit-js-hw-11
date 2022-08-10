import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const ACCOUNT_KEY = '25229838-e8373b6bc5a1f136e8625ae65';
export const ITEMS_PER_PAGE = 4;

export async function getSearchImage({value, page = 1}) {
  const options = {
    params: {
      key: ACCOUNT_KEY,
      q: value,
      page: page,
      per_page: ITEMS_PER_PAGE,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    }
  }
  const { data } = await axios.get(`${BASE_URL}`, options)
  return data;
}
