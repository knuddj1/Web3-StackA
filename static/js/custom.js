$(function () {
    setUpSidebar();
});

function setUpSidebar(){
    var sidebar = $("#sidebar");
    var overlay = $(".overlay");
    var merged = $.merge(sidebar, overlay);

    sidebar.mCustomScrollbar({theme: "minimal"});

    $('#dismiss').add(overlay).on('click', function () {
        merged.removeClass('active');
    });
    
    $('#sidebarCollapse').on('click', function () {
        merged.addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
}
    
