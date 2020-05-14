#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu May 14 15:36:29 2020

@author: atharva

"""
#importing usb.core module from PyUSB
import usb.core

#Locating Device and Identifying it
device = usb.core.find(idVendor=0x0403, idProduct=0x6001)

#Make sure device is there
if device is None:
    print("Device Not Found")

#Reset Device
device.reset()

#Defining configuration object
cfg = usb.core.Configuration(device)

#Defining the first and only interface
inf = cfg[(0,0)]

#Finding Interface Number
i = inf.bInterfaceNumber

#Finding endpoints. I ran an earlier test to find the two of them, listed below.
epIn = inf[0]
epOut = inf[1]

#Definiting Endpoint Addresses as vars
epaddIN = epIn.bEndpointAddress
epaddOUT = epOut.bEndpointAddress

#Kernel Driver Reset
if device.is_kernel_driver_active(i):
    print("Detaching kernel driver")
    device.detach_kernel_driver(i)

#Setting device configuration for USB communication.
device.set_configuration()

#Read 2 bytes from the Bulk IN Endpoint
adcVals = device.read(epaddIN, 2) 

#Y'all know what this shit does
print(adcVals)


"""I can work with the ADC values later.
This should allow for ingestion of the data"""


