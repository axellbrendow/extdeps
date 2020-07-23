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

(async () => {
  const packageJson = JSON.parse(await read());

  console.log("## Dev dependencies");
  console.log();
  console.log(createLibList(packageJson.devDependencies));

  console.log("## Dependencies");
  console.log();
  console.log(createLibList(packageJson.dependencies));
})();
