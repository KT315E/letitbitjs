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

function draw(url){
	// создаём кнопку-скачалку
	var a = document.createElement("a");
	a.href = url;
	a.className = "highlight-s";
	a.textContent = "download";
	a.style.textTransform = "uppercase";
	a.style.font = "400 20px/2 Tahoma, Arial, sans-serif";
	a.style.display = "block";
	a.target = "_blank";

	var before = document.getElementById("page-content-wrapper");
	before.parentNode.insertBefore(a, before);

	// создаём кнопку-попрошайку
	var donate = '<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/small.xml?account=41001781731116&quickpay=small&any-card-payment-type=on&button-text=06&button-size=m&button-color=black&targets=UserJS&default-sum=50&successURL=" width="212" height="42"></iframe>';
	var domparser = new DOMParser();

	var donateDocument = domparser.parseFromString(donate, "text/html");
	before.parentNode.insertBefore(donateDocument.body.firstChild, before);
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
				draw( data[2] );
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
