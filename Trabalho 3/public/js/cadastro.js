var CadastroView = function () {
        
    var select_tipo_pessoa = $('#select_tipo_pessoa');
    var select_tipo_cliente = $('#select_tipo_cliente');
    var select_uf = $('#select_uf');
    var select_cidade = $('#select_cidade');
    var select_contribuinte = $('#select_contribuinte');
    var select_suframa = $('#select_suframa');
    var $select_cidade_loading = select_cidade.parent();
    var btn_cliente_add = $('#cliente_add');
    var $input_cpf_cnpj = $('#cpf_cnpj');
    var $input_insc_estadual = $('#insc_estadual');
    var check_msg_confirmo = $('#msg_confirmo');
    var $input_insc_suframa = $('#insc_suframa');
    //var $div_beneficio_suframa = $('#beneficio_suframa');
    var check_ipi = $('#check_ipi');
    var check_icms = $('#check_icms');
    var check_piscofins = $('#check_piscofins');

    //Vendedores
    var select_vendedores = $('#select_vendedores');

    $('#cep').appMaskApply('cep');
    $('#telefone').appMaskApply('telefone');
    $('#celular').appMaskApply('celular');

    var selectize_tipo_pessoa = null,
        selectize_tipo_cliente = null,
        selectize_uf = null,
        selectize_cidade = null,
        selectize_contribuinte = null,
        selectize_suframa = null;
        selectize_vendedores = null;

    var self = this;
    $.extend(self, {
        btnEnable: function () {
            btn_cliente_add.removeClass('disabled');
            btn_cliente_add.attr('disabled', false);
        },
        btnDisable: function () {
            btn_cliente_add.addClass('disabled');
            btn_cliente_add.attr('disabled', true);
        },
        inputDisable: function (input){
            input.addClass('disabled');
            input.attr('disabled', true);
        },
        inputEnable: function (input){
            input.removeClass('disabled');
            input.attr('disabled', false);
        },
        init: function () {
            self.btnDisable();

            $('#cep').on('keyup', function() {

                let cep = $('#cep').val();
                if(cep.length > 8) {

                    let new_cep = cep.replace('-', '');
                    axios.get('https://viacep.com.br/ws/'+ new_cep +'/json/')
                        .then(function(response){
                            $('#endereco').val(response.data.logradouro);
                            $('#bairro').val(response.data.bairro);
                            if(!response.data.erro) {
                                $('#numero').focus();
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });

                }
                
            });
         
            check_msg_confirmo.change( function (){
                var $self = $(this);
               
                if($self.prop('checked') === true){
                    cadastroView.btnEnable();
                }else{
                    cadastroView.btnDisable();
                }
                
            });
                  
            select_tipo_pessoa.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: tipo_pessoa,
                onChange: function (tipo_pessoa) {

                    if (!tipo_pessoa.length){
                        self.inputDisable($input_cpf_cnpj.val(''));
                        return;
                    }

                    $input_cpf_cnpj.val('');

                    if (tipo_pessoa == 'F'){
                        $input_cpf_cnpj.appMaskApply('cpf');
                        self.inputEnable($input_cpf_cnpj);

                    }else{
                        $input_cpf_cnpj.appMaskApply('cnpj');
                        self.inputEnable($input_cpf_cnpj);
                    }

                }

            });
            selectize_tipo_pessoa = select_tipo_pessoa[0].selectize;

            select_tipo_cliente.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options:  tipo_cliente,
                onChange: function (tipo_cliente){
                    
                    if(tipo_cliente == 'D') {
                        $('#distribuidor_exclusivo').removeClass('hidden');
                        $('[name="is_exclusivo"][value="S"]').prop('checked', true);
                    } else {
                        $('#distribuidor_exclusivo').addClass('hidden');
                    }
                    
                }

            });

            selectize_tipo_cliente = select_tipo_cliente[0].selectize;

            select_vendedores.selectize({
                valueField: 'A3_COD',
                labelField: 'A3_NOME',
                searchField: ['A3_NOME'],
                options: vendedores,
                onChange: function (vendedores){
                }
            });

            selectize_vendedores = select_vendedores[0].selectize;

            select_uf.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: estados,
                onChange: function (estados){

                    CadastroView.loading_cidade(true);

                    if (!estados.length){
                        selectize_cidade.disable();
                        selectize_cidade.clearOptions();
                        CadastroView.loading_cidade(false);
                        return;
                    }

                    selectize_cidade.disable();
                    selectize_cidade.clearOptions();
                    
                    if (estados == 'AM' || estados == 'AP' || estados == 'RR' || estados == 'RO' || estados == 'AC'){
                        selectize_suframa.enable();
                    }else{
                        selectize_suframa.disable();
                        selectize_suframa.clear();
                        check_ipi.removeAttr('checked');
                        check_icms.removeAttr('checked');
                        check_piscofins.removeAttr('checked');
                        self.inputDisable(check_ipi);
                        self.inputDisable(check_icms);
                        self.inputDisable(check_piscofins);
                    }                    

                    $.ajax({
                        url: base_url + '/api/cliente/cidades/' + estados,
                        type: 'GET',
                        success: function (cidades) {

                            selectize_cidade.load(function (callback) {
                                CadastroView.loading_cidade(false);
                                selectize_cidade.enable();
                                callback(cidades);
                            });

                        },
                        error: function (){
                            callback();
                        }

                    });

                }

            });
            selectize_uf = select_uf[0].selectize;

            select_cidade.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: [],
                onChange: function (cidades){

                }

            });
            selectize_cidade = select_cidade[0].selectize;

            select_contribuinte.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: contribuinte,
                onChange: function (contribuinte){

                    if (!contribuinte.length){
                        self.inputDisable($input_insc_estadual.val(''));
                        return;
                    }

                    $input_insc_estadual.val('');

                    if (contribuinte == '1'){
                        self.inputEnable($input_insc_estadual);
                    }else{
                        self.inputDisable($input_insc_estadual);
                    }
                }

            });
            selectize_contribuinte = select_contribuinte[0].selectize;
            
            select_suframa.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: suframa,
                onChange: function (suframa){
                    
                    if (!suframa.length){
                        self.inputDisable($input_insc_suframa.val(''));
                        return;
                    }
                    
                    $input_insc_suframa.val('');
                    check_ipi.removeAttr('checked');
                    check_icms.removeAttr('checked');
                    check_piscofins.removeAttr('checked');
                    
                    if (suframa == '1'){
                        //var tipo_cli = cadastroView.getTipoCliente();
                        self.inputEnable($input_insc_suframa);
                        self.inputEnable(check_ipi);
                        
                        /*if (tipo_cli == 'R' || tipo_cli == 'S' || tipo_cli == 'X'){
                            self.inputEnable(check_icms);
                        }*/
                        self.inputEnable(check_icms);
                        self.inputEnable(check_piscofins);
                        
                    }else{
                        
                        self.inputDisable($input_insc_suframa);
                        self.inputDisable(check_ipi);
                        self.inputDisable(check_icms);
                        self.inputDisable(check_piscofins);
                        
                        //formView.getFormValidation().enableFieldValidators('beneficios[]', false);
                        //$form.formValidation('resetField', 'beneficios[]', null);
                    }
                }
               
            });
            selectize_suframa = select_suframa[0].selectize;

        },
        loading_cidade: function (status) {
            var loaderClass = 'loader';
            status === true ? $select_cidade_loading.addClass(loaderClass) : $select_cidade_loading.removeClass(loaderClass);
        },
        loading_button: function (status) {
            var loaderClass = 'loader';
            status === true ? btn_cliente_add.addClass(loaderClass) : btn_cliente_add.removeClass(loaderClass);
        },
        getTipoPessoa: function (){
            return selectize_tipo_pessoa.getValue();
        },
        getTipoCliente: function (){
            return selectize_tipo_cliente.getValue();
        },
        getSuframa: function (){
            return selectize_suframa.getValue();
        }

    });
        
};
    
