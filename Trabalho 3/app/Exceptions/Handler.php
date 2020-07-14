<?php

namespace App\Exceptions;

use Artico\Defender\Exceptions\ForbiddenException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

use Log;
use App\Mail\ExceptionOccuredMail;
use Mail;
use Symfony\Component\Debug\ExceptionHandler as SymfonyExceptionHandler;
use Symfony\Component\Debug\Exception\FlattenException;

class Handler extends ExceptionHandler{

    //A list of the exception types that should not be reported.
    protected $dontReport = [
        HttpException::class,
        ModelNotFoundException::class,
    ];

    //Report or log an exception. This is a great spot to send exceptions to Sentry, Bugsnag, etc.
    public function report(Exception $e){

        //send email exception
        $this->sendEmailException($e); 
        return parent::report($e);
    
    }

    //Render an exception into an HTTP response.
    public function render($request, Exception $e){

        if($e instanceof ModelNotFoundException){
            $e = new NotFoundHttpException($e->getMessage(), $e);
        }
        
        if($e instanceof ForbiddenException){
            
            if($request->ajax()){
                return response()->json(['mensagem' => $e->getMessage()], 403);
            }
                
            return response()->view('errors.403', ['mensagem' => $e->getMessage()]);
        
        }
        
        if($e instanceof NotFoundException){ 
            
            if($request->ajax()){
                return response()->json(['mensagem' => $e->getMessage()], 404);
            }
                
            return response()->view('errors.404', ['mensagem' => $e->getMessage()]);
        
        }
    
        return parent::render($request, $e);
    
    }

    //TODO - Método | Enviar e-mail quando houver erros
    //Sends an email to the developer about the exception.
    public function sendEmailException(Exception $exception){

        /*try {
            $emails = 'analista.ti@artico.com.br';
            mail_php('emails.sem_valor_reportar', ['mensagem' => 'aaaa'],  $emails, 'Artico – Preço não cadastrado');
            Log::warning('Ocorreu um erro e foi enviado um e-mail');
        } catch (Exception $ex) {
            Log::warning($ex);
        }*/

    }

}
