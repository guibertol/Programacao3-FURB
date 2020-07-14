<?php

namespace App;

use App\Artico\Model;
use App\Artico\PrimaryKeyTrait;
use App\Artico\RecnoTrait;
use App\Artico\SoftDeletes;
use Artico\Defender\Traits\HasDefender;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract; 
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Foundation\Auth\Access\Authorizable;

class User extends Model implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract {
    
    use Authenticatable, Authorizable, CanResetPassword, RecnoTrait, HasDefender, PrimaryKeyTrait, SoftDeletes;

    static $TB = 'usuario_sistema';
    static $PK = 'id_usuario_sistema';
    static $REF = 'id_usuario_sistema';

    protected $fillable = [
        'id_usuario_sistema',
        'nome',
        'email',
        'senha'
    ];

    public function getAuthIdentifier(){
        return $this->attributes[self::$PK];
    }

    protected $hidden = ['senha', 'token', 'D_E_L_E_T_', 'R_E_C_N_O_'];
    
    public function getRememberTokenName(){
        return 'token';
    }

    public function getRememberToken(){
        return $this->token;
    }

    public function setRememberToken($value){
        $this->token = $value;
    }

    public function save(array $options = []){

        parent::save();
        
    }

}