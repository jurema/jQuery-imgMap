(function($) {

  function px(int) {
    return int.toString() + 'px';
  }

  $.fn.imgMap = function(element, options, onLoad) {

    if (typeof options === 'undefined' || typeof options === 'boolean') {
      onLoad = options;
      options = element || {};
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
    div = $(el);
    
    if (onLoad) {
      self.find('img').load(function() {
        self.find('._tags').fadeTo(400, options.opacity);
      });
    }

    div.prop('class', '_tags').css({
      'z-index' : 1,
      top : '0px',
      left : '0px',
      position : 'absolute',
      border : options.borderWidth + ' ' + options.borderType + ' ' + options.borderColor,
      opacity : onLoad ? 0 : options.opacity
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

    window.imgMap = {
      _data : data // exposing the data for further reference
    };

    $.map(data, function(obj, i) {
      var tag = div.clone(true).addClass('tag_' + i).css({
        left : px(obj.start_x),
        top : px(obj.start_y),
        width : px(obj.end_x - obj.start_x),
        height : px(obj.end_y - obj.start_y)
      });

      self.append(tag);
    });
  };

})(jQuery);
