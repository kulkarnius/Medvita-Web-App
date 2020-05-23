# -*- coding: utf-8 -*-
"""
Created on Fri May 22 17:06:17 2020

@author: atomi
"""

import serial


#Define Port Structure


#Make sure baudrate is same as what Sahil has. 
baudrate = 10416

#Timeout can be changed it means that the port will be open for 20 seconds or something.
timeout = 2

#Define Device and Open Port.
dev = serial.serial_for_url('hwgrep://AB0JQF1NA', baudrate=baudrate, timeout=timeout)

#Read From the Port. This is going to read 10 bytes. It will keep it open until the timeout expires.
#If you give no timeout, it will wait until it reads 10 bytes. Or it will be stuck forever...

r = dev.read(40)

print(r)
#This is supposed to just allow us to read straight from it. But let's see

msg = str(r)

count = 0
for i in msg:
    if i == 'T':
        print("Gotem")
        break
    count = count + 1

full = count + 17
    
print(msg[count:full])



#Close Port
dev.close()