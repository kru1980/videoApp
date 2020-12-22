// функция принимает на вход число стр а отдает массив, итерация которого даст нам номер текущей стр
// Создает из номера заданного юзером массив с числами от 1 до номера заданного юзером

export function arrayFromLength(number) {
  return Array.from(new Array(number).keys()).map((k) => k + 1);
}

export function formatPrice(priceStr) {
  const priceArr = priceStr.split(" – ");
  const [low, high] = priceArr.map((price) =>
    parseInt(price.replace(/[^0-9]/g, ""))
  );

  return {
    low,
    high,
  };
}

export function formatPeriod(periodStr) {
  const periodArr = periodStr.split(" – ");
  const [start, end] = periodArr.map((year) => parseInt(year));

  return {
    start,
    end,
  };
}
