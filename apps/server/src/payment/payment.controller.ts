

import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { RazorPayService } from './payment.service';

@Controller('payment')
export class RazorPayController {
	constructor(private readonly razorpayService: RazorPayService) { }

	@Post('create-order')
	async createOrder(@Body() orderData: { amount: number; userId: string; }) {
		console.log("hello")
		const order = await this.razorpayService.createOrder(orderData.amount, orderData.userId);
		return order;
	}

	@Post('verify')
	async verifyPayment(@Body() paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
		const verificationStatus = await this.razorpayService.verifyPayment(paymentData);
		console.log(verificationStatus)
		return { status: verificationStatus };
	}

}