<?php

namespace Artico\Defender\Repositories\Eloquent;

use Artico\Defender\Role;
use Illuminate\Contracts\Foundation\Application;
use Artico\Defender\Exceptions\RoleExistsException;
use Artico\Defender\Contracts\Repositories\RoleRepository;

/**
 * Class EloquentRoleRepository.
 */
class EloquentRoleRepository extends AbstractEloquentRepository implements RoleRepository
{
    /**
     * @param Application $app
     * @param Role $model
     */
    public function __construct(Application $app, Role $model)
    {
        parent::__construct($app, $model);
    }

    public function findByName($name)
    {
        return $this->model->where(Role::$COL_NAME, '=', $name)->first();
    }

    /**
     * Create a new role with the given name.
     *
     * @param $roleName
     *
     * @throws \Exception
     *
     * @return Role
     */
    public function create($roleName)
    {
        if (!is_null($this->findByName($roleName))) {
            // TODO: add translation support
            throw new RoleExistsException('A role with the given name already exists');
        }

//        $last_item = $this->model->orderBy(Role::$PK, 'desc')->first();
//        if ($last_item == null)
//            $last_id = 0;
//        else
//            $last_id = $last_item[Role::$PK];

//        $role = new $this->model;
//        $role[Role::$PK] = ++$last_id;
//        $role[Role::$ROLE_NAME] = $roleName;
//        return $role = $this->model->create([Role::$ROLE_NAME => $roleName]);
//        dd($role->toArray());
//        $role->save();
//        return $role;
        return $role = $this->model->create([Role::$COL_NAME=> $roleName]);
    }
}
