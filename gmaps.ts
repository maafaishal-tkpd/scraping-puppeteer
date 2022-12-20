import puppeteer from "puppeteer";
import dayjs from "dayjs";

const URL = "https://www.google.com/maps/dir/Metland+Transyogi+Cibubur+(Marketing+Gallery),+Jalan+Kota+Taman+Metropolitan,+Cileungsi+Kidul,+Bogor+Regency,+West+Java/Tokopedia+Tower,+Jalan+Professor+Doktor+Satrio,+Karet+Semanggi,+South+Jakarta+City,+Jakarta/@-6.3139834,106.896686,12z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x2e699443f9ed5243:0xe7972e12c8273136!2m2!1d106.9761828!2d-6.4003795!1m5!1m1!1s0x2e69f310b0035227:0x24f90bcf927b562b!2m2!1d106.8194558!2d-6.2212853!3e0";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    userDataDir: "./tmpcl",
  });
  const page = await browser.newPage();
  await page.goto(URL
  );

  const inputs = await page.$$(
    `div[role=list] > div[role=listitem]`
  );

  const productHandles = await page.$$(
    `div[aria-label="Rute"] [id*="section-directions-trip-"]`
  );

  const now = dayjs().format('DD-MMMM-YYYY HH:mm')

  const locations = []

  for (const input of inputs) {
    const inputData = await page.evaluate(
      (el) => el.querySelector("input.tactile-searchbox-input").value,
      input
    );
    locations.push(inputData)
  }

  const routes = []

  for (const product of productHandles) {

    try {
      const route = await page.evaluate(
        (el) => el.querySelector("h1.fontHeadlineSmall > span").textContent,
        product
      );
      const time = await page.evaluate(
        (el) => el.querySelector("div.delay-medium > span").textContent,
        product
      );
      const distance = await page.evaluate(
        (el) => el.querySelector("div.fontBodyMedium > div").textContent,
        product
      );

      routes.push({
        route,
        time,
        distance,
      })
    } catch (error) {}

    try {
      const route = await page.evaluate(
        (el) => el.querySelector("h1.fontHeadlineSmall > span").textContent,
        product
      );
      const time = await page.evaluate(
        (el) => el.querySelector("div.delay-heavy > span:nth-child(1)").textContent,
        product
      );
      const distance = await page.evaluate(
        (el) => el.querySelector("div.fontBodyMedium > div").textContent,
        product
      );
      routes.push({
        route,
        time,
        distance,
      })
    } catch (error) {}
  }

  const data = {
    origin: locations[0],
    destination: locations[1],
    url: URL,
    createdAt: now,
    routes
  }

  console.log('data', data);
  


  //   await browser.close();
})();
