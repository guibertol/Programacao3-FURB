<?php

namespace App\Http\Controllers\Api;

use App\Utilities\Sanatize;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Log;
use App\Aluno;
use Illuminate\Http\Response;

class PainelController extends Controller{

    public function login(Request $request){
        $retorno = array();
        return view('sistema.login', compact('retorno'));
    }

    public function painel(Request $request){
        $retorno = array();
        return view('sistema.painel', compact('retorno'));
    }

}

?>