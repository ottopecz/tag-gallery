/**
 * Module for model.
 * @export TGNS.taggallerymodel
 */
(function (TGNS) {

    /**
     * Thin model of the MVC. Carries the the data, and its getters and setters.
     * @constructor
     */
    function TagGalleryModel() {

        // The position of the last loaded element.
        this._model.endFocus = 4;
    }

    /**
     * Local reference to the model itself.
     * @private
     */
    TagGalleryModel.prototype._model = {};

    /**
     * Getter for photos.
     * @public
     * @return {Object} this._model.photos
     */
    TagGalleryModel.prototype.getPhotos = function () {

        return this._model.photos;
    };

    /**
     * Setter for photos.
     * @public
     * @param {Object} photos
     */
    TagGalleryModel.prototype.setPhotos = function (photos) {

        this._model.photos = photos;
    };

    /**
     * Getter for endFocus.
     * @public
     * @return {Object} this._model.endFocus
     */
    TagGalleryModel.prototype.getEndFocus = function () {

        return this._model.endFocus;
    };

    /**
     * Setter for endFocus.
     * @public
     * @param {Number} newEndFocus
     */
    TagGalleryModel.prototype.setEndFocus = function (newEndFocus) {

        this._model.endFocus = newEndFocus;
    }

    TGNS.taggallerymodel = TagGalleryModel;
}(TGNS));