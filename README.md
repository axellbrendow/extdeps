# extdeps

Extract dependencies and devDependencies from package.json in markdown format.

<p align="left">
<a href="https://www.npmjs.com/package/extdeps"><img src="https://img.shields.io/npm/v/extdeps.svg?style=flat" alt="npm version"></a>
<a href="https://www.npmjs.com/package/extdeps" target="_blank"><img src="https://img.shields.io/npm/dm/extdeps.svg" alt="npm downloads per month"></a>
</p>

## Usage

### First way

Run `npx extdeps` from a folder that has a `package.json` file and a `README.md` file. That's it!

Obs.: the script identifies the start of the dev dependencies section in your README by searching for a line that starts with a '#' and has 'dev' and 'dependencies' on it. Also, same logic for dependencies section.

Example of a valid README:

```
## Dev dependencies

- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) `^7.10.4`

## Dependencies

- [cross-env](https://www.npmjs.com/package/cross-env) `^7.0.2`
```

### Second way

Pipe package.json or redirect it to the script

`cat package.json | npx extdeps`

or

`npx extdeps < package.json`

You should see:

![extdeps execution example](https://i.imgur.com/I86twex.png)
