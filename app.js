export const motor = {
    brand: "yamaha",
    unit: "aerox",
    startEngine: function() {
        console.log("starting titititit")
    },

    niDagan: function(speed) {
        console.log(`nidagan siya og ${speed} kph`)
    }
}

motor.startEngine()
motor.niDagan(20)
motor.niDagan(50)
motor.niDagan(80)

