// import cheerio from "cheerio";
const cheerio = require("cheerio");
import chalk from "chalk";
import { slugify } from "transliteration";
import { arrayFromLength } from "./helpers/common";
import { getPageContent } from "./helpers/puppeteer";
import listItemsHandler from "./hendlers/listItemsHandler";

const SITE = "https://auto.ru/catalog/cars/all/?page_num=";
const pages = 1; // заменить на  [1,2,3,4,5,6]

(async function main() {
  try {
    // Для обхода стр используем фор оф, тк он позволяет внутри тела цикла совершать асинхронные вызовы
    for (const page of arrayFromLength(pages)) {
      // на каждой итерации создается урл с номером текущей стр
      const url = `${SITE}${page}`;
      const pageContent = await getPageContent(url); // получаем html страницы, далее загружаем его в черио и ищем селекторы
      let $ = cheerio.load(pageContent);
      const carsItems = [];

      $(".mosaic__title").each((i, header) => {
        const url = $(header).attr("href"); // получаем ссылку на детальную страницу
        const title = $(header).text(); // получаем текст внутри элемента header

        carsItems.push({
          title,
          url,
          code: slugify(title),
        });
        // обрабатываем полученные данные, создаем ф обработчик полученые данные дополняет и сохраняет в файл
      });

      await listItemsHandler(carsItems);
    }
  } catch (error) {
    console.log(chalk.red(`================== \n`));
    console.log(chalk.red(`у нас ошибка \n`));
    console.log(error);
    console.log(chalk.red(`================== \n`));
  }
})();
