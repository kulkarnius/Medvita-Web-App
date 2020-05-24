import numpy as np
import csv

# Written by: Ryan Mah

# Note: assumes Vcc = Vref = 5V

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

# If you plug in T_from_ADC(0), you get a divide by zero error.
# Fortunately, we will probably never encounter this situation, so I'm just writing it as 0
lookup_table = [0]

for ADC in range(1, 1024):
    try:
        lookup_table.append(T_from_ADC(ADC))
    except:
        print("failed at ADC = " + str(ADC))

# To verify that it's been populated
print(len(lookup_table))

# Replace with your own directory
with open("C:\\Users\\Ryan\\VSCode_Python\\Projects\\look-up_table\\table.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerow(lookup_table)


