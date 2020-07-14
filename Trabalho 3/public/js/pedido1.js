let produtos_carrinho = [];
let total_carrinho = 0;
let operacao_cliente = 0;

$(document).ready(function() {

    $('#zcaclient').select2({
        placeholder: 'Digite o nome ou cnpj',
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: base_url + '/api/cliente/combobox',
            dataType: 'json',
            processResults: function (data) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.text,
                            id: item.id
                        }
                    })
                };
            }
        }
    });

    $('#select-finalidade-venda').select2({
        placeholder: 'Selecionar finalidade',
        allowClear: true,
        tags: false
    });

    $('#select-condicao-venda').select2({
        placeholder: 'Selecionar condição',
        allowClear: true,
        tags: false
    });

    $('#select-produtos-tipo').select2({
        placeholder: 'Selecionar tipo',
        allowClear: true,
        tags: false
    });

    $('#select-produtos-modelo').select2({
        placeholder: 'Selecionar modelo',
        allowClear: true,
        tags: false
    });
    
    $('#select-produtos-voltagem').select2({
        placeholder: 'Selecionar voltagem',
        allowClear: true,
        tags: false
    });

    $('#select-produtos-tipo-congelador').select2({
        placeholder: 'Selecionar tipo',
        allowClear: true,
        tags: false
    });

    $('#select-produtos-cores').select2({
        placeholder: 'Selecionar cor',
        allowClear: true,
        tags: false
    });

    $('#select-tabela-venda').select2({
        placeholder: 'Tabela de venda',
        allowClear: true,
        tags: false
    });
        
    $('#zcaclient').on("change", function(e) { 
        
        showLoading();

        var array_dados = {
            id : $('#zcaclient').val()
        }

        $.ajax({
            type: 'POST',
            url: base_url + '/api/cliente/selecionar_cliente',
            data: array_dados,
            success: function (retorno) {

                if(retorno){

                    operacao_cliente = retorno.data.OPERACAO;

                    $('#dadoscli').css('display', 'block');

                    $('#cliente-nome').text(retorno.data.A1_NOME);
                    $('#cliente-email').text(retorno.data.A1_EMAIL);
                    $('#cliente-inscr').text(retorno.data.A1_INSCR);
                    $('#cliente-cnpj').text(retorno.data.A1_CGC);
                    $('#cliente-tipo').text(retorno.data.A1_TIPO);
                    $('#cliente-pessoa').text(retorno.data.A1_PESSOA);
                    $('#cliente-segmento').text(retorno.data.A1_SATIV1);
                    $('#cliente-telefone1').text(retorno.data.A1_TEL);
                    $('#cliente-end-rua').text(retorno.data.A1_END);
                    $('#cliente-end-bairro').text(retorno.data.A1_BAIRRO);
                    $('#cliente-end-cep').text(retorno.data.A1_CEP);
                    $('#cliente-end-estado').text(retorno.data.A1_EST);
                    $('#cliente-end-municipio').text(retorno.data.A1_MUN);
                    $('#dadoscli').css('display', 'block');
                    hideLoading();

                }
                
            },
            error: function () {
                
            }
        })

    });

    $('#select-finalidade-venda').on("change", function(e) { 

        for(i=0; i<finalidades_msg.length; i++){
            
            if(this.value == finalidades_msg[i].valor){
                console.log(finalidades_msg[i]);
                Swal.fire({title: "Atenção", text: finalidades_msg[i].mensagem, type: "info"});
            }
        }

    });


    $('#select-condicao-venda').on("change", function(e) { 

        $('#condicoes_pagamento').html('');
        var tabela = ""+$('#select-condicao-venda').val();
        var string = '';

        for(i=0; i<condicoes_pagamento.length; i++){

            if(tabela === condicoes_pagamento[i].tabela){

                
                string += '<label class="btn btn-primary" style="margin: 2.5px;"><input onclick="mostrar_selecao_produto()" type="radio" name="condicao_pagamento" value="'+condicoes_pagamento[i].valor+'" autocomplete="off" class="botao_condicao_pagamento" />'+condicoes_pagamento[i].nome+'</label>';

            }

        }

        console.log(string);

        $('#condicoes_pagamento').append('<center>'+string+'</center>');

    });


    $('#select-produtos-tipo').on("change", function(e) { 

        $('#select-produtos-modelo').html('<option></option>');
        var string = '';
        var cor = false
        
        for(i=0; i<produtos_selecao.length; i++){
            if(this.value == produtos_selecao[i].tipo){
                string += '<option value="'+produtos_selecao[i].valor+'">'+produtos_selecao[i].nome+'</option>';

                if(produtos_selecao[i].cor){
                    cor = true;
                }

            }
        }

        if(cor){
            $('#cor_produto').css('display', 'block');
            $('#acessorio_produto').css('display', 'block');
            $('#tipo_congelador').css('display', 'block');
            $('#tipo_congelador_voltagem').css('display', 'block'); 
        }else{
            $('#cor_produto').css('display', 'none');
            $('#acessorio_produto').css('display', 'none');
            $('#tipo_congelador').css('display', 'none');
            $('#tipo_congelador_voltagem').css('display', 'none');
        }

        $('#select-produtos-modelo').append(string);

    });

    $('#select-produtos-modelo').on("change", function(e) { 

        for(i=0; i<produtos_selecao.length; i++){
            if($('#select-produtos-tipo').val() == produtos_selecao[i].valor){
                if(!produtos_selecao[i].cor){
                    $('#add_produto').css('display', 'block');
                }else{
                    $('#add_produto').css('display', 'none');
                }
            }
        }

    });

    $('#select-produtos-tipo-congelador').on("change", function(e) { 
        $('#add_produto').css('display', 'block');
    });

});

