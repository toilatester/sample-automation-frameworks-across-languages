function getReferer(headers) {
    for (var i = 0, len = headers.length; i < len; i++) {
        if (headers[i].name.toLowerCase() === 'referer') {
            return headers[i].value;
        }
    }
    return '';
}

this.onResourceRequested = function (request, networkRequest) {
    if (request.url.indexOf('somehost.com') >= 0) {
        if (request.url.indexOf('purchaseID') >= 0) { // only track click call for now
            console.info('[TRACKING_ID] ' + _trackingId);
            console.info('[TRACKING_DATA] ' + request.url);
        } else {
            console.info('[PAGE_ID|' + _pageTrackingId + '] [REFERER|' + getReferer(request.headers) + '] ' + request.url);
        }
    }
    console.info('Request: '+ request.url);
};
