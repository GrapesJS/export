import grapesjs from 'grapesjs';

export declare type Editor = grapesjs.Editor;
export declare type PluginOptions = {
	/**
	 * Type id used to register the new storage.
	 * You can use this option in case you want to replace the already available storages (eg. `local`).
	 * @default 'indexeddb'
	 */
	type?: string;
	/**
	 * Add a button inside the export dialog
	 * @default true
	 */
	addExportBtn?: boolean;
	/**
	 * Label of the export button
	 * @default 'Export to ZIP'
	 */
	btnLabel?: string;
	/**
	 * ZIP filename prefix
	 * @default 'grapesjs_template'
	 */
	filenamePfx?: string;
	/**
	 * upload uri
	 * @default 'grapesjs_template'
	 */
	uploadUri?: string;
	/**
	 * Use a function to generate the filename, eg. `filename: editor => 'my-file.zip',`
	 */
	filename?: (editor: Editor) => string;
	/**
	 * Callback to execute once the export is completed
	 */
	done?: () => void;
	/**
	 * Callback to execute on export error
	 */
	onError?: (error: Error) => void;
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
	root?: Record<string, unknown>;
	/**
	 * Custom function for checking if the file content is binary
	 */
	isBinary?: (content: string, name: string) => boolean;
};
declare const plugin: grapesjs.Plugin<PluginOptions>;

export {
	plugin as default,
};

export {};
