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

function number_format(number, decimals, dec_point, thousands_sep) {
    //  discuss at: http://phpjs.org/functions/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56);
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ');
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '');
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.');
    //   returns 4: '67,00'
    //   example 5: number_format(1000);
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2);
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1);
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.');
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0);
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2);
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4);
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3);
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ');
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '');
    //  returns 14: '0.00000001'

    number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
            .join('0');
    }
    return s.join(dec);
}
var Format = {
    /**
     * 17528727000149 -> 17.528.727/0001-49
     * @returns {string}
     */
    cnpj: function (value) {
        if (!value) return value;
        value = value.toString().replace(/\D/g, ""); //only number
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');//format cnpj
        return value;
    },
    /**
     * 08144225947 -> 081.442.259-47
     * @returns {string|*}
     */
    cpf: function (value) {
        if (!value) return value;
        value = value.toString().replace(/\D/g, ""); //only number
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        return value;
    },

    /**
     * 88430700 -> 88070-430
     * @returns {string|*}
     */
    cep: function (value) {
        if (!value) return value;
        value = value.toString().replace(/\D/g, ""); //only number
        value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        return value;
    },
    preco: function (value, fixed, preffix) {
        if (!value) return value;
        fixed = (typeof fixed === 'undefined') ? 2 : fixed;
        preffix = (typeof preffix === 'undefined') ? 'R$ ' : preffix;
        value = number_format(value, fixed, ',', '.');
        return preffix + value;
    },
    porcentagem: function (value, fixed, suffix) {
        if (!value) return value;
        fixed = (typeof fixed === 'undefined') ? 2 : fixed;
        suffix = (typeof suffix === 'undefined') ? '%' : suffix;
        return (value * 100).toFixed(fixed) + suffix;
    }


    ///**
    // * ABC1234 -> ABC-1234
    // * @returns {string}
    // */
    //placa: function (value) {
    //    value = value.replace(/^(\w{3})(\d{4})$/, '$1-$2');
    //    return value;
    //}
};
function round(num, fixed) {
    fixed = typeof fixed === 'undefined' ? 2 : fixed;
    var mult = Math.pow(10, fixed);
    return Math.round(num * mult) / mult;
}

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

//# sourceMappingURL=libs_admin.js.map
