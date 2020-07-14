<?php namespace App\Artico;

use Carbon\Carbon;
use Exception;
use OverflowException;
use Log;

class Sanatize{

    public static function float($value)
    {
        return filter_var($value, FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE);
    }


    public static function string($str, $max_length = null){

        if (!$max_length && strlen($str) > $max_length)
            $str = substr($str, 0, $max_length);

        return !empty($str) ? $str : '';

    }

    public static function date($date) {
        if ($date == null)
            return '        ';
        return $date->format('Ymd');
    }

    public static function time($date){
        return $date->format('H:i');
    }

    public static function string2binary($string){

        $out = 'null';
        
        if ($string != null) {
            $content = bin2hex($string);
            $out = "0x" . $content;
        }
                
        return $out;

    }

    public static function binary2string($binary)
    {
        if ($binary == 'null')
            return null;

        return hex2bin(substr($binary, 2));
    }

    public static function decimal($value, $tamanho, $decimal){

        if (strlen(strval(intval($value))) > $tamanho) {
            throw new OverflowException("max tamanho: $tamanho.$decimal,  value: $value");
        }

        return number_format($value, $decimal, '.', '');
        
    }

    public static function int_pad($value, $length){
        return (str_pad($value, $length, "0", STR_PAD_LEFT));
    }

    public static function boolean($value = false){
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }


}
