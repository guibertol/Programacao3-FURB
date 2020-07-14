var _mask = {
    'money': 'input.mask-money',
    'int': 'input.mask-int',
    'float': 'input.mask-float',
    'cep': 'input.mask-cep',
    'cnpj': 'input.mask-cnpj',
    'placa': 'input.mask-placa',
    'veiculo-doc': 'input.mask-veiculo-doc',
    'telefone': 'input.mask-telefone',
    'licenca': 'input.mask-licenca',
    'alvara-numero': 'input.mask-alvara-numero',
    'isc-municipal': 'input.mask-isc-municipal',
    'date': '[class*="mask-date"]'
};


/**
 * mask in input, plugin jQuery-Mask-Plugin
 * @see http://igorescobar.github.io/jQuery-Mask-Plugin/
 * @param mask
 * @param options
 */
$.fn['appMask'] = function (mask, options) {
    if (typeof $.fn.mask === 'undefined') {
        throw new Error('Artico requires jQuery-Mask-Plugin');
    }
    this.mask(mask, options);
};

$.fn['appSetMoney'] = function (value) {
    return this.maskMoney('mask', parseFloat(value));
};
$.fn['appUnmask'] = function (mask, options) {
    if (typeof $.fn.unmask === 'undefined') {
        throw new Error('Artico requires jQuery-Mask-Plugin');
    }
    this.unmask(mask, options);
};


$.fn['appUnmaskValue'] = function (mask_name, options) {
    var self = this;
    if (typeof mask_name === 'undefined') {
        if (self.hasClass('mask-money'))
            mask_name = 'money';
        if (self.hasClass('mask-float'))
            mask_name = 'float';
        else if (self.hasClass('mask-int'))
            mask_name = 'int';
    }

    switch (mask_name) {
        case 'int':
            //self = self.length != 0 ? self : $(_mask['int']);
            var value = self.val();
            if (value == '' || typeof value === 'undefined')
                return 0;

            value = value.replace(/[.]/g, '').replace(',', '.');
            return value;

        case 'float':
            self.appUnmask();
            var value = self.val();
            if (value == '' || typeof value === 'undefined')
                return 0;

            if (value.length > 2)
                value = value / 100;
            self.appMaskApply('float');
            //self = self.length != 0 ? self : $(_mask['float'] + ':eq(0)');
            //value = value.replace(/[.]/g, '').replace(',', '.');
            return parseFloat(value);

        case 'money':
            var value = self.val();
            if (value == '' || typeof value === 'undefined')
                return 0;
            value = value.replace(/[.]/g, '').replace(',', '.');
            return value;
    }
};

/**
 * inicializa uma serie de mascaras já pre-definidas para o sistema, plugin jQuery-Mask-Plugin
 * @see http://igorescobar.github.io/jQuery-Mask-Plugin/
 * @param mask_name
 */
