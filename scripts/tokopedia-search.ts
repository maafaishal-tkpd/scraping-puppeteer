import puppeteer from "puppeteer";
import fs from "fs-extra";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://www.tokopedia.com/search?st=product&q=sandal", {
    waitUntil: "networkidle2",
  });

  const productHandles = await page.$$(".prd_container-card");

  const items = [];

  for (const product of productHandles) {
    let title = null;
    let price = null;
    let img = null;
    let star = null;
    let sold = null;
    let shopName = null;

    try {
      title = await page.evaluate(
        (el) => el.querySelector("div[data-testid=spnSRPProdName]").textContent,
        product
      );
    } catch (error) {
      console.error(error);
    }

    try {
      price = await page.evaluate(
        (el) =>
          el.querySelector("div[data-testid=spnSRPProdPrice]").textContent,
        product
      );
    } catch (error) {
      console.error(error);
    }

    try {
      img = await page.evaluate(
        (el) =>
          el
            .querySelector("img[data-testid=imgSRPProdMain]")
            .getAttribute("src"),
        product
      );
    } catch (error) {
      console.error(error);
    }

    try {
      star = await page.evaluate(
        (el) => el.querySelector("span.prd_rating-average-text").textContent,
        product
      );
    } catch (error) {
      console.error(error);
    }

    try {
      sold = await page.evaluate(
        (el) => el.querySelector("span.prd_label-integrity").textContent,
        product
      );
    } catch (error) {
      console.error(error);
    }
    try {
      shopName = await page.evaluate(
        (el) => el.querySelector("span.prd_link-shop-name").textContent,
        product
      );
    } catch (error) {
      console.error(error);
    }

    if (title) {
      items.push({ title, shopName, price, img, star, sold });
    }
  }

  fs.outputFileSync("results/tokopedia-search.json", JSON.stringify(items));

  await browser.close();
})();
