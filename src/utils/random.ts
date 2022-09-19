const getRandomPositiveInteger = (min: number, max: number): number => {
  const from = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const to = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  return Math.floor(Math.random() * (to - from + 1) + from);
};
const getRandomItems = <T>(items: T[]):T[] => {
  const startPosition = getRandomPositiveInteger(0, items.length - 1);
  const endPosition = startPosition + getRandomPositiveInteger(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

const getRandomItem = <T>(items: T[]):T  =>
  items[getRandomPositiveInteger(0, items.length -1)];

export {getRandomPositiveInteger, getRandomItem, getRandomItems};
