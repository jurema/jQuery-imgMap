(function($) {

  function px(int) {
    return int.toString() + 'px';
  }

  $.fn.imgMap = function(element, options) {

    var self = element;
    if (typeof options === 'undefined') {
      options = element || {};
      self = $(this);
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

    $.map(data, function(obj, i) {
      var tag = div.clone(true).addClass('tag_' + i).css({
        left : px(obj.start_x),
        top : px(obj.start_y),
        width : px(obj.end_x - obj.start_x),
        height : px(obj.end_y - obj.start_y)
      });

      self.append(tag);
    });

    var opt_opacity;
    $.extend({
      imgMap : {
        settings : options, // exposing settings for further reference
        on : function(index) {
          if (opt_opacity) {
            options.opacity = opt_opacity;
          }
          var tags = (index || index === 0) ? tags = $('.tag_' + index.toString()) : $('.tags');
          tags.animate({
            opacity : options.opacity === 0.0 ? opt_opacity : options.opacity
          }, options.fxDuration);
        },
        off : function(index) {
          if (options.opacity !== 0.0) {
            opt_opacity = options.opacity;
            options.opacity = 0.0;
          }
          var tags = (index || index === 0) ? $('.tag_' + index.toString()) : $('.tags');
          tags.animate({
            opacity : 0.0
          }, options.fxDuration);
        }
      }
    });
  };

})(jQuery);
