$(document).ready(function() {
 var isDesktop = (function() {
  return !('ontouchstart' in window) // works on most browsers
  || !('onmsgesturechange' in window); // works on ie10
 })();
 //edit, if you want to use this variable outside of this closure, or later use this:
 window.isDesktop = isDesktop;
 if( isDesktop ){
   $(".thumbnail").hover(
     function() {
       var src = $(this).find(".hover-png").attr("src");
       $(this).find(".hover-png").attr("src", src.replace(/\.png$/i, ".gif"));
     },
     function() {
       var src = $(this).find(".hover-png").attr("src");
       $(this).find(".hover-png").attr("src", src.replace(/\.gif$/i, ".png"));
     }
   );
 }
});
