<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use Illuminate\Support\Facades\Auth;

Route::group(['as' => 'site.'], function () {
    get('/', ['as' => 'inicio', 'uses' => 'SiteController@inicio']);
    get('login', ['as' => 'singin.login', 'uses' => 'SinginController@login']);
    get('logout', ['as' => 'singin.logout', 'uses' => 'SinginController@logout']);
    post('login', ['as' => 'singin.login_post', 'uses' => 'SinginController@login_post']);
    post('novo-cadastro', ['as' => 'singin.register_post', 'uses' => 'SinginController@register_post']);
    post('redefinir-senha', ['as' => 'singin.redefinir_senha', 'uses' => 'SinginController@redefinir_senha']);

    Route::group(['middleware' => 'auth'], function () {
        Route::group(['middleware' => ['needsRole:gestor']], function () {
            Route::group(['prefix' => 'gestor', 'as' => 'gestor.'], function () {
                get('/', function () {
                    return 'gestor';
                });
            });
        });

        Route::group(['middleware' => ['needsRole:admin']], function () {
            Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
                get('/', function () {
                    return 'admin';
                });
                get('pedido/{id}', ['as' => 'pedido.mostra', 'uses' => 'PedidoController@admin_mostra']);
            });

        });

        Route::group(['middleware' => ['needsRole:cliente']], function () {
            Route::group(['prefix' => 'cliente', 'as' => 'cliente.'], function () {
                get('/', function () {
                    return 'cliente';
                });
                post('pedido', ['as' => 'pedido.salva', 'uses' => 'PedidoController@salva']);
            });
        });

        Route::group(['middleware' => ['needsRole:cliente|cacau-show']], function () {
            Route::group(['prefix' => 'cliente-cacau-show', 'as' => 'cliente_cs.'], function () {
                get('/', ['as' => 'inicio', 'uses' => 'ClienteController@inicio_cs']);
                get('pedido/{id}', ['as' => 'pedido.mostra', 'uses' => 'PedidoController@cliente_cs_mostra']);
                get('meus-pedidos', ['as' => 'pedido.meus_pedidos', 'uses' => 'PedidoController@cliente_cs_meus_pedidos']);
            });
        });

        get('boleto/{id}', ['as' => 'boleto', 'uses' => 'PedidoController@boleto']);
    });
});
get('/permissao', function () {
    $user = Auth::user();
    if ($user == null)
        return 'nao logado';

    $user->permissions;
    $user->roles;
    dd($user->toArray());
});

//get('/publicar', function () {
//    $raiz = shell_exec('pwd');
//    dd($raiz);
//
//
//    echo '<pre>';
//    echo $raiz;
////    $testado = shell_exec('git pull origin master && git log');
////    echo '<pre>';
////    echo $testado;
//});


//get('/token', ['uses' => 'SiteController@token']);
//post('/teste_post', ['as' => 'site.teste_post', 'uses' => 'SiteController@test_post']);
//get('/teste_banco', ['uses' => 'SiteController@teste_banco']);
//get('/teste_email', ['uses' => 'SiteController@teste_email']);
//get('/teste_ns', ['uses' => 'SiteController@teste_ns']);