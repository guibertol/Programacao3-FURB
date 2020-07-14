<?php

namespace Artico\Defender;

use App\Artico\Model;
use App\Artico\PrimaryKeyTrait;
use App\User;
use Artico\Defender\Pivots\PermissionRolePivot;
use Artico\Defender\Pivots\PermissionUserPivot;
use Illuminate\Database\Eloquent\Model as EloquentModel;

/**
 * Class Permission.
 */
class Permission extends Model
{
    use PrimaryKeyTrait;

    static $NM = Permission::class;
    static $TB = 'ZB2010';
    static $PK = 'ZB2_COD';

    static $COL_NAME = 'ZB2_NAME';
    static $COL_READABLE_NAME = 'ZB2_LEGNAM';

    static $PERMISSION_ROLE_TABLE = 'ZB3010';
    static $PERMISSION_ROLE_ROLE_KEY = 'ZB3_CODPAP'; //role_id da tabela permission_role
    static $PERMISSION_ROLE_PERMISSION_KEY = 'ZB3_CODPER'; //permission_id da tabela permission_role
    static $PERMISSION_ROLE_PIVOT_EXPIRES = 'ZB3_DTEXPI';
    static $PERMISSION_ROLE_PIVOT_HREXPIRES = 'ZB3_HREXPI';
    static $PERMISSION_ROLE_PIVOT_VALUE = 'ZB3_VALOR';

    static $PERMISSION_USER_TABLE = 'ZB5010';
    static $PERMISSION_USER_PERMISSION_KEY = 'ZB5_CODPER'; //permission_id da tabela permission_user
    static $PERMISSION_USER_USER_KEY = 'ZB5_CODUSR';//user_id da tabela permission_user
    static $PERMISSION_USER_PIVOT_EXPIRES = 'ZB5_DTEXPI';
    static $PERMISSION_USER_PIVOT_HREXPIRES = 'ZB5_HREXPI';
    static $PERMISSION_USER_PIVOT_VALUE = 'ZB5_VALOR';

    /**
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        $this->fillable = [
            self::$COL_NAME,
            self::$COL_READABLE_NAME,
        ];

        parent::__construct($attributes);
//        $this->table = config('defender.permission_table', 'permissions');
    }

    /**
     * Many-to-many permission-role relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(
            Role::$NM,
            Permission::$PERMISSION_ROLE_TABLE,
            Permission::$PERMISSION_ROLE_PERMISSION_KEY,
            Permission::$PERMISSION_ROLE_ROLE_KEY
        )->withPivot(Permission::$PERMISSION_ROLE_PIVOT_VALUE, Permission::$PERMISSION_ROLE_PIVOT_EXPIRES);
    }

    /**
     * Many-to-many permission-user relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(
            User::$NM,
            Permission::$PERMISSION_USER_TABLE,
            Permission::$PERMISSION_USER_PERMISSION_KEY,
            Permission::$PERMISSION_USER_USER_KEY
        )->withPivot(Permission::$PERMISSION_USER_PIVOT_VALUE, Permission::$PERMISSION_USER_PIVOT_EXPIRES);
    }

    /**
     * @param EloquentModel $parent
     * @param array $attributes
     * @param string $table
     * @param bool $exists
     *
     * @return PermissionUserPivot|\Illuminate\Database\Eloquent\Relations\Pivot
     */
    public function newPivot(EloquentModel $parent, array $attributes, $table, $exists)
    {
        $userModel = User::$NM;// app()['config']->get('auth.model');
        $roleModel = Role::$NM; // app()['config']->get('defender.role_model');

        if ($parent instanceof $userModel) {
            return new PermissionUserPivot($parent, $attributes, $table, $exists);
        }

        if ($parent instanceof $roleModel) {
            return new PermissionRolePivot($parent, $attributes, $table, $exists);
        }

        return parent::newPivot($parent, $attributes, $table, $exists);
    }
}
