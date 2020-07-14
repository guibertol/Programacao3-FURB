<?php

use App\Pedido;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;


define('ROUND_PRECO', 2);
if (!function_exists('format_cnpj')) {
    /**
     * mascara para cnpj
     * @param $value
     * accept:
     * 87332587000114 success
     * '87.332.587/0001-14' success
     * @return string '87.332.587/0001-14'
     */
    function format_cnpj($value)
    {
        $pattern = '/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/';
        $replacement = '$1.$2.$3/$4-$5';
        $string = format_digit($value);
        if (strlen($string) == 11) //format cpf
            return format_cpf($value);
        return preg_replace($pattern, $replacement, $string);
    }
}

if (!function_exists('format_cpf')) {
    /**
     * mascara para cpf
     * @param $value
     * accept:
     * 08144225989 success
     * '081.442.259-89' success
     * @return string '081.442.259-89'
     */
    function format_cpf($value)
    {
        $pattern = '/^(\d{3})(\d{3})(\d{3})(\d{2})$/';
        $replacement = '$1.$2.$3-$4';
        $string = format_digit($value);
        return preg_replace($pattern, $replacement, $string);
    }
}

//if (!function_exists('format_cpf')) {
//    /**
//     * mascara para cpf
//     * @param $value
//     * accept:
//     * 08144225989 success
//     * '081.442.259-89' success
//     * @return string '081.442.259-89'
//     */
//    function format_cpf($value)
//    {
//        $pattern = '/^(\d{3})(\d{3})(\d{3})(\d{2})$/';
//        $replacement = '$1.$2.$3-$4';
//        $string = format_digit($value);
//        return preg_replace($pattern, $replacement, $string);
//    }
//}
if (!function_exists('format_telefone')){
    function format_telefone($string)
    {
        if (empty_string($string)){
            $telefone = '';
            return  $telefone;
        }else{
            
            $string = preg_replace('/[^0-9]/i', '', $string);
            
            //$string = str_replace(" ","",$string);
            if (strlen($string) === 11)
            {
                $telefone = '(' . substr($string, 0, 3) . ') ' . substr($string, 3,4) . 
                '-' . substr($string, 7);
                
            }
            elseif(strlen($string) > 11)
            {
                $telefone = '(' . substr($string, 0, 3) . ') ' . substr($string, 3,5) . 
                '-' . substr($string, 8);
                
            }
            else
            {
                $telefone = $string;
            }
            
            return $telefone;
            
           /* for($i=0;$i<strlen($string);$i++)
            {
                $mascara[strpos($mascara, '#')] = $string[$i];
            }
            return $mascara; */
        }
    } 
}

if (!function_exists('format_money')) {
    function format_money($value, $fixed = 2, $preffix = 'R$ ')
    {
        $value = number_format($value, $fixed, ',', '.');
        return $preffix . $value;
    }
}
if (!function_exists('format_digit')) {
    /**
     * @param $value '87.332.587/0001-14'
     * @return mixed 87332587000114
     */
    function format_digit($value)
    {
        if ($value == null)
            return null;
        $pattern = '/\D/';
        $replacement = '';
        $string = $value;
        return preg_replace($pattern, $replacement, $string);
    }
}


if (!function_exists('format_porcentagem')) {
    /**
     * @param $value
     * @param int $fixed
     * @param string $suffix
     * @param int $mult
     * @return string
     */
    function format_porcentagem($value, $fixed = 2, $suffix = '%', $mult = 100)
    {
        $value = ($value * $mult);
        $value = number_format($value, $fixed, '.', '');
        return $value . $suffix;
    }
}

if (!function_exists('format_cep')) {
    function format_cep($value)
    {
        $pattern = '/^(\d{5})(\d{3})$/';
        $replacement = '$1-$2';
        $string = format_digit($value);
        return preg_replace($pattern, $replacement, $string);
    }
}


if (!function_exists('split_pedido_boleto_id')) {
    /**
     *  quebra o codigo separando o identificador do pedido e o identificador do boleto
     * @param $id
     * @return array
     */
    function split_pedido_boleto_id($id)
    {
        $id_len = strlen($id);
        $pedido_id = substr($id, 0, $id_len - 1);
        $boleto_id = substr($id, $id_len - 1, $id_len);
        return compact('pedido_id', 'boleto_id');
    }
}

