import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default (editor, opts = {}) => {
  let pfx = editor.getConfig('stylePrefix');
  let btnExp = document.createElement('button');
  let commandName = 'gjs-export-zip';

  let config = {
    addExportBtn: 1,
    btnLabel: 'Export to ZIP',
    preHtml: '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"></head><body>',
    postHtml: '</body><html>',
    preCss: '',
    postCss: '',
    filenamePfx: 'grapesjs_template',
    filename: null,
    ...opts,
  };

  btnExp.innerHTML = config.btnLabel;
  btnExp.className = `${pfx}btn-prim`;

  // Add command
  editor.Commands.add(commandName, {
    run(editor) {
      const zip = new JSZip();
      const cssDir = zip.folder('css');
      zip.file('index.html', config.preHtml + editor.getHtml() + config.postHtml);
      cssDir.file('style.css', config.preCss + editor.getCss() + config.postCss);
      zip.generateAsync({type:"blob"})
      .then((content) => {
        const filenameFn = config.filename;
        let filename = filenameFn ?
          filenameFn(editor) : `${config.filenamePfx}_${Date.now()}.zip`;
        FileSaver.saveAs(content, filename);
      });
    }
  });

  // Add button inside export dialog
  if (config.addExportBtn) {
    editor.on('run:export-template', () => {
      editor.Modal.getContentEl().appendChild(btnExp);
      btnExp.onclick = () => {
        editor.runCommand(commandName);
      };
    });
  }
};
