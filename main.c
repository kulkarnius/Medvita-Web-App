/*
* Copyright Sahil Kale 2020
* Github: @dakaleyt | sahil.kale1@gmail.com
* All rights reserved
*
* Purpose:
* Revision: 1.13
* Microcontroller: ATMega328p
 */ 

#ifndef F_CPU
#define F_CPU 1000000UL
#endif

#include <avr/io.h>

#define baudRate9600 5 //9600 BPS baud rate. The code is 71.

//Baud rate is calculated by Fosc / (16 * desired baud rate) - 1

#define isBitSet(byte, bit) (byte & (1 << bit))
#define isBitClear(byte, bit) !(byte & (1 << bit))
#define toggleBit(byte, bit) (byte ^= (1 << bit)) //uses an XOR gate. Basically, if both bits are the same, 0 is returned. By using a togglebit macros, we can target a certain bit by entering ex: 10101010 with 00000100 in order to toggle the bit.


void USART_Transmit(unsigned char data)
{
	while(isBitSet(PINB, PB6)) //ensures that the program stalls itself if CTS is false.
	{ }
	else
	{
		while (!(UCSR0A & (1 << UDRE0))) //If UDRE0 0 bit is set to 1, the transmitter is ready to transmit again. The isBitSet part
		{ //This piece of code stalls the program when transmitting.
			//RTS is set to high to indicate UNSAFE
			if(!isBitSet(PORTB, PB7))
			{
				toggleBit(PORTB, PB7);
			}
			
		}
		if(!isBitClear(PORTB, PB7))
		{
			toggleBit(PORTB, PB7);
		}
		//Set RTS to low to indicate SAFE
		UDR0 = data;
	}
	
	
}


int main(void)
{
	DDRB &= (0x00); //Clear DDRB, and also sets PB6 as an input as it is the CTS.
	PORTB &= (0x00); //Clear PORTB register. This also sets the RTS pin, PB7, to low.
	PORTB |= (1 << PB6); //Use internal pull-up resistor in order to use PinX for determining output. 0 = logic low.
	DDRB |= (1 << PB7); // Set the RTS, PB7 as an output. We can now use PortB bit 7 to set high or low.
	
	unsigned int ubrr = baudRate9600; //universal baud rate generator
	
	//ADC Code:
	ADMUX = 0b01000011; //last 4 dictate pin output, ADLAR is now 0 cause we want that sexy 10 bit resolution instead of the peasant 8
	ADCSRA = 0b10000011; //clock speed divided by 8. 125 kHz Clock
	ADCSRB = 0b00000000;//ADCSRB
	
	//UART Code:
	UCSR0C = 0x06;  //This is to set the frame format with 1 stop bit and no parity bits
	UCSR0B = (1 << TXEN0);  //Starts the cannon...I mean transmitter
	UBRR0H = (ubrr>>8);
	UBRR0L = (ubrr);
	
	
	

    while (1) 
    {
		ADCSRA |= (1 << ADSC); //Set the 2nd bit of the ADCSRA to start the ADC.
		while(isBitSet(ADCSRA, ADSC))
		{ //Stall the code to not do anything while the ADC is active.
		}
		
		/*
		For Athul:
		I'm transmitting the ADCH first and then the ADCL signal after. I may add in something after on the USART Transmit like a 0xFF byte to confirm we recieved all the data.
		
		ADCH stores the first 2 bits, the most significant ones. ADCL stores the rest of the . For your code, ensure that the ADCH is shifted 8 bits left, and then tack on the ADCL value to get the 0-1023 number :)
		*/
		
		USART_Transmit(ADCH); //Will only be 2 bits.
		USART_Transmit(ADCL); //ADCL and ADCH is where we are storing the ADC output. it is then put in the USART Transmit function which asks for a char to transmit the raw data from the high register. 
		
		
			
    }
}

