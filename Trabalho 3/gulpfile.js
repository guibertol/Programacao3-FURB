var elixir = require('laravel-elixir');
require('laravel-elixir-compress');


var path = {
    'bower': '../../../bower_components/',
    'public': 'public/',
    'public_js': 'public/js/'
};
elixir(function (mix) {
    mix.sass('app.scss');
    mix.sass('admin.scss');
    mix.sass('pdf.scss');

    mix.scripts([
        path.bower + "jquery/dist/jquery.js",
        "String.js",
    ], path.public_js + 'libs_cliente.js');

    mix.scripts([
        "pedido/api.js",
        "pedido/controller.js",
        "pedido/view.js",
    ], path.public_js + 'pedido.js');

    mix.scripts([
        path.bower + "jquery/dist/jquery.js",
        path.bower + "jquery-maskmoney/dist/jquery.maskMoney.js",
        path.bower + "jquery-mask-plugin/dist/jquery.mask.js",
        path.bower + "selectize/dist/js/standalone/selectize.js",
        path.bower + "sweetalert/dist/sweetalert.min.js",
        path.bower + "moment/min/moment.min.js",
        path.bower + "moment/locale/pt-br.js",
        path.bower + "bootstrap-sass/assets/javascripts/bootstrap/transition.js",
        path.bower + "bootstrap-sass/assets/javascripts/bootstrap/collapse.js",
        path.bower + "bootstrap-sass/assets/javascripts/bootstrap.min.js",
        path.bower + "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
        "libs/highcharts/highcharts.js",
        "fv/formValidation.js",
        "fv/framework/bootstrap.js",
        "fv/language/pt_BR.js"
    ], path.public_js + 'libs_admin_core.js');

    mix.scripts([
        "String.js",
        "number_format.js",
        "format.js",
        "round.js",
        "initial.js",
    ], path.public_js + 'libs_admin.js');

    mix.scripts([
        "csrf-token.js",
        "ppe/checkAll.js",
        "ppe/mask.js",
    ], path.public_js + 'site.js');
    //mix.compress();
});

