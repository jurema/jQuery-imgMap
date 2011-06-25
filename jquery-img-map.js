(function($) {

  function px(int) {
    return int.toString() + 'px';
  }

  $.fn.imgMap = function(element, options) {

    if (typeof options === 'undefined') {
      options = element || {};
      var self = $(this);
    }
    else {
      var self = element;
    }

    var defaults = {
      data : {},
      fx : true,
      fxDuration : 400,
      onLoad : true, // show the tags after the image is fully loaded
      borderWidth : '5px',
      borderColor : 'red',
      borderType : 'solid',
      borderColorOver : this.borderColor,
      borderTypeOver : this.borderOver,
      opacity : 0.3,
      opacityOver : 0.6
    };

    options = $.extend(defaults, options);

    if (!options.fx) {
      options.fxDuration = 0;
    }

    var data = ($.type(options.data) === 'object') ? [options.data] : options.data,
    el = document.createElement('div'),
    onLoad = options.onLoad,
    div = $(el);
    
    self.find('img').load(function() {
      self.find('._tags').fadeTo(options.fxDuration, options.opacity);
    });

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
        $(this).animate({
          opacity : options.opacityOver
        }, options.fxDuration);
      },
      mouseout: function() {
        $(this).animate({
          opacity : options.opacity
        }, options.fxDuration);
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
