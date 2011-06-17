(function($) {

  $.fn.imgMap = function(element, options) {

    if (typeof options === 'undefined') {
      options = element;
      var self = element;
    }
    else {
      var self = $(this);
    }

    var default = {
      data : {},
      borderWidth : '2px',
      borderColor : 'red',
      borderType : 'solid',
      display : 'none'
    };

    $.extend(default, options);

    if ($.type(options.data) === 'object') {
      var data = [data];
    }

    self.css('position', 'relative');
    var el = document.createElement('div'),
    div = $(el).css({
      'z-index' : 1,
      top : '0px',
      left : '0px',
      position : 'absolute',
      display : options.display,
      border : options.borderWidth + ' ' + options.borderType + ' ' + options.borderColor
    });
    
    div.bind('mouseenter mouseleave', function() {
      $(this).fadeToggle();
    });

    function px(int) {
      return int.toString() + 'px';
    }

    $.map(data, function(obj) {
      div.clone().css({
        left : px(obj.start_x),
        top : px(obj.start_y),
        width : px(obj.start_x - obj.end_x),
        height : px(obj.start_y - obj.end_y)
      });
    });

  };

})(jQuery);
