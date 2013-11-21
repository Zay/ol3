goog.provide('ol.format');


/**
 * @param {function(Object, function(this: S, ol.Feature): T, S=)} reader
 *     Reader.
 * @param {Object} object Object.
 * @return {Array.<ol.Feature>}
 * @template S,T
 */
ol.format.readAllFromObject = function(reader, object) {
  var features = [];
  reader(object, function(feature) {
    features.push(feature);
  });
  return features;
};