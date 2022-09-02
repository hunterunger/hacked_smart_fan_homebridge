import json
import gpiozero
from flask import Flask, request
from iot_drivers import Fan

# serve a simple webpage with Flask

app = Flask(__name__)

led = gpiozero.LED(21)
fan = Fan()


def handle_switch_request(device, request):
    data = request.args
    print(data)
    if 'state' in data.keys():
        if data['state'] == '1':
            device.on()
            print("Turned device on")
            return json.dumps({'status': "success", "state": "on"})
        if data['state'] == '0':
            device.off()
            print("Turned device off")
            return json.dumps({'status': "success", "state": "off"})
        else:
            print("Failed because state not found.")
            return json.dumps({'status': "failed", "state": None})
    else:
        return 'error'


@app.route('/')
def index():
    # return current time
    return 'Hello World!'


@app.route('/get')
def get_led():
    # return current time
    print("Getting light state: " + str(led.value))
    return json.dumps({"state": led.value})


# if a post request is sent to the server, return the request body
@app.route('/set', methods=['POST'])
def set_led():
    return handle_switch_request(led, request)


# if a post request is sent to the server, return the request body
@app.route('/set-fan', methods=['POST'])
def set_fan():
    return handle_switch_request(fan, request)


@app.route('/get-fan')
def get_fan():
    return json.dumps({"state": fan.get()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
