

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RazorPayService } from './payment.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('payment')
@UseGuards(JwtGuard)
export class RazorPayController {
	constructor(private readonly razorpayService: RazorPayService) { }

	@Post('create-order')
	async createOrder(@Body() orderData: { amount: number }, @Req() req: ExpressRequest & { user: { id: string } },) {
		console.log("hello")
		const userId = req.user?.id
		console.log(req.user.id)
		if (userId) {
			const order = await this.razorpayService.createOrder(orderData.amount, userId);
			console.log(order)
			return order;
		} else {
			console.log("Please Login")
		}

	}

	@Post('verify')
	async verifyPayment(@Body() paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
		const verificationStatus = await this.razorpayService.verifyPayment(paymentData);
		console.log(verificationStatus)
		return { status: verificationStatus };
	}

}