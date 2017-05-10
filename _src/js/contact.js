/*!
 * Elbit Contact v2.0.0 (http://elbit.com.br/)
 * Copyright 2016-2017 Elbit Digital Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
 */

/**
 * Constructor of Contact
 * Needs of jQuery Ajax (>1.11.3)
 * @param viewport
 * @param feedback
 * @param options
 * @constructor menu
 */
function Contact(viewport, feedback, options) {

	var self = this;

	this.viewport = viewport;
	this.feedback = feedback;

	this.url = !!options.url ? options.url : false;

	this.data = {};

	this.fields = {};

	this.tries = 0;
	this.maxTries = 3;

	this.clickCtrl = function(e) {

		self.initResponse(this);
		e.preventDefault();

	};

	this.states = [
		'is-error',
		'is-fail',
		'is-sending',
		'is-success',
		'is-incomplete',
		'is-invalid'
	];

	this.changeState = function (param) {

		/**
		 * @param [state, message]
		 */

		if (this.viewport) {

			for (var i = this.states.length; i--; )
				this.viewport.classList.remove(this.states[i])

			this.viewport.classList.add(param.state);

			if (param.message)
				this.feedback.innerText = param.message;
				// this.feedback.innerHTML = "<span class='ContactFormStatus-text ContactFormStatus-text--invalid'>" + param.message +  "</span>";

		}

	};

	this.asyncSuccessCtrl = function(data) {

		if (data.sent)
			self.showSuccessMessage();
		else
			self.showFailMessage();

	};

	this.asyncErrorCtrl = function(data) {

		this.tries = this.tries + 1;

		if(this.tries <= this.maxTries)
			self.retry(this.tries);
		else
			self.showErrorMessage();

	};

}



Contact.prototype.showSuccessMessage = function() {

	// console.log('enviado');
	this.changeState({state: 'is-success'});
	this.submit.disabled = true;

};

Contact.prototype.showFailMessage = function() {

	// console.log('completou, mas ocorreu uma falha');
	this.changeState({state: 'is-fail'});

};

Contact.prototype.showErrorMessage = function() {

	this.changeState({state: 'is-error'});

};

Contact.prototype.showRequiredMessage = function(mailError) {

	if (mailError) {

		document.querySelectorAll('.email-text')[0].focus();

		this.changeState({state: 'is-invalid', message: 'E-mail preenchido incorretamente'});

	} else {

		this.changeState({state: 'is-invalid', message: 'Preencha todos os campos'});

	}

};

Contact.prototype.send = function() {

	// console.log('enviando');
	this.changeState({state: 'is-sending'});

	$.ajax({
		url: this.url,
		type: 'jsonp',
		cache: false,
		data: this.data,
		method: 'get',
		timeout: 30000,
		success: this.asyncSuccessCtrl,
		error: this.asyncErrorCtrl
	});

};

Contact.prototype.retry = function(tries) {

	// console.log('tentando enviar novamente');

	$.ajax({
		url: this.url,
		type: 'jsonp',
		cache: false,
		data: this.data,
		method: 'get',
		timeout: 30000,
		success: this.asyncSuccessCtrl,
		error: this.asyncErrorCtrl
	});

};

Contact.prototype.initSend = function() {

	this.send();

};

Contact.prototype.loadTextFieldValue = function(element) {

	return element ? element.value : false;

};

Contact.prototype.loadFieldsData = function(initSend) {

	this.data.name = this.loadTextFieldValue(this.fields.name);
	this.data.client = this.loadTextFieldValue(this.fields.client);
	this.data.cpf = this.loadTextFieldValue(this.fields.cpf);
	this.data.phone = this.loadTextFieldValue(this.fields.phone);
	this.data.email = this.loadTextFieldValue(this.fields.email);
	this.data.address = this.loadTextFieldValue(this.fields.address);
	this.data.city = this.loadTextFieldValue(this.fields.city);
	this.data.message = this.loadTextFieldValue(this.fields.message);

	if (initSend) this.initSend();

};

Contact.prototype.validateTextField = function(element) {

	return element ? element.value !== '' : false;

};

Contact.prototype.validateFields = function() {

	return !(!this.validateTextField(this.fields.name)
	// || !this.validateTextField(this.fields.client)
	// || !this.validateTextField(this.fields.cpf)
	|| !this.validateTextField(this.fields.phone)
	|| !this.validateTextField(this.fields.email)
	|| !this.validateTextField(this.fields.address)
	|| !this.validateTextField(this.fields.city)
	|| !this.validateTextField(this.fields.message));

};

Contact.prototype.initResponse = function(event) {

	if (this.validateFields()) {
		if (this.fields.email.validity) {
			if (this.fields.email.validity.valid) {
				if (this.fields.client.checked) {
					if (this.validateTextField(this.fields.cpf)) {
						if (this.fields.cpf.value.length == 11) {
							this.loadFieldsData(true);
						} else {
							this.changeState({state: 'is-invalid', message: 'Seu CPF deve conter 11 números.'});
						}
					} else {
						this.changeState({state: 'is-invalid', message: 'Se você já é cliente OAI, precisa informar seu CPF.'});
					}
				} else {
					this.loadFieldsData(true);
				}
			} else {
				this.showRequiredMessage(true);
			}
		} else {
			//validate only if it have validity object (supports email input type)
			this.loadFieldsData(true);
		}
	} else {
		this.showRequiredMessage(false);
	}

};

Contact.prototype.addListeners = function() {

	addListener({
		element: this.submit,
		type: 'click',
		crossType: 'onclick',
		listener: this.clickCtrl
	});

};

Contact.prototype.getFields = function() {

	// this.fields.name = document.getElementById('cNome');
	// this.fields.mail = document.getElementById('cEmail');
	// this.fields.message = document.getElementById('cMensagem');
	// this.submit = document.getElementById('cSubmit');

	this.fields.name = document.getElementById('cName');
	this.fields.client = document.getElementById('cClient');
	this.fields.cpf = document.getElementById('cCpf');
	this.fields.phone = document.getElementById('cPhone');
	this.fields.email = document.getElementById('cEmail');
	this.fields.address = document.getElementById('cAddress');
	this.fields.city = document.getElementById('cCity');
	this.fields.message = document.getElementById('cMessage');

	this.submit = document.getElementById('cSubmit');

	this.addListeners();

};

Contact.prototype.init = function() {

	this.getFields();

};