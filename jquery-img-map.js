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
    });
    
    var eachOpt = {};

    $(data).each(function(i, obj) {
      var class = 'tag_' + i,
      tag = div.clone(true).addClass(class).css({
        left : px(obj.start_x),
        top : px(obj.start_y),
        width : px(obj.end_x - obj.start_x),
        height : px(obj.end_y - obj.start_y)
      });

      eachOpt[String(i)] = {
        timeOut : null,
        opacityOver : options.opacityOver,
        opacity : options.opacity,
        opacityTmp : options.opacity,
        status : options.opacity === 0.0 ? false : true,
        running : false
      };

      self.append(tag);
    });

    function setEvent (t, out, off) {
      var index = t.prop('class').split(' ').pop().replace('tag_', '');
      $.imgMap.lastEventIndex = parseInt(index);
      t.animate({
        opacity : out ? $.imgMap._eachSettings[index][off ? 'opacity' : 'opacityTmp'] : $.imgMap._eachSettings[index].opacityOver
      }, options.fxDuration);
    }

    $('._tags').bind({
      mouseover : function() {
        setEvent($(this), null, true);
      },
      mouseout : function() {
        setEvent($(this), true, true);
      }
    });

    $.extend({
      imgMap : {
        lastEventIndex : null,
        settings : options, // exposing settings for further reference
        _eachSettings : eachOpt,
        on : function(index, time, duration, over, cb) {
          if (index || index === 0) {
            var tags = $('.tag_' + String(index));
            options = $.imgMap._eachSettings[String(index)];
            options.running = true;
            options.status = true;
          }
          else {
            var tags = $('._tags');
          }

          var unlock = true;
          var t = setTimeout(function() {
            tags.animate({
              opacity : over ? options.opacityOver : options.opacityTmp
            }, duration || options.fxDuration, function() {
              if (unlock && cb) {
                unlock = false;
                if (index || index === 0) options.running = false;
                return cb();
              }
            });
          }, time || 0);

          if (index || index === 0) {
            options.timeOut = t;
            $('.tag_'+index).unbind('mouseover mouseout').bind({
              mouseover : function() {
                setEvent($(this));
              },
              mouseout : function() {
                setEvent($(this), true);
              }
            });
          }
          else {
            var set = $.imgMap._eachSettings;
            for (var i in set) {
              set[String(i)].status = true;
              set[String(i)].opacity = set[String(i)].opacityTmp;
            }

            $('._tags').unbind('mouseover mouseout').bind({
              mouseover : function() {
                setEvent($(this));
              },
              mouseout : function() {
                setEvent($(this), true);
              }
            });
          }
        },
        off : function(index, time, duration, cb) {
          if (index || index === 0) {
            var tags = $('.tag_' + String(index));
            options = $.imgMap._eachSettings[String(index)];
            options.running = true;
            options.status = false;
          }
          else {
            var tags = $('._tags');
          }

          var unlock = true;
          var t = setTimeout(function() {
            tags.animate({
              opacity : 0.0
            }, duration || options.fxDuration, function() {
              if (unlock && cb) {
                unlock = false;
                if (index || index === 0) options.running = false;
                return cb();
              }
            });
          }, time || 0);

          if (index || index === 0) {
            options.timeOut = t;
            $('.tag_'+index).unbind('mouseover mouseout').bind({
              mouseover : function() {
                setEvent($(this), null, true);
              },
              mouseout : function() {
                setEvent($(this), true, true);
              }
            });
          }
          else {
            var set = $.imgMap._eachSettings;
            for (var i in set) {
              set[String(i)].status = false;
              set[String(i)].opacity = 0.0;
            }

            $('._tags').unbind('mouseover mouseout').bind({
              mouseover : function() {
                setEvent($(this), null, true);
              },
              mouseout : function() {
                setEvent($(this), true, true);
              }
            });
          }
        }
      }
    });
  };

})(jQuery);
