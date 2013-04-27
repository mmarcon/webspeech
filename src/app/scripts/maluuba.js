/*global jQuery: true*/
(function(w, $){
    'use strict';
    var A = w.APP = w.APP || {},
        Config = A.Config;

    A.MaluubaParser = function(apikey){
        this._epInterpret = Config.MALUUBA_INTERPRET_URL;
        this.apikey = apikey || Config.MALUUBA_API_KEY;
    };

    A.MaluubaParser.prototype.interpret = function(transcript){
        var deferred =  $.Deferred();
        if(!transcript) {
            deferred.reject(0);
        } else {
            $.ajax({
                url: this._epInterpret,
                data: {
                    apikey: this.apikey,
                    phrase: transcript
                }
            }).done(function(data){
                if(data.action === 'BUSINESS_SEARCH') {
                    deferred.resolve(data.entities && data.entities.searchTerm);
                } else {
                    deferred.reject(1);
                }
            }).fail(function(){
                deferred.reject(2);
            });
        }
        return deferred.promise();
    };


}(window, jQuery));