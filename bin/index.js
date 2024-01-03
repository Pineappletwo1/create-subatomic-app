#! /usr/bin/env node

// DO NOT EDIT THIS FILE, THIS FILE IS FOR CREATING SUBATOMIC PROJECTS, EDITING THE FILE MAY CAUSE PROBLEMS

const select = require("cli-select");
const chalk = require("chalk");
const readline = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("What is the name of your app? ", (appName) => {
    console.log(`Your app's name is: ${appName}`);
    rl.close();

    console.log("Would you like to use Tailwind?");

    const tailwindOptions = {
      values: ["Yes", "No"],
      valueRenderer: (value, selected) => {
        if (selected) {
          return chalk.hex("#800080")(`* ${value}`); // Purple color for selected option
        }

        return `  ${value}`;
      },
    };

    select(tailwindOptions)
      .then((tailwindResponse) => {
        console.log("Would you like to use TypeScript?");

        const typescriptOptions = {
          values: ["Yes", "No"],
          valueRenderer: (value, selected) => {
            if (selected) {
              return chalk.hex("#800080")(`* ${value}`); // Purple color for selected option
            }

            return `  ${value}`;
          },
        };

        select(typescriptOptions)
          .then((typescriptResponse) => {
            let repoUrl;

            // Clone the repository
            execSync(
              `git clone https://github.com/TheLazyCodernothacker/Subatomic ${appName}`
            );
            // Change directory to the cloned repository
            process.chdir(appName);

            if (
              tailwindResponse.value === "Yes" &&
              typescriptResponse.value === "No"
            ) {
              console.log("Installing Tailwind...");
              fs.writeFileSync(
                path.join(process.cwd(), "tailwind.config.js"),
                `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/pages/**/*.{js,mjs,jsx}", "./app/components/**/*.{js,mjs,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`
              );
              let packageJsonPath = path.join(process.cwd(), "package.json");
              let packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, "utf8")
              );
              packageJson.scripts = packageJson.scripts || {};
              packageJson.scripts["watch:css"] =
                "npx tailwindcss -i ./input.css -o ./public/output.css --watch";
              packageJson.scripts["start"] =
                "npm-run-all --parallel watch:css start:server start:babel";
              fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2)
              );
              execSync("npm i tailwindcss -D", { stdio: "ignore" });
              fs.writeFileSync(
                path.join(process.cwd(), "input.css"),
                `@tailwind base;
@tailwind components;
@tailwind utilities;`
              );
            } else if (
              tailwindResponse.value === "No" &&
              typescriptResponse.value === "Yes"
            ) {
              console.log('Configuring Typescript')
              let packageJsonPath = path.join(process.cwd(), "package.json");
              let packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, "utf8")
              );
              packageJson.scripts = packageJson.scripts || {};
              packageJson.scripts["start:babel"] =
                'babel --extensions ".js,.ts,.tsx" app --out-dir lib --out-file-extension .mjs --watch';
              packageJson.scripts["start"] =
                "npm-run-all --parallel start:server start:babel";
              fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2)
              );
              fs.writeFileSync(
                path.join(process.cwd(), ".babelrc"),
                `{
  "presets": ["@babel/preset-react", "@babel/preset-typescript"],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./"],
        "alias": {
          "@": "./"
        }
      }
    ]
  ]
}`
              );
              fs.renameSync("app/pages/page.js", "app/pages/page.tsx");
              fs.renameSync("app/components/Button.mjs", "app/components/Button.tsx")
              execSync("npm i @babel/preset-typescript", { stdio: "ignore" });
            } else if (
              tailwindResponse.value === "No" &&
              typescriptResponse.value === "No"
            ) {
            } else if (
              tailwindResponse.value === "Yes" &&
              typescriptResponse.value === "Yes"
            ) {
              console.log("Installing Tailwind...");
              fs.writeFileSync(
                path.join(process.cwd(), "tailwind.config.js"),
                `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/pages/**/*.{js,mjs,ts,tsx,jsx}", "./app/components/**/*.{js,mjs,ts,tsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`
              );
              let packageJsonPath = path.join(process.cwd(), "package.json");
              let packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, "utf8")
              );
              packageJson.scripts = packageJson.scripts || {};
              packageJson.scripts["watch:css"] =
                "npx tailwindcss -i ./input.css -o ./public/output.css --watch";
              packageJson.scripts["start:babel"] =
                'babel --extensions ".js,.ts,.tsx" app --out-dir lib --out-file-extension .mjs --watch';
              packageJson.scripts["start"] =
                "npm-run-all --parallel watch:css start:server start:babel";
              fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2)
              );
              execSync("npm i tailwindcss -D", { stdio: "ignore" });
              fs.writeFileSync(
                path.join(process.cwd(), "input.css"),
                `@tailwind base;
@tailwind components;
@tailwind utilities;`
              );
              console.log('Configuring Typescript')
              fs.writeFileSync(
                path.join(process.cwd(), ".babelrc"),
                `{
  "presets": ["@babel/preset-react", "@babel/preset-typescript"],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./"],
        "alias": {
          "@": "./"
        }
      }
    ]
  ]
}`
              );
              fs.renameSync("app/pages/page.js", "app/pages/page.tsx");
              fs.renameSync("app/components/Button.mjs", "app/components/Button.tsx")
              execSync("npm i @babel/preset-typescript", { stdio: "ignore" });
            }

            // Install the dependencies
            console.log("Installing libraries...");
            execSync("npm i ", { stdio: "ignore" });
            execSync("npm i -g", { stdio: "ignore" }); //for CLI

            console.log("finished installing libraries");

            console.log(
              chalk.blue('Please run "npm run start" to get started')
            );
          })
          .catch((e) => {
            console.log(e)
            console.log("No option was selected.");
          });
      })
      .catch((e) => {
        console.log(e);
        console.log("No option was selected.");
      });
  });
}

main();
