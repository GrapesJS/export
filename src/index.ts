import type { Editor, Plugin } from 'grapesjs';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

export type PluginOptions = {
  /**
   * Add a button inside the export dialog
   * @default true
   */
  addExportBtn?: boolean,

  /**
   * Label of the export button
   * @default 'Export to ZIP'
   */
  btnLabel?: string

  /**
   * ZIP filename prefix
   * @default 'grapesjs_template'
   */
  filenamePfx?: string

  /**
   * Use a function to generate the filename, eg. `filename: editor => 'my-file.zip',`
   */
   filename?: (editor: Editor) => string,

   /**
    * Callback to execute once the export is completed
    */
   done?: () => void,

   /**
    * Callback to execute on export error
    */
   onError?: (error: Error) => void,

   /**
    * Use the root object to create the folder structure of your zip (async functions are supported)
    * @example
    * root: {
    *   css: {
    *     'style.css': ed => ed.getCss(),
    *     'some-file.txt': 'My custom content',
    *   },
    *   img: async ed => {
    *     const images = await fetchImagesByStructue(ed.getComponents());
    *     return images;
    *     // Where `images` is an object like this:
    *     // { 'img1.png': '...png content', 'img2.jpg': '...jpg content' }
    *   },
    *   'index.html': ed => `<body>${ed.getHtml()}</body>`
    * }
    */
   root?: Record<string, unknown>

   /**
    * Custom function for checking if the file content is binary
    */
   isBinary?: (content: string, name: string) => boolean,
};

const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const pfx = editor.getConfig('stylePrefix');
  const commandName = 'gjs-export-zip';

  const config: PluginOptions = {
    addExportBtn: true,
    btnLabel: 'Export to ZIP',
    filenamePfx: 'grapesjs_template',
    filename: undefined,
    done: () => {},
    onError: console.error,
    root: {
      css: {
        'style.css': (editor: Editor) => editor.getCss(),
      },
      'index.html': (editor: Editor) =>
        `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="./css/style.css">
          </head>
          <body>${editor.getHtml()}</body>
        </html>`,
    },
    isBinary: undefined,
    ...opts,
  };

  // Add command
  editor.Commands.add(commandName, {
    run(editor, s, opts: PluginOptions = {}) {
      const zip = new JSZip();
      const onError = opts.onError || config.onError;
      const root = opts.root || config.root;

      // @ts-ignore
      this.createDirectory(zip, root)
        .then(async () => {
          const content = await zip.generateAsync({ type: 'blob' });
          const filenameFn = opts.filename || config.filename;
          const done = opts.done || config.done;
          const filenamePfx = opts.filenamePfx || config.filenamePfx;
          const filename = filenameFn ? filenameFn(editor) : `${filenamePfx}_${Date.now()}.zip`;
          FileSaver.saveAs(content, filename);
          done?.();
        })
        .catch(onError);
    },

    createFile(zip: JSZip, name: string, content: string) {
      const opts: JSZip.JSZipFileOptions = {};
      const ext = name.split('.')[1];
      const isBinary = config.isBinary ?
        config.isBinary(content, name) :
        !(ext && ['html', 'css'].indexOf(ext) >= 0) &&
        !/^[\x00-\x7F]*$/.test(content);

      if (isBinary) {
        opts.binary = true;
      }

      editor.log('Create file', { ns: 'plugin-export',
        // @ts-ignore
        name, content, opts
      });
      zip.file(name, content, opts);
    },

    async createDirectory(zip: JSZip, root: PluginOptions["root"]) {
      // @ts-ignore
      root = typeof root === 'function' ? await root(editor) : root;

      for (const name in root) {
        if (root.hasOwnProperty(name)) {
          let content = root[name];
          content = typeof content === 'function' ? await content(editor) : content;
          const typeOf = typeof content;

          if (typeOf === 'string') {
            // @ts-ignore
            this.createFile(zip, name, content);
          } else if (typeOf === 'object') {
            const dirRoot = zip.folder(name);
            // @ts-ignore
            await this.createDirectory(dirRoot, content);
          }
        }
      }
    },
  });

  editor.onReady(() => {
    // Add button inside export dialog
    if (config.addExportBtn) {
      const btnExp = document.createElement('button');
      btnExp.innerHTML = config.btnLabel!;
      btnExp.className = `${pfx}btn-prim`;

      editor.on('run:export-template', () => {
        const el = editor.Modal.getContentEl();
        el?.appendChild(btnExp);
        btnExp.onclick = () => {
          editor.runCommand(commandName);
        };
      });
    }
  })
};

export default plugin;
