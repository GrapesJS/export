# [GrapesJS Upzip](http://grapesjs.com)

This plugin adds the possibility to export and then upload template in a zip archive to a given URI.
Demo: http://grapesjs.com/demo.html


## Summary

* Plugin name: `grapesjs-upzip`
* Commands: `gjs-upzip`
* Node version: 14.16 and up (16.17 is recommended)

## Options

|Option|Description|Default|
|-|-|-
| `addExportBtn` | Add a button inside the export dialog | `true` |
| `btnLabel` | Label to the export button | `Export to ZIP` |
| `filenamePfx` | ZIP filename prefix | `grapesjs_template` |
| `filename` | Use a function to generate the filename, eg. `filename: editor => 'my-file.zip',` | `null` |
| `uploadUri` | Which host you would upload file into? | http://localhost:3000/upload/template
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
  * `https://unpkg.com/grapesjs-upzip`
* NPM
  * `npm i grapesjs-upzip`
* GIT
  * `git clone https://github.com/artf/grapesjs-upzip.git`





## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-upzip.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      // ...
      plugins: ['grapesjs-upzip'],
      pluginsOpts: {
        'grapesjs-upzip': { /* options */ }
      }
  });

  // You can also call the command wherever you want in this way
  editor.runCommand('gjs-upzip');
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import thePlugin from 'grapesjs-upzip';

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
$ git clone https://github.com/artf/grapesjs-upzip.git
$ cd grapesjs-plupzip
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
