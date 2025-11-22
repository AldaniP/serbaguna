const ytdl = require('@ybd-project/ytdl-core');
console.log('Type of export:', typeof ytdl);
console.log('Export keys:', Object.keys(ytdl));
if (typeof ytdl === 'object') {
    console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(ytdl)));
}
try {
    const { YtdlCore } = require('@ybd-project/ytdl-core');
    console.log('YtdlCore export:', YtdlCore);
    if (YtdlCore) {
        console.log('YtdlCore static keys:', Object.keys(YtdlCore));
        console.log('YtdlCore prototype keys:', Object.getOwnPropertyNames(YtdlCore.prototype));
    }
} catch (e) {
    console.log('Error requiring YtdlCore:', e.message);
}
