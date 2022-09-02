# Homebridge Raspberry Pi fan controller

I hacked a fan and turned it smart. 

## Motivation

You can skip down to the ⭐ if you don't care how it was made.

I have an ordinary "dumb" fan that is controlled via an IR remote control, but I wanted to control it with the Apple Home app. 

How hard can it be? 

It was difficult.

### Overview 

This project required three main setups.
1. 🔌 Physical wiring of the Raspberry Pi's pins.
2. ☁️ Raspberry Pi server to control the pins through an api.
3. 🏠 Homebridge Plugin to access through the home app.
4. 

### 1. Raspberry Pi Setup
To do so, I took apart the remote, and rewired it to a Raspberry Pi's GPIO pins. Now when a pin is triggered on the Pi, the remote control sends an "On"/"Off" command to my fan. 

### 2. API Setup 
Then I started a simple server on the Pi to trigger the fan with requests. Here's the API:

GET `/get-fan` will return the fan's state a json like `{"state": 1}`, where `1` means the fan's on, and `0` meaning it's off.

POST `/set-fan?state=1` to turn the fan on, and `/set-fan?state=0` to turn the fan off.

When the server is running on `http://192.168.1.180:5000` your request would look like `curl http://192.168.1.180:5000/get`

### 3. Apple Home App integration

Finally, I used [Homebridge](https://homebridge.io) to connect it to the Home app. It is a small plugin that sends requests to the above api. 



## ⭐ Skip to here if you don't care how it was made

This repo contains code for both the server and client. 

### A. Server

Connect the trigger wire to the GPIO2 pin.
Clone this repo. Then navigate into it.
Then run the following:

```python3 -m pip install -r requirements.txt && python3 main.py```

Configure the ip address to `192.168.1.180` from your router, or edit the Pi's address in the `src/accessory.ts` file. 

### B. Client

Make sure to set up [Homebridge](https://homebridge.io). 
Clone repo.
Run the following.

```npm i && npm run build && sudo npm link```
