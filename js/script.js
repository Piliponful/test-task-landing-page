$(function() {
  if(window.innerHeight < 1186)
    $('.cycle-slideshow').attr('data-cycle-carousel-visible', '2');
  // ==========================HAMBURGER===========================
  $('.phone__caret').click(function() {
    $('.phone__secondary').toggleClass('hidden');
  });

  // ==========================SMOTH SCROLL===========================
  var menu = $('.menu')

  $('a[href*="#"]:not([href="#"])').click(function(e) {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  // ==========================HAMBURGER===========================
  var nav = $('.menu');
  $('.hamburger-menu').on('click', hamburger);

  // ==========================FIXED MENU===========================
  var navWrapper = $('.menu-wrapper');
  var cover = $('.cover');
  var coverTop = cover.offset().top;

  $(window).resize(function() {
    coverTop = cover.offset().top
  });

  $(window).scroll(stickyMenu);

  function stickyMenu() {
    if($(window).scrollTop() > coverTop)
      navWrapper.addClass('fixed');
    else
      navWrapper.removeClass('fixed');
  }

  function hamburger() {
    var navH = nav.height();
    $('.bar').toggleClass('animate');
    if(navH === 205) nav.css('height', '0');
    if(navH === 0) nav.css('height', '205px');
  }
})