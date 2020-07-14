<?php

namespace Artico\Defender\Exceptions;

/**
 * Class ForbiddenException.
 */
class ForbiddenException extends DefenderException
{
    /**
     * @param string $message
     */
    public function __construct($message = 'Você não tem permissão de acesso a esse recurso')
    {
        parent::__construct($message);
    }
}
