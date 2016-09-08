
(function ($) {
	var pluginName = 'flyPanels';
	function Plugin(element, options) {
		var el = element;
		var $el = $(element);
		var innerHeight = window.innerHeight;
		var panelWidth;
		var redrawOnResize = true;
		var topBarHeight = parseInt($('.flypanels-topbar').css('height'), 10);
		var treeMenu = {
			init: false,
			expandHandler: 'a.expand'
		};
		options.treeMenu = $.extend({}, treeMenu, options.treeMenu);
		var search = {
			init: false,
			saveQueryCookie: false,
			searchPanel: $('.offcanvas').find('[data-panel="search"]')
		};
		options.search = $.extend({}, search, options.search);
		options = $.extend({}, $.fn[pluginName].defaults, options);
		function init() {
			setHeight();
			panelWidth = $('.flypanels-left').css('width');
			attachEvents();
			if (options.search.init) {
				initSearch();
			}
			if (options.treeMenu.init) {
				initTreeMenu();
			}
			$(document).ready(function () {
				$el.removeClass('preload');
			});
			hook('onInit');
		}

		function setHeight() {
			$('.flypanels-left').css('height', innerHeight);
			$('.flypanels-right').css('height', innerHeight);
			$('.flypanels-overlay').css('height', innerHeight);
		}

		function initTreeMenu() {
			if (kitUtils.isAndroid() || kitUtils.isIOS()) {
				$('.flypanels-treemenu').addClass('touch');
			}
			$('.flypanels-treemenu li.haschildren ' + options.treeMenu.expandHandler).click(function (e) {
				$(this).parent().parent().toggleClass('expanded');
				e.preventDefault();
			});
		}

		function close() {
			closeLeft();
			closeRight();
			onClose();
		}

		function onCloseLeft() {
			$('body').removeClass('flypanels-open');
			$('html').removeClass('flypanels-open');
			hook('onCloseLeft');
		}

		function onCloseRight() {
			$('body').removeClass('flypanels-open');
			$('html').removeClass('flypanels-open');
			hook('onCloseRight');
		}

		function onOpenLeft() {
			$('body').addClass('flypanels-open');
			$('html').addClass('flypanels-open');
			hook('onOpenLeft');
		}

		function onOpenRight() {
			$('body').addClass('flypanels-open');
			$('html').addClass('flypanels-open');
			hook('onOpenRight');
		}

		function onOpen() {
			$('.flypanels-content').append('<div id="flypanels-overlay" class="overlay"></div>');
			$('.flypanels-content').on('click touchmove touchend touchleave touchcancel', function (e) {
				close();
				e.preventDefault();
			});
			hook('onOpen');
		}

		function onClose() {
			$('.flypanels-content #flypanels-overlay').remove();
			$('.flypanels-content').off('click touchmove touchend touchleave touchcancel');
			hook('onClose');
		}

		function openRight(panel) {
			$el.addClass('openright');
			setTimeout(function () {
				$('.flypanels-right').find('[data-panel="' + panel + '"]').show();
				onOpenRight();
				onOpen();
			}, 200);
		}

		function closeRight() {
			$el.removeClass('openright');
			setTimeout(function () {
				$('.offcanvas .panelcontent').hide();
				onCloseRight();
				onClose();
			}, 200);
		}

		function openLeft(panel) {
			
			$el.addClass('openleft');
			setTimeout(function () {
				$('.flypanels-left').find('[data-panel="' + panel + '"]').show();
				onOpenLeft();
				onOpen();
			}, 200);
		}

		function closeLeft() {
			$el.removeClass('openleft');
			setTimeout(function () {
				$('.offcanvas .panelcontent').hide();
				onCloseLeft();
				onClose();
			}, 200);
		}
       $('.link').click(function (event) {
		         closeLeft();
		   });
	   $('.home-button,.searchbutton,.fenshu-button').click(function (event) {
		         closeRight();
		   });
	$('.link,.fenshubutton').click(function(event){
		$('.content-search').hide(0)
		$('.iframe_search').show(0)	
		}); 
		function afterWindowResize() {
			innerHeight = window.innerHeight;
			setHeight();
		}

		function initSearch() {
			if (kitUtils.isAndroid() || kitUtils.isIOS()) {
				$('.flypanels-searchresult').addClass('touch');
			}
			/*options.search.searchPanel.find('.searchbutton').on('click', function (event) {
				event.preventDefault();
				searchProgress('show');
				doSearch(options.search.searchPanel.find('.searchbox input').val());
			});*/

			options.search.searchPanel.find('.searchbox input').keydown(function (event) {
				if (event.which === 13) {
					searchProgress('show');
					doSearch($(this).val());
					$(this).blur();
				}
			});

			if (cookies.has('searchQuery') === true && options.search.saveQueryCookie ===  true) {
				doSearch(cookies.get('searchQuery'));
			}
		}

		var cookies = {
			get: function (sKey) {
				if (!sKey) {
					return null;
				}
				return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
			},
			set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
				if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
					return false;
				}
				var sExpires = '';
				if (vEnd) {
					switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
						break;
					case String:
						sExpires = '; expires=' + vEnd;
						break;
					case Date:
						sExpires = '; expires=' + vEnd.toUTCString();
						break;
					}
				}
				document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
				return true;
			},
			remove: function (sKey, sPath, sDomain) {
				if (!this.hasItem(sKey)) {
					return false;
				}
				document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
				return true;
			},
			has: function (sKey) {
				if (!sKey) {
					return false;
				}
				return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
			},
			keys: function () {
				var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
				for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
					aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
				}
				return aKeys;
			}
		};

		function doSearch(query) {
			searchError('hide');

			$jsonurl = options.search.searchPanel.find('.searchbox').data('searchurl');
			$ajaxCall = $.ajax({
				url: $jsonurl + '&q=' + query,
				dataType: 'json'
			});

			// Ajax success
			$ajaxCall.done(function (response) {
				var output;
				$foundResults = response.Items.length;
				if ($foundResults > 0) {
					if (options.search.saveQueryCookie ===  true) {
						cookies.set('searchQuery', query, null, '/');
					}
					output = buildResultsList(response.Items);
				} else {
					if (options.search.saveQueryCookie ===  true) {
						cookies.remove('searchQuery', '/');
					}
					searchError('show');
				}
				options.search.searchPanel.find('.resultinfo .query').html(query);
				options.search.searchPanel.find('.resultinfo .num').html($foundResults);
				options.search.searchPanel.find('.flypanels-searchresult').html(output);
				searchProgress('hide');
				options.search.searchPanel.find('.resultinfo').show();
				options.search.searchPanel.find('.flypanels-searchresult').show();
			});
			$ajaxCall.fail(function () {
				searchError('show');
			});
		}

		function buildResultsList(results) {
			output = '<ul>';
			for (var i in results) {
				if (results[i].Type === 'Page') {
					output += '<li><a href="' + results[i].LinkUrl + '"><span class="link">' + results[i].Header + '</span>  <span class="type"><i class="fa page"></i></span></a>';
				} else {
					output += '<li><a href="' + results[i].LinkUrl + '"><span class="link">' + results[i].Header + '</span>  <span class="type"><i class="fa doc"></i></span></a>';
				}
			}
			output += '</ul>';
			return output;
		}


		function attachEvents() {
			$('.panelcontent').on('touchmove', function (e) {
				if ($(this).prop('scrollHeight') <= parseInt(innerHeight, 10)) {
					e.preventDefault();
				}
			});
			$('.offcanvas').on('touchmove', function (e) {
				e.preventDefault();
			}).on('touchmove', '.panelcontent', function (e) {
				e.stopPropagation();
			});

			$('.flypanels-button-left').on('click', function () {
				var panel = $(this).data('panel');
				if ($('.flypanels-container').hasClass('openleft')) {
					closeLeft();
				} else {
					openLeft(panel);
				}
			});

			$('.flypanels-button-right').on('click', function () {
				var panel = $(this).data('panel');
				if ($('.flypanels-container').hasClass('openright')) {
					closeRight();
				} else {
					openRight(panel);
				}
			});

			if (redrawOnResize === true) {
				var resizeTimer;
				$(window).resize(function () {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(afterWindowResize, 100);
				});
			}
			$(window).bind('orientationchange', function (e) {
				setHeight();
			});

			hook('onLoad');
		}
		function option(key, val) {
			if (val) {
				options[key] = val;
			} else {
				return options[key];
			}
		}
		function destroy() {
			$el.each(function () {
				var el = this;
				var $el = $(this);
				hook('onDestroy');
				$el.removeData('plugin_' + pluginName);
			});
		}
		function hook(hookName) {
			if (options[hookName] !== undefined) {
				options[hookName].call(el);
			}
		}
		init();
		return {
			option: option,
			destroy: destroy,
		};
	}

	$.fn[pluginName] = function (options) {
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function () {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				} else {
					throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
				}
			});
			if (returnVal !== undefined) {
				return returnVal;
			} else {
				return this;
			}
		} else if (typeof options === 'object' || !options) {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		}
	};
	$.fn[pluginName].defaults = {
		onInit: function () {},
		onLoad: function () {},
		onOpenLeft: function () {},
		onOpenRight: function () {},
		onCloseLeft: function () {},
		onCloseRight: function () {},
		onDestroy: function () {}
	};
	 
})(jQuery);
