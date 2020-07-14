$.fn['appCheckAll'] = function () {
    var handle = '#selectAll';
    var checks = '.checkAll';

    var self = this;
    if (self.length == 0)
        self = $(handle);

    return self.each(function () {
        var $select = $(this);

        var $checks = $(checks);
        $select.change(function () {
            $checks.prop('checked', $(this).prop("checked"));
        });

        $checks.click(function (e) {  //on click
            $checks.each(function () {
                if (!this.checked) {
                    $select.prop('checked', false);
                    return false;
                }
            });
        });

    });
};
