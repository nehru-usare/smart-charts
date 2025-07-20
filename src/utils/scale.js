export function scaleLinear([domainMin, domainMax], [rangeMin, rangeMax]) {
  return function (value) {
    const ratio = (value - domainMin) / (domainMax - domainMin);
    return rangeMin + ratio * (rangeMax - rangeMin);
  };
}
