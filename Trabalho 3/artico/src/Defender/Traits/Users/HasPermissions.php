<?php

namespace Artico\Defender\Traits\Users;

use Artico\Defender\Permission;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Artico\Defender\Pivots\PermissionUserPivot;
use Artico\Defender\Traits\Permissions\InteractsWithPermissions;
use Illuminate\Support\Facades\DB;

/**
 * Trait HasPermissions.
 */
trait HasPermissions
{
    use InteractsWithPermissions;

    /**
     * Many-to-many permission-user relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::$NM,
            Permission::$PERMISSION_USER_TABLE,
            Permission::$PERMISSION_USER_USER_KEY,
            Permission::$PERMISSION_USER_PERMISSION_KEY
        )->withPivot(Permission::$PERMISSION_USER_PIVOT_VALUE, Permission::$PERMISSION_USER_PIVOT_EXPIRES);
    }

    /**
     * @param Model $parent
     * @param array $attributes
     * @param string $table
     * @param bool $exists
     *
     * @return PermissionUserPivot
     */
    public function newPivot(EloquentModel $parent, array $attributes, $table, $exists)
    {
        $permissionModel = Permission::$NM; // app()['config']->get('defender.permission_model');

        if ($parent instanceof $permissionModel) {
            return new PermissionUserPivot($parent, $attributes, $table, $exists);
        }

        return parent::newPivot($parent, $attributes, $table, $exists);
    }

//    public function attachPermission($permission)
//    {
//
//        $table = DB::table(Permission::$PERMISSION_USER_TABLE);
////        $recno_last = $table->select($this->getRecnoColumn())
////            ->orderBy($this->getRecnoColumn(), 'desc')
////            ->first();
////
////        if ($recno_last == null) {
////            $recno_last = 1;
////        } else {
////            $recno_last = $recno_last->{$this->getRecnoColumn()};
////            $recno_last = $recno_last != null ? intval($recno_last) : 1;
////        }
//        $data[$this->getRecnoColumn()] = $this->auto_increment_recno_table($table);
//
//        if (!$this->hasPermission($permission)) {
//            $this->permissions()->attach($permission, $data);
//        }
//    }

}
