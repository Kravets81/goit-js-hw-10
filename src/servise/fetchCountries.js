export function fetchCountries(country) {
  const seachQuery = country;

  const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });

  const url = `https://restcountries.com/v3.1/name/${seachQuery}?${searchParams}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
