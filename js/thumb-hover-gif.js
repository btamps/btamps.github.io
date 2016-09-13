$(document).ready(function() {
  if ( $(window).width() > 768) {
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
