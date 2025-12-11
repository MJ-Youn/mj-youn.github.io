$(function(){
	
	if(MAIN_IMAGE_EFFECT!=''&&MAIN_IMAGE_EFFECT!='none'){
		startAnimation(MAIN_IMAGE_EFFECT);	
	}
	
	
	$('#modal-welcome').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var modal = $(this);
		modal.find('.modal-content').load(button.data("remote"));
	});
	
	
	$('#modal-welcome2').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var modal = $(this);
		modal.find('.modal-content').load(button.data("remote"));
	});

	
	
	
	var clibboard=new ClipboardJS('.btn-copy');
	clibboard.on('success', function(e) {
		message('안내', '"'+e.text+'" 을 복사하였습니다');
		e.clearSelection();
	});
	
	
});

function message(_title='', _message=''){
	var toastElement = buildToast(_title, _message);
	var toastWrapper = getOrCreateToastWrapper();
	toastWrapper.append(toastElement);
	this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
	
	this.show = function() {
		this.bootstrapToast.show();
	}
	
	this.hide = function() {
		this.bootstrapToast.hide();
	}
	
	this.dispose = function() {
		this.bootstrapToast.dispose();
	}
	
	this.show();
}


/* Utility methods */
function getOrCreateToastWrapper() {
	var toastWrapper = document.querySelector('body > [data-toast-wrapper]');
	
	if (!toastWrapper) {
		toastWrapper = document.createElement('div');
		toastWrapper.style.zIndex = 9999;
		toastWrapper.style.position = 'fixed';
		toastWrapper.style.bottom = 0;
		toastWrapper.style.right = 0;
		toastWrapper.style.padding = '1rem';
		toastWrapper.setAttribute('data-toast-wrapper', '');
		document.body.append(toastWrapper);
	}
	
	return toastWrapper;
}

function buildToastHeader(title) {
	var toastHeader = document.createElement('div');
	toastHeader.setAttribute('class', 'toast-header');
	
	var img = document.createElement('img');
	img.setAttribute('class', 'rounded me-2');
	img.setAttribute('src', '');
	img.setAttribute('alt', '');
	
	var strong = document.createElement('strong');
	strong.setAttribute('class', 'me-auto');
	strong.textContent = title;
	
	var closeButton = document.createElement('button');
	closeButton.setAttribute('type', 'button');
	closeButton.setAttribute('class', 'btn-close');
	closeButton.setAttribute('data-bs-dismiss', 'toast');
	closeButton.setAttribute('data-label', 'Close');
	
	toastHeader.append(img);
	toastHeader.append(strong);
	toastHeader.append(closeButton);

	return toastHeader;
}

function buildToastBody(description) {
	var toastBody = document.createElement('div');
	toastBody.setAttribute('class', 'toast-body');
	toastBody.textContent = description;
	
	return toastBody;
}

function buildToast(title, description) {
	
	var toast = document.createElement('div');
	toast.setAttribute('class', 'toast');
	toast.setAttribute('role', 'alert');
	toast.setAttribute('aria-live', 'assertive');
	toast.setAttribute('aria-atomic', 'true');
	
	var toastHeader = buildToastHeader(title);
	var toastBody = buildToastBody(description);
	
	toast.append(toastHeader);
	toast.append(toastBody);
	
	return toast;
}


function startAnimation(iconType=''){
	const canvas = document.querySelector('canvas');
	canvas.width = $('.header-image').width();
	canvas.height = $('.header-image').height();
	const ctx = canvas.getContext('2d');
	
	const TOTAL = 50;
	const petalArray = [];
	
	const petalImg = new Image();
	
	if(iconType=='sakura'){
		petalImg.src = DOMAIN+'front_end/assets/main/images/sakura.png';	
	}
	
	if(iconType=='heart'){
		petalImg.src = DOMAIN+'front_end/assets/main/images/heart.png';	
	}
	
	if(iconType=='leaf'){
		petalImg.src = DOMAIN+'front_end/assets/main/images/leaft.png';	
	}
	
	if(iconType=='snow'){
		petalImg.src = DOMAIN+'front_end/assets/main/images/snowflake.png';	
	}
	
	petalImg.onload = () => {
	  for (let i = 0; i < TOTAL; i++) {
		petalArray.push(new Petal());
	  }
	  render();
	};
	
	function render() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  window.requestAnimationFrame(render);
	  petalArray.forEach((petal) => {
		petal.animate();
	  });
	}
	
	window.addEventListener('resize', () => {
	  canvas.width = $('.header-image').width();
	  canvas.height = $('.header-image').height();
	});
	

	class Petal {
	  constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height * 2 - canvas.height;
		//this.w = 30 + Math.random() * 15;
		//this.h = 20 + Math.random() * 10;
		this.w = 25;
		this.h = 25;
		this.opacity = this.w / 45;
		this.xSpeed = 2 + Math.random();
		this.ySpped = 1 + Math.random();
		this.flip = Math.random();
		this.flipSpeed = Math.random() * 0.03;
	  }
	
	  draw() {
		if (this.y > canvas.height || this.x > canvas.width) {
		  this.x = -petalImg.width;
		  this.y = Math.random() * canvas.height * 2 - canvas.height;
		  this.xSpeed = 2 + Math.random();
		  this.ySpped = 1 + Math.random();
		  this.flip = Math.random();
		}
	
		ctx.globalAlpha = this.opacity;
		//ctx.drawImage(petalImg, this.x, this.y, this.w * (0.5 + Math.abs(Math.cos(this.flip) / 3)), this.h * (0.7 + Math.abs(Math.sin(this.flip) / 2)));
		ctx.drawImage(petalImg, this.x, this.y, this.w, this.h);
	  }
	
	  animate() {
		this.x += this.xSpeed;
		this.y += this.ySpped;
		this.draw();
		this.flip += this.flipSpeed;
	  }
	}
}

