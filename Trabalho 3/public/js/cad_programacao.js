
let FiltroCadView = function () {

    let self = this;

    let select_clientes = $('#select-clientes');
    let select_representantes = $('#select-representantes');
    let select_gerentes = $('#select-gerentes');
    let gerentes = $('.gerentes');
    let select_anoref = $('#select-anoref'); 

    let selectize_clientes = null;
    let selectize_representantes = null;
    let selectize_gerentes = null;
    let selectize_anoref = null;

    let anos = [];
    anos.push(
        {'ano':'2019'},
        {'ano':'2020'},
        {'ano':'2021'},
        {'ano':'2022'},
        {'ano':'2023'},
        {'ano':'2024'},
        {'ano':'2025'});

    $.extend(self, {

        init: function () {

            select_anoref.selectize({
                valueField: 'ano',
                labelField: 'ano',
                options: anos
            });

            //selectize_anoref = select_anoref[0].selectize;

            select_clientes.selectize({
                persist: true,
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome', 'cnpj'],
                preload: true,
                initData: false,
                render: {
                    option: function (item, escape) {
                        var label = item.nome || '-';
                        var caption = item.cnpj && item.cnpj.trim().length > 0 ? item.cnpj : '-'; //Format.cnpj(item.cnpj)
                        return '<div>' +
                            '<span class="label">' + escape(label) + '</span>' +
                            (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                            '</div>';
                    }
                },
                load: function (query, callback) {
                    var select = selectize_clientes;
                    if (select.settings.initData) {
                        //console.log('pre-carregamento-cliente');
                        callback(clientes);
                        select.settings.initData = false;
                    } else
                        $.ajax({
                            url: base_url + '/api/cliente/combobox',
                            type: 'GET',
                            data: {
                                cnpj: query,
                                nome: query,
                                take: 10,
                                exclude_user: false
                            },
                            error: function () {
                                callback();
                            },
                            success: function (res) {
                                callback(res);
                            }
                        });
                },
            });
            //        select_clientes.removeClass('hidden');
            

            selectize_clientes = select_clientes[0].selectize;

            select_representantes.selectize({
                persist: true,
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome', 'cgc'],
                preload: true,
                initData: false,
                render: {
                    option: function (item, escape) {
                        var label = item.nome || '-';
                        var caption = item.cgc && item.cgc.trim().length > 0 ? item.cgc : '-'; //Format.cnpj(item.cnpj)
                        return '<div>' +
                            '<span class="label">' + escape(label) + '</span>' +
                            (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                            '</div>';
                    }
                },
                load: function (query, callback) {
                    var select = selectize_representantes;
                    if (select.settings.initData) {
                        //console.log('pre-carregamento-cliente');
                        callback(representantes);
                        select.settings.initData = false;
                    } else
                        $.ajax({
                            url: base_url + '/api/representante/combobox',
                            type: 'GET',
                            data: {
                                cgc: query,
                                nome: query,
                                take: 10,
                                exclude_user: false
                            },
                            error: function () {
                                callback();
                            },
                            success: function (res) {
                                callback(res);
                            }
                        });
                },
                onChange: function (cod_repres) {

                    /*filtroCadView.loading(true);
                    //Busca o gerente vinculado
                    $.ajax({
                        url: base_url + '/api/gerente/combobox/' + cod_repres,
                        type: 'GET',
                        error: function () {
                            throw new Error('Erro ao buscar gerente');
                        },
                        success: function (gerente) {
                            

                            selectize_gerentes.load(function (callback){
                                
                                selectize_gerentes.enable();
                                callback(gerente);
                                
                                selectize_gerentes = select_gerentes[0].selectize.addItem(gerente[0].id, true);  
                                filtroCadView.loading(false);
                            });
                        }
                    });*/
                }
            });            

            selectize_representantes = select_representantes[0].selectize;

            select_gerentes.selectize({
                persist: true,
                valueField: 'id',
                labelField: 'nome',
                searchField: ['nome', 'cgc'],
                preload: true,
                initData: false,
                render: {
                    option: function (item, escape) {
                        var label = item.nome || '-';
                        var caption = item.cgc && item.cgc.trim().length > 0 ? item.cgc : '-'; //Format.cnpj(item.cnpj)
                        return '<div>' +
                            '<span class="label">' + escape(label) + '</span>' +
                            (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                            '</div>';
                    }
                },
                load: function (query, callback) {
                    var select = selectize_representantes;
                    if (select.settings.initData) {
                        //console.log('pre-carregamento-cliente');
                        callback(representantes);
                        select.settings.initData = false;
                    } else
                        $.ajax({
                            url: base_url + '/api/gerente/combobox',
                            type: 'GET',
                            data: {
                                cgc: query,
                                nome: query,
                                take: 10,
                                exclude_user: false
                            },
                            error: function () {
                                callback();
                            },
                            success: function (res) {
                                callback(res);
                            }
                        });
                }
            });   

            selectize_gerentes = select_gerentes[0].selectize;
        }
    }); 

}

let AddMetas = function () {

    let self = this;
    let btn_add_metas = $('#btn-add-metas');
    let janeiro = $('#jan');
    let fevereiro = $('#fev');
    let marco = $('#mar');
    let abril = $('#abr');
    let maio = $('#mai');
    let junho = $('#jun');
    let julho = $('#jul');
    let agosto = $('#ago');
    let setembro = $('#set');
    let outubro = $('#out');
    let novembro = $('#nov');
    let dezembro = $('#dez');
    let select_clientes = $('#select-clientes');
    
    $.extend(self, {
        init: function () {

            //btn_add_metas.prop('disabled', true);

            /*dezembro.on('keyup', function () {

                if(select_clientes.val() != '' && janeiro.val() != '' && fevereiro.val() != '' && marco.val() != '' && 
                    abril.val() != '' && maio.val() != '' && junho.val() != '' && julho.val() != '' && agosto.val() != '' &&
                    setembro.val() != '' && outubro.val() != '' && novembro.val() != '' && dezembro.val() != '') {

                    btn_add_metas.prop('disabled', false);
                }
            });*/

        }
    });
}

let MetasCadastradas = function () {

    let self = this;

    let produto_list = $('#produto-list');
    let $container = $('#produto-list').closest('.table');

    $.extend(self, {
        loading: function (status) {

            let loader = 'loader';

            status === true ? $container.addClass(loader) : $container.removeClass(loader);

        },
        init: function () {

            metasCadastradas.loading(true);

            $.ajax({
                url: base_url + '/api/cad_programacao/itens',
                type: 'GET',
                error: function () {
                    throw new Error('Não foi possível carregar as Metas');
                },
                success: function (itens) {

                    metasCadastradas.loading(false);

                    let $template = '';

                    for(let i = 0; i < itens.length; i++) {

                        $template += `<tr>                  
                                        <td class="borda_lateral">${itens[i].A1_NOME}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJAN}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMFEV}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMMAR}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMABR}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMMAI}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJUN}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMJUL}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMAGO}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMSET}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMOUT}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMNOV}</td>
                                        <td class="borda_lateral">${itens[i].ZCB_ITMDEZ}</td>
                                </tr>`;

                    }                  

                    produto_list.append($template);
                }
            });

        }
    });
}

let filtroCadView = new FiltroCadView();
let addMetas = new AddMetas();
let metasCadastradas = new MetasCadastradas();

window.filtroCadView = filtroCadView;
window.addMetas = addMetas;
window.metasCadastradas = metasCadastradas;


