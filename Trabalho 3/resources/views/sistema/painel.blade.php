<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Trabalho3 | Painel</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="{{ asset('/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/bower_components/bootstrap/dist/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/bower_components/font-awesome/css/font-awesome.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/bower_components/Ionicons/css/ionicons.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/dist/css/AdminLTE.min.css')}}">

    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">

</head>
<body class="hold-transition login-page">

    <div class="col-md-offset-3 col-md-6" style="margin-top: 25px;margin-bottom:25px;padding-bottom:25px;">

        <ul class="nav nav-tabs" style="margin-bottom: 20px;">  
            <li class="active"><a href="#1" data-toggle="tab">Listagem</a></li>
            <li><a href="#2" data-toggle="tab">Cadastar aluno</a></li>
            <li><a href="#3" data-toggle="tab">Cadastar usuario</a></li>
        </ul> 

        <div class="tab-content">


            <div class="tab-pane active" id="1">
                <h3>Alunos</h3>
                <table id="tabela_alunos" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <h3>Usuarios</h3>
                <table id="tabela_usuarios" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>email</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>

            <div class="tab-pane" id="2">
                
                <div class="form-group">
                    <label for="exampleInputEmail1">Nome do aluno</label>
                    <input type="text" class="form-control" id="nome_aluno" placeholder="Digite o nome" />
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Email do aluno</label>
                    <input type="email" class="form-control" id="email_aluno" placeholder="Digite o email" />
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">CPF do aluno</label>
                    <input type="email" class="form-control" id="cpf_aluno" placeholder="Digite o cpf" />
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">RG do aluno</label>
                    <input type="email" class="form-control" id="rg_aluno" placeholder="Digite o rg" />
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Data nascimento do aluno</label>
                    <input type="email" class="form-control" id="data_aluno" placeholder="Digite a data" />
                </div>

                <button type="button" class="btn btn-success" onclick="salvar_aluno()">Salvar</button>

            </div>

            <div class="tab-pane" id="3">
                <div class="form-group">
                    <label for="exampleInputEmail1">Nome do usuario</label>
                    <input type="text" class="form-control" id="nome_usuario" placeholder="Digite o nome" />
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email do usuario</label>
                    <input type="email" class="form-control" id="email_usuario" placeholder="Digite o email" />
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Senha do usuario</label>
                    <input type="email" class="form-control" id="senha_usuario" placeholder="Digite o email" />
                </div>
                <button type="button" class="btn btn-success" onclick="salvar_usuario()">Salvar</button>
            </div>

        </div>

        

    </div>

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
    <script src="{{ asset('/bower_components/bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('/bower_components/datatables.net/js/jquery.dataTables.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>

    <style>

        .dataTables_filter{
            display: inline-block;
            float: right;
        }

        .dataTables_length{
            display: inline-block;
        }


    </style>

    <script>

        var oTable = '';
        var oTable1 = '';

        $(function() {

            oTable = $("#tabela_alunos").dataTable({ 
                "ajax": 'alunos', 
                "columns": [
                    { "data": "id_aluno" },
                    {"data": "nome" },
                    {"data": "cpf" },
                    {"data": "acao" }
                ],
                "language": {
                    "url": "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                }
            });

            oTable1 = $("#tabela_usuarios").dataTable({ 
                "ajax": 'usuarios', 
                "columns": [
                    { "data": "id_usuario_sistema" },
                    {"data": "nome" },
                    {"data": "email" },
                    {"data": "acao" }
                ],
                "language": {
                    "url": "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                }
            });
            

        });

        function salvar_aluno(){

            var nome = $('#nome_aluno').val();
            var email = $('#email_aluno').val();
            var cpf = $('#cpf_aluno').val();
            var rg = $('#rg_aluno').val();
            var data_nascimento = $('#data_aluno').val();

            var dados = {
                nome: nome,
                email: email,
                cpf: cpf,
                rg: rg,
                data_nascimento: data_nascimento
            }

            $.ajax({
                url: 'aluno/cadastrar',
                type: 'POST',
                data: dados,
                success: function(data){
                    
                    if(data.sucesso != undefined){
                        Swal.fire(
                        'Sucesso',
                        data.sucesso,
                        'success'
                        );
                        $('#tabela_alunos').DataTable().ajax.reload();
                    }else{
                        Swal.fire(
                        'Atenção',
                        data.error,
                        'info'
                        );
                    }

                } 
            });


        }

        function salvar_usuario(){

            var nome = $('#nome_usuario').val();
            var email = $('#email_usuario').val();
            var senha = $('#senha_usuario').val();
            
            var dados = {
                nome: nome,
                email: email,
                senha: senha
            }

            $.ajax({
                url: 'usuario/cadastrar',
                type: 'POST',
                data: dados,
                success: function(data){
                    
                    if(data.sucesso != undefined){
                        Swal.fire(
                        'Sucesso',
                        data.sucesso,
                        'success'
                        );
                        $('#tabela_usuarios').DataTable().ajax.reload();
                    }else{
                        Swal.fire(
                        'Atenção',
                        data.error,
                        'info'
                        );
                    }

                } 
            });

        }

        function deletar_aluno(id){

            if(confirm("Deseja mesmo deletar esse aluno?")){

                $.ajax({
                    url: 'aluno/excluir/'+id,
                    type: 'get',
                    data: {},
                    success: function(data){
                        
                        if(data.sucesso != undefined){
                            Swal.fire(
                            'Sucesso',
                            data.sucesso,
                            'success'
                            );
                            $('#tabela_alunos').DataTable().ajax.reload();
                        }else{
                            Swal.fire(
                            'Atenção',
                            data.error,
                            'info'
                            );
                        }

                    } 
                });

            }
            
        }

        function deletar_usuario(id){

            if(confirm("Deseja mesmo deletar esse usuario?")){

                $.ajax({
                    url: 'usuario/excluir/'+id,
                    type: 'get',
                    data: {},
                    success: function(data){
                        
                        if(data.sucesso != undefined){
                            Swal.fire(
                            'Sucesso',
                            data.sucesso,
                            'success'
                            );
                            $('#tabela_usuarios').DataTable().ajax.reload();
                        }else{
                            Swal.fire(
                            'Atenção',
                            data.error,
                            'info'
                            );
                        }

                    } 
                });

            }

        }

        function editar_aluno(id){

        }

    </script>

</body>
</html>