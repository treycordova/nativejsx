if (![].fill)  {
  Array.prototype.fill = function(value) {
    let len = parseInt(this.length, 10),
        start = arguments[1],
        relativeStart = parseInt(start, 10) || 0,
        k = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) : Math.min(relativeStart, len),
        end = arguments[2],
        relativeEnd = end === undefined ? len : (parseInt(end) || 0),
        final = relativeEnd < 0 ?
            Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
    for (; k < final; k++) {
        this[k] = value;
    }
    return this;
  };
}