function showLoading() {
    $('.spiner2').css('display', 'block');
}

function hideLoading() {
    $('.spiner2').css('display', 'none');
}

function mostrar_selecao_produto(){
    
    $('#quadro_2').css('display', 'block');

}

function limpar_selecao_produto(){

    $('#select-produtos-tipo').val('').change();
    $('#select-produtos-cores').val('').change();
    $('#select-produtos-voltagem').val('').change();
    $('#select-produtos-tipo-congelador').val('').change();

    $('#select-produtos-modelo').html('');

    $('#cor_produto').css('display', 'none');
    $('#acessorio_produto').css('display', 'none');
    $('#tipo_congelador_voltagem').css('display', 'none');
    $('#tipo_congelador').css('display', 'none');
    $('#add_produto').css('display', 'none');


    $('.acessoriocheck').prop( "checked", false );

}

function add_produto(){

    showLoading();
    
    var tipo_produto = $('#select-produtos-tipo').val();
    var modelo = $('#select-produtos-modelo').val();
    var cor = $('#select-produtos-cores').val();
    var tipo_congelador = $('#select-produtos-tipo-congelador').val();
    var tabela = $("input[name=condicao_pagamento]").val();
    var voltagem = $('#select-produtos-voltagem').val();
    var cod_cliente = $('#zcaclient').val();
    var operacao = operacao_cliente;

    if(cod_cliente == null){
        Swal.fire({title: "Atenção", text: 'Você deve selecionar um cliente', type: "info"});
        hideLoading();
        return false;
    }

    var acessorio = [].filter.call(document.getElementsByName('acessorio[]'), function(c) {
        return c.checked;
    }).map(function(c) {
        return c.value;
    });

    var semacessorio = false;
    for(i=0;i<acessorio.length; i++){
        if(acessorio[i] == "1"){
            semacessorio = true;
        }
    }

    if(semacessorio && acessorio.length>1){
        Swal.fire({title: "Atenção", text: 'Você não pode selecionar sem acessorio com outros acessorios', type: "info"});
        hideLoading();
        return false;
    }

    if(tipo_produto == "1" && acessorio.length == 0){
        Swal.fire({title: "Atenção", text: 'Você deve selecionar ao menos um acessorio na lista de acessorios', type: "info"});
        hideLoading();
        return false;
    }


    $.ajax({
        url: 'add_produto_carrinho',
        type: 'post',
        data: {
            cod_cliente: cod_cliente,
            tipo_produto: tipo_produto,
            modelo: modelo,
            cor: cor,
            tipo_congelador: tipo_congelador,
            acessorio: acessorio,
            tabela: tabela,
            voltagem: voltagem,
            operacao: operacao
        },
        complete: function(data){

            var produto = data.responseJSON.data[0];
            var codigo = produto.B1_COD.trim();
            var produto_desc = produto.INFO.produto;
            var modelo = produto.INFO.modelo;
            var cor = produto.INFO.cor;
            var val = produto.PRECO.DA1_PRCVEN;
            var preco_lista = 'R$ ' + formatMoney(val);
            
            produtos_carrinho.push({
                produto: produto,
                codigo: codigo,
                produto_desc: produto_desc,
                modelo: modelo,
                cor: cor,
                val: parseFloat(val),
                valor_tot: val,
                quantidade: 1,
                adicional: 0.0,
                desconto: 0.0,
                valor_ipi: produto.PRECO.VALOR_IPI,
                valor_total: produto.PRECO.TOTAL
            });

            total_carrinho = total_carrinho + produto.PRECO.TOTAL;

            var adesivo_produto = false;
            var add_adesivo = false;
            var string_adesivo = '';

            if(tipo_produto == "1"){

                adesivo_produto = true;

                add_adesivo = (async () => {
                    if (!await confirm('Deseja adesivo para este produto?', 'Você pode mudar a qualquer momento no carrinho de compras.', 'warning')) {
                        $('#adesivo_'+codigo).prop( "checked", true);
                        return;
                    }else{
                        return;
                    }
                })();

            }

            if(adesivo_produto){
                string_adesivo = '<input type="checkbox" data-target="adesivagem" id="adesivo_'+codigo+'">';
            }else{
                string_adesivo = '---';
            }

            var quantidade = '<input type="number" min="1" class="form-control" style="width: 60px;" id="qtd_carrinho_'+codigo+'" value="1" onchange="calcular_quantidade('+codigo+')"/>';
            var adicional = '<input type="text" class="form-control" style="width: 65px;" id="adicional_carrinho_'+codigo+'"onkeypress="return formatar_moeda(this,'+"''"+','+"'.'"+',event);" onkeyup="calcular_adicional('+codigo+');" value="0.00"/>';
            var desconto = '<input type="text" class="form-control" style="width: 69px;" id="desconto_carrinho_'+codigo+'" onkeypress="return formatar_moeda(this,'+"''"+','+"'.'"+',event);" onkeyup="calcular_desconto('+codigo+');" value="0.00"/>';
            var valor_ipi = '<span id="ipi_carrinho_'+codigo+'">R$ '+formatMoney(produto.PRECO.VALOR_IPI)+'</span>('+produto.PRECO.TAXA_IPI+'%)';
            var valor_total = 'R$ '+formatMoney(produto.PRECO.TOTAL);

            var string_tabela = '<tr><td>'+codigo+'</td><td>'+produto_desc+'</td><td>'+modelo+'</td><td>'+cor+'</td><td>'+string_adesivo+'</td><td>'+quantidade+'</td><td>'+preco_lista+'</td><td>'+adicional+'</td><td>'+desconto+'</td><td>'+preco_lista+'</td><td id="val_carrinho_'+codigo+'">'+preco_lista+'</td><td>'+valor_ipi+'</td><td id="valor_total_carrinho_'+codigo+'">'+valor_total+'</td></tr>';
            
            $('#tabela_carrinho').append(string_tabela);
            limpar_selecao_produto();
            $('#pagamentos_datas_precos').css('display', 'block');
            hideLoading();

            $('#quadro_3').css('display', 'block');
            calcular_parcelas($("input[name=condicao_pagamento]").val(), total_carrinho);

            

        },
        error: function(){

        }
    });

    
    

}

