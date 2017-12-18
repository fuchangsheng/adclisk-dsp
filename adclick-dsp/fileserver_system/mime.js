
var mimetbl = {
    // this table can be found via searching internet
    'txt': 'text/plain',
    'pdf': 'application/pdf',
    'mkv': 'video/x-matroska',
    'png': 'image/png',
    'ppt': 'application/vnd.ms-powerpoint',
    'sql': 'application/x-sql',
    'zip': 'application/zip',
	'css':'text/css'
};

exports.getMimeType = function (suffix) {
    return mimetbl[suffix];
};
