$(document).ready(function() {
  toggleFields();
});

function toggleFields() {
  $('#typeselector').change(function(){
    $('#output').load( '/js/contact-' + $('#typeselector').val() + '.html' ).slideDown(500);
  });
}
