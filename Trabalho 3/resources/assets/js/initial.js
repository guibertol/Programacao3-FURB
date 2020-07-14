if (typeof $.fn.selectize === 'function') {
    $.fn.selectize.defaults.loadingClass = 'selectize-loader';
}
//if (typeof $.fn.selectize === 'function') {
    //$.fn.selectize.defaults.loadingClass = 'selectize-loader';
    //':hidden:not([class~=selectized])', ':hidden > .selectized', '.selectize-control .selectize-input input', ':disabled', ':not(:visible):not([class~=selectized])'
//}

$(document).ready(function () {

    if (typeof $.fn.tooltip === 'function') {
        var $titles = $('[title]');
        if ($titles.length > 0)
            $titles.tooltip({container: 'body'});
    }

    if (typeof  $.fn.datetimepicker === 'function') {
        $.fn.datetimepicker.defaults['icons'] = {
            date: "icon-calendar",
            up: "icon-chevron-up",
            down: "icon-chevron-down",
            previous: "icon-chevron-left",
            next: "icon-chevron-right",

            time: 'glyphicon glyphicon-time',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        };
    }


});
