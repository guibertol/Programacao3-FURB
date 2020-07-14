<?php

Route::group(['as' => 'api.', 'prefix' => 'api'], function () {

    //Alunos
    get('alunos', ['as' => '', 'uses' => 'AlunoController@inicio']);       
    post('aluno/cadastrar', ['as' => '', 'uses' => 'AlunoController@cadastrar']);   
    get('aluno/excluir/{id}', ['as' => '', 'uses' => 'AlunoController@excluir']); 
    put('aluno/editar', ['as' => '', 'uses' => 'AlunoController@editar']); 
    //Usuarios
    get('usuarios', ['as' => '', 'uses' => 'UserController@inicio']);       
    post('usuario/cadastrar', ['as' => '', 'uses' => 'UserController@cadastrar']);   
    get('usuario/excluir/{id}', ['as' => '', 'uses' => 'UserController@excluir']); 
    put('usuario/editar', ['as' => '', 'uses' => 'UserController@editar']); 
    //Front end
    get('login', ['as' => '', 'uses' => 'PainelController@login']);     
    get('painel', ['as' => '', 'uses' => 'PainelController@painel']);     

});

?>