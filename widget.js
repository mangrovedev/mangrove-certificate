(function() {
  document.addEventListener('DOMContentLoaded', function(event) {
  //the event occurred
    var widget_link, iframe, i, widget_links;
    widget_links = document.getElementsByClassName('certificate-registration-widget');
    for (i = 0; i < widget_links.length; i++) {
      widget_link = widget_links[i];
      iframe = document.createElement('iframe');
      iframe.setAttribute('src', widget_link.href);
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '600');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.style.cssText="margin:0 auto";
      iframe.onload = function(){
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
      }
      widget_link.parentNode.replaceChild(iframe, widget_link);
    }
  });

})();
