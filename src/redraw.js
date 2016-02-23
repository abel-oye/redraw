/**
 * @param  {number} relWinth    相对的宽度
 *                  基于设计稿由多少尺寸的宽度
 * @param  {number} relFontSize 相对的字体大小
 */
!(function(relWinth, relFontSize) {
	/**
	 * 适配场景：
	 *	1、html data-mw最大宽度，data-mw-selector最大宽度选择器
	 *
	 */
	var ua = navigator.userAgent,
		isIos = /iphone|ipad|ipod/i.test(ua),
		isAndroid = /android/ig.test(ua),
		isMobile = /Mobile/i.test(ua) || isIos || isAndroid;

	var meta = document.querySelector('[name=viewport]') || (function() {
			var _meta = document.createElement('meta');
			_meta.name = 'viewport';
		})(),
		content = meta.content || '',
		matchScale = content.match(/initial\-scale=([\d\.]+)/),
		//定宽的场景
		matchWidth = content.match(/width=([\d\.]+)/),
		dpr = isIos ? window.devicePixelRatio ? Math.min(window.devicePixelRatio, 3) : 1 : 1, //非ios默认1
		docEl = document.documentElement,
		maxWidth = dpr * (docEl.dataset.mw || 750),
		scale = 1 / dpr,
		tid;

	relWinth = relWinth || 320;
	relFontSize = relFontSize || 16;

	if (meta) {
		if (matchScale) {
			content = content.replace(/initial\-scale=([\d\.]+)/, 'initial-scale=' + scale);
		} else {
			content += ',initial-scale=' + scale;
		}

		meta.content = content.replace(/minimum\-scale=([\d\.]+)/, 'minimum-scale=' + scale)
			.replace(/maximum\-scale=([\d\.]+)/, 'maximum-scale=' + scale);

	} else {
		meta = doc.createElement('meta');
		meta.name = 'viewport';
		meta.content = content;
		docEl.firstElementChild.appendChild(meta);
	}

	var redraw = function() {
			var width = docEl.getBoundingClientRect().width;
			//采用不超过最大宽度的尺寸做为rem参照，最大尺寸也要按照缩放比例之后进行比较
			var fz = Math.min(width, maxWidth) / relWinth * relFontSize;
			//var fz = dpr / 2 * 16;
			docEl.style.fontSize = fz + 'px';
		}
		//简单判断是否为移动端
	if (isMobile) {
		window.addEventListener('resize', function() {
			clearTimeout(tid);
			tid = setTimeout(redraw, 300);
		}, false);
		redraw();
	} else {
		docEl.style.fontSize = '16px';
	}
})(320, 16);