import {
    AccessoryConfig,
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    HAP,
    Logging,
    Service,
} from "homebridge";
import axios from 'axios'

// EDIT YOUR SERVER ADDRESS HERE (Raspberry Pi with the server running)
const server_address = "http://192.168.1.180:5000"


let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
    hap = api.hap;
    api.registerAccessory("FanV2", Fan);
};

class Fan implements AccessoryPlugin {

    private readonly log: Logging;
    private readonly name: string;
    private fanOn = false;

    private readonly switchService: Service;
    private readonly informationService: Service;

    constructor(log: Logging, config: AccessoryConfig, api: API) {
        this.log = log;
        this.name = config.name;

        this.switchService = new hap.Service.Fanv2();
        this.switchService.getCharacteristic(hap.Characteristic.On)
            .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
                try {
                    const request = await axios.get(server_address+"/get-fan");

                    const state = request.data.state;

                    console.log("current status: " + state);

                    this.fanOn = state === 1;

                    callback(undefined, this.fanOn);
                    log.info("Current state of the switch was found: " + (this.fanOn ? "ON" : "OFF"));

                } catch (e) {
                    console.warn(e);
                    callback(undefined, this.fanOn);
                }

            })
            .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
                this.fanOn = value as boolean;

                await axios.post(
                    server_address+"/set-fan",
                    undefined,
                    { params: { state: this.fanOn ? 1 : 0 } });

                log.info("Switch state was changed to: " + (this.fanOn ? "ON" : "OFF"));
                callback();
            });

        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
            .setCharacteristic(hap.Characteristic.Model, "Custom Model");

        log.info("Switch finished initializing!");
    }

    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify(): void {
        this.log("Identify!");
    }

    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices(): Service[] {
        return [
            this.informationService,
            this.switchService,
        ];
    }

}