var FormView = function () {
    var $form = $('form');
    var self = this;
    $.extend(self, {
        init: function () {

            $form
                .on('keyup keypress', function (e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) {
                        e.preventDefault();
                        return false;
                    }

                })
                .formValidation({
                    excluded: [
                        ":hidden:not(.forma-hidden,[class~=selectized])",
                        ":hidden > .selectized",
                        ".selectize-control .selectize-input input",
                        ":disabled",
                        ":not(:visible):not(.forma-hidden,[class~=selectized])" 
                    ],
                    framework: 'bootstrap',
                    fields: {
                        razao_social: {
                            validators: {
                                notEmpty: {
                                    message: 'Favor informar a razão social'
                                }
                            }
                        },
                        nome_fantasia:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar o nome fantasia'
                                }
                            }
                        },
                        select_tipo_pessoa:{
                            validators:{
                                notEmpty:{
                                    message: 'Selecione Fisica ou Juridica para liberar o campo cpf/cnpj'
                                }
                            }
                        },
                        cpf_cnpj:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar o CPF/CNPJ válido'
                                }
                            }
                        },
                        contato:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar um nome para contato'
                                }
                            }
                        },
                        cep:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar um cep'
                                }
                            }
                        },
                        endereco:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar um endereço'
                                },
                            }
                        },
                        bairro:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar o bairro'
                                }
                            }
                        },
                        select_uf:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor selecionar o estado'
                                }
                            }
                        },
                        select_cidade:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor selecionar a cidade'
                                }
                            }
                        },
                        email:{
                            validators:{
                                emailAddress: {
                                    message: 'Digite corretamente o e-mail'
                                },
                                notEmpty:{
                                    message: 'Por favor, informe um e-mail válido'
                                }
                            }
                        },
                        telefone:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe um telefone para contato'
                                }
                            }
                        },
                        celular:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe um celular para contato'
                                }
                            }  
                        },
                        select_tipo_cliente:{
                            validators:{
                                notEmpty:{
                                    message: 'Selecione o tipo do cliente'
                                }
                            }
                        },
                        is_exclusivo:{
                            validators:{
                                stringLength: {
                                    min: 1,
                                    max: 1,
                                    message: 'O valor deve ser 0 ou 1'
                                }
                            }
                        },
                        select_contribuinte:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe se o cliente é contribuinte'
                                }
                            }
                        },
                        insc_estadual:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe a inscrição estadual',
                                    max: 18
                                },
                                digits: {
                                    message: 'Informe apenas números!'
                                }
                            }
                        },
                        select_suframa:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe se o cliente possui inscrição SUFRAMA'
                                }
                            }
                        },
                        insc_suframa:{
                            validators:{
                                notEmpty:{
                                    message: 'Informe a inscrição SUFRAMA',
                                    max:12
                                }
                            }
                        },
                        des_observacao:{
                            validators:{
                                stringLength:{
                                    message: 'máximo 254 caracteres',
                                    max: 254
                                }
                            }
                        }
                    }
                })
                .on('success.form.fv', function (e) {
                    var $cpf_cnpj = $('#cpf_cnpj');
            
                    $form.find($('#cpf_cnpj')).appUnmaskApply('cpf');
                    $form.find($('#cpf_cnpj')).appUnmaskApply('cnpj');
                    $form.find($('#cep')).appUnmaskApply('cep');
                    
                    var select_tp_pessoa = CadastroView.getTipoPessoa();
            
                    if (select_tp_pessoa == 'F'){
                        
                        if( self.validaCPF($('#cpf_cnpj').val()) == false ){                            
                            e.preventDefault();
                            self.disableSubmitButtons(true);
                            $cpf_cnpj.focus();
                            $form.formValidation('updateStatus', $cpf_cnpj, 'INVALID');    
                            swal('Atenção', 'Favor informar um CPF válido!', 'warning');
                            return false;
                        }

                    }else if (select_tp_pessoa == 'J'){

                        $form.find('.mask-cnpj').appUnmaskApply('cnpj');
                        
                        if(self.validaCNPJ($('#cpf_cnpj').val()) == false){
                            e.preventDefault();
                            self.disableSubmitButtons(true);
                            $cpf_cnpj.focus();
                            $form.formValidation('updateStatus', $cpf_cnpj, 'INVALID');
                            swal('Atenção', 'Favor informar um CNPJ válido!', 'warning');
                            return false;
                        }   

                    }
                    
                    if ($('#insc_suframa').val() != ''){
                        
                        if ($('#check_ipi').prop('checked') == false && $('#check_icms').prop('checked') == false && $('#check_piscofins').prop('checked') == false){
                            e.preventDefault();
                            swal('Atenção!', 'Favor selecionar o benefício!');
                            return false;
                        }
                    }
                    
                    if ($('#msg_confirmo').prop('checked') === false){
                        e.preventDefault();
                        swal('Atenção!', 'Favor aceitar os termos para prosseguir com o cadastro.');
                        return false;
                    }
                    
                    CadastroView.loading_button(true);
                })
                .on('success.field.fv', function (e, data) {
                    data.fv.disableSubmitButtons(data.fv.getInvalidFields().length > 0);
                });

        },
        getForm: function () {
            return $form;
        },
        getBtnSubmit: function () {
            $form.find(':submit');
        },
        //Return FormValidation
        getFormValidation: function () {
            return $form.data('formValidation');
        },
        disableSubmitButtons: function (isDisable) {
            self.getFormValidation().disableSubmitButtons(isDisable);
        },
        validaCPF: function(str) {
            str = str.replace('.','');
            str = str.replace('.','');
            str = str.replace('.','');
            str = str.replace('-','');
            strCPF = str;

            var Soma;
            var Resto;
            Soma = 0;
            if (strCPF === "00000000000" || 
                strCPF === "11111111111" || 
                strCPF === "22222222222" || 
                strCPF === "33333333333" || 
                strCPF === "44444444444" || 
                strCPF === "55555555555" || 
                strCPF === "66666666666" || 
                strCPF === "77777777777" || 
                strCPF === "88888888888" || 
                strCPF === "99999999999")
                    return false;
            for (i=1; i<=9; i++)
                    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
            Resto = (Soma * 10) % 11;
            if ((Resto == 10) || (Resto == 11))
                    Resto = 0;
            if (Resto != parseInt(strCPF.substring(9, 10)) )
                    return false;
            Soma = 0;
            for (i = 1; i <= 10; i++)
                    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;
            if ((Resto == 10) || (Resto == 11))
                    Resto = 0;
            if (Resto != parseInt(strCPF.substring(10, 11) ) )
                    return false;
            return true;
        },
        validaCNPJ: function (str){
            str = str.replace('.','');
            str = str.replace('.','');
            str = str.replace('.','');
            str = str.replace('-','');
            str = str.replace('/','');
            cnpj = str;
            var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
            digitos_iguais = 1;
            if (cnpj.length < 14 && cnpj.length < 15)
                    return false;
            for (i = 0; i < cnpj.length - 1; i++)
                    if (cnpj.charAt(i) != cnpj.charAt(i + 1))
                    {
                            digitos_iguais = 0;
                            break;
                    }
            if (!digitos_iguais){
                tamanho = cnpj.length - 2
                numeros = cnpj.substring(0,tamanho);
                digitos = cnpj.substring(tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--)
                {
                        soma += numeros.charAt(tamanho - i) * pos--;
                        if (pos < 2)
                                pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                        return false;
                tamanho = tamanho + 1;
                numeros = cnpj.substring(0,tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--)
                {
                        soma += numeros.charAt(tamanho - i) * pos--;
                        if (pos < 2)
                                pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                        return false;
                return true;
            }else
                return false;
        }

    });
};
    
    
var CadastroView = new CadastroView();
var formView = new FormView();

window.cadastroView = CadastroView;
window.formView = formView;