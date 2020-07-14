/* global Format, validators, CODTAB, produto_index */

(function ($) {
    var Utils = function () {
        var self = this;
        $.extend(self, {
            calc_parcelas: function (valor, quantidade) {
                var valor_item = round(valor / quantidade);
                var itens = [];
                var soma = 0;
                for (var i = 0; i < (quantidade - 1); i++) {
                    itens[i] = valor_item;
                    soma += valor_item;
                }
                itens[i] = round(valor - soma);
                return itens;
            }
        });
    };
    
    var ClienteController = function () {
        var cliente = null;
        var self = this;
        $.extend(self, {
            get: function () {
                return cliente;
            },
            set: function (c) {
                cliente = c;
            },
            setInputCliente: function (cd){
                var cod_cliente = $('#cod_cliente');
                cod_cliente.val(cd);
            },
            getBeneficioSuframa: function (){
                return cliente['A1_ZBENSUF'];
            }
        });
    };
    var CarrinhoController = function () {
        var carrinho = {
            itens: [],
            total_bruto: 0,
            //total_bruto_30: 0,
            //total_bruto_30_60: 0,
            //total_bruto_30_60_90: 0,
            total: 0,
            //total_30: 0,
            //total_30_60: 0,
            //total_30_60_90: 0,
            preco_unitario_desc: 0
            //total_30_60_90_120: 0,
            //total_30_60_90_120_150: 0
        };
        var st_itens = [];
        var formas_pagamento = [];
        var formas_pagamento_avista = null;
        var formas_pagamento_aprazo = null;
        var self = this;
        $.extend(self, {
            addItem: function (item) {
                item.st = self.calcSTItem(item);


                //item.adesivagem = true;
                //if (item['B1_ZTIPO'] != B1_ZTIPO_CONGELADOR) {
                //    item.adesivagem = false;
                //}
                carrinho.itens.push(item);
            },
            /**
             * Valida se o produto pode conter adesivagem;
             * @param produto_index
             * @returns {boolean}
             */
            isValidAdesivagem: function (produto_index) {
                var valid = true;
                if (carrinho.itens[produto_index]['B1_ZTIPO'] != B1_ZTIPO_CONGELADOR) {
                    valid = false;
                }
                return valid;
            },

            /**
             * Verifica se o desconto está dentro do aceitável ou se é null
             * @param desconto_tx 0.2 = 2%
             */
            isValidDesconto: function (desconto_tx) {
                var desconto = carrinho.total_bruto * desconto_tx;
                return (isNaN(desconto) || desconto > carrinho.total_bruto);
            },
            
            isValidAdicional: function (adicional_tx) {
                var adicional = carrinho.total_bruto * adicional_tx;
                return (isNaN(adicional) || adicional > carrinho.total_bruto);
            },
            /**
             * Faz a busca dos preços de um produto no banco
             */
            getItemPrecos: function (dados, callback) {
                var cliente = dados.cliente;
                var produto = dados.produto;
                var produto_id = produto['produto_id'];
                var STATUS_NEW = 1, STATUS_CONTAINS = 2, STATUS_ERROR = 3;
                var produto_index = this.getIndexProdutoById(produto_id);
                var codtab_id = filtroView.getCodTabPreco();
                var frete_tx  = carrinhoView.getFretePorcentagem() / 100;
                var beneficio_suframa = cliente['A1_ZBENSUF'];
                var desconto_icms  = 0;
                
                if (!carrinhoView.getValidDescontoFrete()){
                    frete_tx = 0;
                }
                
                if (beneficio_suframa !== ''){
                    
                    switch (beneficio_suframa){
                        case '2':
                        case '4':
                        case '5':
                        case '7':
                            desconto_icms = 7 / 100;
                            break;
                        default:
                            desconto_icms = 0;
                    } 
                }
                
                if (produto_index == -1) {
                    $.ajax({
                        type: 'get',
                        url: base_url + '/api/produto/precos',
                        data: {
                            estado_id: cliente['A1_EST'],
                            cliente_pessoa: cliente['A1_PESSOA'],
                            cliente_id: cliente['A1_COD'],
                            cliente_tpoper: cliente['TPOPER'],
                            cliente_contrib: cliente['A1_CONTRIB'],
                            produto_id: produto_id,
                            cliente_tipo: cliente['A1_TIPO'],
                            cliente_inscr: cliente['A1_INSCR'],
                            codtab_id: codtab_id,
                            beneficio_suframa: cliente['A1_ZBENSUF']
                        },
                        error: function () {
                            callback(null, STATUS_ERROR);
                        },
                        success: function (precos) {
                            produto['precos'] = precos;
                            produto.quantidade = 1;
                            produto.adesivagem = false;
                            //produto.desconto = 0;
                            produto.adicional = 0;
                            produto.desconto_vpc = 0;
                            produto.desconto_mostruario = 0;
                            //produto.desconto_color = 0;
                            //drk27
                            produto.desconto_frete = frete_tx;
                            produto.desconto_icms = desconto_icms;
                            produto.preco_unitario_desc = 0;
                            carrinhoController.addItem(produto);
                            callback(produto, STATUS_NEW);
                        }
                        
                    });
                    
                }else {
                    carrinho.itens[produto_index]['quantidade']++;
                    callback(produto, STATUS_CONTAINS);
                }
            },


            removeItemIndex: function (index) {
                carrinho.itens.splice(index, 1);
            },
            removeItemById: function (id) {
               // var index = array_find_index(carrinho.itens, id, 'id');
                var index = array_find_index(carrinho.itens, id, 'B1_COD');
                this.removeItemIndex(index);
            },
            getItem: function (index) {
                return carrinho.itens[index];
            },
            //getIndexItemById: function (produto_id) {
            //    return array_find_index(carrinho.itens, produto_id, 'B1_COD');
            //},
            getIndexProdutoById: function (produto_id) {
                return array_find_index(carrinho.itens, produto_id, 'B1_COD');
            },
            getProdutoById: function (produto_id) {
                return array_find_item(carrinho.itens, produto_id, 'B1_COD');
            },
            getItens: function () {
                return carrinho.itens;
            },
            lengthItens: function () {
                return carrinho.itens.length;
            },
            getIdProduto: function (produto_index) {
                return carrinho.itens[produto_index]['B1_COD'];
            },
            incrementQuantidade: function (produto_index) {
                carrinho.itens[produto_index].quantidade++;
            },
            getCarrinho: function () {
                return carrinho;
            },

            /**
             * Busca um preço especifico do item. Ex. A vista 001, 30 dias 002
             */
            getItemPreco: function (produto_index, codtab) {
                var preco = array_find_item(carrinho.itens[produto_index]['precos'], codtab, 'DA1_CODTAB');
                if (preco == null) {
                    swal("Preço não existente", "Preços faltantes para alguns tabelas de condições: <br>Detalhes:  CODTAB: " + codtab + ', B1_COD: ' + carrinho.itens[produto_index]['B1_COD'] + ', TPOPER: ' + clienteController.get()['TPOPER'] + ", favor entrar em contato com a Artico", 'error')
                    throw new Error('Preço não existente. CODTAB: ' + codtab + ', B1_COD: ' + carrinho.itens[produto_index]['B1_COD'] + ', TPOPER: ' + clienteController.get()['TPOPER']);
                }
                return preco['DA1_PRCVEN'];
            },            
//                    updateItemPrecosById: function(){
//
//                    },
            /**
             * Atualiza o total bruto do pedido inteiro
             */
            //updateValuesTotal: function (desconto, adicional) {
            updateValuesTotal: function () {
                var total_bruto = 0;
                    
                $.each(carrinhoController.getItens(), function (index, item) {
                    total_bruto += item.subtotal;
                });
                
                carrinho.total_bruto = total_bruto;
                carrinho.total = carrinho.total_bruto;
               
                //carrinho.preco_unitario_desc = carrinho.preco_unitario_desc;
            },
            /**
             * Atualiza o total bruto para cada uma das diferentes formas de pagamento, ipi e st
             */
            updateItemValues: function (produto_index) {
                var aux_codtab = filtroView.getCodTabPreco();
                
                var preco_unitario = parseFloat(carrinhoController.getItemPreco(produto_index, aux_codtab));
                
                var quantidade = carrinho.itens[produto_index].quantidade;
                var adicional = carrinho.itens[produto_index].adicional;
                var desconto_vpc = carrinho.itens[produto_index].desconto_vpc;
                var desconto_mostruario = carrinho.itens[produto_index].desconto_mostruario;
                //var desconto_color = carrinho.itens[produto_index].desconto_color;
                var desconto_frete = carrinho.itens[produto_index].desconto_frete;
                var desconto_icms = carrinho.itens[produto_index].desconto_icms;
                
                var aux_preco_unitario_desc = carrinho.itens[produto_index].preco_unitario_desc;
                /*var preco_unitario_desc = preco_unitario; */
                
                //var desconto = desconto_vpc + desconto_mostruario + desconto_color + desconto_frete;
                var desconto = 0,
                    ipi_tx = 0,
                    ipi = 0,
                    st_tx = 0,
                    st = 0,
                    subtotal_bruto = 0,
                    preco_adicional = 0,
                    preco_unitario_desc = 0,
                    subtotal_bruto_desconto = 0,
                    ipi_valor = 0, 
                    subtotal_com_ipi = 0,
                    st_valor = 0,
                    subtotal = 0,
                    preco_desconto_icms = 0;
               
                if (aux_preco_unitario_desc == 0 || preco_unitario == aux_preco_unitario_desc){
                    //original
                    desconto = desconto_vpc + desconto_mostruario + desconto_frete + desconto_icms;
                    
                    ipi_tx = (carrinho.itens[produto_index]['B1_IPI'] / 100);
                    ipi = ipi_tx + 1;
                    st_tx = (carrinho.itens[produto_index]['st'] / 100);
                    st = st_tx + 1;
                    subtotal_bruto = round(quantidade * preco_unitario);
                    
                    if (adicional > 0){
                        preco_adicional = 0;
                        preco_unitario_desc = 0;
                        preco_adicional = round(preco_unitario + (preco_unitario * adicional), 2);
                        preco_unitario_desc = round(preco_adicional - (preco_adicional * desconto), 2);
                        
                    }else{
                        preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto), 2);
                    }
                    
                    //var preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto), 2);
                    subtotal_bruto_desconto = round(preco_unitario_desc * quantidade);
                    ipi_valor = round(subtotal_bruto_desconto * ipi_tx);
                    subtotal_com_ipi = round(subtotal_bruto_desconto * ipi);
                    st_valor = round(subtotal_com_ipi * st_tx);
                    subtotal = round(subtotal_com_ipi * st);
                    //Sem IPI sobre MVA
                    //st_valor = round(subtotal_bruto_desconto * st_tx);
                    //subtotal = round(ipi_valor + round(subtotal_bruto_desconto * st));
                    
                }else{
                    
                    preco_unitario_desc = 0;
                    
                    if (adicional > 0){
                        preco_adicional = 0;
                        
                        preco_adicional = round(preco_unitario + (preco_unitario * adicional), 2);
                        preco_desconto_icms = round(preco_adicional - (preco_adicional * desconto_icms), 2);
                        preco_unitario_desc = round(preco_desconto_icms - (preco_desconto_icms * desconto_frete), 2);
                        
                    }else{
                                       
                        if (desconto_vpc != 0 && desconto_frete == 0 && desconto_icms == 0 && desconto_mostruario == 0){
                            preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto_vpc), 2); 
                        
                        }else if (desconto_mostruario != 0 && desconto_vpc == 0 && desconto_icms == 0 && desconto_frete == 0){
                            preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto_mostruario), 2);                        

                        }else if (desconto_frete != 0 && desconto_vpc == 0 && desconto_icms == 0 && desconto_mostruario == 0){
                            preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto_frete), 2);

                        }else {
                            
                            preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto_icms), 2);
                            
                            preco_unitario_desc = round(preco_unitario_desc - (preco_unitario_desc * desconto_vpc), 2);

                            preco_unitario_desc = round(preco_unitario_desc - (preco_unitario_desc * desconto_mostruario), 2);

                            //preco_unitario_desc = round(preco_unitario_desc - (preco_unitario_desc * desconto_color), 2);

                            preco_unitario_desc = round(preco_unitario_desc - (preco_unitario_desc * desconto_frete), 2);

                        }
                    }

                    ipi_tx = (carrinho.itens[produto_index]['B1_IPI'] / 100);
                    ipi = ipi_tx + 1;
                    st_tx = (carrinho.itens[produto_index]['st'] / 100);
                    st = st_tx + 1;

                    subtotal_bruto = round(quantidade * preco_unitario);
                    //var preco_unitario_desc = round(preco_unitario - (preco_unitario * desconto), 2);
                    subtotal_bruto_desconto = round(preco_unitario_desc * quantidade);
                    ipi_valor = round(subtotal_bruto_desconto * ipi_tx);
                    subtotal_com_ipi = round(subtotal_bruto_desconto * ipi);
                    st_valor = round(subtotal_com_ipi * st_tx);
                    subtotal = round(subtotal_com_ipi * st);
                    //Sem IPI sobre MVA
                    //st_valor = round(subtotal_bruto_desconto * st_tx);
                    //subtotal = round(ipi_valor + round(subtotal_bruto_desconto * st));
                    
                }
                
                carrinho.itens[produto_index].subtotal_bruto = subtotal_bruto;
                carrinho.itens[produto_index].subtotal_bruto_desconto = subtotal_bruto_desconto;
                carrinho.itens[produto_index].ipi_valor = ipi_valor;
                carrinho.itens[produto_index].st_valor = st_valor;
                carrinho.itens[produto_index].subtotal = subtotal;
                carrinho.itens[produto_index].preco_unitario_desc = preco_unitario_desc;    
            },

            getTotalST: function () {
                var soma = 0;
                $.each(carrinhoController.getItens(), function (index, item) {
                    soma += item.st_valor;
                });
                return soma;
            },

            getTotalIPI: function () {
                var soma = 0;
                $.each(carrinhoController.getItens(), function (index, item) {
                    soma += item.ipi_valor;
                });
                return soma;
            },

            setFormaPagamento: function (item) {
                formas_pagamento = item;
            },
            getFormaPagamento: function () {
                return formas_pagamento;
            },
            getFormaPagamentoAvista: function () {
                if (formas_pagamento_avista == null) {
                    var aux = formas_pagamento.slice(0);
                    //var aux = formas_pagamento;
                    index = array_find_index(aux, '20', 'id'); //remove
                    aux.splice(index, 1);
                    formas_pagamento_avista = aux;
                }
                return formas_pagamento_avista;
            },
            getFormaPagamentoPrazo: function () {
                if (formas_pagamento_aprazo == null) {
                    var aux = [];                    
                    //var vista = array_find_item(formas_pagamento, '10', 'id');
                    var prazo = array_find_item(formas_pagamento, '20', 'id');
                   // aux.push(vista);
                    aux.push(prazo);
                    formas_pagamento_aprazo = aux;
                }
                return formas_pagamento_aprazo;
            },


            setAdesivagem: function (adesivagem, produto_index) {
                carrinho.itens[produto_index].adesivagem = adesivagem;
            },
            setQuantidade: function (quantidade, produto_index) {
                carrinho.itens[produto_index].quantidade = quantidade;
            },
            //drk27
            setDesconto: function (desconto_tx, produto_index, tipo_desconto) {
                //carrinho.itens[produto_index].desconto = desconto_tx;
                if (tipo_desconto == 1)                {
                    carrinho.itens[produto_index].desconto_vpc = desconto_tx;
                    
                }else if (tipo_desconto == 2){
                    carrinho.itens[produto_index].desconto_mostruario = desconto_tx;
                    
                }/*else if (tipo_desconto == 3){
                    carrinho.itens[produto_index].desconto_color = desconto_tx;
                    
                }*/else if (tipo_desconto == 4){
                    carrinho.itens[produto_index].desconto_frete = desconto_tx;
                }
            },  
            //drk27 novo
            getDesconto : function (produto_index, tipo_desconto){
                
                if (tipo_desconto == 1){
                    return carrinho.itens[produto_index].desconto_vpc;
                    
                }else if (tipo_desconto == 2){
                    return carrinho.itens[produto_index].desconto_mostruario;
                    
                }else if (tipo_desconto == 4){
                    return carrinho.itens[produto_index].desconto_frete;
                }
                //return carrinho.itens[produto_index].desconto;
            },
            getAdicional: function (produto_index){
                return carrinho.itens[produto_index].adicional;                
            },
            setAdicional: function (adicional_tx, produto_index) {
                carrinho.itens[produto_index].adicional = adicional_tx;
            },
            setPrecos: function (precos, produto_index) {
                carrinho.itens[produto_index].precos = precos;
            },
            setST: function (st, produto_index) {
                carrinho.itens[produto_index].st = st;
            },
            setSTItens: function (itens) {
                st_itens = itens;
            },

            /**
             * Atualiza o calculo de ST de um produto
             * @param produto_index
             */
            refreshST: function (produto_index) {
                var st = self.calcST(produto_index);
                self.setST(st, produto_index);
            },


            calcSTItem: function (produto) {
                if (produto == null){
                    return;
                }
                
                var cliente = clienteController.get();
                var st_uf = cliente['A1_EST'];
                var st_item = array_find_item(mva_itens, st_uf, 'uf');
                var produto_nome = produto['modelo_nome'];
                
                if (produto_nome.substring(0,4) == 'FH80' && (st_uf != 'RS' && st_uf != 'SP' && st_uf != 'PR'
                        && st_uf != 'MG' && st_uf != 'RJ' && st_uf != 'AP')){
                    st_item = {
                        uf: st_uf,
                        valor: 0
                    };
                
                }else if (produto_nome.substring(0,4) == 'FH80' && (st_uf == 'RS' || st_uf == 'AP')){
                    //FH80 com MVA diferenciado - RS,AP
                    st_item = {
                        uf: st_uf,
                        valor: 15.33480
                    };
                    
                }else if (produto_nome.substring(0,4) == 'FH80' && (st_uf == 'PR' || st_uf == 'SP')){
                    st_item = {
                        uf: st_uf,
                        valor: 14.6580
                    };
                    
                }else if (produto_nome.substring(0,4) == 'FH80' && (st_uf == 'MG')){
                    st_item = {
                        uf: st_uf,
                        valor: 15.04320
                    };    
                    
                }else if (produto_nome.substring(0,4) == 'FH80' && (st_uf == 'RJ')){
                    st_item = {
                        uf: st_uf,
                        valor: 19.2680
                    };    
                    
                }else if (st_uf == 'SC'){ 
                    //Zerado ST/MVA para SC 
                    st_item = {
                        uf: st_uf,
                        valor: 0
                    };
                }
                
                var st = st_item.valor;
                //congelador, back dark (BDS) e cestas tem st somente para pessoa juridica;
                if (produto['B1_ZTIPO'] == B1_ZTIPO_CONGELADOR || produto['B1_ZTIPO'] == B1_ZTIPO_CESTA ||
                    produto['B1_ZTIPO'] == B1_ZTIPO_BDS || produto['B1_ZTIPO'] == B1_ZTIPO_CERVEJEIRA) {
                
                    if (cliente['A1_PESSOA'] != A1_PESSOA_JURIDICA){
                        st = 0;
                    }
                    //carrinhoController.setST(0, produto_index);
                }else{ 
                    st = 0;
                }
                
                return st;
            },
            /**
             * Calcula o valor do ST
             * @param st_uf
             * @returns {number}
             */
            calcST: function (produto_index) {
                return self.calcSTItem(self.getItem(produto_index));

            },
            addPreco: function (preco, produto_index) {
                carrinho.itens[produto_index].precos.push(preco);
            },
        });
    };

    var FiltroController = function () {
        var self = this;
        var produtos = [];

        var f_cores = [];
        var f_acessorios = [];
        var f_produtos = [];
        var f_voltagens = [];

        var produtos_tipos_group = [];
        var modelos = [];
        var modelos_ids = [];
        var voltagens = [];

        $.extend(self, {
            getProdutos: function () {
                return produtos;
            },
            setProdutos: function (item) {
                produtos = item;
            },
            setProdutosModelos: function (arr) {
                produtos_tipos_group = arr;
            },
            getModelosIds: function () {
                return modelos_ids;
            },
            setModelos: function (m) {
                modelos = m;
            },
            filtroTipo: function (tipo_id) {
                modelos_ids = produtos_tipos_group[tipo_id];
                var m_ids = self.getModelosIds();
                var m_r = [];
                for (var i = 0, len = m_ids.length; i < len; i++) {
                    for (var j = 0, lenj = modelos.length; j < lenj; j++) {
                        var modelo_id = m_ids[i];
                        var modelo = modelos[j];
                        if (modelo['id'] == modelo_id)
                            m_r.push(modelo);
                    }
                }
                return m_r;
            },

            setVoltagens: function (v) {
                voltagens = v;
            },
            /**
             * retorna os produtos que contém o modelo_id
             * @param modelo_id
             */
            filtroModelo: function (modelo_id) {
                var cores_options = [];
                f_cores = produtos;
                $.each(produtos, function (index, item) {
                    var cor_id = item['B1_COR'];                    
                    var cor = array_find_item(cores, cor_id, 'id');
                    
                    if (array_find_item(cores_options, cor_id, 'id') == null){
                        cores_options.push(cor);
                    }
                });
                return cores_options;
            },
            filtroCor: function (cor_id) {
                if (!f_cores.length)
                    return null;

                var aux = [];
                $.each(f_cores, function (index, item) {
                    if (item['B1_COR'] == cor_id) {
                        var acessorio = array_find_item(acessorios, item['B1_ZACESSO'], 'id');
                        if (acessorio != null) {
                            aux.push({
                                id: acessorio.id,
                                nome: acessorio.nome,
                                produto_id: item['B1_COD'],
                                produto_nome: item['B1_DESC'],
                                voltagem_id: item['B1_TENSAO'],
                            });
                        }
                    }
                });
                f_acessorios = aux;
                return f_acessorios;
            },
            
            filtroAcessorio: function (acessorio_id) {
                if (f_acessorios.length) {
                    var aux = [];
                    var isCombo = true;

                    $.each(f_acessorios, function (index, item) {
                        if (item['id'] == acessorio_id) {
                            var voltagem = array_find_item(voltagens, item['voltagem_id'], 'id');
                            if (voltagem == null) {
                                isCombo = false;
                                return false;
                            }

                            aux.push({
                                id: item['voltagem_id'],
                                nome: voltagem.nome,
                                produto_id: item['produto_id'],
                                produto_nome: item['produto_nome'],
                                acessorio_id: acessorio_id,
                            });
                        }
                    });

                    if (isCombo) {
                        f_voltagens = aux;
                        return {
                            isCombo: isCombo,
                            data: aux
                        };

                    } else {
                        aux = [];
                        $.each(f_acessorios, function (index, item) {
                            if (item['id'] == acessorio_id)
                                aux.push({
                                    id: item['produto_id'],
                                    nome: item['produto_nome'],
                                });
                        });
                        f_produtos = aux;

                        return {
                            isCombo: isCombo,
                            data: aux
                        };


                    }

                }
            },
            filtroVoltagem: function (voltagem_id) {
                if (f_voltagens.length) {
                    var aux = [];
                    $.each(f_voltagens, function (index, item) {
                        if (item['id'] == voltagem_id)
                            aux.push({
                                id: item['produto_id'],
                                nome: item['produto_nome'],
                            });
                    });
                    f_produtos = aux;
                    return f_produtos;
                }
            },
            getIndexProdutoById: function (produto_id) {
                return array_find_index(f_cores, produto_id, 'B1_COD');
            },

            getProdutoById: function (produto_id) {
                return array_find_item(f_cores, produto_id, 'B1_COD');
            },

        });
    };

    window.carrinhoController = new CarrinhoController();
    window.clienteController = new ClienteController();
    window.filtroController = new FiltroController();
    window.utils = new Utils();
})(jQuery);
(function ($, carrinhoController) {
   // var Continua = true; 
   // var $container3 = $('#cond_pag');  //table_cond_pag      
    //drk27 var $val_condicao_pagamento = $container3.find('input[type=radio][name=condicao_pagamento]');    
   // var $val_condicao_pagamento = $container3.find('#cond_pagto');    
    var Compcond = '';

    //Compcond = $val_condicao_pagamento.val();  
    
    var CondicaoPagamentoView = function () { 
        var $container = $('#pedido-result'); 
        //drk alterado
        var $container2 = $('#cond_pag'); //table_cond_pag
       // var $container4 = $('#produto-list');
        
        //var $input_condicao_pagamento = $container2.find('input[type=radio][name=cond_pagto]');
        var $input_condicao_pagamento = $container2.find($('#cond_pagto'));
        //var $input_desconto = $container.find('input[name="desconto"]');
        //var $input_adicional = $container4.find('input[name="adicional"]');
        
        //var $input_desconto_opcao = $container.find('input:radio[name="opcao_desconto"]');
      
        var $txt_total = $container.find('[data-target="total"]');

        var self = this;
        $.extend(self, {
            CONDICAO_PAGAMENTO_AVISTA: 'avista',
            CONDICAO_PAGAMENTO_PRAZO: 'prazo',

            init: function () {
               /* $input_desconto.on('keyup', function () { //focusout
                    var self_input = $(this);
                    //$input_adicional.appSetMoney(0);
                    formView.getForm().formValidation('revalidateField', self_input);
                    if (self_input.val() == '') return;
                    carrinhoView.update_desconto($input_desconto.appUnmaskValue());
                });
                
                                
                $input_desconto_opcao.on('change', function () { //focusout
                    var self = $(this);
                    
                    if (self.val() == 'desconto_pedido') {
                        $input_desconto.removeAttr('disabled');
                        carrinhoView.update_adicional($input_adicional.appUnmaskValue());
                        carrinhoView.update_desconto($input_desconto.appUnmaskValue());
                        condicaoPagamentoView.updateTotal();
                    }
                    else {
                        $input_desconto.appSetMoney(0);
                        formView.getForm().formValidation('revalidateField', $input_desconto);
                        $input_desconto.attr('disabled', 'disabled');
                    }
                    
                }); */

                /*$input_condicao_pagamento.change(function () {
                    if (this.value == '001' || this.value == '021' || this.value == '071' || this.value == '081')
                        formaPagamentoView.setCondicaoPagamento(self.CONDICAO_PAGAMENTO_AVISTA);
                    else
                        formaPagamentoView.setCondicaoPagamento(self.CONDICAO_PAGAMENTO_PRAZO);
                });*/
            },
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $container.addClass(loaderClass) : $container.removeClass(loaderClass);
            },
            getCondicaoPagamento: function () {
                var valor = self.getCondicaoPagamentoValue();
                return (valor == '001' || valor == '021' || valor == '025' || valor == '081') ? self.CONDICAO_PAGAMENTO_AVISTA : self.CONDICAO_PAGAMENTO_PRAZO;
            },
            getCondicaoPagamentoValue: function () {
                //drk27
                //var valor = $input_condicao_pagamento.filter(':checked').val();
                var valor = $input_condicao_pagamento.val();
                //var valor = $('#cond_pagto').val();
                
                if (!valor){
                   swal('Atenção', 'Favor selecionar a condição de pagamento antes de adicionar um produto!', 'warning');
                   return false;
                }else{
                    return valor;
                }
                
            },

            getInputCondicaoPagamento: function () {
                return $input_condicao_pagamento;
            },

            getDesconto: function () {
                return $input_desconto.appUnmaskValue();
            },
            getAdicional: function (){
                return $input_adicional.appUnmaskValue();
            },
            refreshTotal: function () {
                var carrinho = carrinhoController.getCarrinho();
                this.loading(true);
                $txt_total.text(Format.preco(carrinho.total));
                
                /*
                if (self_input.data('value') == value) {
                        self_input.addClass('selected');
                        components.formas.container.val(self_input.data('value'));
                    } */
                
                //Drk alteracao 
                //$txt_30.text(Format.preco(carrinho.total_30));
                //$txt_30_60.text(Format.preco(carrinho.total_30_60));
               //$txt_30_60_90.text(Format.preco(carrinho.total_bruto_30_60_90));

                formaPagamentoView.setCondicaoPagamento(condicaoPagamentoView.getCondicaoPagamento());
                this.loading(false);
            },


            /**
             * Percorre os produtos e faz o calculo do total bruto
             */
            //produto_total_render
            updateTotal: function () {
                //var desconto = condicaoPagamentoView.getDesconto(); //val()
                //var adicional = condicaoPagamentoView.getAdicional();
                //carrinhoController.updateValuesTotal(desconto, adicional);
                carrinhoController.updateValuesTotal();
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
                
                var $tr_p6 = $tabela.find('[data-target="tr-p6"]');
                var $condicao_p6 = $tr_p6.find('select[name*="[condicao]"]');
                var $data_p6 = $tr_p6.find('input[name*="[data]"]');
                var $valor_p6 = $tr_p6.find('input[name*="[valor]"]');
                
                var $tr_p7 = $tabela.find('[data-target="tr-p7"]');
                var $condicao_p7 = $tr_p7.find('select[name*="[condicao]"]');
                var $data_p7 = $tr_p7.find('input[name*="[data]"]');
                var $valor_p7 = $tr_p7.find('input[name*="[valor]"]');
                
                var $tr_p8 = $tabela.find('[data-target="tr-p8"]');
                var $condicao_p8 = $tr_p8.find('select[name*="[condicao]"]');
                var $data_p8 = $tr_p8.find('input[name*="[data]"]');
                var $valor_p8 = $tr_p8.find('input[name*="[valor]"]');

                var $tr_p9 = $tabela.find('[data-target="tr-p9"]');
                var $condicao_p9 = $tr_p9.find('select[name*="[condicao]"]');
                var $data_p9 = $tr_p9.find('input[name*="[data]"]');
                var $valor_p9 = $tr_p9.find('input[name*="[valor]"]');


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
                            },
                            p6: {
                                condicao: $condicao_p6,
                                data: $data_p6,
                                valor: $valor_p6
                            },
                            p7: {
                                condicao: $condicao_p7,
                                data: $data_p7,
                                valor: $valor_p7
                            },
                            p8: {
                                condicao: $condicao_p8,
                                data: $data_p8,
                                valor: $valor_p8
                            },
                            p9: {
                                condicao: $condicao_p9,
                                data: $data_p9,
                                valor: $valor_p9
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
        /*drk27
        var validators_valor = {
            validators: {
                greaterThan: {
                    value: 0,
                    message: 'A primeira parcela não pode ser zerada'
                }
            }
        };
        */
        var $prazo_saida = $('#prazo_saida');
        
        //DRK26
        $prazo_saida.keyup( function (){
            // var $valor_input = $(this).val();
            // var cond_pagto = condicaoPagamentoView.getCondicaoPagamentoValue();
            var forma_pagto = condicaoPagamentoView.getCondicaoPagamento();
               
            formaPagamentoView.setCondicaoPagamento(forma_pagto);   
        });
        
        /*Controla parcelas 5 em diante
        var $tabela = $('#tabela-forma-pagamento');
       
        var $tr_p5 = $tabela.find('[data-target="tr-p5"]');
        var $condicao_p5 = $tr_p5.find('select[name*="[condicao]"]');
        var $data_p5 = $tr_p5.find('input[name*="[data]"]');
        
        var $tr_p6 = $tabela.find('[data-target="tr-p6"]');
        var $condicao_p6 = $tr_p6.find('select[name*="[condicao]"]');
        var $data_p6 = $tr_p6.find('input[name*="[data]"]');
        
        var $tr_p7 = $tabela.find('[data-target="tr-p7"]');
        var $condicao_p7 = $tr_p7.find('select[name*="[condicao]"]');
        var $data_p7 = $tr_p7.find('input[name*="[data]"]');
        
        var $tr_p8 = $tabela.find('[data-target="tr-p8"]');
        var $condicao_p8 = $tr_p8.find('select[name*="[condicao]"]');
        var $data_p8 = $tr_p8.find('input[name*="[data]"]');
        */
        //drk26
        //aqui fazer o controle quando selecionar a parcela cartao de credito
        //val = 80
       // components.tabela.parcelas.p1.condicao[0].selectize({
            
       // });
       // components.tabela.parcelas.p3.data.val(dias_25_format);
        
        // drk26        
        /*$condicao_p6.change( function (){
            var $self = $(this);
            var valor = $self.val();
            var cond_pagto = condicaoPagamentoView.getCondicaoPagamentoValue();
            var cliente = clienteController.get();
            var prazo_saida = formaPagamentoView.getPrazoSaida();
            
            if (cliente['A1_CONTRIB'] == 2 || cliente['A1_EST'] == 'SC' || cliente['A1_EST'] == 'ES'
                || cliente['A1_EST'] == 'BA'){
                    
                if ((cond_pagto == '004' || cond_pagto == '024') && valor == '20'){
                    
                    if (prazo_saida != '' ){
                        
                        var dt6 = moment($data_p5.val(), 'DD/MM/YYYY').add(30, 'days');
                        var dt6_format = dt6.format('DD/MM/YYYY');

                        $data_p6.val(dt6_format);
                    }else{
                        
                        swal({
                            title: "Atenção!",
                            text: "Favor preencher o prazo de saída antes de adicionar novas parcelas.",
                            type: "warning",   
                            showCancelButton: false, 
                            confirmButtonColor: "#ED663E",
                            confirmButtonText: "OK",
                            closeOnConfirm: true }, 
                            function(){   
                                $self[0].selectize.clear();
                                $('#prazo_saida').focus();
                            }
                        );
                        
                    }
                
                }      
            }
            
        }); */
        
       /* $condicao_p7.change( function () {
            var $self = $(this);
            var valor = $self.val();
            var cond_pagto = condicaoPagamentoView.getCondicaoPagamentoValue();
            //var forma_pagto = condicaoPagamentoView.getCondicaoPagamento();
            var prazo_saida = formaPagamentoView.getPrazoSaida();
            
            if ((cond_pagto == '004' || cond_pagto == '024') && valor == '20'){
                
                if ($data_p6.val() != '' && prazo_saida != ''){
                    
                    var dt7 = moment($data_p6.val(), 'DD/MM/YYYY').add(30, 'days');
                    var dt7_format = dt7.format('DD/MM/YYYY');

                    $data_p7.val(dt7_format);    
                }else{
                    
                    swal({
                        title: "Atenção!",
                        text: "A data anterior e o prazo de saída devem estar preenchidos.",
                        type: "warning",   
                        showCancelButton: false, 
                        confirmButtonColor: "#ED663E",
                        confirmButtonText: "OK",
                        closeOnConfirm: true }, 
                        function(){   
                            $self[0].selectize.clear();
                            $('#prazo_saida').focus();
                        }
                    );
            
                }
            }
        });  */
        
        /*
         * Só pode gerar parcela 8 cliente com ST
         */
       /* $condicao_p8.change( function (){
            var $self = $(this);
            var valor = $self.val();
            var cond_pagto = condicaoPagamentoView.getCondicaoPagamentoValue();
            //var forma_pagto = condicaoPagamentoView.getCondicaoPagamento();
            var prazo_saida = formaPagamentoView.getPrazoSaida();
            var cliente = clienteController.get();
             
            if (cliente['A1_CONTRIB'] != 2 && cliente['A1_EST'] != 'SC' && cliente['A1_EST'] != 'ES'
                && cliente['A1_EST'] != 'BA') {
            
                if ((cond_pagto == '004' || cond_pagto == '024') && valor == '20'){
                    
                    if ($data_p7.val() != '' && prazo_saida != ''){
                        
                        var dt8 = moment($data_p7.val(), 'DD/MM/YYYY').add(30, 'days');
                        var dt8_format = dt8.format('DD/MM/YYYY');

                        $data_p8.val(dt8_format);
                        
                    }else{
                       
                        swal({
                            title: "Atenção!",
                            text: "A data anterior e o prazo de saída devem estar preenchidos.",
                            type: "warning",   
                            showCancelButton: false,
                            confirmButtonColor: "#ED663E",
                            confirmButtonText: "OK",
                            closeOnConfirm: true }, 
                            function(){   
                                $self[0].selectize.clear();
                                $('#prazo_saida').focus();
                            }
                        );
                
                    }
                }
                
            }else{
                $self[0].selectize.clear();   
            }
            
        }); */
        
        
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
                    
                    //var parcela_name_full = $input_aux.attr('name');
                    //var input_aux_full = $tr.find('input[name="' + parcela_name + '[valor]"]');

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
                        /*drk27
                        if (parcela_name_full == 'parcela[1][valor]'){
                            $tr.data('field-validator', true); 
                            $form.formValidation('updateStatus', input_aux_full, 'INVALID');
                        } */
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
            //drk26
            getPrazoSaida: function(){
                return $prazo_saida.val();
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
            //drk - entra aqui quando é trocado a condicao de pagamento.
            setCondicaoPagamento: function (tipo) {                
                var mva_total = carrinhoController.getTotalST();
                var carrinho = carrinhoController.getCarrinho();
                var cond_atual = condicaoPagamentoView.getCondicaoPagamentoValue();
                var prazo_saida = formaPagamentoView.getPrazoSaida();
           
                /* Se entrar aqui reprocessa o carrinho conforme a condição de pagamento selecionada
                */ 
               
               Compcond = cond_atual;
               /* if(Compcond != cond_atual){
                    
                    if (Compcond == ''){
                        Compcond = cond_atual;
                    }else{
                        carrinhoView.refresh();
                        Compcond = cond_atual;
                    }
                } */
                
                formaPagamentoView.resetFieldsValidators();
                formaPagamentoView.resetTotalSoma();
                formaPagamentoView.loading(true);

                var condicao_pagamento_valor = condicaoPagamentoView.getCondicaoPagamentoValue();
                var hoje = moment();
                var hoje_format = hoje.format('DD/MM/YYYY');
                var FORMA_AVISTA = 10;
                var FORMA_PRAZO = 20;

                var total = null,
                    resto = null,
                    entrada = null,
                    parcelas = null,
                    resto_parcelas = null;

                //A PRAZO
                formaPagamentoView.default_inputs();
                formaPagamentoView.setTipos(carrinhoController.getFormaPagamentoPrazo());

                if (prazo_saida != ''){                     
                    var dt_saida_real = moment(hoje).add(prazo_saida, 'days');
                    var dias_15 = moment(dt_saida_real).add(15, 'days');
                    var dias_30 = moment(dias_15).add(15, 'days');
                    var dias_45 = moment(dias_30).add(15, 'days');
                    var dias_60 = moment(dias_45).add(15, 'days');
                    var dias_75 = moment(dias_60).add(15, 'days'); 
                    var dias_90 = moment(dias_75).add(15, 'days'); 
                    var dias_105 = moment(dias_90).add(15, 'days'); 
                    var dias_120 = moment(dias_105).add(15, 'days'); 
                    var dias_135 = moment(dias_120).add(15, 'days'); 
                    var dias_150 = moment(dias_135).add(15, 'days');
                    
                }else{
                    
                    var dias_15 = moment(hoje).add(15, 'days');
                    var dias_30 = moment(dias_15).add(15, 'days');
                    var dias_45 = moment(dias_30).add(15, 'days');
                    var dias_60 = moment(dias_45).add(15, 'days');
                    var dias_75 = moment(dias_60).add(15, 'days'); 
                    var dias_90 = moment(dias_75).add(15, 'days'); 
                    var dias_105 = moment(dias_90).add(15, 'days'); 
                    var dias_120 = moment(dias_105).add(15, 'days'); 
                    var dias_135 = moment(dias_120).add(15, 'days');  
                    var dias_150 = moment(dias_135).add(15, 'days');
                }
                
                var dias_15_format = dias_15.format('DD/MM/YYYY');
                var dias_30_format = dias_30.format('DD/MM/YYYY');
                var dias_45_format = dias_45.format('DD/MM/YYYY');
                var dias_60_format = dias_60.format('DD/MM/YYYY');
                var dias_75_format = dias_75.format('DD/MM/YYYY');
                var dias_90_format = dias_90.format('DD/MM/YYYY');
                var dias_105_format = dias_105.format('DD/MM/YYYY');
                var dias_120_format = dias_120.format('DD/MM/YYYY');
                var dias_135_format = dias_135.format('DD/MM/YYYY');
                var dias_150_format = dias_150.format('DD/MM/YYYY');
                
                if (condicao_pagamento_valor == '002'){ //30 DIAS
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_15_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 2);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_45_format);
                         
                    }else{
                          
                        parcelas = utils.calc_parcelas(total, 3);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_15_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_45_format);
                    }  
                             
                }else if (condicao_pagamento_valor == '003'){ //60 DIAS   
                    total = carrinho.total;   
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 4);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_45_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_75_format);
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_90_format);                        
                        
                    }else{    
                        
                        parcelas = utils.calc_parcelas(total, 5);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_45_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_60_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_75_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_90_format);
                    }
                      
                }else if (condicao_pagamento_valor == '004'){ //90 DIAS  
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_45_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 6);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_75_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_90_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_105_format);

                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_120_format);

                        components.tabela.parcelas.p7.valor.appSetMoney(parcelas[5]);
                        formaPagamentoView.addTotalSoma(parcelas[5]);
                        components.tabela.parcelas.p7.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p7.data.val(dias_135_format);                        
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 7);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_45_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_75_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_90_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_105_format);

                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[5]);
                        formaPagamentoView.addTotalSoma(parcelas[5]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_120_format);

                        components.tabela.parcelas.p7.valor.appSetMoney(parcelas[6]);
                        formaPagamentoView.addTotalSoma(parcelas[6]);
                        components.tabela.parcelas.p7.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p7.data.val(dias_135_format);   
                    }
                    
                }else if (condicao_pagamento_valor == '007'){
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(resto);
                        formaPagamentoView.addTotalSoma(resto);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);
                        
                    }else{
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(total);
                        formaPagamentoView.addTotalSoma(total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format); 
                    }       
                    
                }else if (condicao_pagamento_valor == '008'){
                    total = carrinho.total;
                    
                    if (mva_total > 0){
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 3);
                        
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
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 3);
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_90_format);
                    }
                    
                }else if (condicao_pagamento_valor == '009'){
                    total = carrinho.total;
                    
                    if (mva_total > 0){
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 5);
                        
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
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_120_format);
                        
                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_150_format);
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 5);
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_90_format);
                        
                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_120_format);
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_150_format);
                    }
                    
                } else if (condicao_pagamento_valor == '010'){ //30 DIAS
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_15_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 2);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_45_format);
                         
                    }else{
                          
                        parcelas = utils.calc_parcelas(total, 3);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_15_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_45_format);
                    }  
                             
                }else if (condicao_pagamento_valor == '011'){ //60 DIAS   
                    total = carrinho.total;   
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 4);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_45_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_75_format);
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_90_format);                        
                        
                    }else{    
                        
                        parcelas = utils.calc_parcelas(total, 5);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_45_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_60_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_75_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_90_format);
                    }
                      
                }else if (condicao_pagamento_valor == '012'){ //90 DIAS  
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_45_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 6);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_75_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_90_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_105_format);

                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_120_format);

                        components.tabela.parcelas.p7.valor.appSetMoney(parcelas[5]);
                        formaPagamentoView.addTotalSoma(parcelas[5]);
                        components.tabela.parcelas.p7.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p7.data.val(dias_135_format);                        
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 7);

                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_45_format);

                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);

                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_75_format);

                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_90_format);

                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_105_format);

                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[5]);
                        formaPagamentoView.addTotalSoma(parcelas[5]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_120_format);

                        components.tabela.parcelas.p7.valor.appSetMoney(parcelas[6]);
                        formaPagamentoView.addTotalSoma(parcelas[6]);
                        components.tabela.parcelas.p7.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p7.data.val(dias_135_format);   
                    }
                    
                }else if (condicao_pagamento_valor == '013'){
                    total = carrinho.total;
                    
                    if (mva_total > 0) {
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(resto);
                        formaPagamentoView.addTotalSoma(resto);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_30_format);
                        
                    }else{
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(total);
                        formaPagamentoView.addTotalSoma(total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format); 
                    }       
                    
                }else if (condicao_pagamento_valor == '014'){
                    total = carrinho.total;
                    
                    if (mva_total > 0){
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 3);
                        
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
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 3);
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_90_format);
                    }
                    
                }else if (condicao_pagamento_valor == '015'){
                    total = carrinho.total;
                    
                    if (mva_total > 0){
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(mva_total);
                        formaPagamentoView.addTotalSoma(mva_total);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        resto = round((total - mva_total));
                        parcelas = utils.calc_parcelas(resto, 5);
                        
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
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_120_format);
                        
                        components.tabela.parcelas.p6.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p6.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p6.data.val(dias_150_format);
                        
                    }else{
                        
                        parcelas = utils.calc_parcelas(total, 5);
                        
                        components.tabela.parcelas.p1.valor.appSetMoney(parcelas[0]);
                        formaPagamentoView.addTotalSoma(parcelas[0]);
                        components.tabela.parcelas.p1.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p1.data.val(dias_30_format);
                        
                        components.tabela.parcelas.p2.valor.appSetMoney(parcelas[1]);
                        formaPagamentoView.addTotalSoma(parcelas[1]);
                        components.tabela.parcelas.p2.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p2.data.val(dias_60_format);
                        
                        components.tabela.parcelas.p3.valor.appSetMoney(parcelas[2]);
                        formaPagamentoView.addTotalSoma(parcelas[2]);
                        components.tabela.parcelas.p3.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p3.data.val(dias_90_format);
                        
                        components.tabela.parcelas.p4.valor.appSetMoney(parcelas[3]);
                        formaPagamentoView.addTotalSoma(parcelas[3]);
                        components.tabela.parcelas.p4.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p4.data.val(dias_120_format);
                        
                        components.tabela.parcelas.p5.valor.appSetMoney(parcelas[4]);
                        formaPagamentoView.addTotalSoma(parcelas[4]);
                        components.tabela.parcelas.p5.condicao[0].selectize.setValue(FORMA_PRAZO);
                        components.tabela.parcelas.p5.data.val(dias_150_format);
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
        var render_cliente_segmento = $container.find('#cliente-segmento');
        var render_cliente_end_rua = $container_end.find('#cliente-end-rua');
        var render_cliente_end_bairro = $container_end.find('#cliente-end-bairro');
        var render_cliente_end_cep = $container_end.find('#cliente-end-cep');
        var render_cliente_end_estado = $container_end.find('#cliente-end-estado');
        var render_cliente_end_municipio = $container_end.find('#cliente-end-municipio');
        var render_cliente_suframa = $container_end.find('#cliente-suframa');
        var render_cliente_beneficio_suframa = $container_end.find('#cliente-beneficio-suframa');

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
                if (data.A1_PESSOA == 'J'){
                    render_cliente_cnpj.text(Format.cnpj(data.A1_CGC));
                }else{
                    render_cliente_cnpj.text(Format.cpf(data.A1_CGC));
                }
                //render_cliente_cnpj.text(Format.cnpj(data.A1_CGC));
                render_cliente_end_rua.text(data.A1_END);
                render_cliente_end_bairro.text(data.A1_BAIRRO);
                render_cliente_end_estado.text(data.A1_EST);
                render_cliente_end_municipio.text(data.A1_MUN);
                render_cliente_end_cep.text(Format.cep(data.A1_CEP));
                render_cliente_tipo.text(cliente_tipos[data.A1_TIPO]);
                render_cliente_pessoa.text(cliente_pessoas[data.A1_PESSOA]);
                render_cliente_segmento.text(data.SEGMENTO);
                render_cliente_suframa.text(data.A1_SUFRAMA);
                render_cliente_beneficio_suframa.text(data.BENEFICIO_SUFRAMA);
                render_cliente_info.removeClass('hidden');
            }
        });
    };
    var FreteView = function () {
        var $container_frete = $('#container-frete');
        var select_transportadores = $('#select-transportadores');
        var selectize_transportadores = null;
        var $render_transportadores_telefone = $('#ipt-transportador-telefone');
        var $render_ipt_frete = $('#ipt-frete');
        var $render_transportadores_nome = $('#ipt-transportador');
        var $render_transportadores_cnpj = $('#ipt-transportador-cnpj');
        var $render_transportadores_obs = $('#ipt-transportador-observacao');
        var $telefone_loading = $render_transportadores_telefone.parent();
        var check_confirmo = $('#check_confirmo');
        //drk27
        var select_gera_orcamento = $('#select_gera_orcamento');
        var selectize_gera_orcamento = null;
        
        var opc_orc = [];
       
        opc_orc.push({
            'id':1,
            'nome':'GERAR ORÇAMENTO'   
        },
        {  
            'id':2,
            'nome':'GERAR PEDIDO'
        });  

        
        var self = this;
        $.extend(self, {
            init: function () {
                //drk27
                $render_transportadores_telefone.appMaskApply('telefone');
                $render_transportadores_cnpj.appMaskApply('cnpj');
                             
                $render_ipt_frete.on('click', function() {
                    formView.getFormValidation().enableFieldValidators('frete', false);
                });
                
                check_confirmo.change( function (){
                    var $self = $(this);
               
                    if($self.prop('checked') === true){
                        formView.disableSubmitButtons(false);
                    }else{
                        formView.disableSubmitButtons(true);
                    }
                
                });
                
                $('#dtp-validade').datetimepicker({
                    format: 'DD/MM/YYYY'
                });
                /*
                var input_frete = formView.getForm().find('input[name="frete"]');
                input_frete.on('keyup', function () { //focusout
                    var self_input = $(this);
                    formView.getForm().formValidation('revalidateField', self_input);
                });
                */
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
                                    //telefone: query,
                                    take: 10
                                },
                                error: function () {
                                    callback();
                                },
                                success: function (res) {
                                    callback(res);
                                }
                            });
                    },
                    onChange: function (transportador_id) {
                        if (transportador_id.length > 0) {
                            freteView.loading(true);
                            
                            $.ajax({
                                url: base_url + '/api/transportador/' + transportador_id,
                                type: 'GET',
                                error: function () {
                                    swal("Ops!", "Erro ao buscar o transportador", 'error');
                                    throw new Error('Erro na Busca do transportador');
                                },
                                success: function (transportador) {
                                    
                                    freteView.update(transportador);
                                   
                                    //$render_transportadores_telefone.val(transportador['A4_TEL']);
                                    freteView.loading(false);
                                }
                            });
                        }
                    }    
                });
                
                selectize_transportadores = select_transportadores[0].selectize; 
                
                select_gera_orcamento.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: opc_orc,
                    onChange: function (opc_orc) {
                        
                        if (opc_orc == 1){
                        
                            swal({
                                title: "",
                                text: "Se desejar, informe um e-mail adicional",
                                type: "input",
                                inputType: "email",
                                showCancelButton: false,
                                closeOnConfirm: true,
                                animation: "slide-from-top",
                                inputPlaceholder: "informe um e-mail adicional"
                              },
                                function(inputValue){

                                    if (inputValue != "") {
                                        $('#email_opc').val(inputValue);
                                        return false;
                                    }
                                }
                            );
                        }
                                             
                    }
                
                });
                selectize_gera_orcamento = select_gera_orcamento[0].selectize;

            },
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $telefone_loading.addClass(loaderClass) : $telefone_loading.removeClass(loaderClass);
            },
            displayFrete: function (status){
                //drk27
                var loadClass = 'hidden';
                status == true ? $container_frete.removeClass(loadClass) : $container_frete.addClass(loadClass);
            },
            resetFields: function (){
                $render_transportadores_telefone.val('');
                $render_ipt_frete.val('');
                $render_transportadores_nome.val('');
                $render_transportadores_cnpj.val('');
                $render_transportadores_obs.val('');
            },
            update: function (data) {               
                //$render_transportadores_telefone.val('('+data.A4_DDD+') '+data.A4_TEL+'');
               
                if ($render_transportadores_telefone.attr('readOnly')){
                    $render_transportadores_telefone.removeAttr('readOnly');
                    $render_transportadores_telefone.appUnmaskApply('telefone');
                    
                    //$render_transportadores_telefone.unmask('(999) 99999-9999');
                }
                
                $render_transportadores_telefone.val(data.A4_DDD+data.A4_TEL);
                $render_transportadores_telefone.appMaskApply('telefone');
                
                formView.getFormValidation().enableFieldValidators('ipt_transportador_telefone', false);
                //$render_transportadores_telefone.mask('(999) 99999-9999');
                $render_transportadores_telefone.attr('readOnly','readOnly');
                
                freteView.loading(false);
            }
            
        });
    };
    var CarrinhoView = function () {
        var $container = $('#produto-list').closest('table');
        var $container_body = $('#produto-list');
        var $pedido_detalhe = $('#pedido-detalhes');
        var $pedido_result = $('#pedido-result');
        var $desconto_frete = $('#desconto_frete');
        var $ipt_desconto_frete = $('#ipt_desc_frete');
        
        var desconto_atual_pedido = 0;
        var produto_count = 0;
        var produto_index_nome = 0;
        var adicional_atual_pedido = 0;
        var reset_desconto = false;
        var reset_adicional = false;

        var self = this;
        $.extend(self, {
            incrementProdutoNome: function () {
                produto_index_nome++;
            },
            resetProdutoNome: function (){
                produto_index_nome = 0;
            },
            decrementProdutoNome: function (){
                produto_index_nome--;
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
            getAdicionalAtual: function () {
                return adicional_atual_pedido;
            },
            setAdicionalAtual: function (adicional) {
                adicional_atual_pedido = adicional;
            },
            setFretePorcentagem: function (valor){
                //$ipt_desconto_frete.val(valor);
                $ipt_desconto_frete.appSetMoney(valor);
            },
            getFretePorcentagem: function (){
                
               return $ipt_desconto_frete.appUnmaskValue();
                
              //return $ipt_desconto_frete.val();
            },
            getValidDescontoFrete: function (){
                
                if ($desconto_frete.prop('checked') == true){
                    return true;
                }else{
                    return false;
                }
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
                
                $container_body.on('click', '[data-target="produto-delete"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    carrinhoController.removeItemById(produto_id);

                    tr.remove();
                    carrinhoView.decrementProduto();
                    carrinhoView.decrementProdutoNome();
                    if (carrinhoView.getProdutoCount() == 0){
                        carrinhoView.hidden();
                    }
                    //condicaoPagamentoView.updateTotal();
                    carrinhoView.refresh();
                });
                
                $desconto_frete.change( function (){
                    var $self = $(this);
                    var carrinho = carrinhoController.getItens();
                    var desconto_percent_frete = carrinhoView.getFretePorcentagem();
                    var desconto_frete_tx = desconto_percent_frete / 100;
                    
                    condicaoPagamentoView.loading(true);
               
                    if($self.prop('checked') === true){
                        
                        $self.val('1');
                        $.each(carrinhoController.getItens(), function (index, item) {
                            carrinho[index].desconto_frete = desconto_frete_tx;
                        });
                        
                        carrinhoView.refresh();  
                        freteView.displayFrete(true);
                        
                        formView.getFormValidation().enableFieldValidators('ipt_transportador', true);
                        formView.getFormValidation().enableFieldValidators('ipt_transportador_cnpj', true);
                        formView.getFormValidation().enableFieldValidators('ipt_transportador_telefone', true);
                        formView.getFormValidation().enableFieldValidators('transportador_observacao', true);
                        
                    }else{
                        
                        //$self.val('2');
                        $.each(carrinhoController.getItens(), function (index, item) {
                            carrinho[index].desconto_frete = 0;
                            //carrinhoController.setDesconto(desconto_frete_tx, index, 4);
                        });
                        
                        carrinhoView.refresh();  
                        freteView.displayFrete(false);
                        freteView.resetFields();
                        
                        formView.getFormValidation().enableFieldValidators('ipt_transportador', false);
                        formView.getFormValidation().enableFieldValidators('ipt_transportador_cnpj', false);
                        formView.getFormValidation().enableFieldValidators('ipt_transportador_telefone', false);
                        formView.getFormValidation().enableFieldValidators('transportador_observacao', false);
                    }
                
                });
                
                /*
                $container_body.on('change', '[data-target="adesivagem"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var adesivagem = self.prop('checked');

                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    carrinhoController.setAdesivagem(adesivagem, produto_index);

                });
                */

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
                
                $container_body.on('keyup', '[data-target="adicional"]', function () {
                    var self = $(this);
                    
                    if (reset_adicional == true){
                        self.val('0');
                    }
                    
                    var tr = self.closest('tr');
                    var adicional = self.appUnmaskValue(); //val()
                    var $input_desconto = null;
                    
                    formView.getForm().formValidation('revalidateField', self);
                    $input_desconto = 0;
                    
                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    var desc_vpc = carrinhoController.getDesconto(produto_index, 1);    
                    var desc_mtr = carrinhoController.getDesconto(produto_index, 2);    
                    //Zera o campo desconto 
                    if (adicional > 0 && (desc_vpc != 0 || desc_mtr != 0)){
                        reset_desconto = true;
                        carrinhoController.setDesconto($input_desconto, produto_index, 1);
                        carrinhoController.setDesconto($input_desconto, produto_index, 2);
                            
                        if (tr != null) {
                            var render_desconto_vpc = tr.find('[data-target="desconto_vpc"]');
                            var render_desconto_mostruario = tr.find('[data-target="desconto_mostruario"]');
                            render_desconto_vpc.appSetMoney($input_desconto).trigger('keyup');
                            render_desconto_mostruario.appSetMoney($input_desconto).trigger('keyup');
                        }
                        
                        reset_desconto = false;
                    }
                    
                    if (reset_adicional == false){    
                        var adicional_tx = adicional / 100;
                        carrinhoController.setAdicional(adicional_tx, produto_index);
                        carrinhoController.updateItemValues(produto_index);
                        carrinhoView.update(produto_index, tr);
                        condicaoPagamentoView.updateTotal();
                    }
                    
                });
                
                $container_body.on('keyup', '[data-target="desconto_vpc"]', function () {
                    var self = $(this);
                    
                    if (reset_desconto == true){
                        self.val('0');
                    }
                    
                    var tr = self.closest('tr');
                    var desconto = self.appUnmaskValue(); //val()
                    var tipo_desconto = 1;
                    var $input_adicional = 0;
                    
                    formView.getForm().formValidation('revalidateField', self);
                        
                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    var desconto_tx = desconto / 100;
                    var vlr_adic = carrinhoController.getAdicional(produto_index);
                    //Zera o campo adicional  
                    if (desconto > 0 && vlr_adic != 0){
                        reset_adicional = true;
                        carrinhoController.setAdicional($input_adicional, produto_index);

                        if (tr != null) {
                            var render_adicional = tr.find('[data-target="adicional"]');
                            render_adicional.appSetMoney($input_adicional).trigger('keyup');
                        }
                        
                        reset_adicional = false;
                    }  
                    
                    if (reset_desconto == false){
                        $pedido_result.find('input[name="desconto_vpc"]').appSetMoney(desconto);
                        carrinhoController.setDesconto(desconto_tx, produto_index, tipo_desconto);
                        carrinhoController.updateItemValues(produto_index);
                        carrinhoView.update(produto_index, tr);
                        condicaoPagamentoView.updateTotal();
                    }
                    
                });
                
                $container_body.on('keyup', '[data-target="desconto_mostruario"]', function () {
                    var self = $(this);
                    
                    if (reset_desconto == true){
                        self.val('0');
                    }
                    
                    var tr = self.closest('tr');
                    var desconto = self.appUnmaskValue(); //val()
                    var tipo_desconto = 2;
                    var $input_adicional = 0;
                    
                    formView.getForm().formValidation('revalidateField', self);
                    
                    var produto_id = tr.find('[data-target="produto_id"]').val();
                    var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                    var desconto_tx = desconto / 100;
                    var vlr_adic = carrinhoController.getAdicional(produto_index);
                    //Zera o campo adicional  
                    if (desconto > 0 && vlr_adic != 0){
                        reset_adicional = true;
                        carrinhoController.setAdicional($input_adicional, produto_index);

                        if (tr != null) {
                            var render_adicional = tr.find('[data-target="adicional"]');
                            render_adicional.appSetMoney($input_adicional).trigger('keyup');
                        }
                        
                        reset_adicional = false;
                    } 
                    
                    if(reset_desconto == false){    
                        $pedido_result.find('input[name="desconto_mostruario"]').appSetMoney(desconto);
                        carrinhoController.setDesconto(desconto_tx, produto_index, tipo_desconto);
                        carrinhoController.updateItemValues(produto_index);
                        carrinhoView.update(produto_index, tr);
                        condicaoPagamentoView.updateTotal();
                    }
                    
                }); 
                
               /* $container_body.on('keyup', '[data-target="desconto_color"]', function () {
                    var self = $(this);
                    var tr = self.closest('tr');
                    var desconto = self.appUnmaskValue(); //val()
                    var tipo_desconto = 3;
                    formView.getForm().formValidation('revalidateField', self);
                    
                    //if (desconto > 0){
                        var produto_id = tr.find('[data-target="produto_id"]').val();
                        var produto_index = carrinhoController.getIndexProdutoById(produto_id);
                        var desconto_tx = desconto / 100;
                        
                        $pedido_result.find('input[name="desconto_color"]').appSetMoney(desconto);
                        carrinhoController.setDesconto(desconto_tx, produto_index, tipo_desconto);
                        carrinhoController.updateItemValues(produto_index);
                        carrinhoView.update(produto_index, tr);
                        condicaoPagamentoView.updateTotal();
                    //}
                }); */

            },
            loading: function (status) {
                var loaderClass = 'loader';
                status == true ? $container.addClass(loaderClass) : $container.removeClass(loaderClass);
            },
            
            update_adicional: function (adicional, index_produto) {
                //desconto = desconto.replace(/[.]/g, '').replace(',', '.');
                carrinhoView.setAdicionalAtual(adicional);
                //var desconto_tx = desconto / 100;
                var adicional_tx = adicional;
                var produto_index = index_produto;
                var id_produto = carrinhoController.getItem(produto_index).produto_id;

                var div_produto_ids = $container_body.find('[data-target="produto_id"]');
               //DRK3 ORIGINAL for (var produto_index = 0, len = carrinhoController.lengthItens(); produto_index < len; produto_index++) {
               // for (produto_index, len = carrinhoController.lengthItens; produto_index < len; produto_index++) {
                if (produto_index == carrinhoController.getIndexProdutoById(id_produto)) {
                    carrinhoController.setAdicional(adicional_tx, produto_index);
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
                        var render_adicional = tr_select.find('[data-target="adicional"]');
                        render_adicional.appSetMoney(adicional).trigger('keyup');
                    }
                }
            },
            update_desconto: function (desconto, index_produto) {
                //desconto = desconto.replace(/[.]/g, '').replace(',', '.');
                carrinhoView.setDescontoAtual(desconto);
                //var desconto_tx = desconto / 100;
                var desconto_tx = desconto;
                var produto_index = index_produto;
               //drk3 novo
                var id_produto = carrinhoController.getItem(produto_index).produto_id;

                var div_produto_ids = $container_body.find('[data-target="produto_id"]');
               //DRK3 ORIGINAL for (var produto_index = 0, len = carrinhoController.lengthItens(); produto_index < len; produto_index++) {
                //for (produto_index, len = carrinhoController.lengthItens(); produto_index < len; produto_index++) {
                 if (produto_index == carrinhoController.getIndexProdutoById(id_produto)) {
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
                            swal("Preço não existente", "Não foi definido nenhum preço para este produto, favor entrar em contato com a Artico", 'error');
                            carrinhoController.removeItemById(produto_id);
                            carrinhoView.loading(false);
                            throw new Error('Preço não existente. B1_COD: ' + produto_id);
                        }
                        else {
                            $.each(precos, function (index, item) {
                                if (item['DA1_STATUS'] == DA1_STATUS_DESATUALIZADO) {
                                    var msg_detalhes = "DA1_CODPRO: " + item['DA1_CODPRO'] + ", DA1_CODTAB: " + item['DA1_CODTAB'] + ", DA1_TPOPER: " + item['DA1_CODTAB'];
                                    swal("Preço desatualizado", "Esse produto esta sofrendo alteraçoes de preço favor entrar em contato com a Artico<br>Detalhes: " + msg_detalhes, 'error');
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
                                
                                carrinhoView.decrementProduto();
                                carrinhoView.decrementProdutoNome();
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
                var aux_desconto_icms = produto['desconto_icms'];
                //var template = "<tr>\n    <td>\n        <div data-target=\"id\"></div>\n        <input type=\'hidden\' data-target=\"produto_id\">\n    </td>\n    <td data-target=\"tipo\"></td>\n    <td data-target=\"modelo\"></td>\n    <td data-target=\"cor\"></td>\n     <td class=\'wd-td-quantidade td-input\'>\n        <div class=\'form-group\'>\n            <input type=\"text\" class=\"form-control mask-int text-right\" data-target=\'quantidade\' value=\'1\'\n                   autocomplete=\'off\'>\n        </div>\n    </td>\n    <td class=\"text-right\" data-target=\"preco_unitario\"></td>\n    <!-- <td class=\"text-right\" data-target=\"subtotal_bruto\"></td>\n-->     <td class=\'wd-td-quantidade td-input\'>\n     <div class=\'form-group\'>\n        <div class=\"input-group\">\n       <input type=\"text\" data-target=\"adicional\"\n class=\"form-control mask-money text-right\"\n placeholder=\"0\" value=\"0\" autocomplete=\"off\">\n\n  <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n      <td class=\'wd-td-quantidade td-input\'>\n        <div class=\'form-group\'>\n            <div class=\"input-group\">\n                <input type=\"text\" data-target=\"desconto\"\n                       class=\"form-control mask-money text-right\"\n                       placeholder=\"0\" value=\"0\" autocomplete=\"off\">\n\n   <div class=\"input-group-addon\">%</div>\n    <td class=\"text-right\" data-target=\"preco_unitario_desc\"></td>\n        </div>\n        </div>\n\n        <!--<input type=\"text\" class=\"form-control text-right\" data-target=\'desconto\' value=\'0\' autocomplete=\'off\'>-->\n    </td>\n    <td class=\"text-right\" data-target=\"subtotal_bruto_desconto\"></td>\n    <td>\n        <span data-target=\"ipi\" class=\'badge\'></span>\n        <div data-target=\"ipi_valor\" class=\'pull-right\'></div>\n    </td>\n    <td>\n        <span data-target=\"st\" class=\'badge\'></span>\n        <div data-target=\"st_valor\" class=\'pull-right\'></div>\n    </td>\n    <td class=\"text-right\" data-target=\"subtotal\"></td>\n    <td class=\'td-delete\' data-target=\"produto-delete\">x</td>\n</tr>";
                if (aux_desconto_icms !== 0){
                    var coluna_desconto_icms = $('#col-desc-icms');
                    
                    coluna_desconto_icms.removeClass('hidden'); 
                    
                    var template = "<tr>\n <td>\n <div data-target=\"id\"></div>\n <input type=\'hidden\' data-target=\"produto_id\">\n  </td>\n  <td data-target=\"tipo\"></td>\n  <td data-target=\"modelo\"></td>\n   <td data-target=\"cor\"></td>\n   <td class=\'wd-td-quantidade td-input\'>\n   <div class=\'form-group\'>\n   <input type=\"text\" class=\"form-control text-right\" data-target=\'quantidade\' value=\'1\'\n   autocomplete=\'off\'>\n   </div>\n   </td>\n   <td class=\"text-right\" data-target=\"preco_unitario\"></td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"adicional\"\n class=\"form-control mask-money2 text-right\"\n placeholder=\"0,000\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n  </td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n    <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"desconto_vpc\"\n class=\"form-control mask-money2 text-right\"\n placeholder=\"0,000\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"desconto_mostruario\"\n class=\"form-control mask-money text-right\"\n placeholder=\"0\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"desconto_icms\"\n class=\"form-control mask-money text-right\"\n placeholder=\"0\" value=\"0\" disabled=\"disabled\"\n autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n    </div>\n    </td>\n    <td class=\"text-right\" data-target=\"preco_unitario_desc\"></td>\n   <td class=\"text-right\" data-target=\"subtotal_bruto_desconto\"></td>\n   <td>\n   <span data-target=\"ipi\" class=\'badge\'></span>\n   <div data-target=\"ipi_valor\" class=\'\'></div>\n   </td>\n   <td>\n   <span data-target=\"st\" class=\'badge\'></span>\n   <div data-target=\"st_valor\" class=\'\'></div>\n   </td>\n   <td class=\"text-right\" data-target=\"subtotal\"></td>\n   <td class=\'td-delete\' data-target=\"produto-delete\">x</td>\n   </tr>"; 
                   
                }else{

                    var template =  "<tr>\n   <td>\n   <div data-target=\"id\"></div>\n   <input type=\'hidden\' data-target=\"produto_id\">\n   </td>\n   <td data-target=\"tipo\"></td>\n   <td data-target=\"modelo\"></td>\n   <td data-target=\"cor\"></td>\n   <td class=\'wd-td-quantidade td-input\'>\n   <div class=\'form-group\'>\n   <input type=\"text\" class=\"form-control text-right\" data-target=\'quantidade\' value=\'1\'\n   autocomplete=\'off\'>\n   </div>\n   </td>\n   <td class=\"text-right\" data-target=\"preco_unitario\"></td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"adicional\"\n class=\"form-control mask-money2 text-right\"\n placeholder=\"0,000\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"desconto_vpc\"\n class=\"form-control mask-money2 text-right\"\n placeholder=\"0,000\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n   <td class=\'wd-td-quantidade2 td-input\'>\n   <div class=\'form-group\'>\n   <div class=\"input-group\">\n   <input type=\"text\" data-target=\"desconto_mostruario\"\n class=\"form-control mask-money text-right\"\n placeholder=\"0\" value=\"0\" autocomplete=\"off\">\n   <div class=\"input-group-addon\">%</div>\n   </div>\n   </div>\n   </td>\n   <td class=\"text-right\" data-target=\"preco_unitario_desc\"></td>\n   <td class=\"text-right\" data-target=\"subtotal_bruto_desconto\"></td>\n   <td>\n   <span data-target=\"ipi\" class=\'badge\'></span>\n   <div data-target=\"ipi_valor\" class=\'\'></div>\n   </td>\n   <td>\n   <span data-target=\"st\" class=\'badge\'></span>\n   <div data-target=\"st_valor\" class=\'\'></div>\n   </td>\n    <td class=\"text-right\" data-target=\"subtotal\"></td>\n   <td class=\'td-delete\' data-target=\"produto-delete\">x</td>\n   </tr>"; 
                }
               
                
                var $template = $(template);
                $template.find('[title]').tooltip();
                
               // var cond_pag_valor = 0;
                var preco_unitario = 0;

                var $render_tipo = $template.find('[data-target="tipo"]');
                var $render_cor = $template.find('[data-target="cor"]');
                //var $render_adesivagem = $template.find('[data-target="adesivagem"]');
                var $render_modelo = $template.find('[data-target="modelo"]');
                var $render_preco_unitario = $template.find('[data-target="preco_unitario"]');
                var $render_subtotal = $template.find('[data-target="subtotal"]');
                var $render_subtotal_bruto = $template.find('[data-target="subtotal_bruto"]');
                var $render_subtotal_bruto_desconto = $template.find('[data-target="subtotal_bruto_desconto"]');
                var $render_produto_id = $template.find('[data-target="produto_id"]');
                var $render_quantidade = $template.find('[data-target="quantidade"]');
                var $render_desconto_vpc = $template.find('[data-target="desconto_vpc"]');
                var $render_desconto_icms = $template.find('[data-target="desconto_icms"]');
                var $render_desconto_mostruario = $template.find('[data-target="desconto_mostruario"]');
                //var $render_desconto_color = $template.find('[data-target="desconto_color"]');
                //var $render_desconto = $template.find('[data-target="desconto"]');
                var $render_adicional = $template.find('[data-target="adicional"]');
                var $render_st = $template.find('[data-target="st"]');
                var $render_st_valor = $template.find('[data-target="st_valor"]');
                var $render_ipi = $template.find('[data-target="ipi"]');
                var $render_ipi_valor = $template.find('[data-target="ipi_valor"]');
                var $render_id = $template.find('[data-target="id"]');
                var $render_preco_unitario_desc = $template.find('[data-target="preco_unitario_desc"]');
                //var $render_cor_id = $template.find('select[name="cor_id"]');                

                var produto_id = produto['produto_id'];
                var produto_index = carrinhoController.getIndexProdutoById(produto_id);

               /* if (!carrinhoController.isValidAdesivagem(produto_index)) {
                    carrinhoController.setAdesivagem(false, produto_index);
                    $render_adesivagem.addClass('hidden');
                }*/


                carrinhoController.updateItemValues(produto_index);
                var carrinho_item = carrinhoController.getItem(produto_index);

                var tipo_nome = carrinho_item['tipo_nome'];
                var modelo_nome = carrinho_item['modelo_nome'];
                var descricao = carrinho_item['B1_DESC'];
                var cor_nome = carrinho_item['cor_nome'];
                var ipi = (carrinho_item['B1_IPI'] / 100);
                var st = (carrinho_item['st'] / 100);
                var quantidade = carrinho_item.quantidade;
                //var adesivagem = carrinho_item.adesivo;
                //var desconto = carrinho_item.desconto;
                
                var desconto_vpc = carrinho_item.desconto_vpc;
                var desconto_icms = carrinho_item.desconto_icms;
                var desconto_mostruario = carrinho_item.desconto_mostruario;
                //var desconto_color = carrinho_item.desconto_color;
                var desconto_frete = carrinho_item.desconto_frete;
                
                var adicional = carrinho_item.adicional;
                //var preco_unitario_adic = null;
                var preco_unitario_desc = null;
                        
                var name = 'produtos[' + carrinhoView.getProdutoNome() + ']';
                //var name_desconto = name + '[desconto]';
                var name_quantidade = name + '[quantidade]';
                var name_adicional = name + '[adicional]';
                
                var name_desconto_vpc = name + '[desconto_vpc]';
                var name_desconto_icms = name + '[desconto_icms]';
                var name_desconto_mostruario = name + '[desconto_mostruario]';
                //var name_desconto_color = name + '[desconto_color]';

                $render_produto_id.attr('name', name + '[produto_id]').val(produto_id);
                $render_quantidade.attr('name', name_quantidade).val(quantidade);
               // $render_adesivagem.attr('name', name + '[adesivagem]').prop('checked', adesivagem);
               // $render_desconto.attr('name', name_desconto).val((desconto * 100).toFixed(2));
               
                $render_desconto_vpc.attr('name', name_desconto_vpc).val((desconto_vpc * 100).toFixed(3));
                $render_desconto_mostruario.attr('name', name_desconto_mostruario).val((desconto_mostruario * 100).toFixed(3));
                $render_desconto_icms.attr('name', name_desconto_icms).val((desconto_icms * 100).toFixed(2));
                //$render_desconto_color.attr('name', name_desconto_color).val((desconto_color * 100).toFixed(2));
               
                $render_desconto_vpc.appMaskApply('money2');
                $render_desconto_mostruario.appMaskApply('money2');
                $render_desconto_icms.appMaskApply('money');
                //$render_desconto_color.appMaskApply('money');
               
               // $render_desconto.appMaskApply('money');
                $render_adicional.attr('name', name_adicional).val((adicional * 100).toFixed(3));
                $render_adicional.appMaskApply('money2');
                $render_id.text(produto_id);
                $render_tipo.text(tipo_nome).attr('title', descricao);
                $render_modelo.text(modelo_nome);
                $render_cor.text(cor_nome);
                
                //cond_pag_valor = condicaoPagamentoView.getCondicaoPagamentoValue();
                var codigo_tab = filtroView.getCodTabPreco();
                //var soma_desconto = desconto_vpc + desconto_mostruario + desconto_color + desconto_frete;
                
                preco_unitario = carrinhoController.getItemPreco(produto_index, codigo_tab);
                preco_unitario_desc =  carrinho_item.preco_unitario_desc;  
                //preco_unitario_desc = parseFloat(preco_unitario) - (parseFloat(preco_unitario) * soma_desconto);
                
                /*if (adicional > 0){
                    preco_unitario_desc = parseFloat(preco_unitario) + (parseFloat(preco_unitario) * adicional);
                }else{
                    preco_unitario_desc = parseFloat(preco_unitario) - (parseFloat(preco_unitario) * desconto);
                }*/                
               
                $render_preco_unitario_desc.text(Format.preco(preco_unitario_desc));
                $render_preco_unitario.text(Format.preco(preco_unitario));
                $render_st.text(Format.porcentagem(st, 2));
                $render_st_valor.text(Format.preco(carrinho_item.st_valor));
                $render_ipi.text(Format.porcentagem(ipi, 0));
                $render_ipi_valor.text(Format.preco(carrinho_item.ipi_valor));
                $render_subtotal.text(Format.preco(carrinho_item.subtotal));
                $render_subtotal_bruto.text(Format.preco(carrinho_item.subtotal_bruto));
                $render_subtotal_bruto_desconto.text(Format.preco(carrinho_item.subtotal_bruto_desconto));
                $container_body.append($template.wrap());

                formView.getForm().formValidation('addField', name_quantidade, validators.quantidade);
               // formView.getForm().formValidation('addField', name_desconto, validators.desconto);
                formView.getForm().formValidation('addField', name_desconto_vpc, validators.desconto_vpc);
                formView.getForm().formValidation('addField', name_desconto_mostruario, validators.desconto_mostruario);
               // formView.getForm().formValidation('addField', name_desconto_color, validators.desconto_color);
                formView.getForm().formValidation('addField', name_adicional, validators.adicional);

                condicaoPagamentoView.updateTotal();
                carrinhoView.show();
            },

            show: function () {
                $pedido_detalhe.removeClass('hidden');
                $('#btn-salvar').attr('disabled', 'disabled');
                
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
                var cliente_contrib = cliente['A1_CONTRIB'];
                var cliente_tipo = cliente['A1_TIPO'];
                var cliente_inscr = cliente['A1_INSCR'];
                var beneficio_suframa = cliente['A1_ZBENSUF'];
                var codtab_id = filtroView.getCodTabPreco();
                
                $.ajax({
                    type: 'get',
                    url: base_url + '/api/produto/precos',
                    data: {
                        produto_id: produtos_ids,
                        estado_id: estado_id,
                        cliente_pessoa: cliente_pessoa,
                        cliente_tpoper: cliente_tpoper,
                        cliente_id: cliente_id,
                        cliente_contrib: cliente_contrib,
                        cliente_tipo: cliente_tipo,
                        cliente_inscr: cliente_inscr,
                        codtab_id: codtab_id,
                        beneficio_suframa: beneficio_suframa
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
                        
                        if (carrinhoView.getProdutoNome() != 0){
                            //var index_nr = carrinhoView.getProdutoNome();
                            carrinhoView.resetProdutoNome();
                        }
                        
                        for (i = 0; i < carrinhoController.lengthItens(); i++) {
                          
                            carrinhoController.refreshST(i);
                            
                           /* if (carrinhoView.getProdutoCount() == 0){
                                carrinhoView.incrementProduto();
                                carrinhoView.incrementProdutoNome();
                            } */                            

                            //carrinhoView.incrementProduto();
                            carrinhoView.incrementProdutoNome();    
                            self.add(carrinhoController.getItem(i));
                        }
                        formaPagamentoView.loading(false);
                        carrinhoView.loading(false);
                        filtroView.loading_CondPag(false);
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
                tr.find('[data-target="preco_unitario_desc"]').text(Format.preco(carrinho_item.preco_unitario_desc));
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
        var select_condpag = $('#cond_pag');
     
        var select_condicao_venda = $('#select-condicao-venda');
        var select_condicao_pagamento = $('#select-condicao-pagamento');
        var $dv_condicao_venda = $('#dv-condicao-venda');
        var $dv_cond_normal = $('#dv-cond-normal');
        var $dv_cond_promocao = $('#dv-cond-promocao');
        var $condpag_loading = select_condicao_pagamento.parent();
        
        //var tipo_venda = {};
        var opc_venda = [];
        //var opc_finalidade = [];      
        
       /* Removido promocao
        opc_venda.push({
            'id':1,
            'nome':'Promocional'
            
        });  
        */
        opc_venda.push({
            'id':2,
            'nome':'Normal'
        });
        
        
       /* opc_finalidade.push({
            'id': 'R',
            'nome': 'Revenda'
        },
        {
            'id': 'N',
            'nome': 'Consumidor Final - Não Contribuinte'
        },
        {
            'id': 'F',
            'nome': 'Consumidor Final'
        });*/
        
        var selectize_produtos = null,
            selectize_produtos_tipos = null,
            selectize_produtos_modelos = null,
            selectize_produtos_cores = null,
            selectize_clientes = null,
            selectize_produtos_acessorios = null,
            selectize_produtos_voltagem = null,
            selectize_condicao_venda = null,
            selectize_condicao_pagamento = null;
            //selectize_finalidade_venda = null;

        var self = this;
        $.extend(self, {
            btnEnable: function () {
                produto_btn_add.removeClass('disabled');
                produto_btn_add.attr('disabled', false);
            },
            btnDisable: function () {
                produto_btn_add.addClass('disabled');
                produto_btn_add.attr('disabled', true);
            },
            getCodTabPreco: function (){
                //return selectize_condicao_pagamento.getValue();
                return $('#tabela').val();
            },
            setInputCondPag: function (cd){
                var cond_pagto = $('#cond_pagto');
                cond_pagto.val(cd);
            },
            setInputTabela: function (cd){
                var tab_preco = $('#tabela');
                tab_preco.val(cd);
            },
            loading_CondPag: function (status){
                var loaderClass = 'loader';
                status == true ? $condpag_loading.addClass(loaderClass) : $condpag_loading.removeClass(loaderClass);
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
                        
                        var codtab_id = selectize_condicao_pagamento.getValue();

                        if (!modelo_id.length) return;

                        var tipo_id = selectize_produtos_tipos.getValue();
                        selectize_produtos_cores.$wrapper.addClass($.fn.selectize.defaults.loadingClass);


                        $.ajax({
                            type: 'get',
                            url: base_url + '/api/produto',
                            data: {
                                tipo_id: tipo_id,
                                modelo_id: modelo_id,
                                codtab_id: codtab_id
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
                        });
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
                            console.log('pre-carregamento-cliente');
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
                                    swal("Ops!", "Erro ao buscar o cliente. Por favor tenta mais tarde ou entre em contato com a Artico", 'error');
                                    throw new Error('Erro na Busca do cliente');
                                },
                                success: function (cliente) {
                                    clienteController.set(cliente);
                                    clienteView.update(cliente);
                                    clienteController.setInputCliente(cliente['A1_COD']);
                                    //filtroView.show();
                                    
                                    $dv_condicao_venda.removeClass('hidden');                                  
                                    
                                    if (carrinhoController.lengthItens()) {
                                        carrinhoView.refresh();
                                    }
                                    
                                    clienteView.loading(false);
                                    carrinhoView.setFretePorcentagem(cliente['DSCFRETE']);
                                    
                                    if (cliente['DSCFRETE'] != 0){
                                        carrinhoView.inputEnable($('#desconto_frete'));
                                    }else{
                                        //drk28
                                        //habilita frete fob
                                        freteView.displayFrete(true);
                                    }
                                    
                                    selectize_condicao_pagamento.clearOptions();
                                    
                                    //var id = cliente['A1_CLASCLI'];
                                   
                                    var uf = cliente['A1_EST'];
                                    
                                    $.ajax({
                                        url: base_url + '/api/cliente/condpag/' + '002' + '/uf/'+ uf,
                                        type: 'GET',
                                        success: function (condpag) {
                                            
                                            selectize_condicao_pagamento.load(function (callback) {
                                                callback(condpag);
                                            });
                                        },
                                        error: function (){
                                            throw new Error('Erro ao carregar as condições de pagamento');
                                        }
                                        
                                    });
                                }
                            });                            
                        } else {
                            filtroView.hidden();
                        }
                    }
                });                
                selectize_clientes = select_clientes[0].selectize;
                /*if (clientes.length == 0) {
                    select_clientes.closest('form').addClass('form-disabled');
                    selectize_clientes.disable();
                }*/
                selectize_clientes.$wrapper.removeClass('hidden');
                selectize_clientes.$dropdown.removeClass('hidden');
                
                
                select_condicao_venda.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: opc_venda,
                    onChange: function (opc_venda) {
                        
                        select_condpag.removeClass('hidden');
                        
                        if (opc_venda == '1'){
                            
                            if($dv_cond_normal.length){
                               $dv_cond_normal.addClass('hidden');
                            }   
                            $dv_cond_promocao.removeClass('hidden');
                            
                        }else{
                            $dv_cond_promocao.addClass('hidden');
                            $dv_cond_normal.removeClass('hidden');                            
                        }
                          
                    }
                
                });
                selectize_condicao_venda = select_condicao_venda[0].selectize;
                
                
                select_condicao_pagamento.selectize({
                    valueField: 'id',
                    labelField: 'nome',
                    searchField: ['nome'],
                    options: [],
                    onChange: function (condpag){
                        self.setInputCondPag(condpag);
                        
                        var cliente = clienteController.get();
                        //var clascli = 002;
                        //cliente['A1_CLASCLI'];
                        var uf = cliente['A1_EST'];
                        
                        //Busca tabela de preço                        
                        $.ajax({
                            url: base_url + '/api/cliente/tabela/' + condpag +'/cod/002/uf/' + uf,
                            type: 'GET',
                            success: function (tabela) {
                                
                                //Regras de frete CIF e FOB
                                if(tabela == '592' || tabela == '593' || tabela == '594' 
                                    || tabela == '542' || tabela == '543' || tabela == '544'
                                    || tabela == '502' || tabela == '503' || tabela == '504') { //FOB
                                    
                                    $('#container-frete').removeClass('hidden');
                                    $('#tipo_frete_fob').removeClass('hidden');
                                    $('#tipo').prop('checked', true); //FOB
                                    $('#tipo_cif').prop('checked', false);
                                    $('#tipo_frete_cif').addClass('hidden');
                                    
                                } else if(tabela == '532' || tabela == '533' || tabela == '534' 
                                        || tabela == '512' || tabela == '513' || tabela == '514') { //CIF
                                    
                                    $('#container-frete').removeClass('hidden');
                                    $('#tipo_frete_cif').removeClass('hidden');
                                    $('#tipo').removeAttr('checked'); //FOB
                                    $('#tipo_cif').prop('checked', true);
                                    $('#tipo_frete_fob').addClass('hidden');
                                    
                                }
                                
                                self.setInputTabela(tabela);
                                
                                if (Compcond != ''){
                                    filtroView.loading_CondPag(true);
                                    
                                    if (Compcond != condpag){
                                        carrinhoView.refresh();
                                    }
                                }
                            },
                            error: function (){
                                throw new Error('Erro ao carregar a condição de pagamento');
                            }
                            
                        });       
                        
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
                    }

                });
                selectize_condicao_pagamento = select_condicao_pagamento[0].selectize;
                
            },
            hidden: function () {
                $container.addClass('hidden');
            },
            show: function () {
                $container.removeClass('hidden');
            },
            enableFinaVenda: function (){
                //drk27
                //selectize_finalidade_venda.enable();
            },
            btnAdd: function () {
                carrinhoView.incrementProduto();
                carrinhoView.incrementProdutoNome();         
                //selectize_finalidade_venda.disable();
                selectize_clientes.disable();
                
                var tipo_id = selectize_produtos_tipos.getValue();
                var tipo = selectize_produtos_tipos.options[tipo_id];
                var modelo_id = selectize_produtos_modelos.getValue();
                var modelo = selectize_produtos_modelos.options[modelo_id];
                var cor_id = selectize_produtos_cores.getValue();
                var cor = selectize_produtos_cores.options[cor_id];
                var produto_id = selectize_produtos.getValue();
                var cliente = clienteController.get();
                var st_uf = cliente['A1_EST'];
                var beneficio_suframa = clienteController.getBeneficioSuframa();
                //var finalidade = selectize_finalidade_venda.getValue();
                //drk
               /* if(tipo_id == '1'){
                        swal({ title: "Deseja adesivo para este produto?",
                               text: "Você pode mudar a qualquer momento no carrinho de compras.",
                               type: "warning",
                               showCancelButton: true,
                               confirmButtonColor: "#ED663E",
                               confirmButtonText: "Sim, Com Adesivo",
                               cancelButtonText: "Não, Sem Adesivo"
                               },
                                function (isConfirm){
                                    if(isConfirm){
                                        var produto = {
                                            tipo_id: tipo_id,
                                            tipo_nome: tipo.nome,
                                            modelo_id: modelo_id,
                                            modelo_nome: modelo.nome,
                                            cor_id: cor_id,
                                            cor_nome: cor.nome,
                                            produto_id: produto_id,
                                            st_uf: st_uf,
                                            adesivo: true //Com adesivo
                                            //fin_venda: finalidade
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
                                    }else{
                                        var produto = {
                                            tipo_id: tipo_id,
                                            tipo_nome: tipo.nome,
                                            modelo_id: modelo_id,
                                            modelo_nome: modelo.nome,
                                            cor_id: cor_id,
                                            cor_nome: cor.nome,
                                            produto_id: produto_id,
                                            st_uf: st_uf,
                                            adesivo: false // Sem adesivo
                                            //fin_venda: finalidade
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
                                   // return produto;
                                }
                            )
                }else{ */
                    
                var produto = {
                    tipo_id: tipo_id,
                    tipo_nome: tipo.nome,
                    modelo_id: modelo_id,
                    modelo_nome: modelo.nome,
                    cor_id: cor_id,
                    cor_nome: cor.nome,
                    produto_id: produto_id,
                    st_uf: st_uf,
                    adesivo: false
                    //fin_venda: finalidade
                    //st: st_valor
                }; 
                    
                var produto_selected = filtroController.getProdutoById(produto_id);
                $.extend(produto, produto_selected);
                
                switch (beneficio_suframa){
                    case '1':
                    case '4':
                    case '6':
                    case '7':
                        produto['B1_IPI'] = 0;
                        break;   
                }

                selectize_produtos_modelos.disable();
                selectize_produtos_modelos.clearOptions();
                selectize_produtos_cores.disable();
                selectize_produtos_cores.clearOptions();
                selectize_produtos.disable();
                selectize_produtos.clearOptions();
                selectize_produtos_tipos.setValue(null);

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
                            prazo_saida:{
                                validators:{
                                    notEmpty:{
                                        message: 'Favor informar o prazo de saída do pedido',
                                        min: 1,
                                        max:2
                                    }
                                }
                            },
                            'regional[id]': {
                                validators: {
                                    notEmpty:{
                                        message: 'Selecione uma regional'
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
                            desconto_vpc: validators.desconto_vpc,
                            desconto_mostruario: validators.desconto_mostruario,
                            //desconto_color: validators.desconto_color,
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
                            'ipt_transportador': {
                                validators: {
                                    notEmpty: {
                                        message: 'Informe o nome do transportador',
                                        max:80
                                    }
                                }
                            },
                            'ipt_transportador_cnpj':{
                                validators: {
                                    /*callback:{
                                        callback: function (value, validator, $field){
                                            //value = value.replace(',', '.');
                                            //var value = $field.appUnmaskValue();
                                            
                                            if (value.length < 18){
                                                return {
                                                    valid: false,
                                                    //message: 'informe corretamente'
                                                }
                                            }
                                            
                                            return true;
                                        }
                                    },*/
                                    stringLength:{
                                        min: 18,
                                        message: 'Informe o CNPJ completo'
                                    },
                                    notEmpty:{
                                        message: 'Informe o CNPJ do transportador'
                                    }
                                }  
                            },
                            'ipt_transportador_telefone':{
                                validators: {
                                    stringLength:{
                                        min:15,
                                        message: 'Informe o telefone completo' 
                                    },
                                    notEmpty:{
                                        message: 'Informe o telefone do transportador'
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
                            /*'parcela[1][valor]':{
                                validators:{
                                    notEmpty:{
                                        message: 'A primeira parcela nunca pode ser zerada!'
                                    }
                                }
                            }*/

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
                            //$form.find('.mask-money').appUnmaskApply('money');                             
                           /* var controle_bndes = 0;
                            var controle_outfina = 0;
                            
                            $('select[name*="[condicao]"]').each(function(){
                                var $self = $(this);
                                
                                if ($self.val() == 40 && ($('#ct_numero').val() == '' || $('#ct_band').val() == '' ||
                                    $('#ct_controle').val() == '' || $('#dtp-validade').val() == '' ||
                                    $('#ct_banco').val() == '' || $('#ct_parcelas').val() == '')){
                                    
                                    controle_bndes++;
                                    return false;                                  
                                    
                                }else if ($self.val() == 70 && ($('#finan_linha_credito').val() == '' ||
                                          $('#finan_bco').val() == '' || $('#finan_telefone').val() == '' ||
                                          $('#finan_email').val() == '')){
                                    
                                    controle_outfina++;
                                    return false;
                                }
                            
                            });*/
                            
                           /* if (controle_bndes != 0){
                                swal('Atenção!', 'Favor informar todos os campos do cartão BNDES', 'warning');
                                return false;
                            }
                            
                            if (controle_outfina != 0){
                                swal('Atenção!', 'Favor informar todos os campos da linha OUTROS FINANCIAMENTOS', 'warning');
                                return false;
                            }
                            
                            if ($('#select-regional').val() == ''){
                                swal('Atenção!', 'Favor selecionar uma regional antes de proceder com o pedido!', 'warning');
                                return false;
                            }*/
                            
                            /*if ($('#select-transportadores').val() == ''){
                                swal('Atenção!', 'Favor selecionar uma opção de transportadora antes de concluir o pedido!', 'warning');
                                return false;
                            }*/
                            
                            if ($('#check_confirmo').prop('checked') === false){
                                e.preventDefault();
                                swal('Atenção!', 'Favor aceitar os termos para prosseguir com o pedido.', 'warning');
                                return false;
                            }
                            
                            if ($('#select_gera_orcamento').val() == ''){
                                swal('Atenção!', 'Favor informar se deseja realizar orçamento.', 'warning');
                                return false;
                            }
                            //drk27 
                            $form.find($('[data-target="desconto_icms"]')).removeAttr('disabled');
                            
                            var ipt_desconto_icms = $form.find($('[data-target="desconto_icms"]'));
                            var aux_desc_icms = ipt_desconto_icms.val();
                            
                            ipt_desconto_icms.appSetMoney(aux_desc_icms).trigger('keyup');
                            $form.find('.mask-money').appUnmaskApply('money');
                            $form.find('.mask-money2').appUnmaskApply('money2');
                        }
                        
                    })
                    .on('success.field.fv', function (e, data) {
                        data.fv.disableSubmitButtons(data.fv.getInvalidFields().length > 0);
                    });
                    //.on('removed.field.fv', function (e, data) {
                    // $(e.target)  --> The form instance
                    // $(e.target).data('formValidation')
                    //              --> The FormValidation instance

                    //console.log(data.field);///   --> The field name
                    //console.log(data.element);//--> The new field element

                    // Do something ...
                    //});
                
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
