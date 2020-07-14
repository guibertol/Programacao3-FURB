<?php

namespace App;

use App\Artico\Model;
use App\Artico\SoftDeletes;
use App\Artico\PrimaryKeyTrait;
use App\Artico\RecnoTrait;
use Illuminate\Support\Facades\DB;

class Aluno extends Model{

    static $NM = Aluno::class;
    static $TB = 'aluno';
    static $PK = 'id_aluno';

    use SoftDeletes, PrimaryKeyTrait, RecnoTrait;

    public function save(array $options = []){

        parent::save();
    
    }

}


?>