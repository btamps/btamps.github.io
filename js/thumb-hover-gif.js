$(document).ready(function() {
  // checks for mobile screens
  if ( $(window).width() > 768) {
    // png and gif swap
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
