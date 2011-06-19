(function($) {

  $.fn.imgMap = function(element, options) {

    if (typeof options === 'undefined') {
      var options = element || {};
      var self = $(this);
    }
    else {
      var self = element;
    }

    var defaults = {
      data : {},
      borderWidth : '5px',
      borderColor : 'red',
      borderType : 'solid',
      borderWidthOver : this.borderWidth,
      borderColorOver : this.borderColor,
      borderTypeOver : this.borderOver,
      opacity : 0.3,
      opacityOver : 0.6
    };

    options = $.extend(defaults, options);

    var data = ($.type(options.data) === 'object') ? [options.data] : options.data;

    var el = document.createElement('div'),
    div = $(el).css({
      'z-index' : 1,
      top : '0px',
      left : '0px',
      position : 'absolute',
      display : options.display,
      border : options.borderWidth + ' ' + options.borderType + ' ' + options.borderColor,
      opacity : options.opacity
    });

    self.css('position', 'relative');
    
    div.bind({
      mouseover : function() {
        $(this).css({
          borderWidth : options.borderWidthOver,
          opacity : options.opacityOver
        });
      },
      mouseout: function() {
        $(this).css({
          borderWidth : options.borderWidth,
          opacity : options.opacity
        });
      }
    });

    function px(int) {
      return int.toString() + 'px';
    }

    $.map(data, function(obj, i) {
      var tag = div.clone(true).css({
        left : px(obj.start_x),
        top : px(obj.start_y),
        width : px(obj.end_x - obj.start_x),
        height : px(obj.end_y - obj.start_y)
      });

      self.append(tag);
    });

  };

})(jQuery);
