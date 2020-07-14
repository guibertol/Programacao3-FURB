<?php

namespace Artico\Defender\Traits\Users;

use Artico\Defender\Role;
use Illuminate\Support\Facades\DB;

/**
 * Trait HasRoles.
 */
trait HasRoles
{
    /**
     * Returns true if the given user has any of the given roles.
     *
     * @param string|array $roles array or many strings of role name
     *
     * @return bool
     */
    public function hasRoles($roles)
    {
        $roles = is_array($roles) ? $roles : func_get_args();

        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns if the given user has an specific role.
     *
     * @param string $role
     *
     * @return bool
     */
    public function hasRole($role)
    {
        return $this->roles
            ->where(Role::$COL_NAME, $role)
            ->first() != null;
    }


    /**
     * Attach the given role.
     *
     * @param \Artico\Defender\Role $role
     */
    public function attachRole($role)
    {

        $table = DB::table(Role::$ROLE_USER_TABLE);
//        $recno_last = $table->select($this->getRecnoColumn())
//            ->orderBy($this->getRecnoColumn(), 'desc')
//            ->first();
//
//        if ($recno_last == null) {
//            $recno_last = 1;
//        } else {
//            $recno_last = $recno_last->{$this->getRecnoColumn()};
//            $recno_last = $recno_last != null ? intval($recno_last) : 1;
//        }
        $data[$this->getRecnoColumn()] = $this->auto_increment_recno_table($table);

        if (!$this->hasRole($role)) {
            $this->roles()->attach($role, $data);
        }
    }

    /**
     * Many-to-many role-user relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
//        $roleModel =  //  config('defender.role_model', 'Artico\Defender\Role');
//        $roleUserTable = config('defender.role_user_table', 'role_user');
//        $roleKey = config('defender.role_key', 'role_id');

        return $this->belongsToMany(
            Role::$NM,
            Role::$ROLE_USER_TABLE,
            Role::$ROLE_USER_USER_KEY,
            Role::$ROLE_USER_ROLE_KEY
//            $roleModel, $roleUserTable, 'user_id', $roleKey
        );
    }

    /**
     * Detach the given role from the model.
     *
     * @param \Artico\Defender\Role $role
     *
     * @return int
     */
    public function detachRole($role)
    {
        return $this->roles()->detach($role);
    }

    /**
     * Sync the given roles.
     *
     * @param array $roles
     *
     * @return array
     */
    public function syncRoles(array $roles)
    {
        return $this->roles()->sync($roles);
    }
}
