function round(num, fixed) {
    fixed = typeof fixed === 'undefined' ? 2 : fixed;
    var mult = Math.pow(10, fixed);
    return Math.round(num * mult) / mult;
}
