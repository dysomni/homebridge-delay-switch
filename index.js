

var Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-delay-switch", "DelaySwitch", delaySwitch);
}


function delaySwitch(log, config, api) {
  let UUIDGen = api.hap.uuid;

  this.log              = log;
  this.name             = config['name'];
  this.delay            = config['delay'];
  this.motionTime       = config['motionTime'] || 3000;
  // this.sensor           = config['sensor'] || true;
  this.startOnReboot    = config['startOnReboot'] || true;
  this.timer;
  this.switchOn         = false;
  this.motionTriggered  = false;
  this.uuid             = UUIDGen.generate(this.name)
}

delaySwitch.prototype.getServices = function () {
  var informationService = new Service.AccessoryInformation();

  informationService
  .setCharacteristic(Characteristic.Manufacturer, "Delay Manufacturer")
  .setCharacteristic(Characteristic.Model, "Delay Model")
  .setCharacteristic(Characteristic.SerialNumber, this.uuid);


  this.switchService = new Service.Switch(this.name);


  this.switchService.getCharacteristic(Characteristic.On)
  .on('get', this.getOn.bind(this))
  .on('set', this.setOn.bind(this));

  if (this.startOnReboot)
  this.switchService.setCharacteristic(Characteristic.On, true)

  var services = [informationService, this.switchService]

  this.motionService = new Service.MotionSensor(this.name + ' trigger');
  this.motionService
    .getCharacteristic(Characteristic.MotionDetected)
    .on('get', this.getMotion.bind(this));
  services.push(this.motionService)

  return services;
}

delaySwitch.prototype.setOn = function (on, callback) {

  if (on) {
    this.log(`Timer started`);
    this.switchOn = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      this.motionTriggered = true;
      this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(true);
      this.log('Triggering Motion Sensor');
      setTimeout(function() {
        this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);
        this.motionTriggered = false;
        this.switchService.getCharacteristic(Characteristic.On).updateValue(false);
        this.switchOn = false;
        this.log('Timer finished');
      }.bind(this), this.motionTime);
    }.bind(this), this.delay);
    callback();
    return;
  }

  this.log(`Timer stopped`);
  this.switchOn = false;
  clearTimeout(this.timer);
  this.motionTriggered = false;
  if (this.sensor) this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);
  callback();
}



delaySwitch.prototype.getOn = function (callback) {
  callback(null, this.switchOn);
}

delaySwitch.prototype.getMotion = function(callback) {
  callback(null, this.motionTriggered);
}
