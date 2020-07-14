<?php

namespace Artico\Defender\Contracts\Repositories;

/**
 * Interface PermissionRepository.
 */
interface PermissionRepository extends AbstractRepository
{
    /**
     * Create a new permission using the given name.
     *
     * @param string $permissionName
     * @param string $readableName
     *
     * @throws \Artico\Defender\Exceptions\PermissionExistsException
     *
     * @return \Artico\Defender\Permission;
     */
    public function create($permissionName, $readableName = null);

    /**
     * @param array $rolesIds
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByRoles(array $rolesIds);
}
