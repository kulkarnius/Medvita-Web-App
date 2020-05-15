# -*- coding: utf-8 -*-
"""
Created on Fri May 15 12:54:21 2020

@author: atharva
"""

"""
Currently this porgram returns b''
I assume when Sahil's code pushes data we'll get something out. This will work better, hopefully.

@Amrit, you are going to need the PySerial Library and the latest Python of course to make this work.
You can go into command prompt and type:
        
    pip install serial pyserial

I'm actually not sure which one works, so just get both. PySerial should be the one though.


Once you connect the FT232RL, to your computer: Go into your devices and just check if it is listed.
That will make sure the driver is installed properly and is functioning. 

The first command that you should run is to go into the command line and run:
    python -m serial.tools.list_ports -v
 
This should give you a list of ports and the appropriate device attached to them.
Make sure the serial number that I have here:

    Serial No. = AB0JQF1NA

Is the same as the serial number that shows up. Then the code should be all g to use.
Run it and see what happens. 

A Few Notes:
 - Let me know if you have any questions.
 - You can run the USB analyzer and see
 - We'll talk on Tuesday to run this code and see.
"""



import serial


#Define Port Structure
#Defining URL for Port with static serial
url = 'hwgrep://' + 'AB0JQF1NA'

#Define Device and Open Port.
dev = serial.serial_for_url('hwgrep://AB0JQF1NA', baudrate=13200, timeout=2)

#Raise Ready to Send. Maybe this is useful, IDK really. It might mean that we can get a CTS from Sahil
dev.rts = True

#Let's this helps a little. Better Flow control hopefully?
print(dev.cts)

#Read From the Port
r = dev.read(4)

#This is supposed to just allow us to read straight from it. But let's see
print(r)

#Lower RTS
dev.rts = False

#Close Port
dev.close()





"""
The following would likely be the argument parsing block
for entry from command line
or user input for the serial number.


import argparse


parser = argparse.ArgumentParser(description='What is the serial number?')
parser.add_argument('Serial Number', action='store', type=str)

sernum = parser.parse_args()
"""