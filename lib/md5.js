'use strict';

var md5 = require('spark-md5');

module.exports = function (str) {
	return md5.hash(str);
};
