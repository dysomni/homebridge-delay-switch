<img src="branding/hoobs_homebridge_delayswitch.svg" width="700px">

# Homebridge-Delay-Switch

[![Downloads](https://img.shields.io/npm/dt/homebridge-delay-switch.svg?color=critical)](https://www.npmjs.com/package/homebridge-delay-switch)
[![Version](https://img.shields.io/npm/v/homebridge-delay-switch)](https://www.npmjs.com/package/homebridge-delay-switch)<br>
[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins) [![Homebridge Discord](https://img.shields.io/discord/432663330281226270?color=728ED5&logo=discord&label=discord)](https://discord.gg/HWUKH9C)<br>
[![certified-hoobs-plugin](https://badgen.net/badge/HOOBS/Certified/yellow)](https://plugins.hoobs.org?ref=10876) [![hoobs-support](https://badgen.net/badge/HOOBS/Support/yellow)](https://support.hoobs.org?ref=10876)

With this plugin, you can create any number of fake switches that will start a timer when turned ON, when the delay time is reached the switch will automatically turn OFF and trigger a dedicated motion sensor for 3 seconds. This can be very useful for advanced automation with HomeKit scenes - when delayed actions are required.

## Installations

This plugin is [HOOBS](https://hoobs.org/?ref=10876) certified and can be easily installed and configured through their UI.

If you don't use HOOBS (or Homebridge UI), keep reading:

 * ```sudo npm install -g homebridge-delay-switch```
* Create an accessory in your config.json file
* Restart homebridge

## Example config.json:

 ```
    "accessories": [
        {
          "accessory": "DelaySwitch",
          "name": "DelaySwitch",
          "delay": 5000,
          "disableSensor": false,
          "startOnReboot": false
        }   
    ]

```

|             Parameter            |         Description         | Required |  Default |   type   |
| -------------------------------- | --------------------------- |:--------:|:--------:|:--------:|
| `accessory`             | always `"DelaySwitch"`               |     ✓    |     -    |  String  |
| `name`                  | Name for your accessory              |     ✓    |     -    |  String  |
| `delay`                 |  Delay/Timer in milliseconds         |     ✓    |     -    |  Integer |
| `disableSensor`         | Remove the Motion Sensor             |          |   `false`  |  Boolean |
| `startOnReboot`         |  When set to `true`, the switch will be turned ON and start the timer when HomeBridge restarts        |          |  `false` |  Boolean  |


## Why do we need this plugin?

The most common use of this plugin is to turn ON/OFF lights based on a motion/door sensor. This can be achieved by setting an automation to turn ON a light and the delay switch when motion is detected and turn OFF the light when the dedicated delay motion sensor is triggered (or delay switch is turned OFF).


Another great example, when using smart wall switch (to turn ON) and RGB light bulb (to switch color) together on the same scene can cause no action on the bulb since the bulb might not even be ON when the command has been sent from homebridge.
For that, we need to set an automation to change the bulb color a few seconds after the wall switch ON command.

Also it can be use with any device that require a certain delay time from other devices (TV + RPi-Kodi  /  PC + SSH / etc...)


## How it works

Basically, all you need to do is:

1. Set the desired delay time in the config file (in milliseconds).
2. The plugin will create one switch and one motion sensor for this plugin.
3. Use this switch in any scene or automation.
4. Set an automation to trigger when this switch is turned OFF or the motion sensor is triggers - "EVE" app is very recommended to set this automation.

## Why Add a Motion Sensor?

A Motion sensor is created for each accessory in order to be able to cancel the timer and the attached automations.
How does it works? You can set the automation to be triggered from the motion sensor instead of the switch OFF command and therefore you can turn OFF the switch and prevent the motion sensor from being triggered or any attached automations.
If you have no use of the sensor you can remove it by adding `"disableSensor": true` to your config.

## Good to know

* **When manualy turning OFF the switch, the timer will stop and the motion sensor will NOT be triggered.**

* **When the delay switch is getting ON command while it's already ON, the timer will restart and the motion sensor trigger will be delayed.**

_________________________________________

## Support homebridge-delay-switch

**homebridge-delay-switch** is a free plugin under the MIT license. it was developed as a contribution to the homebridge/hoobs community with lots of love and thoughts.
Creating and maintaining Homebridge plugins consume a lot of time and effort and if you would like to share your appreciation, feel free to "Star" or donate.

<a target="blank" href="https://www.paypal.me/nitaybz"><img src="https://img.shields.io/badge/PayPal-Donate-blue.svg?logo=paypal"/></a><br>
<a target="blank" href="https://www.patreon.com/nitaybz"><img src="https://img.shields.io/badge/PATREON-Become a patron-red.svg?logo=patreon"/></a><br>
<a target="blank" href="https://ko-fi.com/nitaybz"><img src="https://img.shields.io/badge/Ko--Fi-Buy%20me%20a%20coffee-29abe0.svg?logo=ko-fi"/></a>