function formatMoney(n, c, d, t) {
  c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function calcular_quantidade(codigo,qtd){

    var qtd = $('#qtd_carrinho_'+codigo).val();

    for(i=0; i<produtos_carrinho.length; i++){
        total_carrinho = total_carrinho - produtos_carrinho[i].valor_total;
        if(produtos_carrinho[i].codigo == codigo){
            var valor = produtos_carrinho[i].val * qtd;
            var ipi = produtos_carrinho[i].valor_ipi *qtd;
            var total = valor + ipi;
            produtos_carrinho[i].valor_total = valor + ipi;

            $('#val_carrinho_'+codigo).html('R$ ' + formatMoney(valor));
            $('#ipi_carrinho_'+codigo).html('R$ ' + formatMoney(ipi));
            $('#valor_total_carrinho_'+codigo).html('R$ ' + formatMoney(total));
            total_carrinho = total_carrinho + total;
            calcular_parcelas($("input[name=condicao_pagamento]").val(), total_carrinho);

        }
    }

    console.log(produtos_carrinho);

}

function calcular_adicional(codigo){

    var valor = $('#adicional_carrinho_'+codigo).val();
    console.log(valor);

}

function calcular_desconto(codigo){
    
    var valor = $('#desconto_carrinho_'+codigo).val();
    console.log(valor);

}

async function confirm(titulo, mensagem, tipo) {
    return Swal.fire({
        title: titulo,
        text: mensagem,
        type: tipo,
        showCancelButton: true,
        confirmButtonColor: "#ED663E",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then((result) => {
        if(result.value){
            return false;
        }else{
            return true;
        }
    });
}

function calcular_parcelas(condicao_pagamento, valor_total){

    $('#tabela_precos').html('<tr><td colspan="4" style="text-align: center;"><i class="fas fa-sync fa-spin"></i></td></tr>');

    $.ajax({
        url: 'calcular_parcelas',
        type: 'post',
        data: {
            condicao: condicao_pagamento,
            valor: valor_total
        },
        success: function(retorno){
            
            $('#tabela_precos').html('');
            var y= 0;

            for(i=0;i<retorno.data.parcelas.length; i++){
                var parcela = retorno.data.parcelas[i];
                y++;
                $('#tabela_precos').append('<tr><td></td><td>'+y+'</td><td>'+parcela.data+'</td><td>'+parcela.valor+'</td></tr>');
            }

            $('#tabela_precos').append('<tr><td colspan="3">Total</td><td>'+retorno.data.total+'</td></tr>');

        }
    });

}




















function formatar_moeda(campo, separador_milhar, separador_decimal, tecla) {
	var sep = 0;
	var key = '';
	var i = j = 0;
	var len = len2 = 0;
	var strCheck = '0123456789';
	var aux = aux2 = '';
	var whichCode = (window.Event) ? tecla.which : tecla.keyCode;

	if (whichCode == 13) return true; // Tecla Enter
	if (whichCode == 8) return true; // Tecla Delete
	key = String.fromCharCode(whichCode); // Pegando o valor digitado
	if (strCheck.indexOf(key) == -1) return false; // Valor inválido (não inteiro)
	len = campo.value.length;
	for(i = 0; i < len; i++)
	if ((campo.value.charAt(i) != '0') && (campo.value.charAt(i) != separador_decimal)) break;
	aux = '';
	for(; i < len; i++)
	if (strCheck.indexOf(campo.value.charAt(i))!=-1) aux += campo.value.charAt(i);
	aux += key;
	len = aux.length;
	if (len == 0) campo.value = '';
	if (len == 1) campo.value = '0'+ separador_decimal + '0' + aux;
	if (len == 2) campo.value = '0'+ separador_decimal + aux;

	if (len > 2) {
		aux2 = '';

		for (j = 0, i = len - 3; i >= 0; i--) {
			if (j == 3) {
				aux2 += separador_milhar;
				j = 0;
			}
			aux2 += aux.charAt(i);
			j++;
		}

		campo.value = '';
		len2 = aux2.length;
		for (i = len2 - 1; i >= 0; i--)
		campo.value += aux2.charAt(i);
		campo.value += separador_decimal + aux.substr(len - 2, len);
	}

	return false;
}