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
            }
        });
    };
    var CarrinhoController = function () {
        var carrinho = {
            itens: [],
            total_bruto: 0,
            total_bruto_30: 0,
            total_bruto_30_60: 0,
            total_bruto_30_60_90: 0,
            total: 0,
            total_30: 0,
            total_30_60: 0,
            total_30_60_90: 0,
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
            /**
             * Faz a busca dos preços de um produto no banco
             */
            getItemPrecos: function (dados, callback) {
                var cliente = dados.cliente;
                var produto = dados.produto;
                var produto_id = produto['produto_id'];

                var STATUS_NEW = 1, STATUS_CONTAINS = 2, STATUS_ERROR = 3;
                var produto_index = this.getIndexProdutoById(produto_id);
                if (produto_index == -1) {
                    $.ajax({
                        type: 'get',
                        url: base_url + '/api/produto/precos',
                        data: {
                            estado_id: cliente['A1_EST'],
                            cliente_pessoa: cliente['A1_PESSOA'],
                            cliente_id: cliente['A1_COD'],
                            cliente_tpoper: cliente['TPOPER'],
                            produto_id: produto_id
                        },
                        error: function () {
                            callback(null, STATUS_ERROR);
                        },
                        success: function (precos) {
                            produto['precos'] = precos;
                            produto.quantidade = 1;
                            produto.adesivagem = false;
                            produto.desconto = 0;
                            carrinhoController.addItem(produto);
                            callback(produto, STATUS_NEW);
                        }
                    })
                }
                else {
                    carrinho.itens[produto_index]['quantidade']++;
                    callback(produto, STATUS_CONTAINS);
                }
            },


            removeItemIndex: function (index) {
                carrinho.itens.splice(index, 1);
            },
            removeItemById: function (id) {
                var index = array_find_index(carrinho.itens, id, 'id');
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
                    swal("Preço não existente", "Preços faltantes para alguns tipos de condições: <br>Detalhes:  CODTAB: " + codtab + ', B1_COD: ' + carrinho.itens[produto_index]['B1_COD'] + ', TPOPER: ' + clienteController.get()['TPOPER'] + ", favor entrar em contato com a artico", 'error')
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
            updateValuesTotal: function (desconto) {
                var total_bruto = 0, total_bruto_30 = 0, total_bruto_30_60 = 0, total_bruto_30_60_90 = 0;
                $.each(carrinhoController.getItens(), function (index, item) {
                    total_bruto += item.subtotal;
                    total_bruto_30 += item.subtotal_30;
                    total_bruto_30_60 += item.subtotal_30_60;
                    total_bruto_30_60_90 += item.subtotal_30_60_90;
                });
                carrinho.total_bruto = total_bruto;
                carrinho.total_bruto_30 = total_bruto_30;
                carrinho.total_bruto_30_60 = total_bruto_30_60;
                carrinho.total_bruto_30_60_90 = total_bruto_30_60_90;

                carrinho.total = carrinho.total_bruto - desconto;
                carrinho.total_30 = carrinho.total_bruto_30 - desconto;
                carrinho.total_30_60 = carrinho.total_bruto_30_60 - desconto;
                carrinho.total_30_60_90 = carrinho.total_bruto_30_60_90 - desconto;

            },
            /**
             * Atualiza o total bruto para cada uma das diferentes formas de pagamento, ipi e st
             */
            updateItemValues: function (produto_index) {
                var preco_unitario = this.getItemPreco(produto_index, CODTAB.CODTAB_AVISTA);
                var preco_unitario_30 = this.getItemPreco(produto_index, CODTAB.CODTAB_30);
                var preco_unitario_30_60 = this.getItemPreco(produto_index, CODTAB.CODTAB_30_60);
                var preco_unitario_30_60_90 = this.getItemPreco(produto_index, CODTAB.CODTAB_30_60_90);

                var quantidade = carrinho.itens[produto_index].quantidade;
                var desconto = carrinho.itens[produto_index].desconto;
                var ipi_tx = (carrinho.itens[produto_index]['B1_IPI'] / 100);
                var ipi = ipi_tx + 1;
                var st_tx = (carrinho.itens[produto_index]['st'] / 100);
                var st = st_tx + 1;

                var subtotal_bruto = round(quantidade * preco_unitario);
                var subtotal_bruto_30 = round(quantidade * preco_unitario_30);
                var subtotal_bruto_30_60 = round(quantidade * preco_unitario_30_60);
                var subtotal_bruto_30_60_90 = round(quantidade * preco_unitario_30_60_90);

                var subtotal_bruto_desconto = subtotal_bruto - round(subtotal_bruto * desconto);
                var ipi_valor = round(subtotal_bruto_desconto * ipi_tx);
                var subtotal_com_ipi = round(subtotal_bruto_desconto * ipi);
                var st_valor = round(subtotal_com_ipi * st_tx);
                var subtotal = round(subtotal_com_ipi * st);

                var subtotal_30 = round(round(round(subtotal_bruto_30 - round(subtotal_bruto_30 * desconto)) * ipi) * st);
                var subtotal_30_60 = round(round(round(subtotal_bruto_30_60 - round(subtotal_bruto_30_60 * desconto)) * ipi) * st);
                var subtotal_30_60_90 = round(round(round(subtotal_bruto_30_60_90 - round(subtotal_bruto_30_60_90 * desconto)) * ipi) * st);


                carrinho.itens[produto_index].subtotal_bruto = subtotal_bruto;
                carrinho.itens[produto_index].subtotal_bruto_desconto = subtotal_bruto_desconto;

                carrinho.itens[produto_index].ipi_valor = ipi_valor;
                carrinho.itens[produto_index].st_valor = st_valor;

                carrinho.itens[produto_index].subtotal = subtotal;
                carrinho.itens[produto_index].subtotal_30 = subtotal_30;
                carrinho.itens[produto_index].subtotal_30_60 = subtotal_30_60;
                carrinho.itens[produto_index].subtotal_30_60_90 = subtotal_30_60_90;
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
                    var prazo = array_find_item(formas_pagamento, '10', 'id');
                    var vista = array_find_item(formas_pagamento, '20', 'id');
                    aux.push(vista);
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
            setDesconto: function (desconto_tx, produto_index) {
                carrinho.itens[produto_index].desconto = desconto_tx;
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
                if (produto == null)
                    return;

                var cliente = clienteController.get();
                var st_uf = cliente['A1_EST'];
                var st_item = array_find_item(st_itens, st_uf, 'uf');
                if (st_item == null) {
                    st_item = {
                        uf: ' ',
                        valor: 0
                    };
                }
                var st = st_item.valor;
                //congelador e cestas tem st somente para pessoa juridica;
                if (produto['B1_ZTIPO'] == B1_ZTIPO_CONGELADOR || produto['B1_ZTIPO'] == B1_ZTIPO_CESTA) {
                    if (cliente['A1_PESSOA'] != A1_PESSOA_JURIDICA)
                        st = 0;
                    //carrinhoController.setST(0, produto_index);
                } else
                    st = 0;
                //carrinhoController.setST(0, produto_index);
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
                    if (array_find_item(cores_options, cor_id, 'id') == null)
                        cores_options.push(cor);
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