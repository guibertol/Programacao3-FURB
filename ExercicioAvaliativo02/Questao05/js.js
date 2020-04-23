function calcular(){

    var numero1 = parseInt(document.getElementById('numero1').value);
    var numero2 = parseInt(document.getElementById('numero2').value);
    var numero3 = parseInt(document.getElementById('numero3').value);
    var soma = numero1+numero2+numero3;

    var tipo = '';

    if(soma % 2 === 0){
        tipo = "Numero par";
    }else{
        tipo = "Numero impar";
    }

    alert(soma+', '+tipo);

}