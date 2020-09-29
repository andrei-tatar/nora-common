import { Device } from '../models';
import { ColorState } from '../models/states/color';

export enum ExecuteCommandTypes {
    OnOff = 'action.devices.commands.OnOff',
    Brightness = 'action.devices.commands.BrightnessAbsolute',
    ActivateScene = 'action.devices.commands.ActivateScene',
    ColorAbsolute = 'action.devices.commands.ColorAbsolute',
    ThermostatTemperatureSetpoint = 'action.devices.commands.ThermostatTemperatureSetpoint',
    ThermostatTemperatureSetRange = 'action.devices.commands.ThermostatTemperatureSetRange',
    ThermostatSetMode = 'action.devices.commands.ThermostatSetMode',
    TemperatureRelative = 'action.devices.commands.TemperatureRelative',
    SetVolume = 'action.devices.commands.setVolume',
    VolumeRelative = 'action.devices.commands.volumeRelative',
    OpenClose = 'action.devices.commands.OpenClose',
    LockUnlock = 'action.devices.commands.LockUnlock',
    StartStop = 'action.devices.commands.StartStop',
    PauseUnpause = 'action.devices.commands.PauseUnpause',
    Dock = 'action.devices.commands.Dock',
    SetFanSpeed = 'action.devices.commands.SetFanSpeed',
    SetFanSpeedRelativeSpeed = 'action.devices.commands.SetFanSpeedRelativeSpeed',
    Reverse = 'action.devices.commands.Reverse',
}

export function getStateChanges(command: ExecuteCommandTypes, params: any, device: Device) {
    switch (command) {
        case ExecuteCommandTypes.Brightness:
            if (device.type === 'light') {
                if (device.brightnessControl &&
                    device.turnOnWhenBrightnessChanges &&
                    device.state.brightness !== params.brightness) {
                    return {
                        on: true,
                        brightness: params.brightness,
                    };
                }

                return params;
            }
            break;

        case ExecuteCommandTypes.OnOff:
        case ExecuteCommandTypes.ThermostatTemperatureSetpoint:
        case ExecuteCommandTypes.ThermostatTemperatureSetRange:
        case ExecuteCommandTypes.ThermostatSetMode:
        case ExecuteCommandTypes.SetFanSpeed:
        case ExecuteCommandTypes.OpenClose:
        case ExecuteCommandTypes.Reverse:
            return params;

        case ExecuteCommandTypes.ColorAbsolute:
            if (params.color.spectrumHSV) {
                const update = {
                    color: {
                        spectrumHsv: params.color.spectrumHSV,
                    },
                };
                if (device.type === 'light') {
                    if (device.brightnessControl &&
                        device.colorControl &&
                        device.turnOnWhenBrightnessChanges &&
                        !isEqualColor(device.state.color, update.color)) {
                        return {
                            on: true,
                            ...update,
                        };
                    }
                    return update;
                }
            }
            break;

        case ExecuteCommandTypes.LockUnlock:
            return {
                isLocked: params.lock,
            };

        case ExecuteCommandTypes.ActivateScene:
            break;

        case ExecuteCommandTypes.SetVolume:
            return { currentVolume: params.volumeLevel };

        case ExecuteCommandTypes.TemperatureRelative:
            if (device.type === 'thermostat') {
                const { thermostatTemperatureRelativeDegree, thermostatTemperatureRelativeWeight } = params;
                const change = thermostatTemperatureRelativeDegree || (thermostatTemperatureRelativeWeight / 2);
                return {
                    thermostatTemperatureSetpoint: device.state.thermostatTemperatureSetpoint + change,
                };
            }
            break;

        case ExecuteCommandTypes.VolumeRelative:
            if (device.type === 'speaker' && 'currentVolume' in device.state) {
                const relativeStepSize = device.relativeVolumeStep || params.volumeRelativeLevel;
                const delta = params.relativeSteps * relativeStepSize;
                const newVolume = Math.min(100, Math.max(0, device.state.currentVolume + delta));
                return {
                    currentVolume: newVolume,
                };
            }
            break;

        case ExecuteCommandTypes.StartStop:
        case ExecuteCommandTypes.PauseUnpause:
            if (device.type === 'vacuum' && 'isRunning' in device.state) {
                let running = device.state.isRunning;
                let paused = device.state.isPaused;
                const { start, pause } = params;
                if (start != null && typeof start === 'boolean') {
                    running = start,
                    paused = false;
                }
                if (pause != null && typeof pause === 'boolean') {
                    running = true,
                    paused = pause;
                }
                return {
                    isRunning: running,
                    isPaused: paused,
                    isDocked: false
                };
            }
            break;
            
        case ExecuteCommandTypes.SetFanSpeedRelativeSpeed:
            if (device.type === 'fan') {
                const { fanSpeedRelativeWeight, fanSpeedRelativePercent } = params;
                if (fanSpeedRelativePercent != null && device.supportsFanSpeedPercent) {
                    var new_fan_speed = device.state.currentFanSpeedPercent + fanSpeedRelativeWeight;
                    if (new_fan_speed < 0) {
                        new_fan_speed = 0;
                    }
                    if (new_fan_speed > 100) {
                        new_fan_speed = 100;
                    }
                    return {'currentFanSpeedPercent': new_fan_speed };
                }
                if (fanSpeedRelativeWeight != null) {
                    var speed_index = 0;
                    for (var i = 0; i < device.availableFanSpeeds.speeds.length; i++) {
                        if (device.availableFanSpeeds.speeds[i]['speed_name'] === device.state.currentFanSpeedSetting) {
                            speed_index = i;
                        }
                    }
                    var new_speed_index = speed_index - fanSpeedRelativeWeight;
                    if (new_speed_index < 0) {
                        new_speed_index = 0;
                    }
                    if (new_speed_index >= device.availableFanSpeeds.speeds.length) {
                        new_speed_index = device.availableFanSpeeds.speeds.length - 1;
                    }
                    var newFanSpeedSetting = device.availableFanSpeeds.speeds[new_speed_index]['speed_name'];
                    return {'currentFanSpeedSetting': newFanSpeedSetting };
                }
            }
            break;

        default:
            console.warn(`unsupported execution command: ${command}`);
            break;
    }
}

function isEqualColor(color: ColorState['color'], target: ColorState['color']) {
    return color.spectrumHsv.hue === target.spectrumHsv.hue &&
        color.spectrumHsv.saturation === target.spectrumHsv.saturation &&
        color.spectrumHsv.value === target.spectrumHsv.value;
}
