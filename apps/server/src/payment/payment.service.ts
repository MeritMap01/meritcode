import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto, { BinaryLike } from "crypto";
import { PrismaService } from "nestjs-prisma";
import Razorpay from "razorpay";

@Injectable()
export class RazorPayService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const keyId = this.configService.get<string>("RAZORPAY_KEY_ID");
    console.log(keyId);
    const keySecret = this.configService.get<string>("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      throw new InternalServerErrorException(
        "Razorpay keys are not defined in the environment variables",
      );
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createOrder(amount: number, userId: string) {
    const options = {
      amount: amount * 100,
      currency: "INR",
    };
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const order = await this.razorpay.orders.create(options);

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        userId: userId,
        amount: amount,
        status: "pending",
        startDate,
        endDate,
      },
    });

    return order;
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const expectedSignature = this.generateRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
    );

    const paymentStatus = expectedSignature === razorpay_signature ? "paid" : "unpaid";

    if (expectedSignature !== razorpay_signature || paymentStatus === "unpaid") {
      throw new BadRequestException("Invalid payment verification");
    }

    await this.prisma.payment.update({
      where: { orderId: razorpay_order_id },
      data: { status: paymentStatus },
    });

    return "Payment successful";
  }

  private generateRazorpaySignature(paymentId: string, orderId: string) {
    const hmac = crypto.createHmac(
      "sha256",
      this.configService.get<string>("RAZORPAY_KEY_ID") as BinaryLike,
    );
    hmac.update(`${paymentId}|${orderId}`);
    return hmac.digest("hex");
  }
}
