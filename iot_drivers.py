import gpiozero
from time import sleep

# relay trigger is attached to GPIO2
on_trigger = gpiozero.LED(2)


class Fan:
    def __init__(self):
        self.on_state = False

    def on(self):
        if not self.on_state:
            on_trigger.on()
            sleep(0.4)
            on_trigger.off()
            self.on_state = True

    def off(self):
        if self.on_state:
            on_trigger.on()
            sleep(0.4)
            on_trigger.off()
            self.on_state = False

    def get(self):
        if self.on_state:
            return 1
        else:
            return 0


if __name__ == "__main__":
    fan = Fan()
    fan.on()
    sleep(4)
    fan.off()
