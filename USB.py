# -*- coding: utf-8 -*-
"""
Created on Fri May 22 17:06:17 2020

@author: atomi
"""

from google.cloud import firestore
import serial
import numpy as np

"""
This first block of code reads from the USB and pulls out the value.
"""

#Define Port Structure
#Make sure baudrate is same as what Sahil has. 
baudrate = 2400

#Timeout can be changed it means that the port will be open for 20 seconds or something.
timeout = 2

#Define Device and Open Port.
#The url that points to the device will depend on the board and the device that we use.
dev = serial.serial_for_url('hwgrep://AB0JQF1NA', baudrate=baudrate, timeout=timeout)

#Number of Bytes to be read. Pretty much arbitrary, but it would be good to read more than 20 at least.
n = 40

#Read the bytes
r = dev.read(n)
#Convert all the bytes to string
msg = str(r)

#Parse the message to find the specific binary number that is the ADC output
for r in range(n):
    if msg[r] == 'n':
        msg1 = msg[(r+1):(r+11)]
        break

#Account for the fact that sometimes the ADC output is only 9 bits.
for r in range(10):
    if msg[r] == 'T':
        adcout = float(msg1[0:10])
    else:
        adcout = float(msg1)
            

#Close Port
dev.close()

"""
Code picked up from Ryan's table generator for our specific sensor. It gives us the temperature reading.
Written by: Ryan Mah
Note: assumes Vcc = Vref = 5V
"""
def V(ADC):
    """Calculates the voltage as a function of ADC value"""
    return ADC/204.8

def R(V):
    """Calculates the resistance as a function of V"""
    return (10000*V)/(5 - V)

def T(R):
    """Calculates the temperature as a function of R (IN CELSIUS)"""
    Ro = 10000
    B = 3988

    r_inf = Ro*np.exp((-1*B)/298.15)

    T_K = B/(np.log(R/r_inf))
    T_C = T_K - 273.15 #Convert to celsius

    return T_C

def T_from_ADC(ADC):
    """Calculates the tempature (in celsius) as a function of ADC value"""
    return T(R(V(ADC)))

#Definining a binary to decimal converter. Cause I'm cool like that
def binaryToDecimal(binary):  
    decimal, i = 0, 0
    while(binary != 0): 
        dec = binary % 10
        decimal = decimal + dec * (2**i) 
        binary = binary//10
        i += 1
    return decimal 

#Convert ADC output to Decimal
adcdec = binaryToDecimal(adcout)

#Converting to temperature and rounding to 2 decimal places
temp = round(T_from_ADC(adcdec), 2)

"""
Below is the 4 lines needed to make it work.
Note: The only reason this will work is because in your local development environment you need to export the json file with key into your environment variables.

On linux: I think its like 
    export GOOGLE_APPLICATION_KEY="Pathtofile/keyfile.json"

On windows: It is
    setx GOOGLE_APPLICATION_KEY "Pathtofile/keyfile.json"

Correct me if I am wrong. 

When we actually do this, we will need to add in an authentication object that pulls the key from GCP once the user has authenicated themselves.
But for now, since we're developing locally, the environment variable works perfectly.
"""
#Defining the database
firestore = firestore.Client() #It infers the client from the json file in my environment

testdoc = firestore.collection(u'test').document(u'test') #Generating the document, or accessing it if already exists. 

#Setting the values inside the document. 
testdoc.set({
    u'Temperature': temp
})