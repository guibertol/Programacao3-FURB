<?php
$testado = shell_exec('git pull origin master && git log'); 
 echo '<pre>';
 echo $testado;

 ?>