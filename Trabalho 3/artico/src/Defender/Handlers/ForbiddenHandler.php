<?php

namespace Artico\Defender\Handlers;

use Artico\Defender\Exceptions\ForbiddenException;
use Artico\Defender\Contracts\ForbiddenHandler as ForbiddenHandlerContract;

class ForbiddenHandler implements ForbiddenHandlerContract
{
    public function handle()
    {
        throw new ForbiddenException;
    }
}
