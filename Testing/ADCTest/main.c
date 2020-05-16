/*
 * GccApplication4.c
 *
 * Created: 5/14/2020 16:13:30
 * Author : sahil
 */ 
#ifndef F_CPU
#define F_CPU 1000000UL
#endif



#include <avr/io.h>

#define isBitSet(byte, bit) (byte & (1 << bit))
#define isBitClear(byte, bit) !(byte & (1 << bit))
#define toggleBit(byte, bit) (byte ^= (1 << bit))

int ADCsingleRead(uint8_t adcPort) //adcPort argument takes an integer from 0-8 that will specify the ADC to use. Easier than hard coding the port so that in the future, we can call the function :)
{
	int returnValue;
	ADMUX = 0b00000000;
	ADMUX = adcPort;
	ADMUX |= (1 << REFS0) | (1 << ADLAR); //AVcc internal reference, left justify ADLAR. Plan is to output ADCH for now since this is a test.
	ADCSRA |= (1 << ADEN) | (1 << ADPS1) | (1 << ADPS0);
	
	ADCSRA |= (1 << ADSC);
	
	while(isBitSet(ADCSRA, ADSC));
	
	returnValue = ADCH;
	return returnValue;
	//returnValue = (ADCH << 8) + ADCL;	//Use this if ADLAR is right justified to get 10 bit resolution.
}
int main(void)
{
	DDRD |= 0xFF; //We're gonna use Port D for output :D
	//Note: the input pin is specified in the ADMUX register.
	
	//reset all registers.
	ADCSRA = 0b00000000;
	ADMUX = 0b00000000;
	
    /* Replace with your application code */
    while (1) 
    {
		PORTD = ADCsingleRead(5);
    }
	return 0;
}

