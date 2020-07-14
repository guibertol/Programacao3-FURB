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