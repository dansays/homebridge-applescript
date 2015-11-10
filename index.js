var Service;
var Characteristic;

var applescript = require('applescript');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory('homebridge-applescript', 'Applescript', ApplescriptAccessory);
}

function ApplescriptAccessory(log, config) {
	this.log = log;
	this.service = 'Switch';
	this.name = config['name'];
	this.onCommand = config['on'];
	this.offCommand = config['off'];
}

ApplescriptAccessory.prototype.setState = function(powerOn, callback) {
	var accessory = this;
	var state = powerOn ? 'on' : 'off';
	var prop = state + 'Command';
	var command = accessory[prop].replace(/''/g, '"');

	applescript.execString(command, done);

	function done(err, rtn) {
		if (err) {
			accessory.log('Error: ' + err);
			callback(err || new Error('Error setting ' + accessory.name + ' to ' + state));
		} else {
			accessory.log('Set ' + accessory.name + ' to ' + state);
			callback(null);
		}
	}
}

ApplescriptAccessory.prototype.getServices = function() {
	var informationService = new Service.AccessoryInformation();
	var switchService = new Service.Switch(this.name);

	informationService
		.setCharacteristic(Characteristic.Manufacturer, 'Applescript Manufacturer')
		.setCharacteristic(Characteristic.Model, 'Applescript Model')
		.setCharacteristic(Characteristic.SerialNumber, 'Applescript Serial Number');

	switchService
		.getCharacteristic(Characteristic.On)
		.on('set', this.setState.bind(this));

	return [switchService];
}