

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
  this.motionTime       = config['motionTime']    || 10 * 1000;
  this.startOnReboot    = config['startOnReboot'] || true;
  this.motionCount      = config['motionCount']   || 1;
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

//TODO: refactor this out into different methods keeping in mind 'this'
delaySwitch.prototype.setOn = function (on, callback) {
  if (on) {
    this.log(`Timer started`);
    this.switchOn = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      this.switchOn = false;
      this.switchService.getCharacteristic(Characteristic.On).updateValue(this.switchOn);
      this.log('Timer finished');
      triggerMotion.bind(this)();
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

function triggerMotion(count=0) {
  count += 1;
  setTimeout(function() {
    this.motionTriggered = isOdd(count);
    this.log(`Turning Motion Sensor ${this.motionTriggered ? 'On' : 'Off'}`)
    this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.motionTriggered);
  }.bind(this), this.motionTime * count);
  if(count < (this.motionCount*2))
    triggerMotion.bind(this)(count);
}

function isOdd(n) {
  return n % 2 != 0;
}

delaySwitch.prototype.getOn = function (callback) {
  callback(null, this.switchOn);
}

delaySwitch.prototype.getMotion = function(callback) {
  callback(null, this.motionTriggered);
}
