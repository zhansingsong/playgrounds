;(function(win, pl) {
    var meta = {};
    var event = function(){
      var fnlist = {},
          listen,
          trigger,
          remove;
      listen = function(e, fn){
        if(!fnlist[e]){
          fnlist[e] = [];
        }
        fnlist[e].push(fn);
      };
      trigger = function(e){
        var key = [].shift.call(arguments),
            fns = fnlist[key];
        if(!fns || fns.length === 0){
          return false;
        }
        for(var i = 0, fn; fn = fns[i++];){
          fn.apply(this, arguments);
        }
      };
      remove = function(e, fn){
        var fns = fnlist[e];
        if(!fns){
          return false;
        }
        if(!fn){
          fns && (fns.length = 0);
        } else {
          for(var j = 0, l = fns.length; j < l; j--){
            if(fn === fns[j]){
              fns.splice(j, 1);
            }
          }
        }
      }

      return{
        listen: listen,
        trigger: trigger,
        remove: remove
      }
    }();
    var timer;
    var resizeCB = function(){
      if(win.innerWidth > win.innerHeight){
        meta.current = 'l';
      } else {
        meta.current = 'p';
      }
      return function(){
        console.log('resizeCB');
        if(win.innerWidth > win.innerHeight){
          if(meta.current !== 'l'){
            meta.current = 'l';
            event.trigger('M', meta);
          }
        } else {
          if(meta.current !== 'p'){
            meta.current = 'p';
            event.trigger('M', meta);
          }
        }
      }
    }();
    pl.event = event;
    win.addEventListener('resize', function(){
      timer && win.clearTimeout(timer);
      timer = win.setTimeout(resizeCB, 300);
    }, false);
    // event.listen('M', function(event){  
    //   pl.on && pl.on.call(pl, event); 
    // });
  })(window, window['pl'] || (window['pl'] = {}));