// WIDGET V1 PROXY
(function() {

    // save reference to the Support Center main <iframe>
    var mainFrame = null;
    var pollTimer = setInterval(function() {
      mainFrame = document.querySelector('.nanorep-iframe') || document.getElementById('supportFrame');
      if (mainFrame) {
        clearInterval(pollTimer);
      }
    }, 100);

    // initializeNS function copied from Base.js
    function initializeNS(_namespace) {
        var _split = _namespace.split(".");
        var obj, parent = window;
        for (var i = 0; i < _split.length; ++i) {
            obj = parent[_split[i]];
            if (typeof (obj) === 'undefined' || !obj) parent[_split[i]] = obj = {};
            parent = obj;
        }
        return obj;
    }

    // _it function copied from shortcuts.js
    function _it(arr, func, backwards) {
        var i, result;
        if (!backwards) {
            for (i = 0; i < arr.length; ++i) {
                result = func(arr[i], i);
                if (result === false) break;
            }
        } else {
            for (i = arr.length - 1; i >= 0; --i) {
                result = func(arr[i], i);
                if (result === false) break;
            }
        }
    }

    // initializeNS() and _it() must be global - used by chatProviders.js
    window.initializeNS = window.initializeNS || initializeNS;
    window._it = window._it || _it;

    // preload nanorep SDK loader
    var initChatProviders = function(domain, callback) {
        // handle callbacks
        if (initChatProviders.loaded) {
            if (callback) callback();
        } else if (initChatProviders.loading) {
            if (callback) initChatProviders.callbacks.push(callback);
            return;
        }

        // prepare callback queue
        initChatProviders.loading = true;
        initChatProviders.callbacks = [];
        if (callback) initChatProviders.callbacks.push(callback);

        // execute all pending callbacks
        var loadHandler = function() {
            for (var i = 0; i < initChatProviders.callbacks.length; i++) {
                initChatProviders.callbacks[i]();
            }
        };

        // prepare nanorep namespace
        window.ISQ = window.ISQ || {};
        ISQ.Widget = ISQ.Widget || {};

        // load chat providers via script
        var loaderSrc = '//' + domain + '/widget/scripts/chatProviders.js';
        var script = document.createElement('script');
        script.async = true;
        script.defer = true;

        script.onreadystatechange = script.onload = function() {
            script.onreadystatechange = script.onload = null;
            if (!initChatProviders.loaded) {
                initChatProviders.loaded = true;
                loadHandler();
            }
            document.body.removeChild(script);
        };
        script.setAttribute('src', loaderSrc);
        document.body.appendChild(script);
    };

    // create widget object simulation
    var widgetData = (function() {
        return {
            cdcUser: {
                sendMessage: function(data) {
                    mainFrame.contentWindow.postMessage({
                        subject: 'nrMidProxyV1',
                        data: data
                    }, '*');
                }
            }
        };
    }());

    // listen for chat related events from the intermediate proxy
    window.addEventListener('message', function(e) {
        var message = e && e.data;
        if (message && (message.subject === 'loadChat' || message.subject === 'startCustomChat')) {
            initChatProviders(message.domain, function() {
                // parse config
                message.config = eval('(' + message.config + ')');

                // initialize chat provider in the top most page
                ISQ.Widget.Proxy.Chat[message.config.active].start(message.subject, message.config, widgetData);
            });
        }
    }, false);
}());




// SDK / AD WIDGET proxy
(function() {

    // save reference to the Support Center main <iframe>
    var mainFrame = null;
    var pollTimer = setInterval(function() {
      mainFrame = document.querySelector('.nanorep-iframe') || document.getElementById('supportFrame');
      if (mainFrame) {
        clearInterval(pollTimer);
      }
    }, 100);

    // preload nanorep SDK loader
    var initSDK = function(domain, callback) {
        // handle callbacks
        if (initSDK.loaded) {
            if (callback) callback();
        } else if (initSDK.loading) {
            if (callback) initSDK.callbacks.push(callback);
            return;
        }

        // prepare callback queue
        initSDK.loading = true;
        initSDK.callbacks = [];
        if (callback) initSDK.callbacks.push(callback);

        // execute all pending callbacks
        var loadHandler = function() {
            for (var i = 0; i < initSDK.callbacks.length; i++) {
                initSDK.callbacks[i]();
            }
        };

        // get SDK loader via script
        var loaderSrc = '//' + domain + '/sdk/index.repo?bundles=loader,channeling';
        var script = document.createElement('script');
        script.async = true;
        script.defer = true;

        script.onreadystatechange = script.onload = function() {
            script.onreadystatechange = script.onload = null;
            if (!initSDK.loaded) {
                initSDK.loaded = true;
                loadHandler();
            }
            document.body.removeChild(script);
        };
        script.setAttribute('src', loaderSrc);
        document.body.appendChild(script);
    };

    // API proxy handler
    var executeFunction = function(funcName, args) {

        // variables
        var pluckList = funcName.split('.'),
            pluckObject = window,
            pluckProperty = null;

        for (var i = 0; i < pluckList.length; i++) {
            // skip optional window statement
            pluckProperty = pluckList[i];
            if (i === 0 && pluckList[i] === 'window') {
                continue;
            }
            if (i < pluckList.length - 1) {
                pluckObject = pluckObject[pluckProperty];
            }
        }

        // wrap function
        var wrapFunction = function(funcId) {
            return function() {
                // TODO: omptimize here (allow only JSON argument types)
                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args[i] = JSON.parse(JSON.stringify(arguments[i]));
                }

                var postMessageObject = {
                    type: 'APIProxy',
                    funcId: funcId,
                    args: args
                }

                mainFrame.contentWindow.postMessage(postMessageObject, '*');
            };
        };

        // replace functions in arguments with placeholder functions
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === 'string' && args[i].indexOf('_funcId') === 0) {
                args[i] = wrapFunction(args[i]);
            }
        }

        pluckObject[pluckProperty].apply(pluckObject, args);
    };

    // listen for messages from support center displayed as an <iframe>
    addEventListener('message', function(e) {
        var data = e.data;
        if (data && data.type === 'APIProxy' && mainFrame.src.indexOf(e.origin) === 0) {
            initSDK(data.domain, function() {
                executeFunction(data.func, data.args);
            });
        }
    });

}());