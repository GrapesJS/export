# [GrapesJS Export](http://grapesjs.com)

This plugin adds the possibility to export template in a zip archive.
Demo: http://grapesjs.com/demo.html



## Summary

* Plugin name: `grapesjs-plugin-export`
* Commands: `gjs-export-zip`




## Options

|Option|Description|Default|
|-|-|-
| `addExportBtn` | Add a button inside the export dialog | `true` |
| `btnLabel` | Label to the export button | `Export to ZIP` |
| `preHtml` | String before the HTML template | `<!doctype html><html><head><link rel="stylesheet" href="./css/style.css"></head><body>` |
| `postHtml` | String after the HTML template | `</body><html>` |
| `preCss` | String before the CSS template | `''` |
| `postCss` | String after the CSS template | `''` |
| `filenamePfx` | ZIP filename prefix | `grapesjs_template` |





## Download

* CDN
  * `https://unpkg.com/grapesjs-plugin-export`
* NPM
  * `npm i grapesjs-plugin-export`
* GIT
  * `git clone https://github.com/artf/grapesjs-plugin-export.git`





## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-plugin-export.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      // ...
      plugins: ['grapesjs-plugin-export'],
      pluginsOpts: {
        'grapesjs-plugin-export': { /* options */ }
      }
  });

  // You can also call the command wherever you want in this way
  editor.runCommand('gjs-export-zip');
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import thePlugin from 'grapesjs-plugin-export';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [thePlugin],
  pluginsOpts: {
    [thePlugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => thePlugin(editor, { /* options */ }),
  ],
});
```





## Limitations

Doesn't export images





## Development

Clone the repository

```sh
$ git clone https://github.com/artf/grapesjs-plugin-export.git
$ cd grapesjs-plugin-export
```

Install it

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```



## License

BSD 3-Clause
