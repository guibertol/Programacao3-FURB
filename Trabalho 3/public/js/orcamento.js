var OrcamentoView = function () {
        
    var select_uf = $('#select_uf');
    //var select_classificacao = $('#select_clascli');
    var btn_orcamento_add = $('#orcamento_add');
    var $input_cpf_cnpj = $('#cpf_cnpj');
    var check_msg_confirmo = $('#msg_confirmo');    
    //var classificacao = [];
       
    $input_cpf_cnpj.appMaskApply('cnpj');
    
   /* classificacao.push({
        'id':'001',
        'nome':'REGIONAL'   
    },
    {  
        'id':'002',
        'nome':'NACIONAL'
    }); */  

    var selectize_uf = null;
        //selectize_classificacao = null;

    var self = this;
    $.extend(self, {
        btnEnable: function () {
            btn_orcamento_add.removeClass('disabled');
            btn_orcamento_add.attr('disabled', false);
        },
        btnDisable: function () {
            btn_orcamento_add.addClass('disabled');
            btn_orcamento_add.attr('disabled', true);
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
         
            check_msg_confirmo.change( function (){
                var $self = $(this);
               
                if($self.prop('checked') === true){
                    orcamentoView.btnEnable();
                }else{
                    orcamentoView.btnDisable();
                }
                
            });    

          /*  select_classificacao.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options:  classificacao,
                onChange: function (){
                    
                }

            });
            selectize_classificacao = select_classificacao[0].selectize;*/

            select_uf.selectize({
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome'],
                options: estados,
                onChange: function (){

                }

            });
            selectize_uf = select_uf[0].selectize;
            
        },
        /*loading_cidade: function (status) {
            var loaderClass = 'loader';
            status === true ? $select_cidade_loading.addClass(loaderClass) : $select_cidade_loading.removeClass(loaderClass);
        },*/
        loading_button: function (status) {
            var loaderClass = 'loader';
            status === true ? btn_orcamento_add.addClass(loaderClass) : btn_orcamento_add.removeClass(loaderClass);
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
                    //if ($(e.target).is('textarea')) {
                    //    return true;
                    //}
                    
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
                        cpf_cnpj:{
                            validators:{
                                notEmpty:{
                                    message: 'Favor informar o CPF/CNPJ válido'
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
            
                    $form.find($('#cpf_cnpj')).appUnmaskApply('cnpj');
            
                    if(self.validaCNPJ($('#cpf_cnpj').val()) == false){
                        e.preventDefault();
                        self.disableSubmitButtons(true);
                        $cpf_cnpj.focus();
                        $form.formValidation('updateStatus', $cpf_cnpj, 'INVALID');
                        swal('Atenção', 'Favor informar um CNPJ válido!', 'warning');
                        return false;
                    }   
                    
                    if ($('#msg_confirmo').prop('checked') === false){
                        e.preventDefault();
                        swal('Atenção!', 'Favor aceitar os termos para prosseguir com o cadastro.');
                        return false;
                    }
                    
                    OrcamentoView.loading_button(true);
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
        /**
         * Return FormValidation
         */
        getFormValidation: function () {
            return $form.data('formValidation');
        },
        disableSubmitButtons: function (isDisable) {
            //var btn = self.getFormValidation().$submitButton;
            //if(btn != null)
            //  btn.
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
            //strCPF  = RetiraCaracteresInvalidos(strCPF,11);
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
    
    
var OrcamentoView = new OrcamentoView();
var formView = new FormView();

window.orcamentoView = OrcamentoView;
window.formView = formView;