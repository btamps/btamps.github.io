$(document).ready(function()
{
    $(".thumbnail").hover(
        function() {
          var src = $(this).find(".hover-png").attr("src");
          $(this).find(".hover-png").attr("src", src.replace(/\.png$/i, ".gif"));
        },
        function() {
          var src = $(this).find(".hover-png").attr("src");
          $(this).find(".hover-png").attr("src", src.replace(/\.gif$/i, ".png"));
        });
});
