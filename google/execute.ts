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
        case ExecuteCommandTypes.OpenClose:
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
    }
}

function isEqualColor(color: ColorState['color'], target: ColorState['color']) {
    return color.spectrumHsv.hue === target.spectrumHsv.hue &&
        color.spectrumHsv.saturation === target.spectrumHsv.saturation &&
        color.spectrumHsv.value === target.spectrumHsv.value;
}
