var getterEmailAddress = 'margarita@fateev.pro';

window.discountOptions = {
	'Самовывоз': 25,
	'Доставка': 20,
	'': 0
};
window.delivery = {
	'Самовывоз': {
		'minTotal': 0,
		'price': 0
	},
	'Доставка': {
		'minTotal': 3000,
		'price': 400
	}
};
window.updateDiscount = function () {
	"use strict";

	let checkedDeliveryOption = $(".t706 .t-form .t-radio__wrapper-delivery input:checked");
	let option = checkedDeliveryOption ? checkedDeliveryOption.val() : "";
	console.log(`Option: ${option}`);
	let discount = window.discountOptions[option];
	if (discount > 0) {
		window.tcart.amount = window.tcart.prodamount - (window.tcart.amount / 100) * discount;
		localStorage.setItem('sumWithDiscount', window.tcart.amount);
	}
	let summaryInfo = '';
	if (discount > 0) {
		summaryInfo += `<p>Стоимость с учетом скидки ${discount}%: ${window.tcart__showPrice(window.tcart.amount)}</p>`;
	}
	let delivery = window.delivery[option];
	if (discount > 0 && window.tcart.amount < delivery.minTotal) {
		window.tcart.amount += delivery.price;
		summaryInfo += `
		<p>Стоимость доставки заказа стоимостью до ${window.tcart__showPrice(delivery.minTotal)}:
			${window.tcart__showPrice(delivery.price)}
		</p>`;
	}
	window.tcart__reDrawTotal();
	window.tcart.prodamount_discountsum = window.tcart.prodamount - window.tcart.amount;
	window.tcart.prodamount_withdiscount = window.tcart.amount;
	$(".t706__cartwin-totalamount-info").html(summaryInfo);
	$('[name="discount"]').val(discount);
};
function wrapWithUpdate(func) {
	'use strict';
	return function () { func.apply(this, arguments); window.updateDiscount(); };
}

$(document).ready(function () {
	"use strict";

	var radios = $(".t706 .t-form .t-radio__wrapper-delivery input");
	if (radios.length) {
		radios.change(function () {
			window.updateDiscount();
		});
	}
	window.tcart__product__plus = wrapWithUpdate(window.tcart__product__plus);
	window.tcart__product__minus = wrapWithUpdate(window.tcart__product__minus);
	window.tcart__product__del= wrapWithUpdate(window.tcart__product__del);
	window.tcart__product__updateQuantity = wrapWithUpdate(window.tcart__product__updateQuantity);
	window.tcart__openCart = wrapWithUpdate(window.tcart__openCart);
});