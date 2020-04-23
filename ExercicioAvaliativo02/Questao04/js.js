function carregar(){

    var filmes = Array();

    var filme = new Object();
    filme.nome = "Transformer 5";
    filme.genero = "ficção científica/Ação";
    filmes.push(filme);

    var filme = new Object();
    filme.nome = "O poço";
    filme.genero = "ficção científica/Terror";
    filmes.push(filme);

    var filme = new Object();
    filme.nome = "Pânico";
    filme.genero = "suspense/terror";
    filmes.push(filme);

    var body = document.body;

    for(i=0;i<filmes.length;i++){

        containerFilme = document.createElement("div");
        containerNome = document.createElement("h1");
        containerGenero = document.createElement("h3");

        textNome = document.createTextNode(filmes[i].nome);
        textGenero = document.createTextNode(filmes[i].genero);

        containerNome.appendChild(textNome);
        containerGenero.appendChild(textGenero);

        containerFilme.appendChild(containerNome);
        containerFilme.appendChild(containerGenero);
        containerFilme.setAttribute("class", "filme");

        body.appendChild(containerFilme);
  
    }


}