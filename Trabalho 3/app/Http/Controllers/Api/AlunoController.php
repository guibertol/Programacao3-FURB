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

class AlunoController extends Controller{

    public function inicio(Request $request){
        
        $alunos = DB::table('aluno')->select()->get();
        foreach($alunos as $key => $aluno){

            $botao = '<button type="btn btn-danger" onclick="deletar_aluno('.$aluno->id_aluno.')">Deletar</button>';
            $botao = $botao.'<button type="btn btn-danger" onclick="editar_aluno('.$aluno->id_aluno.')">Editar</button>';

            $alunos[$key]->acao = $botao;

        }

        return response()->json(array('data' => $alunos));

    }

    public function cadastrar(Request $request){

        $dados = $request->input();

        if(!isset($dados['nome']) || trim($dados['nome']) == null){
            return response()->json(array(
                'error' => 'Nome é obrigatorio'
            ));
        }

        if(!isset($dados['cpf']) || trim($dados['cpf']) == null){
            return response()->json(array(
                'error' => 'CPF é obrigatorio'
            ));
        }

        if(!isset($dados['rg']) || trim($dados['rg']) == null){
            return response()->json(array(
                'error' => 'RG é obrigatorio'
            ));
        }

        if(!isset($dados['email']) || trim($dados['email']) == null){
            return response()->json(array(
                'error' => 'e-mail é obrigatorio'
            ));
        }

        if(!isset($dados['data_nascimento']) || trim($dados['data_nascimento']) == null){
            return response()->json(array(
                'error' => 'Data de nascimento é obrigatorio'
            ));
        }

        $aluno = new Aluno();
        $aluno->nome = $request->input('nome');
        $aluno->cpf = $request->input('cpf');
        $aluno->rg = $request->input('rg');
        $aluno->email = $request->input('email');
        $aluno->data_nascimento = $this->ajusta_data($request->input('data_nascimento'));
        $aluno->save();


        return response()->json(array(
            'sucesso' => 'Salvo com sucesso'
        ));

    }

    public function excluir($id){

        $aluno = DB::table('aluno')->select()->where('id_aluno', '=', $id)->get();

        if(isset($aluno[0])){

            DB::table('aluno')->where('id_aluno', $id)->delete();

            return response()->json(array(
                'sucesso' => 'Aluno excluido'
            ));

        }else{
            return response()->json(array(
                'erro' => 'Não foi possivel localizar aluno com o respectivo ID'
            ));
        }

    }

    function ajusta_data($data){

        $data = str_replace('/', '-', $data);
        return date('Y-m-d', strtotime($data));

    }

    public function editar(Request $request){

        $dados = $request->input();
        
        if(!isset($dados['id_aluno'])){
            return response()->json(array(
                'error' => 'id_aluno é obrigatorio'
            ));
        }

        if(!isset($dados['cpf'])){
            return response()->json(array(
                'error' => 'CPF é obrigatorio'
            ));
        }

        if(!isset($dados['rg'])){
            return response()->json(array(
                'error' => 'RG é obrigatorio'
            ));
        }

        if(!isset($dados['email'])){
            return response()->json(array(
                'error' => 'e-mail é obrigatorio'
            ));
        }

        if(!isset($dados['data_nascimento'])){
            return response()->json(array(
                'error' => 'Data de nascimento é obrigatorio'
            ));
        }

        $id_aluno = $dados['id_aluno'];

        $aluno = DB::table('aluno')->select()->where('id_aluno', '=', $id_aluno)->get();
        if(!isset($aluno[0])){
            return response()->json(array(
                'erro' => 'Não foi possivel localizar aluno com o respectivo ID'
            ));
        }

        
        $nome = $dados['nome'];
        $email = $dados['email'];
        $cpf = $dados['cpf'];
        $rg = $dados['rg'];
        $data_nascimento = $this->ajusta_data($dados['data_nascimento']);

        DB::table('aluno')->where('id_aluno', $id_aluno)->update([
            'nome' => $nome,
            'email' => $email,
            'cpf' => $cpf,
            'rg' => $rg,
            'data_nascimento' => $data_nascimento
        ]);

        return response()->json(array(
            'sucesso' => 'Alterado com sucesso'
        ));

    }

}

?>