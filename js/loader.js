/**
 * Helper module for manipulating model.
 * @export TGNS.loader
 */
(function (TGNS, jQuery) {

    /**
     * Thick helper for the model of the MVC.
     * @constructor
     */
    function Loader() {
        // join is cheaper than concatenation of strings.
        var url = [this._BASEURL,
            this._GETLIST,
            this._APIKEY,
            this._FORMAT].join("");
        this.loadData(url, false, this._loadListSuccessHandler);
    }

    /**
     * Url to the Flickr data.
     * @private
     */
    Loader.prototype._BASEURL = "http://api.flickr.com/services/rest/";

    /**
     * API call to the Flickr data. (List)
     * @private
     */
    Loader.prototype._GETINFO = "?method=flickr.photos.getInfo";

    /**
     * API call to the Flickr data. (Info)
     * @private
     */
    Loader.prototype._GETLIST = "?method=flickr.interestingness.getList";

    /**
     * API key to the Flickr data.
     * @private
     */
    Loader.prototype._APIKEY = "&api_key=b6bac310f1dbf7f541e9be21eed24122";

    /**
     * Format of the response and the name of the local callback to process jsonp.
     */
    Loader.prototype._FORMAT = "&format=json&jsoncallback=this._jsonpCallback";

    /**
     * Local reference to the actual data. The loader is building up this.
     * @private
     */
    Loader.prototype._data = null;

    /**
     * Object for ajax request. Now it's XMLHttpRequest but XDomainRequest should be used for IE for crossdomaining.
     * @private
     */
    Loader.prototype._ajaxObj = null;

    /**
     * Sips the data from the Flickr server.
     * @public
     * @param {String} url
     * @param {Boolean} async
     * @param {Function} successCallback
     * @param {Number} i
     */
    Loader.prototype.loadData = function (url, async, successCallback, i) {

        if (window.XMLHttpRequest) {
            this._ajaxObj = new XMLHttpRequest();
        } else {
            this._ajaxObj = new ActiveXObject("Microsoft.XMLHTTP");
        }
        this._ajaxObj.onreadystatechange = successCallback.bind(this, i);
        this._ajaxObj.open("GET", url, async);
        this._ajaxObj.send();
    };

    /**
     * Callback for jsonp. Must be evaled on successful request.
     * @private
     * @param {JSON string} data
     * @return {JSON string} data
     */
    Loader.prototype._jsonpCallback = function(data) {
        return data;
    };

    /**
     * Callback for processing ajax request for List. The word success is a remnant from jquery times.
     * TODO Refactor this.
     * @private
     * @param {Number} i
     */
    Loader.prototype._loadListSuccessHandler = function (i) {

        if (this._ajaxObj.readyState == 4 && this._ajaxObj.status == 200) {

            var data = eval(this._ajaxObj.responseText);

            if (!data.message) {
                this._data = data.photos.photo;
                this._insertData();
            } else {
                alert("Flickr api error occured accessing interestingness list: " + data.message);
            }

        }
    };

    /**
     * Cconstructs and inserts the urls into the data.
     * @private
     */
    Loader.prototype._insertData = function () {

        for (var i = 0; i < this._data.length; i++) {

            var urlArr, entry = this._data[i];

            try {
                urlArr = ["http://farm",
                    entry.farm,
                    ".staticflickr.com/",
                    entry.server,
                    "/",
                    entry.id,
                    "_",
                    entry.secret];

                entry.urlSmall = encodeURI(urlArr.join("") + "_s.jpg");
                entry.urlBig = encodeURI(urlArr.join("") + ".jpg");
                entry.title = ( entry.title || "Nice photo");

            } catch(err) {
                txt = "There was an error processing the data.\n\n";
                txt += "Error description: " + err.message + "\n\n";
                console.log(txt);
                entry.urlSmall = "#";
                entry.urlBig = "#";
                entry.title = "unknown";
            }
        }
    };

    /**
     * Requests for upload info to the Flicr server.
     * TODO The data should enter the model for later use.
     * @public
     * @param {Number} i
     * @param {String} id
     */
    Loader.prototype.loadOneEntry = function (i, id) {

        var urlAjax = [this._BASEURL,
            this._GETINFO,
            this._APIKEY,
            "&photo_id=" + id,
            this._FORMAT].join("");

        this.loadData(urlAjax, false, this._loadInfoSuccessHandler, i);
    };

    /**
     * Callback for processing ajax request for image Info. The word success is a remnant from jquery times.
     * TODO Refactor this.
     * @private
     * @param {Number} i
     */
    Loader.prototype._loadInfoSuccessHandler = function (i) {

        if (this._ajaxObj.readyState == 4 && this._ajaxObj.status == 200) {
            var data = eval(this._ajaxObj.responseText), entry = this._data[i];

            if (!data.message) {
                pubsubz.publish( 'imageinfoloaded',  {
                                                        urlSmall: entry.urlSmall,
                                                        info: this._constructImageInfo(new Date().getTime() - new Date(parseInt(data.photo.dates.posted) * 1000).getTime()),
                                                        title: entry.title,
                                                        i: i});
            } else {
                alert("Flickr api error occured accessing image info: " + data.message);
            }
        }
    };

    /**
     * Constructs image info based on the elapsed time.
     * @private
     * @param {Number} diffTime
     * @return {String} text
     */
    Loader.prototype._constructImageInfo = function (diffTime) {

        var text = "Uploaded:", weeks, days, hours, minutes;

        minutes = Math.round((diffTime / (1000 * 60)) % 60);
        hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
        days = Math.floor((diffTime / (1000 * 60 * 60 * 24)) % 7);
        weeks = Math.floor((diffTime / (1000 * 60 * 60 * 24 * 7)) % 52);

        if (weeks) {
            text += weeks + " week";
            if (weeks >= 2) text += "s";
            if (!days) {
                text += " ago";
                return text;
            }
        }

        if (days) {
            text += " " + days + " day";
            if (days >= 2) text += "s";
            if (!hours) {
                text += " ago";
                return text;
            }
        }

        if (hours) {
            text += " " + hours + " hour";
            if (hours >= 2) text += "s";
            if (!minutes) {
                text += " ago";
                return text;
            }
        }

        if (minutes) {
            text += " " + minutes + " minute";
            if (minutes >= 2) text += "s";
            text += " ago";
        }

        return text;
    };

    /**
     * Returns the processed data for the model.
     * @public
     * @return {Object} this._data
     */
    Loader.prototype.returnDynData = function () {

        return this._data;
    };

    TGNS.loader = Loader;

}(TGNS, jQuery));