<?php namespace App\Artico;

use Illuminate\Database\Eloquent\Model as BaseModel;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;

class Model extends BaseModel{

    static $NM = 'indefinido';
    static $TB = 'indefinido';
    static $PK = 'id';
    static $FK = 'indefinido_id';

    protected $table;
    protected $primaryKey;
    public $timestamps = false;
    public $incrementing = false;


    protected static $rules = [];
    protected static $rules_messages = [];
    protected $validator;

    public function __construct(array $attributes = array(), Validator $validator = null){

        $this->table = static::$TB;
        $this->primaryKey = static::$PK;
        parent::__construct($attributes);
        $this->validator = $validator ?: App::make('validator');

    }

    public function validate(){
        $v = $this->validator->make($this->attributes, static::$rules, static::$rules_messages);
        return $v;
    }

}