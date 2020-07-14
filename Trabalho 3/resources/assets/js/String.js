if (typeof String.prototype.contains === 'undefined') {
    String.prototype.contains = function (it) {
        return this.indexOf(it) != -1;
    };
}

/**
 * 'my name {0},{1}'.format('joh','doug')
 * output: my name joh,doug
 * @return string
 */
if (typeof String.prototype.format === 'undefined') {
    String.prototype.format = function () {
        var args = arguments;
        return this
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}')
            .replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
    };
}
