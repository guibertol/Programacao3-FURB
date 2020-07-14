

let MetasClientesRepresentante = function () {

    let self = this;

    let produto_list_clientes = $('#produto-list-clientes');
    let $container = $('#produto-list-clientes').closest('.table');

    $.extend(self, {

        loading: function (status) {

            var loaderClass = 'loader';
            status == true ? $container.addClass(loaderClass) : $container.removeClass(loaderClass);
        },
        
        init: function (cod_representante) {

            metasClientesRepresentante.loading(true);

            $.ajax({
                url: base_url + '/api/cad_programacao/repres/' + cod_representante,
                type: 'GET',
                error: function () {
                    throw new Error('Não foi possível carregar as Metas');
                },
                success: function (itens) {

                    metasClientesRepresentante.loading(false);
                    
                    let $template = '';

                    for(let i = 0; i < itens.length; i++) {

                        let jan = 0; let fev = 0;  let mar = 0; let abr = 0;
                        let mai = 0; let jun = 0; let jul = 0; let ago = 0;
                        let set = 0; let out = 0; let nov = 0; let dez = 0;

                        let cliente = null; 
                        cliente = itens[i].ZCA_CLIENT;

                        for(let j = 0; j < itens.length; j++) {

                            if(cliente == itens[j].ZCA_CLIENT) {

                                if(itens[j].EMISSAO == "JAN") {
                                    jan = jan + parseInt(itens[j].SOMA_TOTAL)
                                } else if(itens[j].EMISSAO == "FEV") {
                                    fev = fev + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "MAR") {
                                    mar = mar + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "ABR") {
                                    abr = abr + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "MAI") {
                                    mai = mai + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "JUN") {
                                    jun = jun + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "JUL") {
                                    jul = jul + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "AGO") {
                                    ago = ago + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "SET") {
                                    set = set + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "OUT") {
                                    out = out + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "NOV") {
                                    nov = nov + parseInt(itens[j].SOMA_TOTAL);
                                } else if(itens[j].EMISSAO == "DEZ") {
                                    dez = dez + parseInt(itens[j].SOMA_TOTAL);
                                }
                            }

                        }

                        $template += `<tr>                  
                                        <td class="borda_lateral">${itens[i].A1_NOME}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJAN}</td>
                                        <td class="borda_lateral">${jan}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMFEV}</td>
                                        <td>${fev}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMMAR}</td>
                                        <td>${mar}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMABR}</td>
                                        <td>${abr}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMMAI}</td>
                                        <td>${mai}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJUN}</td>
                                        <td>${jun}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJUL}</td>
                                        <td>${jul}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMAGO}</td>
                                        <td>${ago}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMSET}</td>
                                        <td>${set}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMOUT}</td>
                                        <td>${out}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMNOV}</td>
                                        <td>${nov}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMDEZ}</td>
                                        <td>${dez}</td>
                                </tr>`;

                    }                  

                    produto_list_clientes.append($template);
                }
            });
        }

    });

}

let metasClientesRepresentante = new MetasClientesRepresentante();

window.metasClientesRepresentante = metasClientesRepresentante;