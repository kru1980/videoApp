const cheerio = require("cheerio");
import chalk from "chalk";

import saveData from "../hendlers/saver";

import { getPageContent } from "../helpers/puppeteer";
import { formatPrice, formatPeriod } from "../helpers/common";

export default async function listItemsHandler(data) {
  //   console.log(data);
  try {
    // обработчик внутренней страницы на которую произошел переход по ссылке
    for (const initialData of data) {
      // на каждой итерации выводим урл из полученных данных в консоль для отслеживания прогресса
      console.log(
        chalk.green(`Getting data from: `) + chalk.green.bold(initialData.url)
      );

      const detailContent = await getPageContent(initialData.url);
      const $ = cheerio.load(detailContent);

      // на странице не нужную инф в виде дом элемента сперва удаляем

      let period = $(".catalog-generation-summary__desc_period")
        .clone()
        .children()
        .remove()
        .end()
        .text();

      // далее вычленяем данные на цены на авто
      const priceNewStr = $(
        ".catalog-generation-summary__info .catalog-generation-summary__desc:nth-of-type(2)"
      ).text();

      const priceWithMileageStr = $(
        ".catalog-generation-summary__info .catalog-generation-summary__desc:nth-of-type(3)"
      ).text();

      // создадим переменные для очищенных данных
      let priceNew = priceNewStr ? formatPrice(priceNewStr) : null; // цены новых авто

      let priceWithMileage = priceWithMileageStr
        ? formatPrice(priceWithMileageStr)
        : null; // цены старых авто

      period = formatPeriod(period);
      // на некоторых внутренних стр не будет новой цены, будут цены на подержанные авто поэтому меняем цены местами
      if (!priceWithMileage && priceNew) {
        priceWithMileage = priceNew;
        priceNew = null;
      }

      //   console.log(priceNew, priceWithMileage, period);
    }

    await saveData({
      title: initialData.title,
      url: initialData.url,
      code: initialData.code,
      priceNew,
      priceWithMileage,
      period,
    });
  } catch (error) {
    throw error;
  }
}
