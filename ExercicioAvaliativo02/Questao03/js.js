function carregar(){

    var data = Array();

    data.push("Titulo 1");
    data.push("Titulo 2");
    data.push("Titulo 3");
    data.push("Titulo 4");
    data.push("Titulo 5");

    var body = document.body;

    containerUl = document.createElement("ul");

    for(i=0;i<data.length;i++){

        containerLi = document.createElement("li");
        textNome = document.createTextNode(data[i]);
        containerLi.appendChild(textNome);

        containerUl.appendChild(containerLi);

        

    }

    containerTitulo = document.createElement("h1");
    extNome = document.createTextNode("Um titulo qualquer");
    containerTitulo.appendChild(extNome);
    
    body.appendChild(containerTitulo);
    body.appendChild(containerUl);

}