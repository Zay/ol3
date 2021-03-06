goog.provide('ol.tilegrid.Zoomify');

goog.require('goog.math');
goog.require('ol.TileCoord');
goog.require('ol.proj');
goog.require('ol.tilegrid.TileGrid');



/**
 * @constructor
 * @extends {ol.tilegrid.TileGrid}
 * @param {olx.tilegrid.ZoomifyOptions=} opt_options Options.
 * @todo stability experimental
 */
ol.tilegrid.Zoomify = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : options;
  goog.base(this, {
    origin: [0, 0],
    resolutions: options.resolutions
  });

};
goog.inherits(ol.tilegrid.Zoomify, ol.tilegrid.TileGrid);


/**
 * @inheritDoc
 */
ol.tilegrid.Zoomify.prototype.createTileCoordTransform = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};
  var minZ = this.minZoom;
  var maxZ = this.maxZoom;
  var tmpTileCoord = new ol.TileCoord(0, 0, 0);
  /** @type {Array.<ol.TileRange>} */
  var tileRangeByZ = null;
  if (goog.isDef(options.extent)) {
    tileRangeByZ = new Array(maxZ + 1);
    var z;
    for (z = 0; z <= maxZ; ++z) {
      if (z < minZ) {
        tileRangeByZ[z] = null;
      } else {
        tileRangeByZ[z] = this.getTileRangeForExtentAndZ(options.extent, z);
      }
    }
  }
  return (
      /**
       * @param {ol.TileCoord} tileCoord Tile coordinate.
       * @param {ol.proj.Projection} projection Projection.
       * @param {ol.TileCoord=} opt_tileCoord Destination tile coordinate.
       * @return {ol.TileCoord} Tile coordinate.
       */
      function(tileCoord, projection, opt_tileCoord) {
        var z = tileCoord.z;
        if (z < minZ || maxZ < z) {
          return null;
        }
        var n = Math.pow(2, z);
        var x = tileCoord.x;
        if (x < 0 || n <= x) {
          return null;
        }
        var y = tileCoord.y;
        if (y < -n || -1 < y) {
          return null;
        }
        if (!goog.isNull(tileRangeByZ)) {
          tmpTileCoord.z = z;
          tmpTileCoord.x = x;
          tmpTileCoord.y = -y - 1;
          if (!tileRangeByZ[z].contains(tmpTileCoord)) {
            return null;
          }
        }
        if (goog.isDef(opt_tileCoord)) {
          opt_tileCoord.z = z;
          opt_tileCoord.x = x;
          opt_tileCoord.y = -y - 1;
          return opt_tileCoord;
        } else {
          return new ol.TileCoord(z, x, -y - 1);
        }
      });
};
