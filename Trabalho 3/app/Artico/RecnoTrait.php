<?php namespace App\Artico;

use Illuminate\Support\Facades\DB;

trait RecnoTrait
{

    public function getRecnoColumn(){
        //return 'R_E_C_N_O_';
    }

    public function auto_increment_recno(){        
        
        $query = $this->select($this->getRecnoColumn())->orderBy($this->getRecnoColumn(), 'desc');

        if(method_exists($this, 'withTrashed')){
            $query->withTrashed();
        }

        $recno_last = $query->first();

        if($recno_last == null){
            $recno_last = 0;
        }else{
            $recno_last = $recno_last->{$this->getRecnoColumn()};
            $recno_last = $recno_last != null ? intval($recno_last) : 0;
        }

        $this[$this->getRecnoColumn()] = ++$recno_last;

    }

    public function auto_increment_recno_table($table){

        $recno_last = $table->select($this->getRecnoColumn())->orderBy($this->getRecnoColumn(), 'desc')->first();

        if ($recno_last == null) {
            $recno_last = 1;
        } else {
            $recno_last = $recno_last->{$this->getRecnoColumn()};
            $recno_last = $recno_last != null ? intval($recno_last) : 1;
        }
        return ++$recno_last;
        
    }

}