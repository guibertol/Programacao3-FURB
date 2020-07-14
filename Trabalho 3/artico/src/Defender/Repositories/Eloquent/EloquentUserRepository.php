<?php

namespace Artico\Defender\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Contracts\Foundation\Application;
use Artico\Defender\Contracts\Repositories\UserRepository;

class EloquentUserRepository extends AbstractEloquentRepository implements UserRepository
{
    public function __construct(Application $app, EloquentModel $user)
    {
        parent::__construct($app, $user);
    }
    
    public function attachRole($roleName)
    {
        return $this->model->attachRole($roleName);
    }
    
    public function attachPermission($permissionName, array $options = [])
    {
        return $this->model->attachPermission($permissionName, $options);
    }
}
