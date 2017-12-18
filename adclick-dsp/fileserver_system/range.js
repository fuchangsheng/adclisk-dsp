
// parse range method
// only support these three cases
// case 1: bytes=100-            first 100 bytes
// case 2: bytes=-100            last 100 bytes
// case 3: bytes=20-100            the bytes between 20 and 100
// for case 1: return (0, 100)
// for case 2: return (0, -100)
// for case 3: return (20, 100)
exports.parseRange = function(range, size) {
    // we do not support multi range
    if (range.indexOf(',') != -1) {
        return ;
    }

    var start = 0;
    var end  = 0;

    // replace the redundent information
    var range = range.replace(/bytes=/, '');
    var sep = range.indexOf('-');
    if (sep == 0) {
        end = parseInt(range);
        start = size - end;
        end = size;
    } if (sep == (range.length - 1)) {
        start = 0;
        end = parseInt(range.substring(0, sep));
    } else {
        start = parseInt(range.substring(0, sep));
        end = parseInt(range.substring(sep + 1));
    }
    return {'start': start, 'end': end};
};
