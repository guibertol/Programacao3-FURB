<html>
    <head>
        <link rel="stylesheet" href="bootstrap.min.css">
        <script type="text/javascript" src="jquery-2.2.3.min.js"></script>
    </head>
    <body>

        <div class="col-md-6">
            <table class="table table-bordered table-striped">
                <thead>    
                    <tr>
                        <td>ID</td>
                        <td>Nome</td>
                        <td>Sálario</td>
                        <td>Idade</td>
                        <td>Avatar</td>
                        <td>Ações</td>
                    </tr>
                </thead>
                <tbody id="tabela_empregados">
                </tbody>
            <table>
        </div>

        <div class="col-md-6">
            <h2>Cadastrar</h2>
            <div class="form-group">
                <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Nome</label>
                <input type="text" name="nome_form" id="nome_form" class="form-control" placeholder="Digite o nome" required/>
            </div>
            <div class="form-group">
                <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Salario</label>
                <input type="text" name="salario_form" id="salario_form" class="form-control" placeholder="Digite o salario" required/>
            </div>
            <div class="form-group">
                <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Idade</label>
                <input type="text" name="idade_form" id="idade_form" class="form-control" placeholder="Digite a idade" required/>
            </div>
            <div class="form-group">
                <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Avatar</label>
                <input type="text" name="avatar_form" id="avatar_form" class="form-control" placeholder="Digite o avatar" required/>
            </div>
            <button type="btn btn-success" onclick="cadastrar_empregado()">Salvar</button>
        </div>

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="background-color: #0000005e;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Editando funcionario</h5>
                    </div>
                    <div class="modal-body">
                        
                        <div class="form-group">
                            <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Nome</label>
                            <input type="text" name="nome_form" id="nome_form_edit" class="form-control" placeholder="Digite o nome" required/>
                        </div>
                        <div class="form-group">
                            <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Salario</label>
                            <input type="text" name="salario_form" id="salario_form_edit" class="form-control" placeholder="Digite o salario" required/>
                        </div>
                        <div class="form-group">
                            <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Idade</label>
                            <input type="text" name="idade_form" id="idade_form_edit" class="form-control" placeholder="Digite a idade" required/>
                        </div>
                        <div class="form-group">
                            <label for="formNome" style="text-align: left; float: left; font-weight: normal;">Avatar</label>
                            <input type="text" name="avatar_form" id="avatar_form_edit" class="form-control" placeholder="Digite o avatar" required/>
                        </div>

                        <input type="hidden" name="id_form_edit" id="id_form_edit" class="form-control" placeholder="Digite o avatar" required/>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="fechar_modal()">Cancelar</button>
                        <button type="button" class="btn btn-danger" onclick="editar_empregado_post()">Salvar</button>
                    </div>
                </div>
            </div>
        </div>

        <script>

            function listar_empregados(){

                $.ajax({
                    url: 'https://rest-api-employees.jmborges.site/api/v1/employees',
                    type: 'GET',
                    success: function(retorno){

                        for(i=0; i<retorno.data.length; i++){

                            objeto = retorno.data[i];

                            var excluir = '<button type="button" class="btn btn-danger" onclick="excluir_empregado('+"'"+objeto.id+"'"+')">Excluir</button>';
                            var editar = '<button type="button" class="btn btn-warning" onclick="editar_empregado('+"'"+objeto.id+"'"+')">Editar</button>';

                            $('#tabela_empregados').append('<tr id="linha_id_'+objeto.id+'"><td>'+objeto.id+'</td><td>'+objeto.employee_name+'</td><td>'+objeto.employee_salary+'</td><td>'+objeto.employee_age+'</td><td>'+objeto.profile_image+'</td><td>'+editar+excluir+'</td></tr>');
                        }

                    }
                });

            }

            listar_empregados();

            function cadastrar_empregado(){

                var array = {
                    name: $('#nome_form').val(),
                    salary: $('#salario_form').val(),
                    age: $('#idade_form').val(),
                    profile_image: $('#avatar_form').val()
                }

                $.ajax({
                    type: 'POST',
                    url: 'https://rest-api-employees.jmborges.site/api/v1/create',
                    data: array,
                    processData: false,
                    contentType: false,
                    success: function(retorno){
                        
                    }
                });

            }

            function excluir_empregado(id){

                if(confirm('Deseja realmente exluir o empregado?')) {

                    $.ajax({
                        type: 'DELETE',
                        url: 'https://rest-api-employees.jmborges.site/api/v1/delete/'+id,
                        success: function(retorno){
                            
                            $('#linha_id_'+id).remove();

                        }
                    });

                }  

            }

            function fechar_modal(){
                $('#exampleModal').addClass('fade');
                $('#exampleModal').css('display', 'none');
            }

            function editar_empregado(id){

                $('#exampleModal').removeClass('fade');
                $('#exampleModal').css('display', 'block');

                $.ajax({
                    type: 'GET',
                    url: 'https://rest-api-employees.jmborges.site/api/v1/employee/'+id,
                    success: function(retorno){

                        console.log(retorno);
                        
                        $('#nome_form_edit').val(retorno.data.employee_name);
                        $('#salario_form_edit').val(retorno.data.employee_salary);
                        $('#idade_form_edit').val(retorno.data.employee_age);
                        $('#avatar_form_edit').val(retorno.data.profile_image);
                        $('#id_form_edit').val(retorno.data.id);

                    }
                });

            }

            function editar_empregado_post(){

                var id = $('#id_form_edit').val();

                var array = {
                    "name": $('#nome_form_edit').val(),
                    "salary": $('#salario_form_edit').val(),
                    "age": $('#idade_form_edit').val(),
                    "profile_image": $('#avatar_form_edit').val()                    
                }

                $.ajax({
                    type: 'PUT',
                    url: 'http://rest-api-employees.jmborges.site/api/v1/update/'+id,
                    data: array,
                    processData: false,
                    contentType: false,
                    success: function(retorno){
                        console.log(retorno);
                        fechar_modal();
                    },
                    error: function(retorno){
                        alert(retorno.message);
                        fechar_modal();
                    }
                });

            }

        </script>

    </body>
</html>