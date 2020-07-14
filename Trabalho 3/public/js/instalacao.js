$(document).ready(function(){

    $('#select-pedidos-busca').select2({
        placeholder: "Selecionar pedido",
        language: 'pt-BR',
        minimumInputLength: 1,
        tags: false,
        ajax: {
            url: '../instalacao/procurar_pedido_combobox',
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

    $('#tabelaPcp').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_pcp', "columns": [
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

   $('#tabelaPedido').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos', "columns": [
            { "data": "cod_pedido" },
            { "data": "cliente" },
            {"data": "emissao" },
            {"data": "status" }
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

    $('#tabelaAssistencia').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_assistencia', "columns": [
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

    $('#tabelaProjetos').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_projetos', "columns": [
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

    $('#tabelaFinanceiro').DataTable({
        "processing": true,
            "serverSide": false,
        "ajax": 'listar_pedidos_financeiro', "columns": [
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

    

});

function importar_pedido(){

    var valor = $('#select-pedidos-busca').val();
    
    if(valor != null){

        showLoading();

        $.ajax({
            url: 'importar_pedido',
            type: 'POST',
            data: {
                id : valor
            },
            success: function(data) {

                hideLoading();

                if(data.sucesso){
                    Swal.fire({title: "Importado com sucesso", type: "success"});
                }else{
                    Swal.fire({title: data.msg, type: "info"});
                }
                
            }
        });

    }else{

        Swal.fire({title: "Atenção", text:"Selecionar um orçamento", type: "info"});

    }


}

function showLoading() {
    $('.spiner2').css('display', 'block');
}

function hideLoading() {
    $('.spiner2').css('display', 'none');
}

function get_status_select_upload_arquivo(id){

    $.ajax({
        url: 'get_select_arquivo',
        type: 'POST',
        data: {
            id: id
        },
        success: function(data) {
            $('#select_tipo_arquivo').html(data);

        }
    });

}

function upload_arquivo(id){

    select = get_status_select_upload_arquivo(id);

    Swal.fire({
        title: "Upload de arquivo",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: '<form id="formulario1" method="post" enctype="multipart/form-data"><label for="exampleInputEmail1" style="float: left;">Arquivo referente</label><select class="form-control" id="select_tipo_arquivo" style="margin-bottom: 20px;">'+select+'</select><div class="form-group"><input type="file" name="file" class="form-control" id="file" /></div>',
        preConfirm: function() {
            return new Promise((resolve, reject) => {

                if($('input[name="file"]')[0].files[0] != "undefined"){

                    var formData = new FormData();
                    formData.append('file', $('input[name="file"]')[0].files[0]);
                    formData.append('id', id);
                    formData.append('select_tipo_arquivo', $('#select_tipo_arquivo').val());

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
            
            Swal.fire({
                title: 'A instalação possui mais de uma vista?',
                text: "Clique em sim para anexar outra e não para atualizar o status",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                    );
                }else{
                    Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'error'
                    );
                }
            });

            /*showLoading();

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
                            //faz alguma coisa durante o progresso do upload
                        }, false);
                    }
                    return myXhr;
                }
            });*/

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

//TODO | Atualiza os registros do datatable
function atualizar_tabelas(){

    $('#tabelaProjetos').DataTable().ajax.reload();
    $('#tabelaFinanceiro').DataTable().ajax.reload();

}

function estrutura_enviar(id){

    Swal.fire({
        title: "Upload de estruturas pedido F",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: '<form id="formulario1" method="post" enctype="multipart/form-data"><label for="exampleInputEmail1" style="float: left;">Arquivo referente</label><div class="form-group"><input type="file" name="file" class="form-control" id="file" /></div>',
        preConfirm: function() {
            return new Promise((resolve, reject) => {

                if($('input[name="file"]')[0].files[0] != "undefined"){

                    var formData = new FormData();
                    formData.append('file', $('input[name="file"]')[0].files[0]);
                    formData.append('id', id);

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
                url: 'upload_estrutura',
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

function visita_enviar_view(id){

     Swal.fire({
        title: "Enviar arquivos",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        html: '<div class="form-group" style="text-align: left !important;"><label for="exampleInputEmail1">E-mail cliente</label><input type="email" class="form-control" id="email_tecnico"/></div><div class="form-group" style="text-align: left !important;"><label for="exampleInputEmail1">E-mail representante</label><input type="email" class="form-control" id="email_cliente"/></div>',
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
                url: 'envia_doc_cliente',
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
                id: id
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

function baixar_arquivo(id, arquivo){

    showLoading();

    $.ajax({
        type: 'POST',
        url: 'download_arquivo',
        data: {
            id : id,
            arquivo : arquivo
        },
        success: function(retorno){

        },
        error: function(){
            
        },
        complete: function(data){

            hideLoading();
            var resposta = data.responseJSON;

            if(!resposta.erro){
                window.open('../'+resposta.link);
            }else{
                Swal.fire({title: "Arquivo não encontrado", type: "info"});
            }

        }
    });

}

function aprovar_pedido_f(id){

    Swal.fire({
        title: "Confirmar liberação do pedido F?",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function(result) { 

        if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'aprovar_pedido_f',
                data: {
                    id : id
                },
                success: function(retorno){

                },
                error: function(){
                    
                },
                complete: function(data){

                    hideLoading();
                    Swal.fire({title: "Aprovado com sucesso", type: "success"});
                    atualizar_tabelas();

                }               
            });
        
        }

    });

}

function encerar_producao(id){

     Swal.fire({
        title: "Concluir produção do pedido?",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function(result) { 

        if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

        }

    });

}

function confirmar_cobre(id){

    Swal.fire({
        title: "Confirmar envio do cobre?",
        text: "Seremos notificados dessa confirmação",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function(result) { 

        if(result.dismis!= "backdrop" && result.dismiss != "cancel" && result.dismiss != "esc" && result.dismiss != "close"){

            showLoading();

            $.ajax({
                type: 'POST',
                url: 'confirmar_cobre',
                data: {
                    id : id
                },
                complete: function(data){

                    hideLoading();
                    Swal.fire({title: "Aprovado com sucesso", type: "success"});
                    atualizar_tabelas();

                }               
            });
        
        }

    });

}