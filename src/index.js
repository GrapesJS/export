import grapesjs from 'grapesjs';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default grapesjs.plugins.add('gjs-plugin-export', (editor, opts) => {
  let c = opts || {};
  let config = editor.getConfig();
  let pfx = config.stylePrefix;
  let btnExp = document.createElement("BUTTON");
  let commandName = 'gjs-export-zip';

  let defaults = {
    addExportBtn: 1,
    btnLabel: 'Export to ZIP',
    preHtml: '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"></head><body>',
    postHtml: '</body><html>',
    preCss: '',
    postCss: ''
  };

  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  btnExp.innerHTML = c.btnLabel;
  btnExp.className = pfx + 'btn-prim';

  // Add command
  editor.Commands.add(commandName, {
    run() {
      let zip = new JSZip();
      let cssDir = zip.folder("css");
      let fn = 'grapesjs_template_' + Date.now() + '.zip';
      zip.file('index.html', c.preHtml + editor.getHtml() + c.postHtml);
      cssDir.file('style.css', c.preCss + editor.getCss() + c.postCss);
      zip.generateAsync({type:"blob"})
      .then((content) => {
          FileSaver.saveAs(content, fn);
      });
    }
  });

  // Add button inside export dialog
  if (c.addExportBtn) {
    editor.on('run:export-template', () => {
      editor.Modal.getContentEl().appendChild(btnExp);
      btnExp.onclick = () => {
        editor.runCommand(commandName);
      };
    });
  }

});
