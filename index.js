#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

async function read(stream = process.stdin) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const createLibItem = (lib, version) =>
  `- [${lib}](https://www.npmjs.com/package/${lib}) \`${version}\``;

const createLibList = dependencies =>
  Object.keys(dependencies).reduce(
    (libs, lib) => libs + createLibItem(lib, dependencies[lib]) + "\n",
    ""
  );

/**
 * Find a section in the readme and replace it's content.
 *
 * @param {(line: string) => boolean} findSectionStart Function to check if a readme
 * line is the section start
 * @param {string} newSection New section content
 * @param {string} readme Current readme content
 * @param {string} sectionTitle This title will we used if the section does not exist
 */
const replaceSection = (findSectionStart, newSection, readme, sectionTitle) => {
  let newReadme = "";
  const readmeLines = readme.split(/\r\n|\n|\r/);
  let sectionStart = readmeLines.length;
  let sectionEnd = readmeLines.length;

  for (
    let i = 0;
    sectionStart === readmeLines.length && i < readmeLines.length;
    i++
  ) {
    newReadme += readmeLines[i] + "\n";
    if (findSectionStart(readmeLines[i])) sectionStart = i;
  }

  if (sectionStart === readmeLines.length)
    newReadme += "\n" + sectionTitle + "\n";

  newReadme += "\n" + newSection;

  for (
    let i = sectionStart + 1;
    sectionEnd === readmeLines.length && i < readmeLines.length;
    i++
  )
    if (/^#/.test(readmeLines[i])) sectionEnd = i;

  if (sectionEnd !== readmeLines.length) newReadme += "\n";

  for (let i = sectionEnd; i < readmeLines.length; i++)
    newReadme += readmeLines[i] + "\n";

  return newReadme.replace(/\n{2,}/g, "\n\n");
};

(async () => {
  let packageJson;

  if (!process.stdin.isTTY) {
    packageJson = JSON.parse(await read());

    if (packageJson.devDependencies) {
      console.log("## Dev dependencies");
      console.log();
      console.log(createLibList(packageJson.devDependencies));
    }

    if (packageJson.dependencies) {
      console.log("## Dependencies");
      console.log();
      console.log(createLibList(packageJson.dependencies));
    }
  } else {
    packageJson = JSON.parse(
      fs.readFileSync(path.resolve(".", "package.json"))
    );

    let readmePath;

    if (fs.existsSync(path.resolve(".", "README.md")))
      readmePath = path.resolve(".", "README.md");
    else if (fs.existsSync(path.resolve(".", "README")))
      readmePath = path.resolve(".", "README");

    if (!readmePath) console.error("README not found");
    else {
      const readme = fs.readFileSync(readmePath).toString();
      let newReadme = readme;

      if (packageJson.devDependencies) {
        newReadme = replaceSection(
          line =>
            /^#.*dev.*dependencie/i.test(line) || /^#.*dev.*librar/i.test(line),
          createLibList(packageJson.devDependencies),
          newReadme,
          "## Dev dependencies"
        );
      }

      if (packageJson.dependencies) {
        newReadme = replaceSection(
          line =>
            /^#((?!dev).)*dependencie/i.test(line) || /^#.*librar/i.test(line),
          createLibList(packageJson.dependencies),
          newReadme,
          "## Dependencies"
        );
      }

      fs.writeFile(readmePath, newReadme, err => {
        if (err) throw err;
      });
    }
  }
})();
