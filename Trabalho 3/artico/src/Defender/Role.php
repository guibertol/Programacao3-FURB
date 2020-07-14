<?php

namespace Artico\Defender;

use App\Artico\Model;
use App\Artico\PrimaryKeyTrait;
use App\Artico\RecnoTrait;
use App\User;
use Artico\Defender\Traits\Permissions\RoleHasPermissions;

/**
 * Class Role.
 */
class Role extends Model
{

    use PrimaryKeyTrait,
        RoleHasPermissions,
        RecnoTrait;

    static $NM = Role::class;
    static $TB = 'ZB4010';
    static $PK = 'ZB4_COD';

    static $COL_NAME = 'ZB4_NOME';

    static $ROLE_USER_TABLE = 'ZB6010';
    static $ROLE_USER_USER_KEY = 'ZB6_CODUSR';
    static $ROLE_USER_ROLE_KEY = 'ZB6_COD';


    public function save(array $options = [])
    {
        if (empty($this[$this->getRecnoColumn()])) {
            $this->auto_increment_recno();
        }
        parent::save();
    }

//    /**
//     * Table name.
//     *
//     * @var string
//     */
//    protected $table;

    /**
     * Mass-assignment whitelist.
     *
     * @var array
     */
//    protected $fillable = [
//        'name',
//    ];
//
//    /**
//     * @param array $attributes
//     */
    public function __construct(array $attributes = [])
    {
        $this->fillable = [
            self::$COL_NAME
        ];
        parent::__construct($attributes);
//
////        $this->table = config('defender.role_table', 'roles');
    }

    /**
     * Many-to-many role-user relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class,
            Role::$ROLE_USER_TABLE,
            Role::$ROLE_USER_ROLE_KEY,
            Role::$ROLE_USER_USER_KEY
        );
    }
}
