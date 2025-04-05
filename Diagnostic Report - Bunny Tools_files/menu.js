// toggler
$(".navbar-toggler").click(function () {
    $('.mobile-nav').toggleClass('animateScale')
});

$("#solutions-menu-button a.nav-link").click(function (e) {
    e.preventDefault();
    if ($("#solutions-menu-button ul").hasClass("active")) {
        $("#solutions-menu-button ul").removeClass("active");
    }
    else {
        $("#solutions-menu-button ul").addClass("active");
    }
});
$("#products-menu-button a.nav-link").click(function (e) {
    e.preventDefault();
    if ($("#products-menu-button ul").hasClass("active")) {
        $("#products-menu-button ul").removeClass("active");
    }
    else {
        $("#products-menu-button ul").addClass("active");
    }
});