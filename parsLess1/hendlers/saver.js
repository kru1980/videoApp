import path from "path";
import fs from "fs";
import chalk from "chalk";

export default async function saveData(data) {
  // поле code в нем храниться название на транслите для формирования имени файла
  const { code } = data;
  const fileName = `${code}.json`;
  // формируем путь для сохраниения данных
  const savePath = path.join(__dirname, "..", "data", fileName); // путь до директории хранения данных

  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        return reject(err);
      }

      console.log(
        chalk.blue("File was saved successfully: ") +
          chalk.blue.bold(fileName) +
          "\n"
      );

      resolve();
    });
  });
}

// saveData({
//   title: "LADA (ВАЗ) Vesta I",
//   url: "https://auto.ru/catalog/cars/vaz/vesta/",
//   code: "lada-vaz-vesta-i",
//   priceNew: { low: 653900, high: 994900 },
//   period: { start: 2015, end: NaN },
// });
