
const showdown  = require('showdown')
let converter = new showdown.Converter();
converter.setFlavor('github');
converter.setOption('smoothLivePreview', true);
converter.setOption('openLinksInNewWindow', true);
converter.setOption('customizedHeaderId', true);
converter.setOption('parseImgDimensions', true);


function toHtml(md){
    return converter.makeHtml(md)
}



module.exports ={
    toHtml:toHtml,
}