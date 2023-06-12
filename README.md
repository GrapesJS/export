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
| `filenamePfx` | ZIP filename prefix | `grapesjs_template` |
| `filename` | Use a function to generate the filename, eg. `filename: editor => 'my-file.zip',` | `null` |
| `root` | Use the root object to create the folder structure of your zip (async functions are supported), eg. `
    {
      css: {
        'style.css': ed => ed.getCss(),
        'some-file.txt': 'My custom content',
      },
      img: async ed => {
        const images = await fetchImagesByStructue(ed.getComponents());
        return images;
        // Where `images` is an object like this:
        // { 'img1.png': '...png content', 'img2.jpg': '...jpg content' }
      },
      'index.html': ed => `<body>${ed.getHtml()}</body>`
    }
  `
  | `{ ...check the source }` |





## Download

* CDN
  * `https://unpkg.com/grapesjs-plugin-export`
* NPM
  * `npm i grapesjs-plugin-export`
* GIT
  * `git clone https://github.com/GrapesJS/export.git`





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





## Development

Clone the repository

```sh
$ git clone https://github.com/GrapesJS/export.git.git
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
