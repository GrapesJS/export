import type grapesjs from 'grapesjs';
import JSZip from 'jszip';

type Editor = grapesjs.Editor;

export type PluginOptions = {
  /**
   * Type id used to register the new storage.
   * You can use this option in case you want to replace the already available storages (eg. `local`).
   * @default 'indexeddb'
   */
  type?: string,

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
   * upload uri
   * @default 'grapesjs_template'
   */
  uploadUri?: string

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

const plugin: grapesjs.Plugin<PluginOptions> = (editor, opts = {}) => {
  const pfx = editor.getConfig('stylePrefix');
  const commandName = 'gjs-zipup';

  const config: PluginOptions = {
    addExportBtn: true,
    btnLabel: 'Zip and Upload',
    filenamePfx: 'grapesjs_template',
    filename: undefined,
    uploadUri: 'http://localhost:3000/upload/template',
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
    // @ts-ignore
    async run(editor, s, opts: PluginOptions = {}) {
      const zip = new JSZip();
      const onError = opts.onError || config.onError;
      const root = opts.root || config.root;

      // @ts-ignore
      this.createDirectory(zip, root)
        .then(async () => {
          const content = await zip.generateAsync({ type: 'blob' });
          const done = opts.done || config.done;          
          const filenameFn = opts.filename || config.filename;
          const filenamePfx = opts.filenamePfx || config.filenamePfx;
          const filename = filenameFn ? filenameFn(editor) : `${filenamePfx}_${Date.now()}.zip`;

          if(config.uploadUri) {
            // @ts-ignore
            this.uploadFile(content, filename)
          }
          
          // FileSaver.saveAs(content, filename);
          done?.();
        })
        .catch(onError);
    },

    async uploadFile(file: Blob, name: string) {
      const fetchHandler = {
        apply(target: CallableFunction, thisArg: any, args: Array<any>) {},
      };
      const proxiedFetch = new Proxy(fetch, fetchHandler)

      try{
        const uri = new URL(config.uploadUri!)
        let data = new FormData()
        data.append('file', file, name)
        // call api upload file to server         
        let response = await proxiedFetch( uri, {
          method: 'POST',
          body: data
        })

        if(response.status !== 200) {
          throw new Error('HTTP response code != 200');
        }

        let json_response = await response.json();
        editor.log(['Upload Status', { json_response }], { ns: 'plugin-upzip' });
      } catch(e) {
        console.log(e)
      }
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

      editor.log(['Create file', { name, content, opts }], { ns: 'plugin-export' });
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

      // @ts-ignore
      editor.on('run:export-template', () => {
        // @ts-ignore
        const el = editor.Modal.getContentEl();
        el?.appendChild(btnExp);
        btnExp.onclick = () => {
          // @ts-ignore
          editor.runCommand(commandName);
        };
      });
    }
  })
};

export default plugin;
