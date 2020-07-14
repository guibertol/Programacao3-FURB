<?php

    Route::group(['as' => 'aplicativo.', 'prefix' => 'aplicativo'], function () {

        //Cargas iniciais
        get('/carregar/pedido', ['as' => '', 'uses' => 'PedidoAppController@load']);
        get('/carregar/cliente', ['as' => '', 'uses' => 'ClienteAppController@load']);
        get('/carregar/preco', ['as' => '', 'uses' => 'PrecoAppController@load']);
        get('/carregar/produto', ['as' => '', 'uses' => 'ProdutoAppController@load']);
        get('/carregar/acessorio', ['as' => '', 'uses' => 'AcessorioAppController@load']);
        get('/carregar/cor', ['as' => '', 'uses' => 'CorAppController@load']);
        get('/carregar/inicioescolha', ['as' => '', 'uses' => 'ProdutoAppController@inicioescolha']); 
        get('/carregar/tabela', ['as' => '', 'uses' => 'TabelaAppController@load']);
        get('/carregar/condicao', ['as' => '', 'uses' => 'CondicaoAppController@load']);
        get('/carregar/transportador', ['as' => '', 'uses' => 'TransportadorAppController@load']);
        get('/carregar/oportunidade/{id}', ['as' => '', 'uses' => 'OportunidadeAppController@load']);

        //Consultas
        get('/consultar/tabela_preco', ['as' => '', 'uses' => 'VendedorAppController@tabelas_preco']);
        get('/consultar/cliente/buscar', ['as' => '', 'uses' => 'ClienteAppController@buscar']);
        get('/consultar/cliente/{id}', ['as' => '', 'uses' => 'ClienteAppController@selecionar_id']);
        get('/consultar/pedido/{id}', ['as' => '', 'uses' => 'PedidoAppController@mostra']);
        get('/consultar/entrega/{id}', ['as' => '', 'uses' => 'PedidoAppController@consulta_entrega']);
        post('/consultar/login', ['as' => '', 'uses' => 'LoginAppController@load']);

        //Cadastros
        post('/cadastrar/cliente', ['as' => '', 'uses' => 'ClienteAppController@cadastro']);
        post('/cadastrar/pedido', ['as' => '', 'uses' => 'PedidoAppController@cadastro']);  

        //Verificacao de preco
        get('/carregar/preco_base', ['as' => '', 'uses' => 'PrecoAppController@preco_base']);                   
           
    });

?>