<?php

namespace Artico\Defender\Traits\Permissions;

use Artico\Defender\Permission;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Trait InteractsWithPermissions.
 */
trait InteractsWithPermissions
{
    /**
     * Attach the given permission.
     *
     * @param array|\Artico\Defender\Permission $permission
     * @param array $options
     */
    public function attachPermission($permission, array $options = [])
    {
        if (!is_array($permission)) {
            if ($this->existPermission($permission->name)) {
                return;
            }
        }
        
        $table = DB::table(Permission::$PERMISSION_USER_TABLE);
        //joga data atual + 365 dias no campo ZB5_DTEXPI
        $date = date_create(date('Ymd'));
        date_add($date,date_interval_create_from_date_string("365 days"));
        
        $this->permissions()->attach($permission, [
            $this->getRecnoColumn() => $this->auto_increment_recno_table($table),
            //'value' => array_get($options, 'value', true),
            'ZB5_VALOR' => array_get($options, 'ZB5_VALOR', 120),
            //'expires' => array_get($options, 'expires', null),
            //'ZB5_DTEXPI' => array_get($options, 'ZB5_DTEXPI', date('Ymd')),
            'ZB5_DTEXPI' => array_get($options, 'ZB5_DTEXPI', date_format($date,'Ymd')),
        ]);
    }

    /**
     * Get the a permission using the permission name.
     *
     * @param string $permissionName
     *
     * @return bool
     */
    public function existPermission($permissionName)
    {
        $permission = $this->permissions->first(function ($key, $value) use ($permissionName) {
            return ($value->name == $permissionName);
        });

        if (!empty($permission)) {
            $active = (is_null($permission->pivot->expires) or $permission->pivot->expires->isFuture());

            if ($active) {
                return (bool)$permission->pivot->value;
            }
        }

        return false;
    }

    /**
     * Alias to the detachPermission method.
     *
     * @param \Artico\Defender\Permission $permission
     *
     * @return int
     */
    public function revokePermission($permission)
    {
        return $this->detachPermission($permission);
    }

    /**
     * Detach the given permission from the model.
     *
     * @param \Artico\Defender\Permission $permission
     *
     * @return int
     */
    public function detachPermission($permission)
    {
        return $this->permissions()->detach($permission);
    }

    /**
     * Sync the given permissions.
     *
     * @param array $permissions
     *
     * @return array
     */
    public function syncPermissions(array $permissions)
    {
        return $this->permissions()->sync($permissions);
    }

    /**
     * Revoke all user permissions.
     *
     * @return int
     */
    public function revokePermissions()
    {
        return $this->permissions()->detach();
    }

    /**
     * Revoke expired user permissions.
     *
     * @return int|null
     */
    public function revokeExpiredPermissions()
    {
        $expiredPermissions = $this->permissions()->wherePivot('expires', '<', Carbon::now())->get();

        if ($expiredPermissions->count() > 0) {
            return $this->permissions()->detach($expiredPermissions->modelKeys());
        }

        return;
    }

    /**
     * Extend an existing temporary permission.
     *
     * @param string $permission
     * @param array $options
     *
     * @return bool|null
     */
    public function extendPermission($permission, array $options)
    {
        foreach ($this->permissions as $_permission) {
            if ($_permission->name === $permission) {
                return $this->permissions()->updateExistingPivot(
                    $_permission->id,
                    array_only($options, ['value', 'expires'])
                );
            }
        }

        return;
    }
}
