/*global jQuery: true, $: true */
(function(w, $){
    'use strict';
    var A = w.APP = w.APP || {},
        /*Config = A.Config,*/
        map = $('.map'), msg = $('.message'), btn = $('button'),
        input = $('input'), dl = $('dl'),
        resultTpl = $('#result').html().trim(),
        recognitionEngine, listening, transcript, interimTranscript,
        interpretEngine = new A.MaluubaParser(),
        hereImg = map.data('hereimg');

    function checkCompatibility() {
        return 'webkitSpeechRecognition' in window;
    }

    function _translateMessage(to) {
        msg[0].style['-webkit-transform'] = 'translateY(' + to + ')';
        msg[0].style['-moz-transform'] = 'translateY(' + to + ')';
        msg[0].style['-o-transform'] = 'translateY(' + to + ')';
        msg[0].style['-ms-transform'] = 'translateY(' + to + ')';
        msg[0].style.transform = 'translateY(' + to + ')';
    }

    function showMessage(message, error) {
        var deferred = $.Deferred();
        if(error) {
            msg.addClass('error');
        } else {
            msg.removeClass('error');
        }

        msg.text(message);
        _translateMessage(0);

        setTimeout(function(){
            _translateMessage('-50px');
            msg.one('webkitTransitionEnd', function(){
                deferred.resolve();
            });
        }, 2300);
        return deferred.promise();
    }

    function initMap(position){
        map.jHERE({
            enable: ['behavior', 'zoombar'],
            type: ['smart'],
            center: position.coords,
            zoom: 15
        });

        //I want to create a marker that can't be deleted, so I'll
        //have to go the advanced way...
        map.jHERE('originalMap', function(map, here){
            var permanentMarkers = new here.map.Container(),
                currentPositionMarker = new here.map.Marker(position.coords, {
                    icon: hereImg,
                    anchor: { x: 12, y: 12 }
                });
            map.objects.add(permanentMarkers);
            permanentMarkers.objects.add(currentPositionMarker);
        });
    }

    function positionError(){
        initMap({
            coords: [52.5, 13.3]
        });
        showMessage('Error detecting position', true);
    }

    function search(term){
        if(!term) {
            return;
        }

        A.search(map.jHERE().center, term)
        .done(function(results){
            map.jHERE('nomarkers');
            dl.empty();
            results.length = Math.min(results.length, 3);

            results.forEach(function(r, i){
                r.name = r.title;
                r.address = r.vicinity;
                r.index = i + 1;
                dl.append($.tmpl(resultTpl, r));

                map.jHERE('marker', r.position, {
                    fill: '#3cb371',
                    text: r.index,
                    textColor: '#ffffff',
                    stroke: '#ffffff'
                });
            });
            //jHERE recipe: zoom to a zoom level that shows all the objects
            //added to the map, no matter how they were added (jHERE or standard API)
            map.jHERE('originalMap', function(map) {map.zoomTo(map.getBoundingBox());});
        });
    }

    function capture(){
        if(listening) {
            return recognitionEngine.stop();
        }
        showMessage('Ask anything...');
        transcript = '';
        interimTranscript = '';
        recognitionEngine.start();
    }

    function bindEvents(){
        btn.on('click', capture);
        $(document).on('keypress', function(event){
            if(event.which === 115) {
                capture();
            }
        });

        input.on('keypress', function(e){
            e.stopPropagation();
            if(event.which === 13) {
                search($(this).val());
            }
        });

        $('form').on('submit', function(e){
            e.preventDefault();
        });
    }

    function initSpeechRecognition(){
        recognitionEngine = new webkitSpeechRecognition();
        recognitionEngine.continuous = true;
        recognitionEngine.interimResults = true;
        listening = false;

        recognitionEngine.onstart = function(){
            listening = true;
            transcript = '';
            btn.addClass('listening');
        };

        recognitionEngine.onerror = function(/*e*/){
            listening = false;
            if (interimTranscript) {
                showMessage('An error occurred. Trying my best...', true);
            } else {
                showMessage('An error occurred. Try again.', true);
            }
        };

        recognitionEngine.onresult = function(event){
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                    //Ok, looks like it's final, let's just stop the engine
                    listening = false;
                    recognitionEngine.stop();
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognitionEngine.onend = function(/*e*/){
            listening = false;
            btn.removeClass('listening');

            interpretEngine.interpret(transcript)
            .done(function(terms){
                terms = terms || [];
                input.val(terms.join(' '));
                showMessage('Got it! Searching...');
                search(terms.join(' '));
            })
            .fail(function(code){
                if(code === 0) {
                    return showMessage('You must say something...', true);
                }
                showMessage('Recognition failed :(', true);
            });
        };
    }

    A.init = function(){
        if(checkCompatibility()) {
            bindEvents();
            initSpeechRecognition();
            w.navigator.geolocation.getCurrentPosition(function(position){
                showMessage('Your position has been detected')
                    .then(function(){showMessage('Press "S" and start speaking!');});
                initMap(position);
            }, positionError);
        } else {
            initMap({
                coords: [52.5, 13.3]
            });
            showMessage('Web Speech Not Supported :(', true);
        }
    };

}(window, jQuery));

$(window).on('load', function(){
    'use strict';
    window.APP.init();
});