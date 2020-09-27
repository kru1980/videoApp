const puppeteer = require("puppeteer");

const url = "https://att-rail.ru/";
const selector = ".product_pod";

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: "networkidle2" });

//   const result = await page.evaluate(() => {
//     let data = [];
//     let elements = document.querySelectorAll(".product_pod");
//     console.log(elements);
//     for (var element of elements) {
//       // Проходимся в цикле по каждому товару
//       let title = element.childNodes[5].innerText; // Выбираем название
//       let price = element.childNodes[7].children[0].innerText; // Выбираем цену

//       data.push({ title, price }); // Помещаем объект с данными в массив
//     }

//     return data;
//   });

//   browser.close();
//   return result;
// })()
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  await page.goto(url);
  let urlPage = await page.url();
  console.log("urlPage=", urlPage);
  await page.screenshot({ path: "pictures/mainPage.png" });

  await browser.close();
})();
