<?php

namespace Artico\Defender\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * Class Defender.
 */
class Defender extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'defender';
    }
}
