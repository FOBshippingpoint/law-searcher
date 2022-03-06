import ghpages from "gh-pages";
import fs from "fs";
import chalk from "chalk";

const PATH_TO_INDEX = "./dist/webpage/index.html";

const indexHtml = fs.readFileSync(PATH_TO_INDEX, "utf8");

const log = {
  info: (text) => {
    console.log(chalk.inverse(text));
  },
  success: (text) => {
    console.log(chalk.green(text));
  },
  error: (text) => {
    console.log(chalk.red(text));
  },
};

const regex = /="\//g;
if (regex.test(indexHtml)) {
  log.info("Found relative path in index.html, fixing...");
  const newHtml = indexHtml.replace(regex, '="./');
  log.info("Writing new index.html...");
  fs.writeFileSync(PATH_TO_INDEX, newHtml);
  log.success("Success!");
}

log.info("Deploying to gh-pages...");
ghpages.publish("dist", function (err) {
  if (err) {
    log.error("Error publishing to gh-pages" + err);
    return;
  }

  log.success("Success!");
});
