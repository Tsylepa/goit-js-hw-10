function fletchCountry(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(country =>
    country.json()
  );
}

export default { fletchCountry };
