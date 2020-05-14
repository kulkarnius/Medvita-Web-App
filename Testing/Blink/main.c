/*
 * GccApplication3.c
 *
 * Created: 5/12/2020 20:12:19
 * Author : sahil
 */ 

#ifndef F_CPU
#define F_CPU 1000000UL
#endif

#include <avr/io.h>
#include <util/delay.h>	


#define toggleBit(byte, bit) (byte ^= (1 << bit))

void blinkLED() //blinks the led. Ports are hardcoded.
{
	toggleBit(PORTB, PB0);
	_delay_ms(500);
	toggleBit(PORTB, PB0);
	
}

int main(void)
{
	DDRB &= 0x00;
	DDRB |= (1 << PB0);
	
    /* Replace with your application code */
    while (1) 
    {
		blinkLED();
    }
}

