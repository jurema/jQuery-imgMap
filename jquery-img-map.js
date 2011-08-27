(function($) {

  function px(num) {
    return String(num) + 'px';
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
      opacity : 0.3,
      opacityOver : 0.6
    };

    options = $.extend(defaults, options);
    options.fxDuration = !options.fx ? 0 : options.fxDuration;

    var data = ($.type(options.data) === 'object') ? [options.data] : options.data,
    el = document.createElement('div'),
    div = $(el);
    
    self.css('position', 'relative').find('img').load(function() {
      self.find('._tags').fadeTo(options.fxDuration, options.opacity);
    });

    div.prop('class', '_tags').css({
      'z-index' : 1,
      top : '0px',
      left : '0px',
      position : 'absolute',
      border : options.borderWidth + ' ' + options.borderType + ' ' + options.borderColor,
      opacity : options.onLoad ? 0 : options.opacity
    }).bind({
      mouseover : function() {
        $.imgMap.lastEventIndex = parseInt($(this).attr('class').split(" ")[1].replace("tag_", ""));
        $(this).animate({
          opacity : options.opacityOver
        }, options.fxDuration);
      },
      mouseout : function() {
        $(this).animate({
          opacity : options.opacity
        }, options.fxDuration);
      }
    });

    $(data).each(function(i, obj) {
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
        lastEventIndex : null,
        settings : options, // exposing settings for further reference
        on : function(index, time, duration, cb) {
          if (opt_opacity) options.opacity = opt_opacity;
          var tags = (index || index === 0) ? $('.tag_' + String(index)) : $('._tags'),
          unlock = true;
          setTimeout(function() {
            tags.animate({
              opacity : options.opacity === 0.0 ? opt_opacity : options.opacity
            }, duration || options.fxDuration, function() {
              if (unlock && cb) {
                unlock = false;
                return cb();
              }
            });
          }, time || 0);
        },
        off : function(index, time, duration, cb) {
          if (options.opacity !== 0.0) {
            opt_opacity = options.opacity;
            options.opacity = 0.0;
          }
          var tags = (index || index === 0) ? $('.tag_' + String(index)) : $('._tags'),
          unlock = true;
          setTimeout(function() {
            tags.animate({
              opacity : 0.0
            }, duration || options.fxDuration, function() {
              if (unlock && cb) {
                unlock = false;
                return cb();
              }
            });
          }, time || 0);
        }
      }
    });
  };

})(jQuery);
