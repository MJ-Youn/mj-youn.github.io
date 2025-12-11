"use strict";

const dsnParam = {
	cursor: {
		run: true,
		speed: 0.35,
		speedInner: 0.15
	},
	scrollbar: {
		duration: 1.5,
		smooth: false,
		smoothTouch: false,
		mouseMultiplier: 1
	},
	name: "BLACKDSN"
};

(function($) {
	"use strict";

	preloader();
	effectBackForward();

	async function reloadAjax($off, $el = $(document)) {
		if (!$off) {
			window.$effectScroll = await effectScroller();
			window.$animate = await dsnGrid.effectAnimate();
		}

		imgPosition();
		gridGaps();
		await $effectScroll.start();
		await $animate.allInt();
		await sliderIntro();
	}

	function imgPosition() {
		$("[data-dsn-position]").each(function() {
			if (this.nodeName === "IMG") $(this).css("object-position", dsnGrid.getData(this, "position", "center"));
			else $(this).css("background-position", dsnGrid.getData(this, "position", "center"));
		});
	}

	function gridGaps() {
		$(".d-grid[data-dsn-gap]").each(function() {
			const gap = dsnGrid.getData(this, "gap", "30px 30px");
			const split = gap.split(" ");
			this.style.gridGap = gap;
			this.style.setProperty("--grid-gap", gap);

			if (this.classList.contains('dsn-isotope')) {
				if (split.length > 1) {
					this.style.setProperty("--grid-gap-row", split[0]);
					this.style.setProperty("--grid-gap-col", split[1]);
					this.style.setProperty("--grid-gap", split[1]);
				} else if (split.length) {
					this.style.setProperty("--grid-gap-row", split[0]);
					this.style.setProperty("--grid-gap-col", split[0]);
					this.style.setProperty("--grid-gap", split[0]);
				}
			}
		});
		$("[data-dsn-iconsize]").each(function() {
			this.style.setProperty("--dsn-icon-size", dsnGrid.getData(this, "iconsize"));
		});
	}
	/**
	 *
	 * servicestab
	 *
	 */



	function preloader() {
		const preloader = $("#dsn_preloader");

		if (!preloader.length) {
			window.addEventListener('DOMContentLoaded', function() {
				reloadAjax().catch($err => {
					//console.log($err);
				});
			});
			return false;
		}

		const progress_number = preloader.find(".loading-count"),
			preloader_progress = preloader.find('.dsn-progress-path'),
			present = {
				value: 0
			};

		const updateVal = (val, isSetVal) => {
			progress_number.text(val.toFixed(0));
			preloader_progress.css("stroke-dashoffset", 300 - val * 3);
			if (isSetVal) present.value = val;
		};

		const timer = dsnGrid.pageLoad({
			startTime: 0,
			endTime: 100,
			duration: 1000,
			onProgress(val) {}

		});
		window.addEventListener('DOMContentLoaded', function() {

			$('body').css("overflow", "hidden");
			//clearInterval(timer);
			const tl = gsap.timeline();
			tl.to(present, 1, {
				value: 100,

				onUpdate() {
					//updateVal(present.value, true);
				}

			}).call(function() {
				reloadAjax().catch($err => {
					//console.log($err);
				});
			}).to(preloader.find('> *:not(.bg-load)'), {
				autoAlpha: 0
			}).to(preloader.find('.bg-load'), {
				yPercent: -100,
				ease: Expo.easeInOut,
				duration: 1.5
			}).to(preloader.find('.bg-load .separator__path'), {
				attr: {
					d: dsnGrid.getData(preloader.find('.bg-load .separator__path').get(0), 'to')
				},
				ease: "Power4.easeInOut",
				duration: 1.5
			}, '-=1.5').fromTo("#main_root", 1, {
				y: 400
			}, {
				y: 0,
				clearProps: true,
				ease: Expo.easeInOut
			}, "-=1.2").call(function() {
				preloader.remove();
				ScrollTrigger.update();
				ScrollTrigger.getAll().forEach($item => {
					$item.refresh();
				});
			});
		});
	}

	function effectBackForward() {
		$wind.on("popstate", function(e) {

			if (window.location.hash.length) {
				$wind.scrollTop(0);
				dsnGrid.scrollTop(window.location.hash, 1, -100);
				return;
			}

			if (document.location.href.indexOf("#") > -1) {
				return;
			}

			setTimeout(function() {
				dsnAjax().backAnimate(e);
			}, 50);
		});
	}

	function dsnAjax() {
		return dsnGrid.dsnAjax({
			className: 'dsn-ajax-effect',

			async success(data) {
				const animate = {
					value: 0
				};
				return gsap.to(animate, 0.2, {
					value: 100,
					delay: 1,

					onStart() {
						reloadAjax(true).catch($err => {
							console.error($err);
						});
					}

				});
			},

			onComplete() {
				ScrollTrigger.refresh();
			}

		});
	}

	function effectScroller() {
		const locked_scroll = "locked-scroll";
		let lenisScroll = null;
		return {
			/**
			 *
			 * @returns {boolean}
			 * Check smooth scroll is enable or not
			 */
			isScroller: function() {
				var _dsnParam$scrollbar;

				return dsnParam === null || dsnParam === void 0 ? void 0 : (_dsnParam$scrollbar = dsnParam.scrollbar) === null || _dsnParam$scrollbar === void 0 ? void 0 : _dsnParam$scrollbar.smooth;
			},
			start: function() {
				$body.removeClass(locked_scroll);
				dsnGrid.scrollTop(0, {
					duration: 0.01
				});
				if (!this.isScroller()) return;
				lenisScroll = new Lenis(dsnParam.scrollbar);

				function raf(time) {
					lenisScroll.raf(time);
					requestAnimationFrame(raf);
				}

				requestAnimationFrame(raf);
			},

			/**
			 *  locked smooth scrollbar
			 */
			locked: function() {
				var _lenisScroll;

				$body.addClass(locked_scroll);
				this.isScroller() && ((_lenisScroll = lenisScroll) === null || _lenisScroll === void 0 ? void 0 : _lenisScroll.destroy());
			},

			/**
			 *
			 * @param $id
			 * @returns {*}
			 * Gets scrollbar on the given element. If no scrollbar instance exists, returns undefined:
			 */
			getScrollbar: () => lenisScroll,

			/**
			 *
			 * @param listener
			 * @param $useWin
			 *
			 * Since scrollbars will not fire a native scroll event
			 */
			getListener: function(listener) {
				if (listener === undefined) return;

				const scroll = e => {
					listener(e, window.scrollX, window.scrollY);
				};

				$wind.on("scroll", scroll);
			}
		};
	}


	function sliderIntro($el = $(document)) {
		let tl = gsap.timeline();
		const pagination = {
			next: [],
			prev: []
		};

		const initSlider = async function() {
			const dsnSliderContent = this.querySelector('.dsn-slider-content');
			await this.querySelectorAll('.content-slider .slide-item').forEach(($item, $index) => {
				var _slideContent$querySe, _slideContent$querySe2;

				const slideContent = $item.querySelector('.slide-content');
				$item.setAttribute('data-dsn-id', $index);
				if (!slideContent) return;
				slideContent === null || slideContent === void 0 ? void 0 : slideContent.setAttribute('data-dsn-id', $index);
				if ($index === 0) slideContent === null || slideContent === void 0 ? void 0 : slideContent.classList.add('dsn-active', 'dsn-active-animate');
				pagination.prev.push(`<div class="swiper-slide"  data-swiper-autoplay="2000">
							<div class="box-content w-100 d-flex align-items-center">
								<div class="prev-arrow">
									<div class="container-inner">
										<svg class="arrow v-middle" xmlns="http://www.w3.org/2000/svg"
											 viewBox="0 0 28.214 23.057">
											<g fill="none" stroke-linecap="square" stroke-width="1">
												<path d="M23.528 11.685h-20M16.685 19.528l8-8-8-8"></path>
											</g>
										</svg>
										<svg class="circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<g class="circle-wrap" fill="none" stroke-width="1" stroke-linejoin="round"
											   stroke-miterlimit="10">
												<circle cx="12" cy="12" r="10.5"></circle>
											</g>
										</svg>
									</div>
								</div>
								<div class='box-title'><h6 class='sm-title-block'>${(_slideContent$querySe = slideContent.querySelector('.title')) === null || _slideContent$querySe === void 0 ? void 0 : _slideContent$querySe.innerText}</h6></div>
							</div>
						</div>`);
				pagination.next.push(`<div class="swiper-slide" data-swiper-autoplay="2000">
							<div class="box-content w-100 d-flex align-items-center justify-content-end">
								<div class='box-title'><h6 class='sm-title-block'>${(_slideContent$querySe2 = slideContent.querySelector('.title')) === null || _slideContent$querySe2 === void 0 ? void 0 : _slideContent$querySe2.innerText}</h6></div>
								<div class="next-arrow">
									<div class="container-inner">
										<svg class="arrow v-middle" xmlns="http://www.w3.org/2000/svg"
											 viewBox="0 0 28.214 23.057">
											<g fill="none" stroke-linecap="square" stroke-width="1">
												<path d="M23.528 11.685h-20M16.685 19.528l8-8-8-8"></path>
											</g>
										</svg>
										<svg class="circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
											 viewBox="0 0 24 24">
											<g class="circle-wrap" fill="none" stroke-width="1" stroke-linejoin="round"
											   stroke-miterlimit="10">
												<circle cx="12" cy="12" r="10.5"></circle>
											</g>
										</svg>
									</div>
								</div>
							</div>
						</div>`);
				dsnSliderContent === null || dsnSliderContent === void 0 ? void 0 : dsnSliderContent.append(slideContent);
			});
			pagination.next.push(pagination.next.shift());
			pagination.prev.unshift(pagination.prev.pop());
			const nextCon = this.querySelector('.next-paginate');
			if (nextCon) nextCon.innerHTML = `<div class="swiper-wrapper">${pagination.next.join(' ')}</div>`;
			const navContainer = this.querySelector('.prev-paginate');
			if (navContainer) navContainer.innerHTML = `<div class="swiper-wrapper">${pagination.prev.join(' ')}</div>`;
			await this.querySelectorAll('.dsn-slider-content .slide-content [data-dsn-split=\"chars\"]').forEach(function($item) {
				dsnGrid.spltting.Char($item, true);
			});
			await this.querySelectorAll('.dsn-slider-content .head-meta').forEach(function($item) {
				dsnGrid.spltting.Items($item, "span");
			});
		};

		const init = swiper => {
			swiper.slides.forEach(item => {
				const video = item.querySelector('.swiper-slide:not(.swiper-slide-active) video');
				if (video) video.pause();
			});
		};

		const activeVideo = swiper => {
			const newVideo = swiper.slides[swiper.activeIndex].querySelector('video');
			const oldVideo = swiper.slides[swiper.previousIndex].querySelector('video');
			if (newVideo) newVideo.play();
			if (oldVideo) oldVideo.pause();
		};

		const getContent = (swiper, contentRef) => {
			const oldNum = swiper.slides[swiper.previousIndex].getAttribute("data-dsn-id");
			const newNum = swiper.slides[swiper.activeIndex].getAttribute("data-dsn-id");
			return [newNum, oldNum, contentRef.querySelector('[data-dsn-id="' + newNum + '"]'), contentRef.querySelector('[data-dsn-id="' + oldNum + '"]')];
		};

		function slideChange(swiper) {
			//console.log(slideChange);
			const contentSlider = this.querySelector('.dsn-slider-content');
			if (!contentSlider) return;
			activeVideo(swiper);
			if ($('canvas').hasClass("intro-type-move")) {
				$('canvas').removeClass("intro-type-move");
				$('canvas').addClass("intro-type-scale");
			} else {
				$('canvas').removeClass("intro-type-scale");
				$('canvas').addClass("intro-type-move");
			}
			const [newNum, oldNum, newContent, oldContent] = getContent(swiper, contentSlider),
				[newTitle, oldTitle] = [Array.from(newContent.querySelectorAll('.title .char') || []), Array.from(oldContent.querySelectorAll('.title .char') || [])],
				$isRight = oldNum < newNum,
				animate = {
					show: {
						autoAlpha: 1,
						y: 0,
						stagger: {
							amount: 0.3,
							from: "center"
						},
						ease: "back.out(4)",
						rotation: 0,
						scale: 1,
						yoyo: true
					},
					hide: {
						autoAlpha: 0,
						y: !$isRight ? "25%" : "-25%",
						stagger: {
							amount: 0.3,
							from: "center"
						},
						ease: "back.in(4)",
						yoyo: true,
						rotation: 8,
						scale: 1.1
					}
				};
			const current = Number.parseInt(newNum, 10) + 1,
				num = this.querySelector(".slider-current-index");
			if (num) num.innerHTML = current > 9 ? current : '0' + current;
			if (swiper.dsnOnChange) swiper.dsnOnChange(newNum, oldNum, newContent, oldContent);
			tl.progress(1);
			tl = new gsap.timeline();
			oldContent.classList.remove("dsn-active-animate");
			tl.fromTo(oldTitle, 0.4, animate.show, animate.hide).call(function() {
				oldContent.classList.remove("dsn-active");
				newContent.classList.add("dsn-active");
				newContent.classList.add("dsn-active-animate");
			}).fromTo(newTitle, 0.8, animate.hide, animate.show, "-=.005");
		}

		const swiper = function() {
			const option = Object.assign({}, {
				on: {
					init,
					slideChange: slideChange.bind(this)
				}
			}, dsnGrid.getData(this, 'option') || {}, {
				autoHeight: false
			});
			if (window.innerWidth > 767) option.pagination = {
				el: this.querySelector('.swiper-pagination'),
				type: 'bullets',
			};

			//console.log(option);

			option.autoplay = {
				delay: 3000,
			}
			option.effect = 'fade';

			return new Swiper(this.querySelector(".content-slider .swiper-container"), option);
		};

		const NavSwiper = function(container, swiper) {
			var _swiper$passedParams2, _swiper$passedParams3;

			const navContainer = container.querySelector('.next-paginate');
			setTimeout(function() {
				gsap.to($(container).find('.bg-container'), {
					opacity: 1
				});
			}, 3000);
			if (!navContainer) return false;

			if (window.innerWidth > 575) {
				navContainer.querySelectorAll('h6.sm-title-block').forEach($item => {
					const s = dsnGrid.spltting.Char($item);
					s.chars.forEach(($item, $index) => {
						$index = $index + 5;
						$item.setAttribute('data-swiper-parallax-y', `${$index * 9}%`);
						$item.setAttribute(`data-swiper-parallax-opacity`, '0');
						$item.setAttribute('data-swiper-parallax-duration', $index * 100);
						$item.classList.add('swiper-parallax-transform');

						if (s.chars.length === $index - 4) {
							const arrow = s.el.closest('.box-content').querySelector('.next-arrow');
							if (!arrow) return;
							arrow.setAttribute('data-swiper-parallax-y', `${$index * 3}%`);
							arrow.setAttribute(`data-swiper-parallax-opacity`, '0');
							arrow.setAttribute('data-swiper-parallax-duration', $index * 100);
							arrow.classList.add('swiper-parallax-transform');
						}
					});
				});
			}

			const navSlider = new Swiper(navContainer, {
				speed: ((_swiper$passedParams2 = swiper.passedParams) === null || _swiper$passedParams2 === void 0 ? void 0 : _swiper$passedParams2.speed) || 1000,
				loop: ((_swiper$passedParams3 = swiper.passedParams) === null || _swiper$passedParams3 === void 0 ? void 0 : _swiper$passedParams3.loop) || false,
				touchRatio: 0.2,
				resistanceRatio: 0.65,
				autoplay: {
					delay: 1000
				},
				parallax: true
			});
			swiper.thumbs.swiper = navSlider;
			setTimeout(function() {
				navContainer.classList.remove('d-none');
			}, 3000);
			//console.log(navSlider);
			return navSlider;
		};

		const NavSwiperPrev = function(container, swiper, nav) {
			var _swiper$passedParams4, _swiper$passedParams5;

			const navContainer = container.querySelector('.prev-paginate');
			setTimeout(function() {
				gsap.to($(container).find('.bg-container'), {
					opacity: 1
				});
			}, 3000);
			if (!navContainer) return false;

			if (window.innerWidth > 575) {
				navContainer.querySelectorAll('h6.sm-title-block').forEach($item => {
					const s = dsnGrid.spltting.Char($item);
					s.chars.forEach(($item, $index) => {
						if ($index === 0) {
							$index = $index + 4;
							const arrow = s.el.closest('.box-content').querySelector('.prev-arrow');
							arrow.setAttribute('data-swiper-parallax-y', `${$index * 3}%`);
							arrow.setAttribute(`data-swiper-parallax-opacity`, '0');
							arrow.classList.add('swiper-parallax-transform');
							$index = 0;
						}

						$index = $index + 5;
						$item.setAttribute('data-swiper-parallax-y', `${$index * 9}%`);
						$item.setAttribute(`data-swiper-parallax-opacity`, '0');
						$item.setAttribute('data-swiper-parallax-duration', $index * 100);
						$item.classList.add('swiper-parallax-transform');
					});
				});
			}

			const navSlider = new Swiper(navContainer, {
				speed: ((_swiper$passedParams4 = swiper.passedParams) === null || _swiper$passedParams4 === void 0 ? void 0 : _swiper$passedParams4.speed) || 1000,
				loop: ((_swiper$passedParams5 = swiper.passedParams) === null || _swiper$passedParams5 === void 0 ? void 0 : _swiper$passedParams5.loop) || false,
				touchRatio: 0.2,
				resistanceRatio: 0.65,

				autoplay: {
					delay: 2500,
					disableOnInteraction: false,
				},
				allowTouchMove: false
			});
			nav.thumbs.swiper = navSlider;
			setTimeout(function() {
				navContainer.classList.remove('d-none');
			}, 3000);
			return navSlider;
		};

		const webGelOption = function() {
			const images = [];
			$(this).find(".bg-container .slide-item").each(function() {
				const slide_content = $(this).find('.image-bg'),
					id = $(this).data('dsn-id');

				if (slide_content.find('video').length) {
					images[id] = {
						posters: slide_content.find('video').get(0),
						src: slide_content.find('video').attr("data-dsn-poster"),
						overlay: slide_content.data("overlay")
					};
				} else {
					const img = slide_content.find('img');
					const srcImg = img.data('dsn-src');
					images[id] = {
						src: srcImg !== null && srcImg !== void 0 ? srcImg : img.attr("src"),
						overlay: slide_content.data("overlay")
					};
				}
			});
			if (images.length) $(this).find(".bg-container").attr("data-overlay", images[0].overlay);
			return images;
		};

		$el.find(".main-slider:not(.dsn-swiper-initialized)").each(function() {
			this.classList.add('dsn-swiper-initialized');
			initSlider.bind(this)().then(swiper.bind(this)).then(function(swiper) {
				const handleNext = function() {
						if (tl.isActive()) return;

						if (swiper.slides.length === swiper.activeIndex + 1 && !swiper.passedParams.loop) {
							swiper.slideTo(0);
						} else {
							swiper.slideNext();
						}
					},
					handlePrev = function() {
						if (tl.isActive()) return;

						if (swiper.activeIndex === 0 && !swiper.passedParams.loop) {
							swiper.slideTo(swiper.slides.length);
						} else {
							swiper.slidePrev();
						}
					},
					nextArrow = $(this).find('.next-arrow'),
					prevArrow = $(this).find('.prev-arrow');

				if (nextArrow.length) nextArrow.on('click', handleNext);
				if (prevArrow.length) prevArrow.on('click', handlePrev);
				const nav = NavSwiper(this, swiper);
				const navPrev = NavSwiperPrev(this, swiper, nav);
				let webGel = null;
				if (this.classList.contains('dsn-webgl')) webGel = dsnGrid.WebGLDistortionHoverEffects({
					imgs: webGelOption.bind(this)(),
					...(dsnGrid.getData(this, 'webgl', {}) || {}),
					direction: swiper.params.direction,
					parent: this.querySelector('.bg-container'),
					swiper,

					onStart({
						parent,
						item
					}) {
						parent.setAttribute('data-overlay', item.overlay);
					}

				});
				dsnGrid.killAjax(function() {
					if (nextArrow.length) nextArrow.off('click', handleNext);
					if (prevArrow.length) prevArrow.off('click', handlePrev);
					tl.kill();
					swiper.destroy();
					webGel.destroy();
					if (nav) nav.destroy();
					if (navPrev) navPrev.destroy();
				});
			}.bind(this));
		});
	}

	function mouseCirMove($off) {
		const $element = $("#dsn_cursor"),
			inner = $("#dsn_cursor_inner");
		if (dsnParam.cursor.run) $body.addClass('dsn-cursor-effect');
		if (!$element.length || dsnGrid.isMobile() || !dsnParam.cursor.run) return;
		const mouseStop = 'dsn-stop-cursor';

		if (!$off) {
			dsnGrid.mouseMove($element, {
				speed: dsnParam.cursor.speed,
				mouseStop,
				inner: {
					el: inner,
					speed: dsnParam.cursor.speedInner
				}
			});
		}

		const defaultEl = $element.css(['opacity', 'width', 'height', 'borderColor', 'background']),
			{
				stop,
				run
			} = {
				stop: () => $body.addClass(mouseStop),
				run: () => $body.removeClass(mouseStop)
			};
		dsnGrid.mouseHover("a:not(> img):not(.vid) , .dsn-button-sidebar,  button , .button-load-more , [data-cursor=\"open\"]", {
			enter: () => gsap.to($element, 0.5, {
				width: 70,
				height: 70,
				opacity: 0.5,
				backgroundColor: defaultEl.borderColor
			}),
			leave: () => gsap.to($element, 0.5, {
				...defaultEl
			})
		});
		dsnGrid.mouseHover(".c-hidden , .social-side a , .next-arrow , .prev-arrow , .dsn-btn.vid", {
			enter() {
				stop();
				const {
					x,
					y,
					width,
					height
				} = this.getBoundingClientRect();
				gsap.to($element, 0.5, {
					width,
					height,
					opacity: 0,
					x,
					y,
					xPercent: 0,
					yPercent: 0
				});
				gsap.to(inner, 0.1, {
					opacity: 0
				});
			},

			leave() {
				run();
				gsap.to($element, 0.5, {
					...defaultEl,
					xPercent: -50,
					yPercent: -50
				});
				gsap.to(inner, 0.1, {
					opacity: 1
				});
			}

		});
	}

})(jQuery);

//# sourceMappingURL=custom.js.map