function format_date($date, $format = 'd/m/Y', $default = '-')
{
    if (empty_string($date) || $date == null)
        return $default;
    if ($date instanceof Carbon)
        return $date->format('d/m/Y');
    if (is_string($date)) {
        $date = date_carbon($date);
        return format_date($date);
    }
}

function date_carbon($sanatize_date)
{
    if (empty($sanatize_date))
        return null;

    return Carbon::createFromFormat('Ymd', $sanatize_date);
}

function datepicker_carbon($sanatize_date)
{
    if (empty($sanatize_date))
        return null;
    return Carbon::createFromFormat('d/m/Y', $sanatize_date);
}

function calc_parcela($valor, $numero_parcelas)
{
    $valor = round($valor, 2);
    $valor_soma = 0;
    $valor_item = $valor / $numero_parcelas;
    $result = [];
    for ($i = 0; $i < $numero_parcelas - 1; $i++) {
        $valor_item = round($valor_item, 2);
        $result[$i] = $valor_item;
        $valor_soma += $valor_item;
    }
    $result[$i] = $valor - $valor_soma;
    return $result;
}

function auto_increment_user()
{
    $last = 0;
    $item = User::orderBy(User::$PK, 'desc')->select(User::$PK)->first();
    if ($item)
        $last = intval($item[User::$PK]);
    return (str_pad(++$last, 6, "0", STR_PAD_LEFT));
}

function auto_increment_pedido()
{
    //busca do banco
    $last = 0;
    $item = Pedido::orderBy(Pedido::$PK, 'desc')->select(Pedido::$PK)->first();
    if ($item)
        $last = intval($item[Pedido::$PK]);
//    $last_len = strlen($last);
//    $new = substr($last, 0, $last_len - 1);
//    $new = intval($new);
//    return (str_pad(++$new, 6, "0", STR_PAD_LEFT));
    return (str_pad(++$last, 6, "0", STR_PAD_LEFT));
}



if (!function_exists('rand_pass')) {


    /**
     * Gera uma senha aleatoria
     * @param int $tamanho
     * @param bool|true $maiusculas
     * @param bool|true $numeros
     * @param bool|false $simbolos
     * @return string
     */
    function rand_pass($tamanho = 20, $maiusculas = true, $numeros = true, $simbolos = false)
    {
//        return '123';

        $lmin = 'abcdefghijklmnopqrstuvwxyz';
        $lmai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $num = '1234567890';
        $simb = '!@#$%*-';
        $retorno = '';
        $caracteres = '';

        $caracteres .= $lmin;
        if ($maiusculas) $caracteres .= $lmai;
        if ($numeros) $caracteres .= $num;
        if ($simbolos) $caracteres .= $simb;

        $len = strlen($caracteres);
        for ($n = 1; $n <= $tamanho; $n++) {
            $rand = mt_rand(1, $len);
            $retorno .= $caracteres[$rand - 1];
        }

        return $retorno;
    }
}
function mail_php($view, array $data = [], $to = '', $subject = ''){
}

function empty_string($value)
{
    return preg_match('/\S/', $value) ? false : true;
}


/**
 * Retorna o sql gerado
 * @return array
 */
function sql_log()
{
    $queries = DB::getQueryLog();
    $formattedQueries = [];
    foreach ($queries as $query) :
        $prep = $query['query'];
        foreach ($query['bindings'] as $binding) :
            $prep = preg_replace("#\?#", "'" . $binding . "'", $prep, 1);
        endforeach;
        $formattedQueries[] = $prep;
    endforeach;
    return $formattedQueries;
}

function LENTRIM_NULL($collumn){
    return 'LEN(RTRIM(' . $collumn . '))=0';
}

function LENTRIM_NOTNULL($collumn){
    return 'LEN(RTRIM(' . $collumn . '))!=0';
}

function mail_attach($arq, array $data = [], $to = '', $subject = ''){
}

function render_html ($tipo, $obs){
}