/**
 * Looking for the following Parameters:
 * initialChunksWithEntry
 * CSSFilename,
 * CSSExtractPluginName
 */
class ChunksRenamePlugin {
  constructor(chunksToRename = {}) {
    Object.keys(chunksToRename).forEach(key => {
      this[key] = chunksToRename[key];
    });
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      "ChunksRenamePlugin",
      (compilation, { normalModuleFactory }) => {
        compilation.chunkTemplate.hooks.renderManifest.tap("ChunksRenamePlugin", (result, options) => {
          const chunk = options.chunk;
          const outputOptions = options.outputOptions;

          if ( this.initialChunksWithEntry && chunk.hasEntryModule() && chunk.isOnlyInitial() ) {
            chunk.filenameTemplate = typeof this.initialChunksWithEntry === "boolean" ? outputOptions.filename : this.initialChunksWithEntry;
          }
          if (this.asyncChunks && !chunk.isOnlyInitial()) {
            chunk.filenameTemplate = this.asyncChunks;
          }
          if ( this.hasOwnProperty(chunk.name) && typeof this[chunk.name] === "string" ) {
            chunk.filenameTemplate = this[chunk.name];
          }


          // has css?
          const hasCSS = result[0] && result[0].identifier.includes(this.CSSExtractPluginName);
          // get the id of the file
          const chunkId = hasCSS ? result[0].pathOptions.chunk.id : '';

          // check if it has a slash to put it in the right folder
          if ( hasCSS && chunkId && chunkId.toString().includes('/') ) {
            result[0].filenameTemplate = `[name]/${this.CSSFilename}`;
          }

        });
      }
    );
  }
}

module.exports = ChunksRenamePlugin;
