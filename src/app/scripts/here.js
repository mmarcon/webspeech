/*global jQuery: true*/
(function(w, $){
    'use strict';
    var A = w.APP = w.APP || {},
        Config = A.Config;

    function search(center, term) {
        var url = Config.HERE_PLACES_URL.replace('{LAT}', center.latitude)
            .replace('{LON}', center.longitude)
            .replace('{TERM}', term),
            deferred = $.Deferred();

        $.ajax({url: url}).done(function(response){
            if(response && response.results && response.results.items) {
                deferred.resolve(response.results.items);
            }
        }).fail(function(){
            deferred.reject();
        });
        return deferred.promise();
    }

    A.search = search;
}(window, jQuery));