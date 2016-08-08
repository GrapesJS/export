# [GrapesJS Export](http://grapesjs.com)

This plugin adds the possibility to export template in a zip archive.
Demo: http://grapesjs.com/demo.html

## Resume

* Add
  * Commands
      - `gjs-export-zip`
* Plugin
  * Name: `gjs-plugin-export`
  * Plugin options
      - addExportBtn: Add a button inside the export dialog
        default: `true`
      - btnLabel: Label to the export butten
        default: `Export to ZIP`
      - preHtml: String before the HTML template
        default: `<!doctype html><html><head><link rel="stylesheet" href="./css/style.css"></head><body>`
      - postHtml: String after the HTML template
        default: `</body><html>`
      - preCss: String before the CSS template
        default: ``
      - postCss: String after the CSS template
        default: ``

## Usage

```html
<link rel="stylesheet" href="path/to/grapes.min.css">
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-plugin-export.min.js"></script>

<div id="gjs"></div>
<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      plugins: ['gjs-plugin-export'],
      pluginsOpts: {
        'gjs-plugin-export': {
          btnLabel: 'EXPORT',
          preHtml: '<!doctype><html><head><link rel="stylesheet" href="./css/style.css"></head><body>'
        }
      }
  });

  // You can also call the command wherever you want in this way
  editor.runCommand('gjs-export-zip');
</script>
```

## Limitations

Doesn't export images


## License

BSD 3-Clause
