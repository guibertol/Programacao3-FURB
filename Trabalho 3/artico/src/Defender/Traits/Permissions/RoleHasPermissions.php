<?php

namespace Artico\Defender\Traits\Permissions;

use Artico\Defender\Permission;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Artico\Defender\Pivots\PermissionRolePivot;

/**
 * Trait RoleHasPermissions.
 */
trait RoleHasPermissions
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
            Permission::$PERMISSION_ROLE_TABLE,
            Permission::$PERMISSION_ROLE_ROLE_KEY,
            Permission::$PERMISSION_ROLE_PERMISSION_KEY
        )->withPivot(Permission::$PERMISSION_ROLE_PIVOT_VALUE, Permission::$PERMISSION_ROLE_PIVOT_EXPIRES);
    }

    /**
     * @param EloquentModel $parent
     * @param array $attributes
     * @param string $table
     * @param bool $exists
     *
     * @return PermissionRolePivot|\Illuminate\Database\Eloquent\Relations\Pivot
     */
    public function newPivot(EloquentModel $parent, array $attributes, $table, $exists)
    {
        $permissionModel = Permission::$NM; // app()['config']->get('defender.permission_model');

        if ($parent instanceof $permissionModel) {
            return new PermissionRolePivot($parent, $attributes, $table, $exists);
        }
        return parent::newPivot($parent, $attributes, $table, $exists);
    }
}
