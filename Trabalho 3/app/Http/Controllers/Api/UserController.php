<?php

namespace App\Http\Controllers\Api;

use App\Artico\Sanatize;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Log;
use App\Aluno;
use Illuminate\Http\Response;

class UserController extends Controller{

    public function inicio(Request $request){
        
        $usuarios = DB::table('usuario_sistema')->select()->get();
        foreach($usuarios as $key => $usuario){
            $botao = '<button type="btn btn-danger" onclick="deletar_usuario('.$usuario->id_usuario_sistema.')">Deletar</button>';
            $botao = $botao.'<button type="btn btn-danger" onclick="editar_usuario('.$usuario->id_usuario_sistema.')">Editar</button>';
            $usuarios[$key]->acao = $botao;
        }

        return response()->json(array('data' => $usuarios));

    }

    public function cadastrar(Request $request){

        $dados = $request->input();

        if(!isset($dados['nome']) || trim($dados['nome']) == null){
            return response()->json(array(
                'error' => 'Nome é obrigatorio'
            ));
        }

        if(!isset($dados['email']) || trim($dados['email']) == null){
            return response()->json(array(
                'error' => 'e-mail é obrigatorio'
            ));
        }

        if(!isset($dados['senha']) || trim($dados['senha']) == null){
            return response()->json(array(
                'error' => 'Senha é obrigatorio'
            ));
        }

        $user = new User();
        $user->nome = $request->input('nome');
        $user->email = $request->input('email');
        $user->senha = $request->input('senha');
        $user->save();

        return response()->json(array(
            'sucesso' => 'Salvo com sucesso'
        ));

    }

    public function excluir($id){

        $usuario = DB::table('usuario_sistema')->select()->where('id_usuario_sistema', '=', $id)->get();

        if(isset($usuario[0])){

            DB::table('usuario_sistema')->where('id_usuario_sistema', $id)->delete();

            return response()->json(array(
                'sucesso' => 'Usuario excluido'
            ));

        }else{
            return response()->json(array(
                'erro' => 'Não foi possivel localizar usuario com o respectivo ID'
            ));
        }

    }

    public function editar(Request $request){

        $dados = $request->input();
        
        if(!isset($dados['id_usuario_sistema'])){
            return response()->json(array(
                'error' => 'id_usuario_sistena é obrigatorio'
            ));
        }

        if(!isset($dados['email'])){
            return response()->json(array(
                'error' => 'e-mail é obrigatorio'
            ));
        }

        if(!isset($dados['nome'])){
            return response()->json(array(
                'error' => 'Nome é obrigatorio'
            ));
        }

        if(!isset($dados['senha'])){
            return response()->json(array(
                'error' => 'Senha é obrigatorio'
            ));
        }

        $id_usuario_sistema = $dados['id_usuario_sistema'];

        $usuario_sistema = DB::table('usuario_sistema')->select()->where('id_usuario_sistema', '=', $id_usuario_sistema)->get();
        if(!isset($usuario_sistema[0])){
            return response()->json(array(
                'erro' => 'Não foi possivel localizar usuario com o respectivo ID'
            ));
        }

        
        $nome = $dados['nome'];
        $email = $dados['email'];
        $senha = $dados['senha'];

        DB::table('usuario_sistema')->where('id_usuario_sistema', $id_usuario_sistema)->update([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senha
        ]);

        return response()->json(array(
            'sucesso' => 'Alterado com sucesso'
        ));

    }

}

?>