# tlaloc

tlaloc is a Raspberry Pi/Arduino driven sprinkler application based on the node.js framework.
### Key features include:
+ CRON based sprinkler scheduling with option for fertilize.
+ Temperature controlled heating and cooling
+ Easy customization for administering varied zones
+ An easy to use web interface for at-home or VPN control.

##### Requirements:
+ A Raspberry Pi with Node.js and npm installed
+ An Arduino flashed with ConfigureableFirmata (installed through Arduino IDE)
+ One 8 channel relay module
+ One ds18b20 digital thermometer
+ One 4.7k Ohm Resister and male-to-male jumper wires

#### To install:
On your raspberry pi, open up a command prompt and enter:
```
git clone https://www.github.com/Ipswich/tlaloc ~/
cd ~/tlaloc
npm install
```

#### To run:
On your raspberry pi, open up a command prompt and enter:
```
cd ~/tlaloc
npm start
```

#### Note: 
This project is intended for personal use, and will likely require some tinkering/knowhow for wiring and setting things up, including modifying default pin-out for individual means.
