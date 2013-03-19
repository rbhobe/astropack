var StrUtils = function DataUtils() {};

StrUtils.toSafeSelectorStr = function(displayName) {
    var safeName = displayName;
    safeName = safeName.toLowerCase(); // to lower case
    safeName = safeName.replace(/[^a-zA-Z0-9_-]/g,'-'); // replace special chars with hyphen
    safeName = safeName.replace(/-+$|(-)+/g, '$1'); // remove multiple hyphens to replace with a single one
    return safeName;
}