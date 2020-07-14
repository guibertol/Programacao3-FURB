

let url_origin = window.location.origin;

if(url_origin == "http://portal.artico.com.br"){

    function newPopUp() {
        window.open("http://portal.artico.com.br/vendedor/tabela/desconto","tabela","width=1000, height=500");
    }

}else{ 
    
    //localhost

    function newPopUp() {
        window.open("http://localhost/portal2.dev/public/vendedor/tabela/desconto","tabela","width=1000, height=500");
    }

}


$('.fa-bars').on('click', function() {
    if($('.menu_mobile').hasClass('menu_mobile_mostra')) {
        
        $('.menu_mobile').removeClass('menu_mobile_mostra');               
    } else {            

        $('.menu_mobile').addClass('menu_mobile_mostra'); 
    }
});
