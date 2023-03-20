import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './servise/fetchCountries';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  Input: document.querySelector('#search-box'),
  CountryList: document.querySelector('.country-list'),
  CountryInfo: document.querySelector('.country-info'),
};

refs.Input.addEventListener('input', debounce(onInputType, DEBOUNCE_DELAY));

function onInputType(evt) {
  resetMarkup();

  const country = evt.target.value;

  if (country.trim() === '') return;
  fetchCountries(country)
    .then(renderMarkup)
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function resetMarkup() {
  refs.CountryList.innerHTML = '';
  refs.CountryInfo.innerHTML = '';
}

function renderMarkup(data) {
  if (data.length === 1) {
    renderMarkupCountry(data);
  } else if (data.length > 1 && data.length <= 10) {
    renderMarkupCountryItem(data);
  } else {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function renderMarkupCountry(data) {
  const markup = data
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class="country-info-wrapper">
      <img src="${flags.svg}" alt="flag" class="country_img">
      <h2>${name.official}</h2>
      </div> 
      <p class="country_description"><span></span>Capital:</span> ${capital}</p>
      <p class="country_description"><span>Population:</span> ${(
        population / 1000000
      ).toFixed(2)} million</p>
      <p class="country_description"><span>Languages:</span>  ${Object.values(
        languages
      )}</p>`;
    })
    .join('');

  refs.CountryInfo.insertAdjacentHTML('beforeend', markup);
}

function renderMarkupCountryItem(data) {
  const markup = data
    .map(({ flags, name }) => {
      return `<li class="country-item">
      <img src="${flags.svg}" alt="flag" class="country_img">
      <h3>${name.official}</h3>
      </li>`;
    })
    .join('');

  refs.CountryList.insertAdjacentHTML('beforeend', markup);
}
