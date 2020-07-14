function showLoading() {
    $('.spiner2').css('display', 'block');
}

function hideLoading() {
    $('.spiner2').css('display', 'none');
}

function exibir_informacao(id){

    showLoading();

    $.ajax({
        type: 'POST',
        url: 'informacoes_representante',
        data: {
            id: id
        },
        success: function(retorno){
            hideLoading();
            $('#nome_repres').text(retorno.data.A3_NOME);
            $('#aba_informacoes').css('display', 'block');
            console.log(retorno);
        },
        error: function(retorno){
            
            hideLoading();
            alert('Ocorreu um erro interno, contate o T.I');

        }
    });

}

function filtro_mes(){

    if($('#filtro_acumulativo_value').val() == "1"){
        if($('#filtro_option_value').val()<$('#filtro_acumulativo_mes_value').val()){
            alert('A data de termino não pode ser menor que a de inicio');
            return false;
        }
    }

    showLoading();

    $.ajax({
        type: 'POST',
        url: 'filtrar_dados',
        data: {
            mes: $('#filtro_option_value').val(),
            mes_de: $('#filtro_acumulativo_mes_value').val(),
            acumulativo: $('#filtro_acumulativo_value').val(),
            unid_fabril: $('#filtro_uni_fabril').val(),
            gerente: $('#filtro_gerente').val()
        },
        success: function(retorno){
               
            $('#exibicao').html('');

            if(retorno.data.VENDEDORES != undefined){
                for(i=0; i<retorno.data.VENDEDORES.length;i++){
                    $('#exibicao').append(retorno.data.VENDEDORES[i].HTML);
                }
            }

            

            $('#valor_vendido_um').html('<i class="far fa-money-bill-alt"></i> Valor vendido '+retorno.data.TOTAL);
            $('#valor_total_meta').html('<i class="far fa-money-bill-alt"></i> Meta orçamento '+retorno.data.TOTAL_META);
            $('#valor_total_meta_representante').html('<i class="far fa-money-bill-alt"></i> Meta Plano '+retorno.data.TOTAL_META_REPRESENTANTE);

            hideLoading();           

        },
        error: function(retorno){
            
            hideLoading();
            alert('Ocorreu um erro interno, contate o T.I');

        }
    });

}

function muda_acumulativo_select(){

    valor = $('#filtro_acumulativo_value').val();

    if(valor == "1"){
        $('#competencia_titulo').html('Ate');
        $('#acumulativo_select_div').css('display', 'inline-block');
    }else{
        $('#competencia_titulo').html('Competência');
        $('#acumulativo_select_div').css('display', 'none');
    }

}

function exibir_atendimentos(id){

    showLoading();

    $.ajax({
        type: 'POST',
        url: 'informacoes_atendimentos_representante',
        data: {
            id: id,
            mes: $('#filtro_option_value').val(),
            mes_de: $('#filtro_acumulativo_mes_value').val(),
            acumulativo: $('#filtro_acumulativo_value').val(),
            unidade_fabril: $('#filtro_uni_fabril').val()
        },
        success: function(retorno){

            var resultado = retorno.tabela;
            $('#nome_repres').html(retorno.vendedor);
            $('#resultado_atendimentos').html('<table class="table table-striped table-bordered"><thead><tr><td>Status</td><td>Cliente</td></tr></thead><tbody>'+resultado+'</tbody></table>');
            $('#aba_informacoes').css('display', 'block');
            hideLoading();
 
        },
        error: function(retorno){
            
            hideLoading();
            alert('Ocorreu um erro interno, contate o T.I');

        }
    });

}

function muda_barra_metas(){

    var id = $('#filtro_metas_exibir').val();

    if(id == "0"){
        $('.meta_grafico_interta').css('display', 'block');
        $('.meta_grafico_representante').css('display', 'block');
    }else if(id == "1"){
        $('.meta_grafico_interta').css('display', 'block');
        $('.meta_grafico_representante').css('display', 'none');
    }else if(id == "2"){
        $('.meta_grafico_interta').css('display', 'none');
        $('.meta_grafico_representante').css('display', 'block');
    }

}

