<?php namespace App\Artico;

use Illuminate\Support\Facades\DB;

trait PrimaryKeyTrait{

    public function get_auto_increment_pk_length(){
        return 6;
    }

    public function get_auto_increment_pk_length2(){
        return 9;
    }

    public function auto_increment_pk(){

        $col = self::$PK;

        $query = $this->select($col)->orderBy($col, 'desc');

        if (method_exists($this, 'withTrashed')) {
            $query->withTrashed();
        }

        $item_last = $query->first();
        
        $n_last = $item_last != null ? intval($item_last[$col]) : 0;
        $length = $this->get_auto_increment_pk_length();
        $this[$col] = (str_pad(++$n_last, $length, "0", STR_PAD_LEFT));

    }

    public function auto_increment_pk_orc($cod_pedido) {

        $col = self::$PK;

        $item_orc = $cod_pedido;
        $verif_existe = substr_count($item_orc, '_');

        if($verif_existe > 0) {

            $item_orc = explode("_", $item_orc);

            if(intval($item_orc[1]) < 10) {
                $last_chars = intval($item_orc[1]) + 1;
                $last_chars = '0'.strval($last_chars);
            } else {
                $last_chars = intval($item_orc[1]) + 1;
                $last_chars = strval($last_chars);
            }

            $item_orc = $item_orc[0].'_'.$last_chars;

        }else{
            $item_orc = $cod_pedido.'_01';
        }

        $this[$col] = $item_orc;

    }


    public function save(array $options = []){
        if (empty($this[self::$PK])){
            $this->auto_increment_pk();
        }
        parent::save();
    }


}