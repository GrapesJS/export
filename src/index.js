import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default (editor, opts = {}) => {
  let pfx = editor.getConfig('stylePrefix');
  let btnExp = document.createElement('button');
  let commandName = 'gjs-export-zip';

  let config = {
    addExportBtn: 1,
    btnLabel: 'Export to ZIP',
    filenamePfx: 'grapesjs_template',
    filename: null,
    root: {
      css: {
        'style.css': ed => ed.getCss(),
      },
      'index.html': ed =>
        `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="./css/style.css">
          </head>
          <body>${ed.getHtml()}</body>
        <html>`,
    },
    ...opts,
  };

  btnExp.innerHTML = config.btnLabel;
  btnExp.className = `${pfx}btn-prim`;

  // Add command
  editor.Commands.add(commandName, {
    createFile(zip, name, content) {
      zip.file(name, content);
    },

    createDirectory(zip, root) {
      for (const name in root) {
        if (root.hasOwnProperty(name)) {
          let content = root[name];
          content = typeof content === 'function' ? content(editor) : content;
          const typeOf = typeof content;

          if (typeOf === 'string') {
            this.createFile(zip, name, content);
          } else if (typeOf === 'object') {
            const dirRoot = zip.folder(name);
            this.createDirectory(dirRoot, content);
          }
        }
      }
    },

    run(editor) {
      const zip = new JSZip();
      this.createDirectory(zip, config.root);
      zip.generateAsync({ type: 'blob' })
      .then(content => {
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