$.fn['appMaskApply'] = function (mask_name) {
    var self = this;

    //console.log('apply maks: ' + mask_name);
    switch (mask_name) {
        case 'money':
            self = self.length != 0 ? self : $(_mask['money']);
            if (typeof $.fn.maskMoney === 'undefined')
                throw  new Error('Artico requires jQuery-MaskMoney');
            self.maskMoney({allowNegative: false, thousands: '.', decimal: ',', affixesStay: false});
            break;

        case 'int':
            self = self.length != 0 ? self : $(_mask['int']);
            self.appMask('000.000.000.000.000', {reverse: true});
            break;

        case 'float':
            self = self.length != 0 ? self : $(_mask['float']);
            self.appMask('000.000.000.000.000,00', {reverse: true});
            break;

        case 'cep':
            self = self.length != 0 ? self : $(_mask['cep']);
            self.appMask('00000-000');
            break;

        case 'cnpj':
            self = self.length != 0 ? self : $(_mask['cnpj']);
            self.appMask('00.000.000/0000-00');
            break;

        case 'placa':
            self = self.length != 0 ? self : $(_mask['placa']);
            self.appMask('SSS-0000', {
                'translation': {
                    S: {pattern: /[A-Za-z]/},
                    0: {pattern: /[0-9]/}
                },
                onKeyPress: function (value, event) {
                    event.currentTarget.value = value.toUpperCase();
                }
            });
            break;

        case 'veiculo-doc':
            self = self.length != 0 ? self : $(_mask['veiculo-doc']);
            self.appMask('000000000000');
            break;

        case 'licenca':
            self = self.length != 0 ? self : $(_mask['licenca']);
            self.appMask('00000000');
            break;

        case 'isc-municipal':
            self = self.length != 0 ? self : $(_mask['isc-municipal']);
            self.appMask('000000/000-0');
            break;

        case 'alvara-numero':
            self = self.length != 0 ? self : $(_mask['alvara-numero']);
            self.appMask('000.000.000.000.000');
            break;

        case 'telefone':
            self = self.length != 0 ? self : $(_mask['telefone']);
            var SPMaskBehavior = function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                },
                spOptions = {
                    onKeyPress: function (val, e, field, options) {
                        field.mask(SPMaskBehavior.apply({}, arguments), options);
                    }
                };

            self.appMask(SPMaskBehavior, spOptions);
            break;
        default :
            console.error('Mask \'' + mask_name + '\' not defined.');
    }
};
$.fn['appUnmaskApply'] = function (mask_name, options) {
    var self = this;

    var unmask_build = function (item, $mask) {
        item = item.length != 0 ? item : $(_mask[$mask]);
        item.appUnmask();
    };

    switch (mask_name) {
        case 'money':
            self = self.length != 0 ? self : $(_mask['money']);
            self.each(function () {
                var item = $(this);
                var value = item.val();
                if (value == '' || typeof value === 'undefined') {
                    item.val(0);
                } else {
                    value = value.replace(/[.]/g, '').replace(',', '.');
                    item.val(parseFloat(value));
                }
            });
            break;

        case 'int':
            self = self.length != 0 ? self : $(_mask['int']);
            self.each(function () {
                var item = $(this);
                var value = item.val();
                value = value.replace(/[.]/g, '').replace(',', '.');
                item.val(parseFloat(value));
            });
            break;

        case 'float':
            self = self.length != 0 ? self : $(_mask['float']);
            self.each(function () {
                var item = $(this);
                var value = item.val();
                value = value.replace(/[.]/g, '').replace(',', '.');
                item.val(parseFloat(value));
            });
            break;

        case 'date':
            self = self.length != 0 ? self : $(_mask['date']);
            self.each(function () {
                var item = $(this);
                var $datepicker = item.data("DateTimePicker");
                options = options || [];
                //var format = options.format || $datepicker.options.pickTime ? 'YYYY-MM-DD H:m' : 'YYYY-MM-DD';
                var input = item.find('input');
                if (input.val() != '') {
                    var date = $datepicker.getDate();
                    if (date != null)
                    //date = date.format(format);
                    //    date = date.format();
                        date = date.toISOString();
                    input.val(date);
                }
            });
            break;

        case 'veiculo-doc':
            unmask_build(self, 'veiculo-doc');
            break;
        case 'placa':
            unmask_build(self, 'placa');
            break;
        case 'telefone':
            unmask_build(self, 'telefone');
            break;
        case 'cep':
            unmask_build(self, 'cep');
            break;
        case 'cnpj':
            unmask_build(self, 'cnpj');
            break;
        case 'licenca':
            unmask_build(self, 'licenca');
            break;
        case 'alvara-numero':
            unmask_build(self, 'alvara-numero');
            break;
        case 'isc-municipal':
            unmask_build(self, 'isc-municipal');
            break;

        default :
            console.error('Unmask \'' + mask_name + '\' not defined.');
    }
};


$['appMaskApplyAll'] = function () {
    var items = [
        'money',
        'int',
        'float',
        'cep',
        'cnpj',
        'placa',
        'licenca',
        'telefone',
        'alvara-numero',
        'isc-municipal'
    ];


    $.each(items, function (index, item) {
        $().appMaskApply(item);
    });
};

$(document).ready(function () {
    if (typeof $.fn.mask === 'function') {
        $.appMaskApplyAll();
    }
});
