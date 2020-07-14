$(document).ready(function() {

    $('.select-op').select2({
        placeholder: "Selecionar OP",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false
    });

    $('.select-orcamento').select2({
        placeholder: "Selecionar orçamento",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: 'procurar_orcamento',
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

    

    $('#select-clientes').select2({
        placeholder: "Selecionar cliente",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: 'procurar_cliente',
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

    $('#select-transportadores').select2({
        placeholder: "Selecionar transportador",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: 'procurar_transporte',
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

    $('#select-pedido').select2({
        placeholder: "Selecionar pedido",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: 'procurar_pedido',
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

    $('#select-pedido').on('change', function(){

        showLoading();

        var array_dados = {
            id : this.value
        }
        
        $.ajax({
            type: 'POST',
            url: 'historico_pedido',
            data: array_dados,
            success: function (retorno) {

                $('#title_ultima').css('display', 'block');

                $('#gerar_atualizacoes').html('');
                
                for(i=0; i<retorno.data.length; i++){

                    var arquivo = '';

                    if(retorno.data[i].arquivo != ''){
                        arquivo = ' - <a href="../'+retorno.data[i].arquivo+'" target="_blank">Visualizar arquivo</a>';
                    }
                    
                    $('#gerar_atualizacoes').append('<li><a target="_blank" href="#">'+retorno.data[i].setor+'</a><a href="#" class="float-right"> - '+retorno.data[i].data+'</a><p>'+retorno.data[i].status+''+arquivo+'</p></li>');
                }

                hideLoading();

            }
        });

    });

    $('#select-clientes').on("change", function(e) { 
        
        var array_dados = {
            id : $('#select-clientes').val()
        }

        $.ajax({
            type: 'POST',
            url: 'selecionar_cliente',
            data: array_dados,
            success: function (retorno) {

                if(retorno){

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

                }
                
            },
            error: function () {
                
            }
        })
    
    });

    
    $('#tabelaorcamento').DataTable({
        "processing": true,
        "serverSide": false,
        "ajax": 'listar_pedidos_orcamento', 
        "columns": [
            { "data": "ZCA_NUM" },
            {"data": "cliente" },
            {"data": "data" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(4);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

    $('#tabelajoacir').DataTable({
            "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_joacir', "columns": [
            { "data": "ZCA_NUM" },
            {"data": "cliente" },
            {"data": "data" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(5);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

    $('#tabelafinanceiro').DataTable({
            "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_financeiro', "columns": [
            { "data": "ZCA_NUM" },
            {"data": "cliente" },
            {"data": "data" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(6);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

    var tabelaProjeto = $('#tabelaProjeto').DataTable({
            "processing": true,
            "serverSide": false,
        "ajax": 'listar_arq_projetos', "columns": [
            { "data": "check" },
            { "data": "cod_pedido" },
            {"data": "cliente" },
            {"data": "status" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(2);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

    $('#tabelaVisita').DataTable({
            "processing": true,
            "serverSide": false,
        "ajax": 'listar_visita_tecnica', "columns": [
            { "data": "check" },
            { "data": "cod_pedido" },
            {"data": "cliente" },
            {"data": "status" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(1);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

    $('#tabelaPedido').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos', "columns": [
            { "data": "cod_pedido" },
            { "data": "cliente" },
            {"data": "emissao" },
            {"data": "status" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        }
    });

    $('#tabelafabrica').DataTable({
            "processing": true,
            "serverSide": false,
        "ajax": 'listar_producao', "columns": [
            { "data": "check" },
            { "data": "cod_pedido" },
            {"data": "cliente" },
            {"data": "status" },
            { "data": "acoes" }
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing":   "Processando...",
            "sLengthMenu":   "&nbsp;_MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Seguinte",
                "sLast":     "Último"
            }
        },
        "fnDrawCallback" : function() {
        },
        dom: 'Blfrtip',
        buttons: [
            {
                className: "btn btn-info",
                text: '<i class="far fa-question-circle"></i>',
                titleAttr: 'Clique para obter ajuda',
                action: function ( e, dt, node, config ) {
                    helper_acoes(3);
                },
                init: function(api, node, config) {
                    $(node).removeClass('dt-button');
                }
            }
        ]
    });

});

function campo_valor(valor){

    if(valor == 1){
        if($("#pagamentocli_a").is(":checked")){
            $('#valorcli_a').css('display', 'block');
        }else{
            $('#valorcli_a').css('display', 'none');
        }
    }else if(valor == 2){
        if($("#pagamentocli_b").is(":checked")){
            $('#valorcli_b').css('display', 'block');
        }else{
            $('#valorcli_b').css('display', 'none');
        }
    }

}

function campo_entrega(valor){

    if($("#"+valor).is(":checked")){
        if(valor == "entregacli1"){
            $('#entregadesccli1').css('display', 'block');
        }
    }else{
        if(valor == "entregacli1"){
            $('#entregadesccli1').css('display', 'none');
        }
    }

}

function financeiro_check(clickedid){


    if(document.getElementById(clickedid).checked == false){
    
        document.getElementById(clickedid).checked = true;
    
    }else{

        document.getElementById(clickedid).checked = false;

        Swal.fire({
            title: "Confirmar liberação do pedido?",
            text: "Seremos notificados com essa atualização",
            type: "warning",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(function(result) { 

            if(result.value){

                var string1 = clickedid.split("_");
                var array_dados = {
                    id: string1[0]
                }

                showLoading();

                hideLoading();
                Swal.fire({title: "Confirmado com sucesso", type: "success"});

                document.getElementById(clickedid).checked = true;
                atualizar_tabelas();
                
            }else{
                document.getElementById(clickedid).checked = false;
            }

        });

    }

}

function showLoading() {
    $('.spiner2').css('display', 'block');
}

function hideLoading() {
    $('.spiner2').css('display', 'none');
}

function upload_arquivo(id, tipo){

    Swal.fire({
        title: "Upload de arquivo",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: '<form id="formulario1" method="post" enctype="multipart/form-data"><div class="form-group"><input type="file" name="file" class="form-control" id="file" /></div>',
        preConfirm: function() {
            return new Promise((resolve, reject) => {

                if($('input[name="file"]')[0].files[0] != "undefined"){

                    var formData = new FormData();
                    formData.append('file', $('input[name="file"]')[0].files[0]);
                    formData.append('id', id);
                    formData.append('tipo', tipo);

                    resolve({
                        arquivo : formData
                    });

                }else{
                    return false;
                }
            
            });
        }
    }).then(function(result){ 

        if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close" && result.value.arquivo.get('file') != "undefined"){

            showLoading();

            $.ajax({
                url: 'upload_arquivo',
                type: 'POST',
                data: result.value.arquivo,
                success: function(data) {
                    
                    hideLoading();
                    Swal.fire({title: "Enviado com sucesso", type: "success"});
                    atualizar_tabelas();

                },
                cache: false,
                contentType: false,
                processData: false,
                xhr: function() { // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                        myXhr.upload.addEventListener('progress', function() {
                            /* faz alguma coisa durante o progresso do upload */
                        }, false);
                    }
                    return myXhr;
                }
            });

        }else if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close" && result.value.arquivo.get('file') == "undefined"){

            Swal.fire({
                type: "error",
                title: "Favor selecionar um arquivo",
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "OK"
            });

        }
    
    });

}

function arquivo_view(id){

    Swal.fire({
        title: "Arquivos do projeto",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        focusConfirm: false,
        buttons: false,
        html: '<br /><a href="" target="_blank"><i class="fa fa-fw fa-file"></i> Visualizar</a>'
    }).then(function(result) { 
    
    });

}

function confirmar_producao(id){
    
    Swal.fire({
        title: "Confirmar envio a produção?",
        text: "Seremos notificados com essa atualização",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
     }).then(function(result) { 

        if(result.value){

            showLoading();

            var array_dados = {
                id : id
            }
            
            $.ajax({
                type: 'POST',
                url: 'confirmar_producao',
                data: array_dados,
                success: function(retorno){

                },
                error: function(){
                    
                },
                complete: function(data){
                    hideLoading();
                    Swal.fire({title: "Enviado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }
    
    });

}

function visita_enviar_view(id){
    
    Swal.fire({
        title: "Enviar arquivos",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: '<div class="form-group" style="text-align: left !important;"><label for="exampleInputEmail1">E-mail técnico</label><input type="email" class="form-control" id="email_tecnico"/></div><div class="form-group" style="text-align: left !important;"><label for="exampleInputEmail1">E-mail cliente</label><input type="email" class="form-control" id="email_cliente"/></div>',
        preConfirm: function() {
            return new Promise((resolve, reject) => {

                var email_cliente = $('#email_cliente').val();
                var email_tecnico = $('#email_tecnico').val();

                resolve({
                    email_cliente : email_cliente,
                    email_tecnico : email_tecnico
                });

            });
        }
    }).then(function(result) { 

        if(result.value){

            showLoading();

            var array_dados = {
                id : id,
                email_cliente : result.value.email_cliente,
                email_tecnico : result.value.email_tecnico
            }
            
            $.ajax({
                type: 'POST',
                url: 'envia_doc_assistencia',
                data: array_dados,
                success: function(retorno){

                },
                error: function(){
                    
                },
                complete: function(data){
                    hideLoading();
                    Swal.fire({title: "Enviado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }
    
    });

}

function producao_check(clickedid){

    if(document.getElementById(clickedid).checked == false){
    
        document.getElementById(clickedid).checked = true;
    
    }else{

        document.getElementById(clickedid).checked = false;

        Swal.fire({
            title: "Confirmar inicio da produção do pedido?",
            text: "Seremos notificados com essa atualização",
            type: "warning",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(function(result) { 

            if(result.value){

                var string1 = clickedid.split("_");
                var array_dados = {
                    id: string1[0]
                }

                showLoading();

                hideLoading();
                Swal.fire({title: "Confirmado com sucesso", type: "success"});

                /*$.ajax({
                    type: 'POST',
                    url: 'confirma_producao',
                    data: array_dados,
                    success: function (retorno) {

                    },
                    error: function () {
                        
                    },
                    complete: function (data) {
                        hideLoading();
                        Swal.fire({title: "Enviado com sucesso", type: "success"});
                    }
                });*/

                document.getElementById(clickedid).checked = true;
                 atualizar_tabelas();

            }else{

                document.getElementById(clickedid).checked = false;

            }

        });

    }


}

//TODO | Enviar o formulario para cadastrar o pedido
function enviar_form_pedido(){

    showLoading();

    var formulario = $('#form_pedido_camara').serializeArray();
    var data2 = {};
    var form = new FormData();

    $(formulario).each(function(index, obj){
        data2[obj.name] = obj.value;
        form.append(obj.name, obj.value);
    });
    
    if(data2.cliente_id == undefined){
        Swal.fire({title: "Campo Cliente é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if(data2.data_entrega == "" || data2.data_entrega == null){
        Swal.fire({title: "Prazo de entrega é obrigatoria", type: "info"});
        hideLoading();
        return false;
    }else if(data2.transportador_id == undefined){
        Swal.fire({title: "Transportador é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if(data2.select_vendedores == undefined){
        Swal.fire({title: "Vendedor é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if(data2.nr_orcamento == null || data2.nr_orcamento == ""){
        Swal.fire({title: "Nº Orçamento é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if(data2.nr_projeto == null || data2.nr_projeto == ""){
        Swal.fire({title: "Nº Projeto é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if(data2.data_assinatura == null || data2.data_assinatura == ""){
        Swal.fire({title: "Data de assinatura é obrigatorio", type: "info"});
        hideLoading();
        return false;
    }else if($('input[name="file1"]')[0].files[0] == undefined){

        Swal.fire({title: "Arquivo é obrigatorio", type: "info"});
        hideLoading();
        return false;

    }

    form.append('fileUpload', $('input[name="file1"]')[0].files[0]); 

    console.log(...form);
    
    $.ajax({
        type: 'POST',
        url: 'submit_camara',
        data: form,
        processData: false,
        contentType: false,
        success: function(retorno){

            hideLoading();

            if(!retorno.sucesso){

                Swal.fire({
                    title: "Ocorreu um erro", 
                    text: retorno.msg, 
                    type: "error"
                });

            }else{

                Swal.fire({
                    title: "Enviado com sucesso", 
                    text: "Um e-mail foi enviado com o pedido em anexo.",
                    type: "success"
                }).then(function(result){});

                $('#form_pedido_camara').each (function(){
                    this.reset();
                });

                atualizar_tabelas();

            }

        },
        error: function(data){

            hideLoading();
            
            Swal.fire({
                title: "Ocorreu um erro", 
                text: data.responseJSON.msg, 
                type: "error"
            });

        }
    });

}

//Todo | Apenas acerta as casas decimais do numero
function moeda(a, e, r, t) {
    let n = ""
      , h = j = 0
      , u = tamanho2 = 0
      , l = ajd2 = ""
      , o = window.Event ? t.which : t.keyCode;
    if (13 == o || 8 == o)
        return !0;
    if (n = String.fromCharCode(o),
    -1 == "0123456789".indexOf(n))
        return !1;
    for (u = a.value.length,
    h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
        ;
    for (l = ""; h < u; h++)
        -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
    if (l += n,
    0 == (u = l.length) && (a.value = ""),
    1 == u && (a.value = "0" + r + "0" + l),
    2 == u && (a.value = "0" + r + l),
    u > 2) {
        for (ajd2 = "",
        j = 0,
        h = u - 3; h >= 0; h--)
            3 == j && (ajd2 += e,
            j = 0),
            ajd2 += l.charAt(h),
            j++;
        for (a.value = "",
        tamanho2 = ajd2.length,
        h = tamanho2 - 1; h >= 0; h--)
            a.value += ajd2.charAt(h);
        a.value += r + l.substr(u - 2, u)
    }
    return !1
}

function confirmar_orcamento(id){

    Swal.fire({
        title: "Confirmar orçamento do pedido?",
        text: "Seremos notificados com essa atualização",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function(result) { 

        if(result.value){

            var array_dados = {
                id: id
            }

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'confirma_orcamento',
                data: array_dados,
                success: function (retorno) {

                },
                error: function () {
                    
                },
                complete: function (data) {
                    hideLoading();
                    Swal.fire({title: "Atualizado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }

    });

}

function joacir_libera(id){

    Swal.fire({
        title: "Confirmar liberação do pedido?",
        text: "Seremos notificados com essa atualização",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function(result) { 

        if(result.value){

            var array_dados = {
                id: id
            }

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'confirma_joacir',
                data: array_dados,
                success: function (retorno) {

                },
                error: function () {
                    
                },
                complete: function (data) {
                    hideLoading();
                    Swal.fire({title: "Atualizado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }

    });

}

function financeiro_libera(id){

    html = '<label for="exampleInputEmail1" style="float: left;">Status da liberação</label><select class="form-control" id="select_finalidade"><option value="1">Liberado</option><option value="2">Liberado com pendencia embarque</option><option value="3">Recusado</option></select>';

    Swal.fire({
        title: "Confirmar liberação do pedido?",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: html
    }).then(function(result) { 

        if(result.value){

            var array_dados = {
                id: id,
                financeiro_status : $('#select_finalidade').val()
            }

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'confirma_financeiro',
                data: array_dados,
                success: function (retorno) {

                },
                error: function () {
                    
                },
                complete: function (data) {
                    hideLoading();
                    Swal.fire({title: "Atualizado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }

    });

}

function helper_acoes(number){

    var texto_html = '';

    texto_html += '<p><i class="fas fa-eye"></i> Visualizar o pedido.</p><br/>';
    texto_html += '<p><i class="far fa-folder-open"></i> Clique nesse icone para visualizar quais arquivos já foram anexados</p>';

    if(number == 2){

        //Projetos
        texto_html += '<p><i class="far fa-lightbulb"></i> Inserir as informações sobre maquinario e rede eletrica.</p><br/>';
        texto_html += '<p><i class="fa fa-upload"></i> Quando clicar nessa ação, você deverá fazer o upload de um arquivo que será: o projeto, ou lista de peças ou ficha startup.</p><br/>';
        texto_html += '<p><i class="fas fa-file-download"></i> Clicar aqui para baixar a ficha startup.</p><br/>';
        texto_html += '<p><i class="fas fa-industry"></i> Essa ação, fará com que o pedido sejá encaminhado para o setor de produção.</p><br/>';
       

        texto_html += '<p><i class="fa fa-circle pend1"></i> Ações que estão dependente de você</p>';
        texto_html += '<p><i class="fa fa-circle pend2"></i> Ação que depende de você e um terceiro</p>';
        texto_html += '<p><i class="fa fa-circle pend3"></i> Seu processo foi finalizado</p>';
        
    }else if(number == 1){

        //Assistenia tecnica
        texto_html += '<p><i class="fa fa-upload"></i> Quando clicar nesse botão, você deverá fazer o upload do arquivo de OS.</p><br/>';
        texto_html += '<p><i class="far fa-paper-plane"></i> Enviara para o e-mail do tecnico os arquivos para a visita.</p><br/>';
        texto_html += '<p><i class="fa fa-download"></i> Nesse botão você colocara os arquivos que o tecnico respondeu no e-mail.</p><br/>';
     

        texto_html += '<p><i class="fa fa-circle pend1"></i> Ações que estão dependente de você</p>';
        texto_html += '<p><i class="fa fa-circle pend2"></i> Ação que depende de você e um terceiro</p>';
        texto_html += '<p><i class="fa fa-circle pend3"></i> Seu processo foi finalizado</p>';

    }else if(number == 3){

        //Fabrica
        texto_html += '<p><i class="far fa-calendar-plus"></i> Informar as datas de entrega do isolamento de piso e tubulação da maquina.</p><br/>';
        

        texto_html += '<p><i class="fa fa-circle pend1"></i> Ações que estão dependente de você</p>';
        texto_html += '<p><i class="fa fa-circle pend2"></i> Ação que depende de você e um terceiro</p>';
        texto_html += '<p><i class="fa fa-circle pend3"></i> Seu processo foi finalizado</p>';

    }else if(number == 4){

        //Orçamentos
        texto_html += '<p><i class="fas fa-calculator"></i> Confirmar orçamento.</p><br/>';

    }else if(number == 5){

        //Engenharia
        texto_html += '<p><i class="fas fa-cogs"></i> Confirmar projeto.</p><br/>';

    }else if(number == 6){

        //Financeiro
        texto_html += '<p><i class="far fa-money-bill-alt"></i> Confirmar financeiro.</p><br/>';

    }

    

    

    Swal.fire({
        title: "Ações",
        html : texto_html,
        type: 'info',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "OK"
    });

}

//TODO | Informa as datas para as entregas antecipdadas
function informar_datas(id){

    showLoading();

    var array_dados = {
        id : id
    }

    $.ajax({
        type: 'POST',
        url: 'verificar_entregas',
        data: array_dados,
        complete: function (data) {

            console.log(data.responseJSON.data);

            hideLoading();

            var html = '';

            if(data.responseJSON.data.ZCA_VLRISO != "0.0"){
                html += '<div class="form-group"><label for="exampleInputEmail1" style="float: left;">Isolamento do piso</label><input type="date" class="form-control" placeholder="Digite a data" id="isopiso"/></div>';
            }

            if(data.responseJSON.data.ZCA_VLRTUB != "0.0"){
                html += '<div class="form-group"><label for="exampleInputEmail1" style="float: left;">Tubulação da maquina</label><input type="date" class="form-control" placeholder="Digite a data" id="tubdata"/></div>';
            }

            if(html != ''){

                Swal.fire({
                    title: "Cronograma de entrega",
                    html: html,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar",
                    preConfirm: function() {
                        return new Promise((resolve, reject) => {

                            var data_isolamento = $('#isopiso').val();
                            var data_tubulacao = $('#tubdata').val();

                            resolve({
                                data_isolamento : data_isolamento,
                                data_tubulacao : data_tubulacao
                            });

                        });
                    }
                }).then(function(result) { 

                    if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

                        var array_dados = {
                            id: id,
                            data_isolamento : result.value.data_isolamento,
                            data_tubulacao : result.value.data_tubulacao
                        }

                        showLoading();

                        $.ajax({
                            type: 'POST',
                            url: 'informa_datas',
                            data: array_dados,
                            success: function (retorno) {

                            },
                            error: function () {
                                
                            },
                            complete: function (data) {
                                hideLoading();
                                Swal.fire({title: "Atualizado com sucesso", type: "success"});
                                atualizar_tabelas();
                            }
                        });

                    }

                });

            }else{

                Swal.fire({
                    title: "Atenção",
                    text: "Não possui pagamentos do cliente",
                    type: "info"
                });

            }

        }
    });

}

//TODO | Visuaizar ficha startup
function visualizar_ficha_startup(id){

    window.open('startup/'+id);

}

//TODO | Visuaiza o pedido em forma de LDF
function visualizar_pedido(id){

    window.open('pdf_pedido/'+id);

}

//TODO | Atualiza os registros do datatable
function atualizar_tabelas(){

    $('#tabelaProjeto').DataTable().ajax.reload();
    $('#tabelaPedido').DataTable().ajax.reload();
    $('#tabelafinanceiro').DataTable().ajax.reload();
    $('#tabelaFinanceiro2').DataTable().ajax.reload();
    $('#tabelaVisita').DataTable().ajax.reload();
    $('#tabelafabrica').DataTable().ajax.reload();
    $('#tabelaorcamento').DataTable().ajax.reload();
    $('#tabelajoacir').DataTable().ajax.reload();

}

function baixar_orcamento(){

    var nr = $('#nr_orcamento').val();
    
    if(nr != null){
        
        window.open("excell/"+nr, "_blank");

    }else{

        Swal.fire({title: "Favor selecionar um orçamento", type: "info"});

    }

}

function folder_open(id){

    showLoading();

    var array_dados = {
        id : id
    }

    $.ajax({
        type: 'POST',
        url: 'folder_open',
        data: array_dados,
        complete: function (data) {

            hideLoading();

            Swal.fire({
                title: "Checklist",
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                focusConfirm: false,
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                html: data.responseJSON.html
            });

        }
    });

}

function inserir_informacoes(id){

    var array_dados = {
        id : id
    }

    var antecipadas = '';
    antecipadas = '<tr><td align="left" style="width: 50%;"><input type="checkbox" class="form-check-input" name="pagamentocli[]" id="pagamentocli_a" value="A" onchange="campo_valor(1);"/><label class="form-check-label" for="exampleCheck1">Isolamento do piso</label></td><td id="valorcli_a" style="display: none;"><input type="text" class="form-control" id="pagamento_a" name="valorpagamentocli[]" onKeyPress="return(moeda(this,'+"'.'"+','+"','"+',event))" placeholder="Digite o valor" /></td></tr>';
    antecipadas += '<tr><td align="left" style="width: 50%;"><input type="checkbox" class="form-check-input" name="pagamentocli[]" id="pagamentocli_b" value="B" onchange="campo_valor(2);"/><label class="form-check-label" for="exampleCheck1">Tubulação de cobre</label></td><td id="valorcli_b" style="display: none;"><input type="text" class="form-control" id="pagamento_b" name="valorpagamentocli[]" onKeyPress="return(moeda(this,'+"'.'"+','+"','"+',event))" placeholder="Digite o valor" /></td></tr>';
    var sting_antecipadas = '<center><h5 class="display-4">Pagamentos do cliente</h5></center><center><table>'+antecipadas+'</table></center>';

    var html_teste = '<div class="form-group"><label for="exampleInputEmail1">Instalação Elétrica</label><select class="form-control" name="instalacao" id="instalacao_select" required><option value="M">Monofasico</option><option value="T">Trifasico</option></select></div>';
    html_teste += '<div class="form-group"><label for="exampleInputEmail1">Voltagem</label><select class="form-control" name="voltagem" id="voltagem_select" required><option value="1">127 V</option><option value="2">220 V</option><option value="3">380 V</option></select></div>'+sting_antecipadas;

    Swal.fire({
        title: "Informarções complementares",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: html_teste,
        preConfirm: function(){

            return new Promise((resolve, reject) => {

                var voltagem_select = $('#voltagem_select').val();
                var instalacao_select = $('#instalacao_select').val();
                var pagamento_a = $('#pagamento_a').val();
                var pagamento_b = $('#pagamento_b').val();

                resolve({
                    voltagem_select : voltagem_select,
                    instalacao_select : instalacao_select,
                    pagamento_a : pagamento_a,
                    pagamento_b : pagamento_b
                });

            });

        }
    }).then(function(result){ 

        if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

            var array_dados = {
                id: id,
                voltagem_select : result.value.voltagem_select,
                instalacao_select : result.value.instalacao_select,
                pagamento_a : result.value.pagamento_a,
                pagamento_b : result.value.pagamento_b
            }

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'info_complementares',
                data: array_dados,
                success: function (retorno) {

                },
                error: function () {
                    
                },
                complete: function (data) {
                    console.log(data);
                    hideLoading();
                    Swal.fire({title: "Atualizado com sucesso", type: "success"});
                    atualizar_tabelas();
                }
            });

        }

    });

}

function baixar_csv_vendido(id){

    showLoading();

    var array_dados = {
        id: id
    }

    $.ajax({
        type: 'GET',
        url: 'baixar_csv_vendido',
        data: array_dados,
        success: function (retorno) {

        },
        error: function () {
            
        },
        complete: function (data) {

            hideLoading();
           
            if(data.responseJSON.sucesso){
                window.open('../'+data.responseJSON.caminho);
            }else{
                Swal.fire({title: "Não foi possivel encontrar o arquivo.", type: "warning"});
            }

        }
    });

}

function baixar_tecnico(id){

    showLoading();

    var array_dados = {
        id: id
    }

    $.ajax({
        type: 'GET',
        url: 'baixar_tecnico',
        data: array_dados,
        success: function (retorno) {

        },
        error: function () {
            
        },
        complete: function (data) {

            hideLoading();
           
            if(data.responseJSON.sucesso){
                window.open('../'+data.responseJSON.caminho);
            }else{
                Swal.fire({title: "Não foi possivel encontrar o arquivo.", type: "warning"});
            }

        }
    });

}

function editar_cliente(id){

    showLoading();

    var array_dados = {
        id: id
    }

    $.ajax({
        type: 'POST',
        url: 'editar_cliente_view',
        data: array_dados,
        success: function (retorno) {

        },
        error: function () {
            
        },
        complete: function (data) {

            hideLoading();
            console.log(data);
            var result = data.responseJSON.data;
            console.log(result);

            var formulario = "";
            formulario += '<div class="form-group" style="text-align: left;"><label for="cpf_cnpj" class="control-label">CPF/CNPJ</label><input type="text" value="'+result.A1_CGC+'" class="form-control" id="cpf_cnpj" name="cpf_cnpj" placeholder="Informe o CPF ou CNPJ..." required></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="razao_social" class="control-label">Nome/Razão Social</label><input type="text" value="'+result.A1_NOME+'" class="form-control" id="razao_social" name="razao_social" placeholder="Informe a razão social..." maxlength="40" required></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="nome_fantasia" class="control-label">Fantasia</label><input type="text" value="'+result.A1_NREDUZ+'" class="form-control" id="nome_fantasia" name="nome_fantasia" placeholder="Informe o nome fantasia..." maxlength="28" required></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="nome_fantasia" class="control-label">CEP</label><input type="text" value="'+result.A1_CEP+'" class="form-control" name="cep" required /></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="nome_fantasia" class="control-label">Endereço</label><input type="text" value="'+result.A1_END+'" class="form-control" name="endereco" required /></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="nome_fantasia" class="control-label">Bairro</label><input type="text" value="'+result.A1_BAIRRO+'" class="form-control" name="bairro" required /></div>';
            formulario += '<div class="form-group" style="text-align: left;"><label for="nome_fantasia" class="control-label">E-mail</label><input type="text" value="'+result.A1_EMAIL+'" class="form-control" name="email" required /></div>';

            Swal.fire({
                title: "Edição do cliente - "+id,
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                html: '<form id="formulario1edit" method="post" enctype="multipart/form-data">'+formulario+'</form>',
                preConfirm: function() {
                    return new Promise((resolve, reject) => {

                        var formulario = $('#formulario1edit').serializeArray();
                        var data2 = {};

                        $(formulario).each(function(index, obj){
                            console.log(obj);
                            data2[obj.name] = obj.value;
                        });

                        data2.id = array_dados.id;
                        
                        resolve({
                            formulario : data2
                        });

                    
                    });
                }
            }).then(function(result){

                if(result.dismiss!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

                    showLoading();

                    $.ajax({
                        type: 'POST',
                        url: 'editar_cliente_camara',
                        data: result,
                        success: function (retorno) {
                            console.log(retorno);
                        },
                        error: function () {
                            
                        },
                        complete: function (data) {

                            hideLoading();

                            console.log(data);
                        
                            if(data.responseJSON.sucesso){
                                Swal.fire({title: "Atualizado com sucesso", type: "success"});
                            }else{
                                Swal.fire({title: "Ocorreu um erro ao atualizar o pedido.", type: "warning"});
                            }

                        }
                    });

                }

            });

        }
    });

}

function editar_pedido(id){

    showLoading();

    var array_dados = {
        id: id
    }

    $.ajax({
        type: 'POST',
        url: 'editar_pedido_view',
        data: array_dados,
        success: function (retorno) {

        },
        error: function () {
            
        },
        complete: function (data) {

            hideLoading();

            var result = data.responseJSON.pedido;
            console.log(result);

            var parcelas = '';
            for(i=1; i<11; i++){

                var valor = '';
                var data = '';
                var forma = '';

                if(i==1){
                    data = result.ZCA_DATA1.trim();
                    valor = result.ZCA_PARC1.trim();
                    forma = result.ZCA_FORMP1.trim();
                }else if(i==2){
                    data = result.ZCA_DATA2.trim();
                    valor = result.ZCA_PARC2.trim();
                    forma = result.ZCA_FORMP2.trim();
                }else if(i==3){
                    data = result.ZCA_DATA3.trim();
                    valor = result.ZCA_PARC3.trim();
                    forma = result.ZCA_FORMP3.trim();
                }else if(i==4){
                    data = result.ZCA_DATA4.trim();
                    valor = result.ZCA_PARC4.trim();
                    forma = result.ZCA_FORMP4.trim();
                }else if(i==5){
                    data = result.ZCA_DATA5.trim();
                    valor = result.ZCA_PARC5.trim();
                    forma = result.ZCA_FORMP5.trim();
                }else if(i==6){
                    data = result.ZCA_DATA6.trim();
                    valor = result.ZCA_PARC6.trim();
                    forma = result.ZCA_FORMP6.trim();
                }else if(i==7){
                    data = result.ZCA_DATA7.trim();
                    valor = result.ZCA_PARC7.trim();
                    forma = result.ZCA_FORMP7.trim();
                }else if(i==8){
                    data = result.ZCA_DATA8.trim();
                    valor = result.ZCA_PARC8.trim();
                    forma = result.ZCA_FORMP8.trim();
                }else if(i==9){
                    data = result.ZCA_DATA9.trim();
                    valor = result.ZCA_PARC9.trim();
                    forma = result.ZCA_FORMP9.trim();
                }else if(i==10){
                    data = result.ZCA_DATAA.trim();
                    valor = result.ZCA_PARCA.trim();
                    forma = result.ZCA_FORMVA.trim();
                }

                if(data.trim() != ''){
                    var data1 = data.substr(0, 4)+'-'+data.substr(4, 2)+'-'+data.substr(6, 2);
                    data = data1;
                }
                
                valor = Format.preco(valor);
                valor1 = valor.split(" ");
                valor = valor1[1];
                
                if(forma == '10'){
                    forma = '<select class="form-control" style="border-radius: 0px;"  name="forma_compra_'+i+'"required><option value="10">A vista</option><option value="20">A prazo</option><option value="30">Financiamento</option></select>';
                }else if(forma == '20'){
                    forma = '<select class="form-control" style="border-radius: 0px;"  name="forma_compra_'+i+'"required><option value="20">A prazo</option><option value="10">A vista</option><option value="30">Financiamento</option></select>';
                }else if(forma == '30'){
                    forma = '<select class="form-control" style="border-radius: 0px;"  name="forma_compra_'+i+'"required><option value="30">Financiamento</option><option value="20">A prazo</option><option value="10">A vista</option></select>';
                }else{
                    forma = '<select class="form-control" style="border-radius: 0px;"  name="forma_compra_'+i+'"required><option value="">--- selecionar ---</option><option value="20">A prazo</option><option value="10">A vista</option><option value="30">Financiamento</option></select>';
                }

                parcelas += '<tr><td style="padding: 0px;">'+forma+'</td><td style="padding: 0px;"><input type="date" data-date-format="dd/mm/yyyy" style="border-radius: 0px;" value="'+data+'" class="form-control formdatamask_'+i+'" placeholder="Data"  name="data_compra_'+i+'"/></td><td style="padding: 0px;"><input type="text" style="border-radius: 0px;" value="'+valor+'" onKeyPress="return(moeda(this, '+"'.'"+', '+"','"+',event))" class="form-control" placeholder="Valor" name="valor_compra_'+i+'"/></td></tr>';
               

            }

            var nr_projeto = result.ZCA_NUMPR;
            var nr_orcamento = result.ZCA_NUM2;
            var dt_assinado = result.ZCA_DTLANC;
            var nr_pedido = result.ZCA_OBRA;
            var cliente = result.ZCA_CLIENT;


            if(dt_assinado.trim() != ''){
                var dt_assinado = dt_assinado.substr(0, 4)+'-'+dt_assinado.substr(4, 2)+'-'+dt_assinado.substr(6, 2);
            }

            var cliente = '<div class="jumbotron" style="font-size: 12px !important;padding: 15px;border-radius: 0px;text-align:left;" id="dadoscli"><div class="col-md-6"><p><b>Nome:</b> '+result.cliente.A1_NOME+'</p><p><b>Email:</b> '+result.cliente.A1_EMAIL+'</p><p><b>Inscrição Estadual:</b> '+result.cliente.A1_INSCR+'</p><p><b>CNPJ:</b> '+result.cliente.A1_CGC+'</p><p><b>Tipo:</b> '+result.cliente.A1_TIPO+'</p><p><b>Múnicipio:</b> '+result.cliente.A1_MUN+'</p></div><div class="col-md-6" style="display: contents;"><p><b>Pessoa:</b> '+result.cliente.A1_PESSOA+'</p><p><b>Segmento:</b> '+result.cliente.A1_SATIV1+'</p><p><b>Telefone:</b> '+result.cliente.A1_TEL+'</p><p><b>Rua:</b> '+result.cliente.A1_END+'</p><p><b>Bairro:</b> '+result.cliente.A1_BAIRRO+'</p><p><b>Estado:</b> '+result.cliente.A1_EST+'</p></div></div>';

            result1 = '<label for="exampleInputEmail1">Forma de pagamento</label><table class="table table-bordered"><tr><td>Forma</td><td>Data</td><td>Valor</td></tr><tbody>' + parcelas + '</tbody></table>';
            var ZCA_OBSERV = '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Observações do pedido</label><textarea id="observacao_edit" class="form-control" rows="3" name="observacao" style="resize: none;" maxlength="250">'+result.ZCA_OBSERV+'</textarea></div></div>';
            ZCA_OBSERV += '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Observações da entrega</label><textarea id="observacao_entrega_edit" class="form-control" rows="3" name="observacao_entrega_edit" style="resize: none;" maxlength="250">'+result.ZCA_OBSTRA+'</textarea></div></div>';
            ZCA_OBSERV += '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Observações de instalação</label><textarea id="observacao_instalacao_edit" class="form-control" rows="3" name="observacao_instalacao_edit" style="resize: none;" maxlength="250">'+result.ZCA_OBSINS+'</textarea></div></div><div class="form-group" style="text-align: left;">'+result1+'</div>';

            var num_proj = '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Nº Projeto</label><input value="'+nr_projeto+'" class="form-control" placeholder="Nº projeto" name="nr_projeto_edit" maxlength="6" /></div>';
            var num_orca = '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Nº Orçamento</label><input value="'+nr_orcamento+'" class="form-control" placeholder="Nº orcamento" name="nr_orcamento_edit" maxlength="6"/></div>';
            var num_pedido = '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Nº Pedido</label><input value="'+nr_pedido+'" class="form-control" placeholder="Nº pedido" name="nr_pedido_edit" maxlength="6"/></div>';

            var html = ZCA_OBSERV;

            html += '<div class="form-group" style="text-align: left;"><label for="exampleInputEmail1">Prazo de entrega (saída da fábrica, em dias)</label><input type="text" value="'+result.ZCA_DTPRVF+'" maxlength="3" class="form-control" name="data_saida" id="data_saida"/></div>';
            html += '<div class="form-group" style="text-align: left;"><label for="data_assinatura" class="control-label">Data assinatura do pedido</label><input type="date" data-date-format="dd/mm/yyyy" value="'+dt_assinado+'" class="form-control formdatamask" placeholder="Data de assinatura"  name="data_assinatura"/></div>';

            Swal.fire({
                title: "Edição pedido - "+id,
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                customClass: 'swal-wide',
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                html: '<form id="formulario1edit" method="post" enctype="multipart/form-data">'+cliente+num_pedido+num_proj+num_orca+html+'</form>',
                preConfirm: function() {
                    return new Promise((resolve, reject) => {

                        var formulario = $('#formulario1edit').serializeArray();
                        var data2 = {};

                        $(formulario).each(function(index, obj){
                            console.log(obj);
                            data2[obj.name] = obj.value;
                        });

                        data2.id = array_dados.id;
                        
                        resolve({
                            formulario : data2
                        });

                    
                    });
                }
            }).then(function(result){

                if(result.dismiss!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

                    showLoading();

                    $.ajax({
                        type: 'POST',
                        url: 'editar_pedido_camara',
                        data: result,
                        success: function (retorno) {
                            console.log(retorno);
                        },
                        error: function () {
                            
                        },
                        complete: function (data) {

                            hideLoading();

                            console.log(data);
                        
                            if(data.responseJSON.sucesso){
                                 Swal.fire({title: "Atualizado com sucesso", type: "success"});
                            }else{
                                Swal.fire({title: "Ocorreu um erro ao atualizar o pedido.", type: "warning"});
                            }

                        }
                    });

                }

            });

        }
    });

}