function abrir_metas(codigo){
    
    showLoading();

    $.ajax({
        type: 'POST',
        url: 'abrir_metas_compostas',
        data: {
            id: codigo,
            mes: $('#filtro_option_value').val(),
            mes_de: $('#filtro_acumulativo_mes_value').val(),
            acumulativo: $('#filtro_acumulativo_value').val(),
            unid_fabril: $('#filtro_uni_fabril').val(),
            gerente: $('#filtro_gerente').val()
        },
        success: function(retorno){

            console.log(retorno);
            hideLoading();

            Swal.fire({
                title: 'Metas representante',
                icon: 'info',
                html: retorno.data,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false
            });

        },
        error: function(retorno){
            
            hideLoading();
            alert('Ocorreu um erro interno, contate o T.I');

        }
    });

}

function exibir_filtro_relatorio(codigo){

    var formulario = '';
    var option_datas = '<option value="2020-01">01-2020</option><option value="2020-02">02-2020</option><option value="2020-03">03-2020</option><option value="2020-04">04-2020</option><option value="2020-05">05-2020</option><option value="2020-06">06-2020</option><option value="2020-07">07-2020</option><option value="2020-08">08-2020</option><option value="2020-09">09-2020</option><option value="2020-10">10-2020</option><option value="2020-11">11-2020</option><option value="2020-12">12-2020</option>';
    var option_datas_futuras = '<option value="202001">01-2020</option><option value="202002">02-2020</option><option value="202003">03-2020</option><option value="202004">04-2020</option><option value="202005">05-2020</option><option value="202006">06-2020</option><option value="202007">07-2020</option><option value="202008">08-2020</option><option value="202009">09-2020</option><option value="202010">10-2020</option><option value="202011">11-2020</option><option value="202012">12-2020</option>';

    var select_acumulativo = '<div class="form-group" style="text-align: left;display: none;" id="select_acumulativo_relatorio"><label id="competencia_titulo">Até</label><select class="form-control" id="acumulativo_valor_selecionar_formulario">'+option_datas+'</select></div>';

    formulario = '<div class="form-group" style="text-align: left;"><label id="competencia_titulo">Relatorio</label><select class="form-control" id="relatorio_selecionar_formulario" onchange="mudar_relatorio_modal(this.value)"><option value="1">Vendas por representante</option><option value="10">Acompanhamento do representante</option><option value="21">Negociações futuras</option><option value="22">Acompanhamento Walther</option></select></div>';
    formulario += '<div class="form-group" style="text-align: left;" id="unidade_selecionar_formulario_div"><label>Unidade fabril</label><select class="form-control" id="unidade_selecionar_formulario" ><option value="0">Todas</option><option value="000001">Instalações</option><option value="000002">Congeladores</option><option value="000003">Câmaras</option></select></div>';  
    formulario += '<div class="form-group" style="text-align: left;display:none;" id="status_relatorio_acompanhamento_div"><label>Status</label><select class="form-control" id="status_relatorio_acompanhamento_filtro"><option value="T">Todos</option><option value="0">Normal</option><option value="1">Remarcado</option><option value="2">Perdido - congeladores</option><option value="0-2">Vendido</option><option value="1-2">Perdido - câmaras/instalação</option><option value="2-2">Desistência</option><option value="3-2">Suspenso</option><option value="4-2">Negociação diretoria</option><option value="5-2">Previsão de negociação</option></select></div>'; 
    formulario += '<div id="acumulativo_relatorio_1"><div class="form-group" style="text-align: left;"><label id="competencia_titulo">Acumulativo?</label><select class="form-control" id="acumulativo_selecionar_formulario" onchange="formulario_relatorio(this.value)"><option value="0">Não</option><option value="1">Sim</option></select></div>'+select_acumulativo+'</div>';
    formulario += '<div class="form-group" style="text-align: left;" id="competencia_select_formulario_presente"><label id="competencia_titulo_valor">Competencia</label><select class="form-control" id="competencia_selecionar_formulario">'+option_datas+'</select></div>';
    
    formulario += '<div class="form-group" style="text-align: left;display:none;" id="data_negociacao_relatorio_acompanhamento_div"><label>Referencia</label><select class="form-control" id="data_futuras_negociacaos">'+option_datas_futuras+'</select></div>';

    Swal.fire({
        title: 'Impressão de relatorio',
        html: formulario,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Imprimir',
        cancelButtonText: 'Cancelar',
        preConfirm: function(){
            
            return new Promise((resolve, reject) => {

                var tipo_relatorio = $('#relatorio_selecionar_formulario').val();
                var competencia = $('#competencia_selecionar_formulario').val();
                var acumulativo = $('#acumulativo_selecionar_formulario').val();
                var acumulativo_competencia = $('#acumulativo_valor_selecionar_formulario').val();
                var unidade_fabril = $('#unidade_selecionar_formulario').val();
                var gerente = $('#filtro_gerente').val();
                var status_filtro = $('#status_relatorio_acompanhamento_filtro').val();

                var string = tipo_relatorio+'_'+status_filtro;

                if(tipo_relatorio == "21"){
                    string = tipo_relatorio;
                    competencia = $('#data_futuras_negociacaos').val();
                }

                window.open('pdf/'+string+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+unidade_fabril+'/'+gerente);

            });

        }
    });

}

