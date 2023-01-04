import './css/styles.css';
import Notiflix from 'notiflix';
import API from './js/fetchCountries';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const countrySelector = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const list = document.querySelector('.country-list');

countrySelector.addEventListener(
  'input',
  debounce(searchCountry, DEBOUNCE_DELAY)
);

function searchCountry() {
  const name = countrySelector.value;
  name.length === 0
    ? (countryInfo.innerHTML = '')
    : name.length !== 0 &&
      API.fletchCountry(name)
        .then(countries => showList(countries))
        .then(country => showResult(country))
        .catch(error =>
          Notiflix.Notify.failure('Oops, there is no country with that name')
        );
}

function showList(countries) {
  list.innerHTML = '';

  if (countries.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1) {
    const markup = [];

    list.addEventListener('click', countrySelect);

    countries.forEach(({ flags, name }) => {
      markup.push(
        `<li data-name="${name.common}"><a href><img src="${flags.svg}" width="80"/>${name.official}</a></li>`
      );
    });

    list.innerHTML = markup.join('');
    return;
  } else if (countries.length === 1) {
    return countries[0];
  }

  return countries;
}

function showResult(country) {
  countryInfo.innerHTML = '';

  if (country) {
    const { flags, name, capital, population, languages } = country;

    const markup = `<div class="country-card"><img src="${
      flags.svg
    }" class="flag"/><h1>${
      name.official
    }</h1><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>Languages:</b> ${Object.values(
      languages
    ).join(', ')}</p></div>`;
    countryInfo.innerHTML = markup;
  }
}

function countrySelect(e) {
  e.preventDefault();
  console.log(e.target.dataset.name);
  // showResult(countries.find(c => c.name.common === e.target.dataset.name));
  list.innerHTML = '';
}
