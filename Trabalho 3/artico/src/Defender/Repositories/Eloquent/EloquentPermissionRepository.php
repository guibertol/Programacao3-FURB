<?php

namespace Artico\Defender\Repositories\Eloquent;

use Artico\Defender\Permission;
use Artico\Defender\Role;
use Illuminate\Contracts\Foundation\Application;
use Artico\Defender\Exceptions\PermissionExistsException;
use Artico\Defender\Contracts\Repositories\PermissionRepository;
use Carbon\Carbon;

/**
 * Class EloquentPermissionRepository.
 */
class EloquentPermissionRepository extends AbstractEloquentRepository implements PermissionRepository
{

    /**
     * @param Application $app
     * @param Permission $model
     */
    public function __construct(Application $app, Permission $model)
    {
        parent::__construct($app, $model);
    }

    public function findByName($name)
    {
        return $this->model->where(Permission::$COL_NAME, '=', $name)->first();
    }


    /**
     * Create a new permission using the given name.
     *
     * @param string $permissionName
     * @param string $readableName
     *
     * @throws PermissionExistsException
     *
     * @return Permission
     */
    public function create($permissionName, $readableName = null)
    {
        if (!is_null($this->findByName($permissionName))) {
            throw new PermissionExistsException('The permission ' . $permissionName . ' already exists'); // TODO: add translation support
        }

        // Do we have a display_name set?
        $readableName = is_null($readableName) ? $permissionName : $readableName;

        return $permission = $this->model->create([
            Permission::$COL_NAME => $permissionName,
            Permission::$COL_READABLE_NAME => $readableName,
        ]);
    }

    /**
     * @param array $rolesIds
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByRoles(array $rolesIds)
    {
        return $this->model->whereHas('roles', function ($query) use ($rolesIds) {
            $query->whereIn(Role::$PK, $rolesIds);
        })->get();
    }

    /**
     * @param $user
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActivesByUser($user)
    {
        $table = $user->permissions()->getTable();

        //TODO: converter a data
        return $user->permissions()
            ->where($table . '.' . Permission::$PERMISSION_USER_PIVOT_VALUE, true)
            ->where(function ($q) use ($table) {
                $q->where($table . '.' . Permission::$PERMISSION_USER_PIVOT_EXPIRES, '>=', Carbon::now());
                $q->orWhereNull($table . '.' . Permission::$PERMISSION_USER_PIVOT_EXPIRES);
            })
            ->get();
    }
}