function formulario_relatorio(valor){
    
    if(valor == "0"){
        $('#select_acumulativo_relatorio').css('display', 'none');
        $('#competencia_titulo_valor').html('Competencia');
    }else{
        $('#select_acumulativo_relatorio').css('display', 'block');
        $('#competencia_titulo_valor').html('De');
    }

}

function abrir_clientes_representante(codigo, qtd){

    var tipo_relatorio = 2;

    if(qtd>0){
        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui clientes agendados para esse mês',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_clientes_novos_representante(codigo, qtd){

    var tipo_relatorio = 3;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui novos clientes para o periodo informado',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_clientes_nao_marcados(codigo, qtd){

    var tipo_relatorio = 4;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui clientes não marcados',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_clientes_atendidos_representante(codigo, qtd){

    var tipo_relatorio = 5;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui clientes atendidos',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_nao_atendidos_representante(codigo, qtd){

    var tipo_relatorio = 6;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui não atendidos',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function cadastrar_acompanhamento(codigo){

    showLoading();
    console.log(codigo);

    $.ajax({
        type: 'POST',
        url: 'cliente_para_atendimento',
        data: {
            id: codigo
        },
        success: function(retorno){

            hideLoading();

            var select_cliente_registro_atendimento = '';
            var select_cliente_registro_captacao = '';
            var select_cliente_registro_negociacao = '';

            for(i=0;i<retorno.data.ATENDIMENTOS.length; i++){
                select_cliente_registro_atendimento += '<option value="'+retorno.data.ATENDIMENTOS[i].codigo+'">'+retorno.data.ATENDIMENTOS[i].nome+'</option>';
            }

            for(i=0;i<retorno.data.CAPTACAO.length; i++){
                select_cliente_registro_captacao += '<option value="'+retorno.data.CAPTACAO[i].codigo+'">'+retorno.data.CAPTACAO[i].nome+'</option>';
            }

            for(i=0;i<retorno.data.NEGOCIACAO.length; i++){
                select_cliente_registro_negociacao += '<option value="'+retorno.data.NEGOCIACAO[i].codigo+'">'+retorno.data.NEGOCIACAO[i].nome+'</option>';
            }

            formulario = '';
            formulario += '<div class="form-group" style="text-align: left;"><label id="competencia_titulo">Registrar para</label><select class="form-control" id="select_tipo_registro_acompanhamento" onchange="select_tipo_registro_acompanhamento(this.value)"><option value="0">Atendimento ao cliente</option><option value="1">Captação</option><option value="2">Negociação</option></select></div>';
            formulario += '<div class="form-group" id="cliente_registro_atendimento"><label id="competencia_titulo" style="float: left;">Cliente</label><select class="form-control select2" id="select_cliente_acompanhamento"><option></option>'+select_cliente_registro_atendimento+'</select>'+'</div>';            
            formulario += '<div class="form-group" id="cliente_registro_captacao" style="display: none;"><label id="competencia_titulo" style="float: left;">Cliente</label><select class="form-control select2" id="select_cliente_acompanhamento_captacao"><option></option>'+select_cliente_registro_captacao+'</select></div>';
            formulario += '<div class="form-group" id="cliente_registro_negociacao" style="display: none;"><label id="competencia_titulo" style="float: left;">Cliente</label><select class="form-control select2" id="select_cliente_acompanhamento_negociacao"><option></option>'+select_cliente_registro_negociacao+'</select></div>';     
            formulario += '<div class="form-group" style="text-align: left;" id="status_acompanhamento_0"><label id="competencia_titulo">Tipo de registro</label><select class="form-control" id="select_tipo_acompanhamento" onchange="select_tipo_acompanhamento_mostrar(this.value)"><option value="0">Normal</option><option value="1">Remarcar</option><option value="2">Perdido</option></select></div>';
            formulario += '<div class="form-group" style="text-align: left;display:none;" id="status_acompanhamento_1"><label id="competencia_titulo">Tipo de registro</label><select class="form-control" id="select_tipo_acompanhamento_1"><option value="0">Normal</option><option value="2">Perdido</option><option value="3">Em atendimento</option></select></div>';
            formulario += '<div class="form-group" style="text-align: left;display:none;" id="status_acompanhamento_2"><label id="competencia_titulo">Tipo de registro</label><select class="form-control" id="select_tipo_acompanhamento_2"><option value="0">Vendido</option><option value="1">Perdido</option><option value="2">Desistência</option><option value="3">Suspenso</option><option value="4">Negociação diretoria</option><option value="5">Previsão de negociação</option></select></div>';
            formulario += '<div class="form-group" style="text-align: left;display:none;" id="valor_data_acompanhamento"><label id="competencia_titulo">Nova data</label><input type="text" id="input_data_acompanhamento" class="form-control"/></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label id="competencia_titulo">Descrição (<span id="cont_caracteres_desc">200</span> Restantes)</label><textarea class="swal2-textarea" id="descricao_cliente_acompanhamento" placeholder="" onkeyup="limite_textarea(this.value)" style="display: flex;margin-top: 0px;"></textarea></div>';

            Swal.fire({
                title: 'Cadastro de acompanhamento',
                html: formulario,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: 'Salvar',
                cancelButtonText: 'Cancelar',
                onOpen: () => {
                    $('#select_cliente_acompanhamento').select2({
                        placeholder: "Selecionar cliente",
                        tags: false
                    });
                    $('#select_cliente_acompanhamento_captacao').select2({
                        placeholder: "Selecionar cliente",
                        tags: false
                    });
                    $('#select_cliente_acompanhamento_negociacao').select2({
                        placeholder: "Selecionar cliente",
                        tags: false
                    });
                    $('#input_data_acompanhamento').datepicker({
                        autoclose: true,
                        format: "mm/yyyy",
                        startView: "months",
                        minViewMode: "months",
                        language: 'pt-BR'
                    });
                }
            }).then((result) => {

                if(result.value){

                    var tipo = $('#select_tipo_acompanhamento').val();
                    var input_data_acompanhamento = $('#input_data_acompanhamento').val();
                    var select_tipo_registro_acompanhamento = $('#select_tipo_registro_acompanhamento').val()

                    if(tipo == "1" && input_data_acompanhamento == ""){

                        Swal.fire({
                            type: 'info',
                            title: 'Nesse tipo, data não pode ser vazia',
                            showCloseButton: true,  
                            showCancelButton: false, 
                            confirmButtonText: 'OK'
                        });

                        return false;
                    }

                    if(input_data_acompanhamento=="" && select_tipo_registro_acompanhamento == "2"){
                        Swal.fire({
                            type: 'info',
                            title: 'Nesse tipo, data não pode ser vazia',
                            showCloseButton: true,  
                            showCancelButton: false, 
                            confirmButtonText: 'OK'
                        });

                        return false;
                    }

                    var descricao = $('#descricao_cliente_acompanhamento').val();
                    var cliente = $('#select_cliente_acompanhamento').val();
                    var cod_captacao = $('#select_cliente_acompanhamento_captacao').val();
                    var cod_negociacao = $('#select_cliente_acompanhamento_negociacao').val();

                    if(cliente == "" && cod_captacao == "" && cod_negociacao == ""){
                        Swal.fire({
                            type: 'info',
                            title: 'Selecione o cliente',
                            showCloseButton: true,  
                            showCancelButton: false, 
                            confirmButtonText: 'OK'
                        });
                        return false;
                    }
                    
                    if(descricao == ""){

                        Swal.fire({
                            type: 'info',
                            title: 'Preencha a descrição',
                            showCloseButton: true,  
                            showCancelButton: false, 
                            confirmButtonText: 'OK'
                        });

                        return false;
                    }

                    showLoading();

                    var data = {
                        cod_captacao: cod_captacao,
                        cliente: cliente,
                        descricao: descricao,
                        vendedor: codigo,
                        tipo: tipo,
                        data_agendamento: input_data_acompanhamento,
                        tipo_registro: $('#select_tipo_registro_acompanhamento').val(),
                        select_tipo_acompanhamento_1: $('#select_tipo_acompanhamento_1').val(),
                        select_tipo_acompanhamento_2: $('#select_tipo_acompanhamento_2').val(),
                        cod_negociacao: cod_negociacao
                    }

                    $.ajax({
                        type: 'POST',
                        url: 'cadastrar_acompanhamento',
                        data: data,
                        success: function(retorno){
                            
                            hideLoading();

                            Swal.fire({
                                type: 'success',
                                title: 'Cadastrado com sucesso',
                                showCloseButton: true,  
                                showCancelButton: false, 
                                confirmButtonText: 'OK'
                            });

                        }
                    });

                }
                

            });
   
        },
        error: function(){
            hideLoading();
            alert('Ocorreu um erro, contate o TI');
        }
    });

}

function mudar_relatorio_modal(valor){

    if(valor == "10"){

        $('#acumulativo_relatorio_1').css('display', 'block');
        $('#unidade_selecionar_formulario_div').css('display', 'none');
        $('#status_relatorio_acompanhamento_div').css('display', 'block');
        $('#data_negociacao_relatorio_acompanhamento_div').css('display', 'none');
        $('#competencia_select_formulario_presente').css('display', 'block');

    }else if(valor == "1"){

        $('#acumulativo_relatorio_1').css('display', 'block');
        $('#unidade_selecionar_formulario_div').css('display', 'block');
        $('#status_relatorio_acompanhamento_div').css('display', 'none');
        $('#data_negociacao_relatorio_acompanhamento_div').css('display', 'none');
        $('#competencia_select_formulario_presente').css('display', 'block');

    }else if(valor == "21"){

        $('#data_negociacao_relatorio_acompanhamento_div').css('display', 'block');
        $('#acumulativo_relatorio_1').css('display', 'none');
        $('#unidade_selecionar_formulario_div').css('display', 'none');
        $('#status_relatorio_acompanhamento_div').css('display', 'none');
        $('#competencia_select_formulario_presente').css('display', 'none');

    }else if(valor == "22"){

        $('#unidade_selecionar_formulario_div').css('display', 'none');
        $('#competencia_select_formulario_presente').css('display', 'none');
        $('#acumulativo_relatorio_1').css('display', 'none');
        $('#status_relatorio_acompanhamento_div').css('display', 'none');

    }

}

function limite_textarea(valor) {
    quant = 200;
    total = valor.length;
    if(total <= quant) {
        resto = quant - total;
        document.getElementById('cont_caracteres_desc').innerHTML = resto;
    } else {
        document.getElementById('descricao_cliente_acompanhamento').value = valor.substr(0,quant);
    }
}

function abrir_orcamentos_portal(codigo, qtd){

    var tipo_relatorio = 11;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui orçamentos cadastrados',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_orcamentos_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 14;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui orçamentos cadastrados',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_projetos_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 15;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui projetos cadastrados',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_vendas_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 16;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui vendas realizadas',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_negociacao_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 17;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui negociações em andamento',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_clientes_reagendados(codigo, qtd){

    var tipo_relatorio = 18;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui clientes reagendados',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function abrir_skype_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 19;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }

        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();
        
        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui registros',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function select_tipo_acompanhamento_mostrar(valor){

    if(valor == "1"){
        $('#valor_data_acompanhamento').css('display', 'block');
    }else{
        $('#valor_data_acompanhamento').css('display', 'none');
    }

}

function filtro_mes_representante(){

    if($('#filtro_acumulativo_value').val() == "1"){
        if($('#filtro_option_value').val()<$('#filtro_acumulativo_mes_value').val()){
            alert('A data de termino não pode ser menor que a de inicio');
            return false;
        }
    }

    showLoading();

    $.ajax({
        type: 'POST',
        url: 'filtrar_dados_representante',
        data: {
            mes: $('#filtro_option_value').val(),
            mes_de: $('#filtro_acumulativo_mes_value').val(),
            acumulativo: $('#filtro_acumulativo_value').val()
        },
        success: function(retorno){
               
            $('#exibicao').html('');
            $('#exibicao').append(retorno.data.VENDEDOR.HTML);
            
            hideLoading(); 

        },
        error: function(retorno){
            
            hideLoading();
            alert('Ocorreu um erro interno, contate o T.I');

        },
        complete: function(){
            montar_grafico_representante(); 
        }
    });

}

function abrir_captacao_instalacoes_camaras(codigo, qtd){

    var tipo_relatorio = 20;

    if(qtd>0){

        var acumulativo = $('#filtro_acumulativo_value').val();

        if(acumulativo == "0"){
            var competencia = $('#filtro_option_value').val();    
            var acumulativo_competencia = $('#filtro_acumulativo_mes_value').val();
        }else{
            var competencia = $('#filtro_acumulativo_mes_value').val();    
            var acumulativo_competencia = $('#filtro_option_value').val();
        }
        
        var filtro_uni_fabril = $('#filtro_uni_fabril').val();
        var gerente = $('#filtro_gerente').val();

        window.open('pdf/'+tipo_relatorio+'/'+codigo+'/'+competencia+'/'+acumulativo_competencia+'/'+acumulativo+'/'+filtro_uni_fabril+'/'+gerente);

    }else{

        Swal.fire({
            title: 'Atenção',
            type: 'info',
            text: 'Não possui captações',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false
        });

    }

}

function select_tipo_registro_acompanhamento(codigo){

    if(codigo == "0"){
        $('#cliente_registro_atendimento').css('display', 'block');
        $('#cliente_registro_captacao').css('display', 'none');
        $('#cliente_registro_negociacao').css('display', 'none');
        $('#status_acompanhamento_0').css('display', 'block');
        $('#status_acompanhamento_1').css('display', 'none');
        $('#status_acompanhamento_2').css('display', 'none');
        $('#valor_data_acompanhamento').css('display', 'none');
    }else if(codigo == "1"){
        $('#cliente_registro_atendimento').css('display', 'none');
        $('#cliente_registro_captacao').css('display', 'block');
        $('#cliente_registro_negociacao').css('display', 'none');
        $('#status_acompanhamento_1').css('display', 'block');
        $('#status_acompanhamento_0').css('display', 'none');
        $('#status_acompanhamento_2').css('display', 'none');
        $('#valor_data_acompanhamento').css('display', 'none');
    }else if(codigo == "2"){
        $('#cliente_registro_atendimento').css('display', 'none');
        $('#cliente_registro_captacao').css('display', 'none');
        $('#cliente_registro_negociacao').css('display', 'block');
        $('#status_acompanhamento_2').css('display', 'block');
        $('#status_acompanhamento_0').css('display', 'none');
        $('#status_acompanhamento_1').css('display', 'none');
        $('#valor_data_acompanhamento').css('display', 'block');
    }

    $('#text_area_select').css('display', 'block');

}

function mudar_filtro_unidade(){

    var id = $('#filtro_gerente').val();

    if(id == "27" || id == "3" || id == "518" || id == "617"){
        $('#filtro_uni_fabril').html('<option value="000002">Congeladores</option>');
    }else if(id == "230"){
        $('#filtro_uni_fabril').html('<option value="000001">Instalações</option>');
    }else if(id == "580"){
        $('#filtro_uni_fabril').html('<option value="000003">Câmaras</option>');
    }else{
        $('#filtro_uni_fabril').html('<option value="0">Todas</option><option value="000001">Instalações</option><option value="000002">Congeladores</option><option value="000003">Câmaras</option>');
    }

}