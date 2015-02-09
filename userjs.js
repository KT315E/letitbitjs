'use strict';

/* global GM_xmlhttpRequest */

var md5 = require('./lib/md5');

/* подпись запроса */
function sign(url, appid) {
	var scope = [];

	scope.push('kAY54boSH+'); 	// salt 1
	scope.push( url.split('/').slice(0, -1).join('/') + "/" );
	scope.push(appid);					//appid
	scope.push(50);							// sp
	scope.push('gUnS60oleO^'); // salt 2

	return md5(md5( scope.join("|") ));
}

/* формирует строку запроса к АПИ */
function createPostData(url) {
	var appid = md5(Math.random().toString());

	var apiqs = {
		action: "LINK_GET_DIRECT",
		link: url,
		appid: appid,
		version: 3,
		free_link: 1,
		sh: sign(url, appid),
		sp: 50
	};

	return Object.keys(apiqs).map(function(key){
		return key + "=" + apiqs[key];
	}).join("&");
}


function main() {
	/* jshint -W064 */

	GM_xmlhttpRequest({
		method: "POST",
		url: "http://api.letitbit.net/internal/index4.php",
		data: createPostData( document.getElementById('link_for_downloader').value ),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": ""
		},
		onload: function(xhr) {
			var data = xhr.responseText.split('\n');

			if ( data[0].toLowerCase() == "ok" ) {
				console.log( data[2] );
			} else {
				console.log( 'что-то пошло не так...', data );
			}
		},
		onerror: function() {
			console.error('error');
		}
	});
}

window.addEventListener('DOMContentLoaded', main, false);
window.prompt = null;
