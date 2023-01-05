import './css/styles.css';
import Notiflix from 'notiflix';
import API from './js/fetchCountries';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const NOT_ALLOWED_COUNTRIES = ['RU', 'BY'];

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
    : API.fletchCountry(name)
        .then(countries => isAllowed(countries))
        .then(countries => onInputType(countries))
        .then(country => showResult(country))
        .catch(error =>
          Notiflix.Notify.failure('Oops, there is no country with that name')
        );
}

function isAllowed(countries) {
  return countries.filter(
    country => !NOT_ALLOWED_COUNTRIES.includes(country.cca2)
  );
}

function onInputType(countries) {
  list.innerHTML = '';

  if (countries.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1) {
    showList(countries);
  } else if (countries.length === 1) {
    return countries[0];
  } else {
    return Error.apply;
  }
}

function showList(countries) {
  const markup = [];

  countries.forEach(({ flags, name }) => {
    markup.push(
      `<li data-name="${name.common}"><a href><img src="${flags.svg}" width="80"/>${name.official}</a></li>`
    );
  });

  list.innerHTML = markup.join('');

  [...list.children].forEach(el =>
    el.addEventListener('click', e => {
      e.preventDefault();
      showResult(
        countries.find(country => country.name.common === el.dataset.name)
      );
    })
  );
}

function showResult(country) {
  countryInfo.innerHTML = '';

  if (country) {
    list.innerHTML = '';
    const { flags, name, capital, population, languages } = country;

    const markup = `<div class="country-card"><img src="${
      flags.svg
    }" class="flag"/><h1>${
      name.official
    }</h1><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population
      .toString()
      .replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      )}</p><p><b>Languages:</b> ${Object.values(languages).join(
      ', '
    )}</p></div>`;
    countryInfo.innerHTML = markup;
  }
}
