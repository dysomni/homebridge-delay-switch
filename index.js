

var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-delay-switch", "DelaySwitch", delaySwitch);
}


function delaySwitch(log, config) {
    this.log = log;
    this.name = config['name'];
    this.delayTime = config['delay'];
    this.timer;
    this.switchOn = false;
    this.motionTriggered = false;

}

delaySwitch.prototype.getServices = function () {
    var informationService = new Service.AccessoryInformation();

    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Delay Manufacturer")
        .setCharacteristic(Characteristic.Model, "Delay Model")
        .setCharacteristic(Characteristic.SerialNumber, "Delay Serial Number");


    this.switchService = new Service.Switch(this.name);


    this.switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    this.motionService = new Service.MotionSensor(this.name + ' Trigger');

    this.motionService
        .getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getMotion.bind(this));

    return [informationService, this.switchService, this.motionService];

}


delaySwitch.prototype.setOn = function (on, callback) {

    if (!on) {
        this.log('Stopping the Timer.');
    
        this.switchOn = false;
        clearTimeout(this.timer);
        this.motionTriggered = false;
        this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);

        
      } else {
        this.log('Starting the Timer.');
        this.switchOn = true;
    
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          this.log('Time is Up! Triggering Motion Sensor');
          this.motionTriggered = true;
          this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(true);
          this.switchService.getCharacteristic(Characteristic.On).updateValue(false);
          this.switchOn = false;
          setTimeout(function() {
            this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);
            this.motionTriggered = false;
          }.bind(this), 3000);
        }.bind(this), this.delay);
      }
    
      callback();
}



delaySwitch.prototype.getOn = function (callback) {
    callback(null, this.switchOn);
}

delaySwitch.prototype.getMotion = function(callback) {
    callback(null, this.motionTriggered);
}