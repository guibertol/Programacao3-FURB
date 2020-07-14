/* global Format, validators, CODTAB */

(function ($, carrinhoController) {
    var CondicaoPagamentoView = function () {
        var $container = $('#pedido-result');

        var $input_condicao_pagamento = $container.find('input[type=radio][name=condicao_pagamento]');
        var $input_desconto = $container.find('input[name="desconto"]');
        var $input_desconto_opcao = $container.find('input:radio[name="opcao_desconto"]');

        var $txt_total = $container.find('[data-target="total"]');
        var $txt_30 = $container.find('[data-target="total_30"]');
        var $txt_30_60 = $container.find('[data-target="total_30_60"]');
        var $txt_30_60_90 = $container.find('[data-target="total_30_60_90"]');


        var self = this;
        $.extend(self, {
            CONDICAO_PAGAMENTO_AVISTA: 'avista',
            CONDICAO_PAGAMENTO_PRAZO: 'prazo',

            init: function () {
                $input_desconto.on('keyup', function () { //focusout
                    var self_input = $(this);
                    formView.getForm().formValidation('revalidateField', self_input);
                    if (self_input.val() == '') return;
                    carrinhoView.update_desconto($input_desconto.appUnmaskValue());
                });


                $input_desconto_opcao.on('change', function () { //focusout
                    var self = $(this);
                    if (self.val() == 'desconto_pedido') {
                        $input_desconto.removeAttr('disabled');
                        carrinhoView.update_desconto($input_desconto.appUnmaskValue());
                        condicaoPagamentoView.updateTotal();
                    }
                    else {
                        $input_desconto.appSetMoney(0);
                        formView.getForm().formValidation('revalidateField', $input_desconto);
                        $input_desconto.attr('disabled', 'disabled');
                    }
                });

                $input_condicao_pagamento.change(function () {
                    if (this.value === '001')
                        formaPagamentoView.setCondicaoPagamento(self.CONDICAO_PAGAMENTO_AVISTA);
                    else
                        formaPagamentoView.setCondicaoPagamento(self.CONDICAO_PAGAMENTO_PRAZO);
                });
            },
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $container.addClass(loaderClass) : $container.removeClass(loaderClass);
            },
            getCondicaoPagamento: function () {
                var valor = self.getCondicaoPagamentoValue();
                return (valor == '001' || valor == '021' || valor == '025') ? self.CONDICAO_PAGAMENTO_AVISTA : self.CONDICAO_PAGAMENTO_PRAZO;
            },
            getCondicaoPagamentoValue: function () {
                return $input_condicao_pagamento.filter(':checked').val();
                //  $('input[name=radioName]:checked', '#myForm').val()
            },

            getInputCondicaoPagamento: function () {
                return $input_condicao_pagamento;
            },

            getDesconto: function () {
                return $input_desconto.appUnmaskValue();
            },
            refreshTotal: function () {
                var carrinho = carrinhoController.getCarrinho();
                this.loading(true);
                $txt_total.text(Format.preco(carrinho.total));
                $txt_30.text(Format.preco(carrinho.total_30));
                $txt_30_60.text(Format.preco(carrinho.total_30_60));
                $txt_30_60_90.text(Format.preco(carrinho.total_bruto_30_60_90));

                formaPagamentoView.setCondicaoPagamento(condicaoPagamentoView.getCondicaoPagamento());
                this.loading(false);
            },


            /**
             * Percorre os produtos e faz o calculo do total bruto
             */
            //produto_total_render
            updateTotal: function () {
                var desconto = condicaoPagamentoView.getDesconto(); //val()
                carrinhoController.updateValuesTotal(desconto);
                condicaoPagamentoView.refreshTotal();
            }
        });


    };
    var FormaPagamentoView = function () {
        var components = {
            init: function () {
                var $container = $('#container-forma-pagamento');
                var $container_check = $container.find('#forma-pagamento-check');
                var $container_check_total = $container_check.find('#forma-pagamento-total');
                var $container_check_total_soma = $container_check.find('#forma-pagamento-total-soma');
                var $container_check_total_faltante = $container_check.find('#forma-pagamento-total-faltante');
                var $container_check_total_faltante_valor = $container_check_total_faltante.find('[data-target="valor"]');
                var $container_check_total_excedente = $container_check.find('#forma-pagamento-total-excedente');
                var $container_check_total_excedente_valor = $container_check_total_excedente.find('[data-target="valor"]');

                var $tabela = $container.find('#tabela-forma-pagamento');
                var $selects_tipo = $tabela.find('[data-target="forma-pagamento"]');
                var $dtpickers_data = $tabela.find('[data-target="forma-pagamento-data"]');
                var $inputs_data = $dtpickers_data.find('input');
                var $inputs_valor = $tabela.find('[data-target="forma-pagamento-valor"]');

                var $tr_p1 = $tabela.find('[data-target="tr-p1"]');
                var $condicao_p1 = $tr_p1.find('select[name*="[condicao]"]');
                var $data_p1 = $tr_p1.find('input[name*="[data]"]');
                var $valor_p1 = $tr_p1.find('input[name*="[valor]"]');

                var $tr_p2 = $tabela.find('[data-target="tr-p2"]');
                var $condicao_p2 = $tr_p2.find('select[name*="[condicao]"]');
                var $data_p2 = $tr_p2.find('input[name*="[data]"]');
                var $valor_p2 = $tr_p2.find('input[name*="[valor]"]');

                var $tr_p3 = $tabela.find('[data-target="tr-p3"]');
                var $condicao_p3 = $tr_p3.find('select[name*="[condicao]"]');
                var $data_p3 = $tr_p3.find('input[name*="[data]"]');
                var $valor_p3 = $tr_p3.find('input[name*="[valor]"]');

                var $tr_p4 = $tabela.find('[data-target="tr-p4"]');
                var $condicao_p4 = $tr_p4.find('select[name*="[condicao]"]');
                var $data_p4 = $tr_p4.find('input[name*="[data]"]');
                var $valor_p4 = $tr_p4.find('input[name*="[valor]"]');

                var $tr_p5 = $tabela.find('[data-target="tr-p5"]');
                var $condicao_p5 = $tr_p5.find('select[name*="[condicao]"]');
                var $data_p5 = $tr_p5.find('input[name*="[data]"]');
                var $valor_p5 = $tr_p5.find('input[name*="[valor]"]');

                var $input_check = formView.getForm().find('#forma_pagamento_check');

                var form_pagamento = formView.getForm().find('input[name="forma_pagamento"]');
                var component_pagamento_target = $('ul[data-action="js-pagamento-itens"] li');

                var self = this;
                $.extend(self, {
                    container: $container,
                    check: {
                        input: $input_check,
                        container: $container_check,
                        total: $container_check_total,
                        total_soma: $container_check_total_soma,
                        faltante_container: $container_check_total_faltante,
                        faltante_valor: $container_check_total_faltante_valor,
                        excedente_container: $container_check_total_excedente,
                        excedente_valor: $container_check_total_excedente_valor,
                    },
                    tabela: {
                        container: $tabela,
                        select_tipos: $selects_tipo,
                        dtpickers_data: $dtpickers_data,
                        inputs_data: $inputs_data,
                        inputs_valor: $inputs_valor,

                        parcelas: {
                            p1: {
                                condicao: $condicao_p1,
                                data: $data_p1,
                                valor: $valor_p1
                            },
                            p2: {
                                condicao: $condicao_p2,
                                data: $data_p2,
                                valor: $valor_p2
                            },
                            p3: {
                                condicao: $condicao_p3,
                                data: $data_p3,
                                valor: $valor_p3
                            },
                            p4: {
                                condicao: $condicao_p4,
                                data: $data_p4,
                                valor: $valor_p4
                            },
                            p5: {
                                condicao: $condicao_p5,
                                data: $data_p5,
                                valor: $valor_p5
                            }

                        }
                    },
                    formas: {
                        container: form_pagamento,
                        component: component_pagamento_target,
                    }
                });
            }
        };


        var total = 0;
        var total_soma = 0;

        var loading_count = 0;

        var validators_data = {
            validators: {
                notEmpty: {
                    message: 'Por favor selecione uma data'
                }
            }
        };

        var validators_condicao = {
            validators: {
                notEmpty: {
                    message: 'Por favor selecione uma condicao'
                }
            }
        };

        var self = this;
        $.extend(self, {
            init: function () {
                components.init();


                formaPagamentoView.loading(true);
                components.tabela.select_tipos.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: formas_pagamento,
                });
                components.tabela.dtpickers_data.datetimepicker({
                    format: 'DD/MM/YYYY'
                });

                $('#dtp-validade').datetimepicker({
                    format: 'DD/MM/YYYY'
                });

                components.tabela.select_tipos.on('change', function (e) {
                    var $self = $(this);
                    var value = $self.val();
                    if (value == '40') {//bndes
                        formaPagamentoView.setFormaPagamento(40);
                    } else if (value == '70') { //outros financiamentos
                        formaPagamentoView.setFormaPagamento(70);
                    }
                });


                components.tabela.container.on('keyup', 'input[name*="[valor]"]', function () {
                    var $valor_input = $(this);
                    var valor = $valor_input.appUnmaskValue();

                    var $form = formView.getForm();
                    var $fv = formView.getFormValidation();

                    var $tr = $valor_input.closest('tr');
                    //var $data_input = $tr.find('input[name*="[data]"]');
                    //var $dtpicker_data = $data_input.closest('.input-group');
                    //var $condicao_select = $tr.find('select[name*="[condicao]"]');


                    var $input_aux = $tr.find('input[name*="[valor]"]');
                    var parcela_name = $input_aux.attr('name').replace('[valor]', '');
                    var $data_input = $tr.find('input[name="' + parcela_name + '[data]"]');
                    var $dtpicker_data = $data_input.closest('.input-group');
                    var $condicao_select = $tr.find('select[name="' + parcela_name + '[condicao]"]');


                    if (valor != 0) {
                        if (!$tr.data('field-validator')) {
                            $tr.data('field-validator', true);

                            $form.formValidation('addField', $data_input, validators_data);
                            $form.formValidation('addField', $condicao_select, validators_condicao);
                            $dtpicker_data.on('dp.change', function (e) {
                                $fv.revalidateField($data_input);
                            });
                        }
                    } else {
                        $tr.data('field-validator', false);
                        $fv.offLiveChange($data_input);
                        $fv.updateStatus($data_input, 'VALID');
                        $form.formValidation('resetField', $data_input, null);
                        $form.formValidation('removeField', $data_input);

                        $fv.offLiveChange($condicao_select);
                        $fv.updateStatus($condicao_select, 'VALID');
                        $form.formValidation('resetField', $data_input, null);
                        $form.formValidation('removeField', $condicao_select);
                    }

                    self.recalcTotalSoma();
                });

                //COMPONENT FAZER PLUGIN DEPOIS

                var component_pagamento_init = function () {
                    components.formas.component.click(function () {
                        var self_comp = $(this);
                        components.formas.component.removeClass('selected');
                        self_comp.addClass('selected');
                        components.formas.container.val(self_comp.data('value'));
                    });
                };


                component_pagamento_init();
                self.setFormaPagamento(10);
                formaPagamentoView.loading(false);
            },

            /**
             * Percorre todas as linhas da tabela e adiciona os validators dos campos de data e
             * condicao caso o valor inserido seja diferente de 0
             */
            updateFieldsValidators: function () {
                var $trs = components.tabela.container.find('tbody tr');
                var $form = formView.getForm();
                var $fv = formView.getFormValidation();

                $trs.each(function () {
                    var $tr = $(this);
                    var $valor_input = $tr.find('input[name*="[valor]"]');
                    var valor = $valor_input.appUnmaskValue();

                    if (valor != 0) {
                        if (!$tr.data('field-validator')) {
                            //var $data_input = $tr.find('input[name*="[data]"]');
                            //var $dtpicker_data = $data_input.closest('.input-group');
                            //var $condicao_select = $tr.find('select[name*="[condicao]"]');

                            var $input_aux = $tr.find('input[name*="[valor]"]');
                            var parcela_name = $input_aux.attr('name').replace('[valor]', '');
                            var $data_input = $tr.find('input[name="' + parcela_name + '[data]"]');
                            var $dtpicker_data = $data_input.closest('.input-group');
                            var $condicao_select = $tr.find('select[name="' + parcela_name + '[condicao]"]');

                            $tr.data('field-validator', true);

                            $form.formValidation('addField', $data_input, validators_data);
                            $form.formValidation('addField', $condicao_select, validators_condicao);
                            $dtpicker_data.on('dp.change', function (e) {
                                $fv.revalidateField($data_input);
                            });
                        }
                    }
                });
                //$fv.resetForm();
            },

            resetFieldsValidators: function () {
                var $trs = components.tabela.container.find('tbody tr');
                var $form = formView.getForm();
                var $fv = formView.getFormValidation();

                $trs.each(function () {
                    var $tr = $(this);
                    if ($tr.data('field-validator')) {
                        $tr.data('field-validator', false);

                        //var $data_input = $tr.find('input[name*="[data]"]');
                        //var $dtpicker_data = $data_input.closest('.input-group');
                        //var $condicao_select = $tr.find('select[name*="[condicao]"]');

                        var $input_aux = $tr.find('input[name*="[valor]"]');
                        var parcela_name = $input_aux.attr('name').replace('[valor]', '');
                        var $data_input = $tr.find('input[name="' + parcela_name + '[data]"]');
                        var $dtpicker_data = $data_input.closest('.input-group');
                        var $condicao_select = $tr.find('select[name="' + parcela_name + '[condicao]"]');

                        $fv.offLiveChange($data_input);
                        $fv.updateStatus($data_input, 'VALID');
                        $form.formValidation('resetField', $data_input, null);
                        $form.formValidation('removeField', $data_input);

                        $fv.offLiveChange($condicao_select);
                        $fv.updateStatus($condicao_select, 'VALID');
                        $form.formValidation('resetField', $data_input, null);
                        $form.formValidation('removeField', $condicao_select);

                        $dtpicker_data.off("dp.change");
                    }
                });
                //$fv.resetForm();
            },
            /**
             * Seleciona a Forma de Pagamento
             */
            setFormaPagamento: function (value) {
                components.formas.component.removeClass('selected');
                components.formas.component.each(function (index, item) {
                    var self_input = $(item);
                    if (self_input.data('value') == value) {
                        self_input.addClass('selected');
                        components.formas.container.val(self_input.data('value'));
                    }
                });
            },

            setTotal: function (t) {
                total = t;
            },


            /**
             * Percorre os inputs dos valores recalculando a soma total
             */
            recalcTotalSoma: function () {
                self.resetTotalSoma();
                components.tabela.inputs_valor.each(function (index, item) {
                    var $self = $(item);
                    var valor = $self.appUnmaskValue();
                    self.addTotalSoma(valor);
                });

                self.updateTotalRender();
            },

            resetTotalSoma: function () {
                total_soma = 0;
            },
            addTotalSoma: function (val) {
                total_soma += parseFloat(val);
            },
            loading: function (status) {
                var loaderClass = 'loader';
                if (status == true)
                    loading_count++;
                else
                    loading_count--;

                loading_count > 0 ? components.container.addClass(loaderClass) : components.container.removeClass(loaderClass);
            },


            /**
             * Atualiza os valores do total, soma e resto na tela
             */
            updateTotalRender: function () {
                var faltanteClass = 'faltante';
                var excedenteClass = 'excedente';

                var faltante = round(total - total_soma);
                var excedente = 0;
                if (faltante < 0) {
                    excedente = total_soma - total;
                }

                components.check.total.text(Format.preco(total));
                components.check.total_soma.text(Format.preco(total_soma));

                if (faltante == 0) {
                    components.check.excedente_container.addClass('hidden');
                    components.check.faltante_container.addClass('hidden');
                    components.check.container.removeClass(excedenteClass);
                    components.check.container.removeClass(faltanteClass);
                    components.check.input.val('1');
                    formView.getFormValidation().revalidateField(components.check.input);

                }
                else if (faltante > 0) {
                    components.check.container.addClass(faltanteClass);
                    components.check.container.removeClass(excedenteClass);
                    components.check.faltante_container.removeClass('hidden');
                    components.check.excedente_container.addClass('hidden');
                    components.check.faltante_valor.text(Format.preco(faltante));
                    //formView.disableSubmitButtons(true);
                    components.check.input.val('');
                    formView.getFormValidation().revalidateField(components.check.input);
                } else {
                    components.check.container.addClass(excedenteClass);
                    components.check.container.removeClass(faltanteClass);
                    components.check.excedente_container.removeClass('hidden');
                    components.check.faltante_container.addClass('hidden');
                    components.check.excedente_valor.text(Format.preco(excedente));
                    //formView.disableSubmitButtons(true);
                    components.check.input.val('');
                    formView.getFormValidation().revalidateField(components.check.input);
                }
            },

            setCondicaoPagamento: function (tipo) {
                var st_total = carrinhoController.getTotalST();
                var carrinho = carrinhoController.getCarrinho();

                formaPagamentoView.resetFieldsValidators();
                formaPagamentoView.resetTotalSoma();
                formaPagamentoView.loading(true);

                var condicao_pagamento_valor = condicaoPagamentoView.getCondicaoPagamentoValue();

                var hoje = moment();
                //var hoje = moment("09112015", "DDMMYYYY");

                var hoje_format = hoje.format('DD/MM/YYYY');
                var embarque = moment(hoje).add(PERIODO_DESEMBARQUE, 'days');

                var FORMA_AVISTA = 10;

                var FORMA_PRAZO = 20;

                var total = null,
                    resto = null,
                    entrada = null,
                    parcelas = null,
                    resto_parcelas = null;

                if (tipo == condicaoPagamentoView.CONDICAO_PAGAMENTO_AVISTA) { //A VISTA
                    total = carrinho.total;

                    formaPagamentoView.default_inputs();
                    formaPagamentoView.setTipos(carrinhoController.getFormaPagamentoAvista());
                    if (st_total > 0) {
                        components.tabela.parcelas.p1.valor.appSetMoney(st_total);
                        formaPagamentoView.addTotalSoma(st_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                        components.tabela.parcelas.p1.data.val(hoje_format);

                        resto = round((total - st_total));
                        components.tabela.parcelas.p2.valor.appSetMoney(resto);
                        formaPagamentoView.addTotalSoma(resto);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_AVISTA);
                        components.tabela.parcelas.p2.data.val(hoje_format);
                    } else {
                        components.tabela.parcelas.p1.valor.appSetMoney(total);
                        formaPagamentoView.addTotalSoma(total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                        components.tabela.parcelas.p1.data.val(hoje_format);
                    }
                } else { //A PRAZO
                    formaPagamentoView.default_inputs();
                    formaPagamentoView.setTipos(carrinhoController.getFormaPagamentoPrazo());


                    var dias_30 = moment(embarque).add(30, 'days');
                    var dias_60 = moment(embarque).add(60, 'days');
                    var dias_90 = moment(embarque).add(90, 'days');
                    var dias_30_format = dias_30.format('DD/MM/YYYY');
                    var dias_60_format = dias_60.format('DD/MM/YYYY');
                    var dias_90_format = dias_90.format('DD/MM/YYYY');


                    if (condicao_pagamento_valor == '002' || condicao_pagamento_valor == '022') {
                        total = carrinho.total_30;
                        if (st_total > 0) {
                            components.tabela.parcelas.p1.valor.appSetMoney(st_total);
                            formaPagamentoView.addTotalSoma(st_total);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);

                            resto = round((total - st_total));
                            entrada = round(resto * 0.3);
                            resto_parcelas = round(resto - entrada);
                            components.tabela.parcelas.p2.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p2.data.val(hoje_format);

                            components.tabela.parcelas.p3.valor.appSetMoney(resto_parcelas);
                            formaPagamentoView.addTotalSoma(resto_parcelas);
                            components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p3.data.val(dias_30_format);
                        } else {
                            entrada = round(total * 0.3);
                            resto_parcelas = round(total - entrada);

                            components.tabela.parcelas.p1.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);


                            components.tabela.parcelas.p2.valor.appSetMoney(resto_parcelas);

                            formaPagamentoView.addTotalSoma(resto_parcelas);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p2.data.val(dias_30_format);
                        }
                    } else if (condicao_pagamento_valor == '003' || condicao_pagamento_valor == '023') {
                        total = carrinho.total_30_60;
                        if (st_total > 0) {
                            //components.tabela.parcelas.p1.valor.maskMoney('mask', st_total);
                            components.tabela.parcelas.p1.valor.appSetMoney(st_total);
                            formaPagamentoView.addTotalSoma(st_total);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);

                            resto = round((total - st_total));
                            entrada = round(resto * 0.3);
                            resto_parcelas = round(resto - entrada);
                            components.tabela.parcelas.p2.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p2.data.val(hoje_format);

                            parcelas = utils.calc_parcelas(resto_parcelas, 2);
                            components.tabela.parcelas.p3.valor.appSetMoney(parcelas[0]);
                            formaPagamentoView.addTotalSoma(parcelas[0]);
                            components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p3.data.val(dias_30_format);

                            components.tabela.parcelas.p4.valor.appSetMoney(parcelas[1]);
                            formaPagamentoView.addTotalSoma(parcelas[1]);
                            components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p4.data.val(dias_60_format);
                        } else {
                            entrada = round(total * 0.3);
                            resto_parcelas = round(total - entrada);

                            components.tabela.parcelas.p1.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);

                            parcelas = utils.calc_parcelas(resto_parcelas, 2);
                            components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                            formaPagamentoView.addTotalSoma(parcelas[0]);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p2.data.val(dias_30_format);

                            components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                            formaPagamentoView.addTotalSoma(parcelas[1]);
                            components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p3.data.val(dias_60_format);
                        }
                    } else if (condicao_pagamento_valor == '004' || condicao_pagamento_valor == '024') {
                        total = carrinho.total_30_60_90;

                        if (st_total > 0) {
                            components.tabela.parcelas.p1.valor.appSetMoney(st_total);
                            formaPagamentoView.addTotalSoma(st_total);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);

                            resto = round((total - st_total));
                            entrada = round(resto * 0.3);
                            resto_parcelas = round(resto - entrada);
                            components.tabela.parcelas.p2.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p2.data.val(hoje_format);

                            parcelas = utils.calc_parcelas(resto_parcelas, 3);
                            components.tabela.parcelas.p3.valor.appSetMoney(parcelas[0]);
                            formaPagamentoView.addTotalSoma(parcelas[0]);
                            components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p3.data.val(dias_30_format);

                            components.tabela.parcelas.p4.valor.appSetMoney(parcelas[1]);
                            formaPagamentoView.addTotalSoma(parcelas[1]);
                            components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p4.data.val(dias_60_format);

                            components.tabela.parcelas.p5.valor.appSetMoney(parcelas[2]);
                            formaPagamentoView.addTotalSoma(parcelas[2]);
                            components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p5.data.val(dias_90_format);
                        } else {
                            entrada = round(total * 0.3);
                            resto_parcelas = round(total - entrada);

                            components.tabela.parcelas.p1.valor.appSetMoney(entrada);
                            formaPagamentoView.addTotalSoma(entrada);
                            components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_AVISTA);
                            components.tabela.parcelas.p1.data.val(hoje_format);

                            parcelas = utils.calc_parcelas(resto_parcelas, 3);
                            components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                            formaPagamentoView.addTotalSoma(parcelas[0]);
                            components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p2.data.val(dias_30_format);

                            components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                            formaPagamentoView.addTotalSoma(parcelas[1]);
                            components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p3.data.val(dias_60_format);

                            components.tabela.parcelas.p4.valor.appSetMoney(parcelas[2]);
                            formaPagamentoView.addTotalSoma(parcelas[2]);
                            components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                            components.tabela.parcelas.p4.data.val(dias_90_format);
                        }


                    }
                }
                formaPagamentoView.updateFieldsValidators();
                formaPagamentoView.setTotal(total);
                formaPagamentoView.updateTotalRender();
                formaPagamentoView.loading(false);
            },

            default_dates: function () {
                components.tabela.inputs_data.val(null);
            },
            default_tipos: function () {
                components.tabela.select_tipos.each(function (index, item) {
                    var selectize_item = item.selectize;
                    selectize_item.setValue(null);
                });
            },
            default_valor: function () {
                components.tabela.inputs_valor.val(null);
            },
            default_inputs: function () {
                formaPagamentoView.loading(true);
                self.default_dates();
                self.default_tipos();
                self.default_valor();
                formaPagamentoView.loading(false);
            },
            setTipos: function (data) {
                formaPagamentoView.loading(true);
                components.tabela.select_tipos.each(function (index, item) {
                    var selectize_item = item.selectize;
                    selectize_item.clearOptions();
                    selectize_item.load(function (callback) {
                        selectize_item.enable();
                        callback(data);
                    });
                });
                formaPagamentoView.loading(false);
            }

        });
    };
    var ClienteView = function () {
        var render_cliente_info = $('#cliente-info');
        var $container = $('#cliente');
        var $container_end = $('#cliente-end');
        var $container_loading = render_cliente_info.parent();

        var render_cliente_nome = $container.find('#cliente-nome');
        var render_cliente_insc = $container.find('#cliente-inscr');
        var render_cliente_email = $container.find('#cliente-email');
        var render_cliente_cnpj = $container.find('#cliente-cnpj');
        var render_cliente_tipo = $container.find('#cliente-tipo');
        var render_cliente_pessoa = $container.find('#cliente-pessoa');
        var render_cliente_end_rua = $container_end.find('#cliente-end-rua');
        var render_cliente_end_bairro = $container_end.find('#cliente-end-bairro');
        var render_cliente_end_cep = $container_end.find('#cliente-end-cep');
        var render_cliente_end_estado = $container_end.find('#cliente-end-estado');
        var render_cliente_end_municipio = $container_end.find('#cliente-end-municipio');

        var self = this;
        $.extend(self, {
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $container_loading.addClass(loaderClass) : $container_loading.removeClass(loaderClass);
            },
            update: function (data) {
                render_cliente_nome.text(data.A1_NOME);
                render_cliente_email.text(data.A1_EMAIL);
                render_cliente_email.attr('href', 'mailto:' + data.A1_EMAIL);
                render_cliente_insc.text(data.A1_INSCR);
                render_cliente_cnpj.text(Format.cnpj(data.A1_CGC));
                render_cliente_end_rua.text(data.A1_END);
                render_cliente_end_bairro.text(data.A1_BAIRRO);
                render_cliente_end_estado.text(data.A1_EST);
                render_cliente_end_municipio.text(data.A1_MUN);
                render_cliente_end_cep.text(Format.cep(data.A1_CEP));
                render_cliente_tipo.text(cliente_tipos[data.A1_TIPO]);
                render_cliente_pessoa.text(cliente_pessoas[data.A1_PESSOA]);
                render_cliente_info.removeClass('hidden');
            }
        });
    };
    var FreteView = function () {

        var select_transportadores = $('#select-transportadores');
        var selectize_transportadores = null;

        var self = this;
        $.extend(self, {
            init: function () {
                $('#dtp-validade').datetimepicker({
                    format: 'DD/MM/YYYY'
                });
                var input_frete = formView.getForm().find('input[name="frete"]');
                input_frete.on('keyup', function () { //focusout
                    var self_input = $(this);
                    formView.getForm().formValidation('revalidateField', self_input);
                });


                select_transportadores.selectize({
                    persist: true,
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome', 'cnpj'],
                    preload: true,
                    initData: true,
                    render: {
                        option: function (item, escape) {
                            var label = item.nome || '-';
                            var caption = item.cnpj && item.cnpj.trim().length > 0 ? item.cnpj : '-'; //Format.cnpj(item.cnpj)
                            return '<div>' +
                                '<span class="label">' + escape(label) + '</span>' +
                                (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                                '</div>';
                        }
                    },
                    load: function (query, callback) {
                        var select = selectize_transportadores;
                        if (select.settings.initData) {
                            //console.log('pre-carregamento-transportadores');
                            callback(transportadores);
                            select.settings.initData = false;
                        } else
                            $.ajax({
                                url: base_url + '/api/transportador/combobox',
                                type: 'GET',
                                data: {
                                    cnpj: query,
                                    nome: query,
                                    take: 10
                                },
                                error: function () {
                                    callback();
                                },
                                success: function (res) {
                                    callback(res);
                                }
                            });
                    }
                });
                selectize_transportadores = select_transportadores[0].selectize;

            }
        });
    };
    var CarrinhoView = function () {
        var $container = $('#produto-list').closest('table');
        var $container_body = $('#produto-list');
        var $pedido_detalhe = $('#pedido-detalhes');
        var $pedido_result = $('#pedido-result');

        var desconto_atual_pedido = 0;
        var produto_count = 0;
        var produto_index_nome = 0;

        var self = this;
        $.extend(self, {
            incrementProdutoNome: function () {
                produto_index_nome++;
            },
            getProdutoNome: function () {
                return produto_index_nome;
            },
            incrementProduto: function () {
                produto_count++;
            },
            decrementProduto: function () {
                produto_count--;
            },
            getProdutoCount: function () {
                return produto_count;
            },

            getDescontoAtual: function () {
                return desconto_atual_pedido;
            },
            setDescontoAtual: function (desconto) {
                desconto_atual_pedido = desconto;
            },

            init: function () {


                $container_body.on('click', '[data-target="produto-delete"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var produto_id = tr.find('[data-target="produto_id"]').data('value');
                    carrinhoController.removeItemById(produto_id);

                    tr.remove();
                    carrinhoView.decrementProduto();
                    if (carrinhoView.getProdutoCount() == 0)
                        carrinhoView.hidden();
                    condicaoPagamentoView.updateTotal();


                });
                $container_body.on('change', '[data-target="adesivagem"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var adesivagem = self.prop('checked');

                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    carrinhoController.setAdesivagem(adesivagem, produto_index);

                });

                $container_body.on('keyup', '[data-target="quantidade"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var quantidade = self.val();

                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    carrinhoController.setQuantidade(quantidade, produto_index);
                    carrinhoController.updateItemValues(produto_index);
                    carrinhoView.update(produto_index, tr);
                    condicaoPagamentoView.updateTotal();
                });


                $container_body.on('keyup', '[data-target="desconto"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var desconto = self.appUnmaskValue(); //val()
                    formView.getForm().formValidation('revalidateField', self);

                    if (carrinhoView.getDescontoAtual() != desconto) {
                        var opcao_desconto = $pedido_result.find('input:radio[name="opcao_desconto"][value="desconto_pedido_item"]');
                        var desconto_atual = 0;
                        $pedido_result.find('input[name="desconto"]').appSetMoney(desconto_atual);
                        carrinhoView.setDescontoAtual(desconto_atual);
                        formView.getForm().formValidation('revalidateField', 'desconto');
                        opcao_desconto.prop('checked', true).trigger('change');
                    }

                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);

                    var desconto_tx = desconto / 100;
                    carrinhoController.setDesconto(desconto_tx, produto_index);
                    carrinhoController.updateItemValues(produto_index);
                    carrinhoView.update(produto_index, tr);
                    condicaoPagamentoView.updateTotal();
                });

            },
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $container.addClass(loaderClass) : $container.removeClass(loaderClass);
            },


            update_desconto: function (desconto) {
                //desconto = desconto.replace(/[.]/g, '').replace(',', '.');
                carrinhoView.setDescontoAtual(desconto);
                //var desconto_tx = desconto / 100;
                var desconto_tx = desconto;

                var div_produto_ids = $container_body.find('[data-target="produto_id"]');
                for (var produto_index = 0, len = carrinhoController.lengthItens(); produto_index < len; produto_index++) {
                    carrinhoController.setDesconto(desconto_tx, produto_index);
                    var produto_id = carrinhoController.getItem(produto_index).produto_id;
                    var tr_select = null;
                    div_produto_ids.each(function (index, item) {
                        var self_produto = $(item);
                        var id = self_produto.val();
                        if (id == produto_id) {
                            tr_select = self_produto.closest('tr');
                        }
                    });
                    if (tr_select != null) {
                        var render_desconto = tr_select.find('[data-target="desconto"]');
                        render_desconto.appSetMoney(desconto).trigger('keyup');
                    }
                }
            },
            /**
             * Busca os preços do produto
             */
            updatePreco: function (produto) {
                carrinhoView.loading(true);
                var cliente = clienteController.get();
                if (cliente == null)
                    return;
                var produto_id = produto['produto_id'];
                carrinhoController.getItemPrecos({
                    produto: produto,
                    cliente: cliente
                }, function (produto_detalhes, status) {
                    if (status == 1) {
                        var precos = produto_detalhes['precos'];
                        if (!precos.length) {
                            swal("Preço não existente", "Não foi definido nenhum preço para este produto, favor entrar em contato com a artico", 'error');
                            carrinhoController.removeItemById(produto_id);
                            carrinhoView.loading(false);
                            throw new Error('Preço não existente. B1_COD: ' + produto_id);
                        }
                        else {
                            $.each(precos, function (index, item) {
                                if (item['DA1_STATUS'] == DA1_STATUS_DESATUALIZADO) {
                                    var msg_detalhes = "DA1_CODPRO: " + item['DA1_CODPRO'] + ", DA1_CODTAB: " + item['DA1_CODTAB'] + ", DA1_TPOPER: " + item['DA1_CODTAB'];
                                    swal("Preço desatualizado", "Esse produto esta sofrendo alteraçoes de preço favor entrar em contato com a artico<br>Detalhes: " + msg_detalhes, 'error');
                                    carrinhoController.removeItemById(produto_id);
                                    carrinhoView.loading(false);
                                    throw new Error('Preço desatualizado' + msg_detalhes);
                                }
                            });
                        }
                        carrinhoView.add(produto_detalhes);
                    }
                    else if (status == 2) {
                        var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                        carrinhoController.incrementQuantidade(produto_index);
                        var $render_produto_ids = $container_body.find('[data-target="produto_id"]');
                        $.each($render_produto_ids, function () {
                            var self = $(this);
                            if (produto_id == self.val()) {
                                var render_quantidade = self.closest('tr').find('[data-target="quantidade"]');
                                var quantidade = render_quantidade.val();
                                quantidade++;
                                render_quantidade.val(quantidade);
                                render_quantidade.trigger('keyup');
                            }
                        });
                    }
                    carrinhoView.loading(false);
                });
            },


            /**
             * Adiciona um item na tabela do carrinho
             * @param produto
             */
            add: function (produto) {
                var template = "<tr>\n    <td>\n        <div data-target=\"id\"></div>\n        <input type=\'hidden\' data-target=\"produto_id\">\n    </td>\n    <td data-target=\"tipo\"></td>\n    <td data-target=\"modelo\"></td>\n    <td data-target=\"cor\"></td>\n    <td>\n        <label>\n            <input type=\"checkbox\" data-target=\"adesivagem\">\n        </label>\n    </td>\n    <td class=\'wd-td-quantidade td-input\'>\n        <div class=\'form-group\'>\n            <input type=\"text\" class=\"form-control mask-int text-right\" data-target=\'quantidade\' value=\'1\'\n                   autocomplete=\'off\'>\n        </div>\n    </td>\n    <td class=\"text-right\" data-target=\"preco_unitario\"></td>\n    <td class=\"text-right\" data-target=\"subtotal_bruto\"></td>\n    <td class=\'wd-td-quantidade td-input\'>\n        <div class=\'form-group\'>\n            <div class=\"input-group\">\n                <input type=\"text\" data-target=\"desconto\"\n                       class=\"form-control mask-money text-right\"\n                       placeholder=\"0\" value=\"0\" autocomplete=\"off\">\n\n                <div class=\"input-group-addon\">%</div>\n            </div>\n        </div>\n\n        <!--<input type=\"text\" class=\"form-control text-right\" data-target=\'desconto\' value=\'0\' autocomplete=\'off\'>-->\n    </td>\n    <td class=\"text-right\" data-target=\"subtotal_bruto_desconto\"></td>\n    <td>\n        <span data-target=\"ipi\" class=\'badge\'></span>\n        <div data-target=\"ipi_valor\" class=\'pull-right\'></div>\n    </td>\n    <td>\n        <span data-target=\"st\" class=\'badge\'></span>\n        <div data-target=\"st_valor\" class=\'pull-right\'></div>\n    </td>\n    <td class=\"text-right\" data-target=\"subtotal\"></td>\n    <td class=\'td-delete\' data-target=\"produto-delete\">x</td>\n</tr>";

                var $template = $(template);
                $template.find('[title]').tooltip();

                var $render_tipo = $template.find('[data-target="tipo"]');
                var $render_cor = $template.find('[data-target="cor"]');
                var $render_adesivagem = $template.find('[data-target="adesivagem"]');
                var $render_modelo = $template.find('[data-target="modelo"]');
                var $render_preco_unitario = $template.find('[data-target="preco_unitario"]');
                var $render_subtotal = $template.find('[data-target="subtotal"]');
                var $render_subtotal_bruto = $template.find('[data-target="subtotal_bruto"]');
                var $render_subtotal_bruto_desconto = $template.find('[data-target="subtotal_bruto_desconto"]');
                var $render_produto_id = $template.find('[data-target="produto_id"]');
                var $render_quantidade = $template.find('[data-target="quantidade"]');
                var $render_desconto = $template.find('[data-target="desconto"]');
                var $render_st = $template.find('[data-target="st"]');
                var $render_st_valor = $template.find('[data-target="st_valor"]');
                var $render_ipi = $template.find('[data-target="ipi"]');
                var $render_ipi_valor = $template.find('[data-target="ipi_valor"]');
                var $render_id = $template.find('[data-target="id"]');
                //var $render_cor_id = $template.find('select[name="cor_id"]');

                var produto_id = produto['produto_id'];
                var produto_index = carrinhoController.getIndexProdutoById(produto_id);

                if (!carrinhoController.isValidAdesivagem(produto_index)) {
                    carrinhoController.setAdesivagem(false, produto_index);
                    $render_adesivagem.addClass('hidden');
                }


                carrinhoController.updateItemValues(produto_index);
                var carrinho_item = carrinhoController.getItem(produto_index);

                var tipo_nome = carrinho_item['tipo_nome'];
                var modelo_nome = carrinho_item['modelo_nome'];
                var descricao = carrinho_item['B1_DESC'];
                var cor_nome = carrinho_item['cor_nome'];
                var ipi = (carrinho_item['B1_IPI'] / 100);
                var st = (carrinho_item['st'] / 100);
                var quantidade = carrinho_item.quantidade;
                var adesivagem = carrinho_item.adesivagem;
                var desconto = carrinho_item.desconto;

                var name = 'produtos[' + carrinhoView.getProdutoNome() + ']';
                var name_desconto = name + '[desconto]';
                var name_quantidade = name + '[quantidade]';

                $render_produto_id.attr('name', name + '[produto_id]').val(produto_id);
                $render_quantidade.attr('name', name_quantidade).val(quantidade);


                $render_adesivagem.attr('name', name + '[adesivagem]').prop('checked', adesivagem);
                $render_desconto.attr('name', name_desconto).val(desconto * 100);
                $render_desconto.appMaskApply('money');


                $render_id.text(produto_id);
                $render_tipo.text(tipo_nome).attr('title', descricao);
                $render_modelo.text(modelo_nome);
                $render_cor.text(cor_nome);
                
                var preco_unitario = carrinhoController.getItemPreco(produto_index, CODTAB.CODTAB_AVISTA);
                $render_preco_unitario.text(Format.preco(preco_unitario));
                $render_st.text(Format.porcentagem(st, 0));
                $render_st_valor.text(Format.preco(carrinho_item.st_valor));
                $render_ipi.text(Format.porcentagem(ipi, 0));
                $render_ipi_valor.text(Format.preco(carrinho_item.ipi_valor));
                $render_subtotal.text(Format.preco(carrinho_item.subtotal));
                $render_subtotal_bruto.text(Format.preco(carrinho_item.subtotal_bruto));
                $render_subtotal_bruto_desconto.text(Format.preco(carrinho_item.subtotal_bruto_desconto));
                $container_body.append($template.wrap());

                formView.getForm().formValidation('addField', name_quantidade, validators.quantidade);
                formView.getForm().formValidation('addField', name_desconto, validators.desconto);

                condicaoPagamentoView.updateTotal();
                carrinhoView.show();
            },

            show: function () {
                $pedido_detalhe.removeClass('hidden');
            },
            hidden: function () {
                $pedido_detalhe.addClass('hidden');
            },


            /**
             * Atualiza todos os itens do carrinho, buscando novamente seus preços e recalculando suas taxas
             */
            refresh: function () {

                carrinhoView.loading(true);
                formaPagamentoView.loading(true);
                $container_body.html(''); // remove todas as linhas

                var produtos_ids = [];
                for (var i = 0; i < carrinhoController.lengthItens(); i++) {
                    produtos_ids.push(carrinhoController.getIdProduto(i));
                    carrinhoController.setPrecos([], i);
                }

                var cliente = clienteController.get();
                var cliente_pessoa = cliente['A1_PESSOA'];
                var cliente_id = cliente['A1_COD'];
                var cliente_tpoper = cliente['TPOPER'];
                var estado_id = cliente['A1_EST'];

                $.ajax({
                    type: 'get',
                    url: base_url + '/api/produto/precos',
                    data: {
                        produto_id: produtos_ids,
                        estado_id: estado_id,
                        cliente_pessoa: cliente_pessoa,
                        cliente_tpoper: cliente_tpoper,
                        cliente_id: cliente_id
                    },
                    error: function () {
                        formaPagamentoView.loading(false);
                        carrinhoView.loading(false);
                    },
                    success: function (precos) {
                        for (i = 0; i < precos.length; i++) {
                            var preco = precos[i];
                            var produto_id = preco['DA1_CODPRO'];
                            var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                            carrinhoController.addPreco(preco, produto_index);

                        }
                        for (i = 0; i < carrinhoController.lengthItens(); i++) {
                            carrinhoController.refreshST(i);
                            self.add(carrinhoController.getItem(i));
                        }
                        formaPagamentoView.loading(false);
                        carrinhoView.loading(false);
                    }
                });
            },

            /**
             * Atualiza o preço, ipi, st, totais de uma unica linha da tabela
             */
            update: function (produto_index, tr) {
                var carrinho_item = carrinhoController.getItem(produto_index);

                tr.find('[data-target="ipi_valor"]').text(Format.preco(carrinho_item.ipi_valor));
                tr.find('[data-target="st_valor"]').text(Format.preco(carrinho_item.st_valor));

                tr.find('[data-target="subtotal"]').text(Format.preco(carrinho_item.subtotal));
                tr.find('[data-target="subtotal_bruto"]').text(Format.preco(carrinho_item.subtotal_bruto));
                tr.find('[data-target="subtotal_bruto_desconto"]').text(Format.preco(carrinho_item.subtotal_bruto_desconto));
            }
        });

    };
    var FiltroView = function () {
        var $container = $('#produto-info');
        var produto_btn_add = $('#produto-add');


        var select_produtos = $('#select-produtos');
        var select_produtos_tipos = $('#select-produtos-tipo');
        var select_produtos_modelos = $('#select-produtos-modelo');
        var select_produtos_cores = $('#select-produtos-cores');
        var select_produtos_acessorios = $('#select-produtos-acessorios');
        var select_produtos_voltagem = $('#select-produtos-voltagem');
        var select_clientes = $('#select-clientes');

        var selectize_produtos = null,
            selectize_produtos_tipos = null,
            selectize_produtos_modelos = null,
            selectize_produtos_cores = null,
            selectize_clientes = null,
            selectize_produtos_acessorios = null,
            selectize_produtos_voltagem = null;

        var self = this;
        $.extend(self, {
            btnEnable: function () {
                produto_btn_add.removeClass('disabled');
                produto_btn_add.attr('disabled', false);
            },
            btnDisable: function () {
                produto_btn_add.addClass('disabled');
                produto_btn_add.attr('disabled', true)
            },
            init: function () {
                self.hidden();
                self.btnDisable();
                produto_btn_add.click(function () {
                    self.btnAdd();
                });

                select_produtos.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: [],
                    onChange: function (produto_id) {
                        if (!produto_id.length) return;
                        filtroView.btnEnable();//  produto_btn_add_enable();
                    }
                });
                selectize_produtos = select_produtos[0].selectize;
                selectize_produtos.disable();
                select_produtos_voltagem.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: [],
                    onChange: function (voltagem_id) {
                        selectize_produtos.disable();
                        selectize_produtos.clearOptions();

                        if (!voltagem_id.length) return;

                        var r = filtroController.filtroVoltagem(voltagem_id);
                        if (r == null)
                            selectize_produtos.disable();

                        selectize_produtos.load(function (callback) {
                            selectize_produtos.enable();
                            callback(r);
                        });

                    }
                });
                selectize_produtos_voltagem = select_produtos_voltagem[0].selectize;
                selectize_produtos_voltagem.disable();

                select_produtos_acessorios.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: [],
                    onChange: function (acessorio_id) {
                        selectize_produtos_voltagem.disable();
                        selectize_produtos_voltagem.clearOptions();
                        selectize_produtos.disable();
                        selectize_produtos.clearOptions();

                        if (!acessorio_id.length) return;


                        var r = filtroController.filtroAcessorio(acessorio_id);
                        if (r.isCombo) {
                            selectize_produtos_voltagem.$wrapper.removeClass('hidden');
                            selectize_produtos_voltagem.$dropdown.removeClass('hidden');

                            selectize_produtos_voltagem.load(function (callback) {
                                selectize_produtos_voltagem.enable();
                                callback(r.data);
                            });
                        } else {
                            selectize_produtos_voltagem.$wrapper.addClass('hidden');
                            selectize_produtos_voltagem.$dropdown.addClass('hidden');
                            selectize_produtos_voltagem.disable();
                            selectize_produtos_voltagem.clearOptions();
                            selectize_produtos.load(function (callback) {
                                selectize_produtos.enable();
                                callback(r.data);
                            });
                        }


                    }
                });
                selectize_produtos_acessorios = select_produtos_acessorios[0].selectize;
                selectize_produtos_acessorios.disable();

                select_produtos_cores.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: [],
                    onChange: function (cor_id) {
                        selectize_produtos_acessorios.disable();
                        selectize_produtos_acessorios.clearOptions();
                        selectize_produtos.disable();
                        selectize_produtos.clearOptions();

                        if (!cor_id.length) return;

                        var r = filtroController.filtroCor(cor_id);
                        if (r == null)
                            selectize_produtos_acessorios.disable();

                        selectize_produtos_acessorios.load(function (callback) {
                            selectize_produtos_acessorios.enable();
                            callback(r);
                        });


                    }
                });
                selectize_produtos_cores = select_produtos_cores[0].selectize;
                selectize_produtos_cores.disable();

                select_produtos_modelos.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    onChange: function (modelo_id) {
                        selectize_produtos.disable();
                        selectize_produtos.clearOptions();
                        selectize_produtos_cores.disable();
                        selectize_produtos_cores.clearOptions();
                        filtroView.btnDisable();

                        if (!modelo_id.length) return;

                        var tipo_id = selectize_produtos_tipos.getValue();
                        selectize_produtos_cores.$wrapper.addClass($.fn.selectize.defaults.loadingClass);


                        $.ajax({
                            type: 'get',
                            url: base_url + '/api/produto',
                            data: {
                                tipo_id: tipo_id,
                                modelo_id: modelo_id
                            },
                            success: function (produtos) {
                                filtroController.setProdutos(produtos);
                                selectize_produtos_cores.load(function (callback) {
                                    selectize_produtos_cores.enable();
                                    var r = filtroController.filtroModelo(modelo_id);
                                    if (r.length > 0)
                                        selectize_produtos_cores.enable();
                                    callback(r);
                                });
                                selectize_produtos_cores.$wrapper.removeClass($.fn.selectize.defaults.loadingClass);
                            }
                        })
                    }
                });


                select_produtos_tipos.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: produtos_tipos,
                    onChange: function (tipo_id) {
                        selectize_produtos.disable();
                        selectize_produtos.clearOptions();
                        selectize_produtos_modelos.disable();
                        selectize_produtos_modelos.clearOptions();
                        selectize_produtos_cores.disable();
                        selectize_produtos_cores.clearOptions();
                        filtroView.btnDisable();

                        if (!tipo_id.length) return;
                        selectize_produtos_modelos.load(function (callback) {
                            var r = filtroController.filtroTipo(tipo_id);
                            if (r.length > 0)
                                selectize_produtos_modelos.enable();
                            callback(r);
                        });
                    }

                });
                selectize_produtos_modelos = select_produtos_modelos[0].selectize;
                selectize_produtos_modelos.disable();
                selectize_produtos_tipos = select_produtos_tipos[0].selectize;


                select_clientes.selectize({
                    persist: true,
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome', 'cnpj'],
                    preload: true,
                    initData: true,
                    render: {
                        option: function (item, escape) {
                            var label = item.nome || '-';
                            var caption = item.cnpj && item.cnpj.trim().length > 0 ? item.cnpj : '-'; //Format.cnpj(item.cnpj)
                            return '<div>' +
                                '<span class="label">' + escape(label) + '</span>' +
                                (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                                '</div>';
                        }
                    },
                    load: function (query, callback) {
                        var select = selectize_clientes;
                        if (select.settings.initData) {
                            //console.log('pre-carregamento-cliente');
                            callback(clientes);
                            select.settings.initData = false;
                        } else
                            $.ajax({
                                url: base_url + '/api/cliente/combobox',
                                type: 'GET',
                                data: {
                                    cnpj: query,
                                    nome: query,
                                    take: 10,
                                    exclude_user: false
                                },
                                error: function () {
                                    callback();
                                },
                                success: function (res) {
                                    callback(res);
                                }
                            });
                    },
                    onChange: function (cliente_id) {
                        if (cliente_id.length > 0) {
                            clienteView.loading(true);

                            $.ajax({
                                url: base_url + '/api/cliente/' + cliente_id,
                                type: 'GET',
                                error: function () {
                                    swal("Ops!", "Erro ao buscar o cliente. Por favor tenta mais tarde ou entre em contato com a artico", 'error');
                                    throw new Error('Erro na Busca do cliente');
                                },
                                success: function (cliente) {
                                    clienteController.set(cliente);
                                    clienteView.update(cliente);
                                    filtroView.show();

                                    selectize_produtos_tipos.$wrapper.removeClass('hidden');
                                    selectize_produtos_tipos.$dropdown.removeClass('hidden');
                                    selectize_produtos_modelos.$wrapper.removeClass('hidden');
                                    selectize_produtos_modelos.$dropdown.removeClass('hidden');
                                    selectize_produtos_cores.$wrapper.removeClass('hidden');
                                    selectize_produtos_cores.$dropdown.removeClass('hidden');
                                    selectize_produtos_acessorios.$wrapper.removeClass('hidden');
                                    selectize_produtos_acessorios.$dropdown.removeClass('hidden');
                                    selectize_produtos_voltagem.$wrapper.removeClass('hidden');
                                    selectize_produtos_voltagem.$dropdown.removeClass('hidden');
                                    selectize_produtos.$wrapper.removeClass('hidden');
                                    selectize_produtos.$dropdown.removeClass('hidden');

                                    if (carrinhoController.lengthItens()) {
                                        carrinhoView.refresh();
                                    }
                                    clienteView.loading(false);
                                }
                            });
                        } else {
                            filtroView.hidden();
                        }
                    }
                });
                //        select_clientes.removeClass('hidden');


                selectize_clientes = select_clientes[0].selectize;
                if (clientes.length == 0) {
                    select_clientes.closest('form').addClass('form-disabled');
                    selectize_clientes.disable();
                }
                selectize_clientes.$wrapper.removeClass('hidden');
                selectize_clientes.$dropdown.removeClass('hidden');

            },
            hidden: function () {
                $container.addClass('hidden');
            },
            show: function () {
                $container.removeClass('hidden');
            },
            btnAdd: function () {
                carrinhoView.incrementProduto();
                carrinhoView.incrementProdutoNome();

                var tipo_id = selectize_produtos_tipos.getValue();
                var tipo = selectize_produtos_tipos.options[tipo_id];
                var modelo_id = selectize_produtos_modelos.getValue();
                var modelo = selectize_produtos_modelos.options[modelo_id];
                var cor_id = selectize_produtos_cores.getValue();
                var cor = selectize_produtos_cores.options[cor_id];
                var produto_id = selectize_produtos.getValue();
                var cliente = clienteController.get();
                var st_uf = cliente['A1_EST'];

                //var st_valor = carrinhoController.calcST(st_uf);
                var produto = {
                    tipo_id: tipo_id,
                    tipo_nome: tipo.nome,
                    modelo_id: modelo_id,
                    modelo_nome: modelo.nome,
                    cor_id: cor_id,
                    cor_nome: cor.nome,
                    produto_id: produto_id,
                    st_uf: st_uf
                    //st: st_valor
                };

                var produto_selected = filtroController.getProdutoById(produto_id);
                $.extend(produto, produto_selected);

                selectize_produtos_modelos.disable();
                selectize_produtos_modelos.clearOptions();
                selectize_produtos_cores.disable();
                selectize_produtos_cores.clearOptions();
                selectize_produtos.disable();
                selectize_produtos.clearOptions();
                selectize_produtos_tipos.setValue(null);

                //carrinhoController.addItem(produto);
                carrinhoView.updatePreco(produto);
            }


        });
    };


    var FormView = function () {
        var $form = $('form');
        var self = this;
        $.extend(self, {
            init: function () {
                //$form.find(':not(textarea)')
                //    .on('keyup keypress', function (e) {
                //        var code = e.keyCode || e.which;
                //        if (code == 13) {
                //            e.preventDefault();
                //            return false;
                //        }
                //    });

                $form
                    .on('keyup keypress', function (e) {
                        var code = e.keyCode || e.which;
                        if ($(e.target).is('textarea')) {
                            return true;
                        }
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
                            forma_pagamento_check: {
                                validators: {
                                    notEmpty: {
                                        message: 'O valor da soma das parcelas deve ser igual ao valor total do pedido'
                                    }
                                }
                            },

                            'cliente_id': {
                                validators: {
                                    notEmpty: {
                                        message: 'Por favor, selecione um cliente'
                                    }
                                }
                            },

                            frete: {
                                validators: {
                                    notEmpty: {
                                        message: 'Por favor informe o valor do frete'
                                    }
                                }
                            },
                            desconto: validators.desconto,
                            'observacao': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 254 caracteres',
                                        max: 254
                                    }
                                }
                            },
                            'transportador_observacao': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 254 caracteres',
//                                    max: function (value, validator, $field) {
//                                        return 120 - (value.match(/\r/g) || []).length;
//                                    }
                                        max: 254
                                    }
                                }
                            },
                            'transportador': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 80 caracteres',
                                        max: 80
                                    }
                                }
                            },
                            'finan_linha_credito': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 30 caracteres',
                                        max: 30
                                    }
                                }
                            },
                            'finan_bco': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 40 caracteres',
                                        max: 40
                                    }
                                }
                            },
                            'finan_telefone': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 15 caracteres',
                                        max: 15
                                    }
                                }
                            },
                            'finan_email': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 40 caracteres',
                                        max: 40
                                    }
                                }
                            },
                            'ct_numero': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 26 caracteres',
                                        max: 26
                                    }
                                }
                            },

                            'ct_controle': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 4 caracteres',
                                        max: 4
                                    }
                                }
                            },
                            'ct_validade': {
                                validators: {
                                    date: {
                                        format: 'DD/MM/YYYY',
                                        message: 'data inválida'
                                    }
                                }
                            },
                            'ct_banco': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 40 caracteres',
                                        max: 40
                                    }
                                }
                            },
                            'ct_parcelas': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 3 caracteres',
                                        max: 3
                                    }
                                }
                            },
                            'ct_band': {
                                validators: {
                                    stringLength: {
                                        message: 'máximo 30 caracteres',
                                        max: 30
                                    }
                                }
                            }

                        }
                    })
                    .on('success.form.fv', function (e) {
                        if (carrinhoView.getProdutoCount() < 1) {
                            e.preventDefault();
                            //var fm = $(e.target);
                            //var fv = fm.data('formValidation');
                            //fv.disableSubmitButtons(false);
                            self.disableSubmitButtons(false);
                        } else {
                            $form.find('.mask-money').appUnmaskApply('money');
                        }
                    })
                    .on('success.field.fv', function (e, data) {
                        data.fv.disableSubmitButtons(data.fv.getInvalidFields().length > 0);
                    })
                    //.on('removed.field.fv', function (e, data) {
                    // $(e.target)  --> The form instance
                    // $(e.target).data('formValidation')
                    //              --> The FormValidation instance

                    //console.log(data.field);///   --> The field name
                    //console.log(data.element);//--> The new field element

                    // Do something ...
                    //});
                ;
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
            }

        });
    };

    var clienteView = new ClienteView();
    var formaPagamentoView = new FormaPagamentoView();
    var condicaoPagamentoView = new CondicaoPagamentoView();
    var carrinhoView = new CarrinhoView();
    var filtroView = new FiltroView();
    var freteView = new FreteView();
    var formView = new FormView();


    window.formaPagamentoView = formaPagamentoView;
    window.condicaoPagamentoView = condicaoPagamentoView;
    window.clienteView = clienteView;
    window.carrinhoView = carrinhoView;
    window.filtroView = filtroView;
    window.freteView = freteView;
    window.formView = formView;
})(jQuery, carrinhoController);
