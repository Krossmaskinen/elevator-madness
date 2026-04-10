export const getRandomNumber = (min: number, max: number, exclude?: number): number => {
  let result;
  do {
    result = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (result === exclude);

  return result;
};

export const getRandomBool = (): boolean => {
  return Math.random() > 0.5;
};