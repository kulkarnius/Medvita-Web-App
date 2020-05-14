#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu May 14 13:45:45 2020

@author: vinit
"""

import usb.core
import usb.control


#Device Things
device = usb.core.find(idVendor=0x0403, idProduct=0x6001)

if device is None:
    print("Device Not Found")

cfg = usb.core.Configuration(device)

inf = cfg[(0,0)]

i = inf.bInterfaceNumber

epIn = inf[0]
epOut = inf[1]

epaddIN = epIn.bEndpointAddress
epaddOUT = epOut.bEndpointAddress


if device.is_kernel_driver_active(i):
    print("Detaching kernel driver")
    device.detach_kernel_driver(i)

device.set_configuration()

#Bulk Transfer
r = device.read(epaddIN,1024)

print(r)

""""
device.set_configuration(config)
"""