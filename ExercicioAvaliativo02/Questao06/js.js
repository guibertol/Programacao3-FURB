function calcular(){

    var numero1 = parseInt(document.getElementById('numero1').value);
    var fatorial = calcular_fatorial(numero1);
    document.getElementById("resposta").innerHTML = "<p>Resultado: "+fatorial+"</p>";

}

function calcular_fatorial(num){

    var fatorial=1;

    for(var x=1; x<=num; x++){
        fatorial=fatorial*x;
    }

    return fatorial;

}