import paypal from "../../config/paypalConfig.js";
import Course from "../../model/courseSchema.js";
import Order from "../../model/orderSchema.js";
import {
  addCourseToStudent,
  createPaypalPaymentConfig,
} from "../../utility/paymentHelper.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";

// Function to create an order with PayPal integration
const createOrder = async (req, res) => {
  try {
    const orderDetails = req.body;

    const createPaymentJson = createPaypalPaymentConfig(
      orderDetails.courseTitle,
      orderDetails.courseId,
      orderDetails.coursePricing
    );

    // Create PayPal payment
    paypal.payment.create(createPaymentJson, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal payment creation error:", error);
        return buildErrorResponse(res, "Error creating PayPal payment.", 500);
      }

      // Create and save a new order record
      const newlyCreatedCourseOrder = new Order(orderDetails);
      await newlyCreatedCourseOrder.save();

      // Get approval URL from PayPal to redirect user
      const approveUrl = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      buildSuccessResponse(
        res,
        { approveUrl, orderId: newlyCreatedCourseOrder._id },
        "Order created successfully!"
      );
    });
  } catch (error) {
    console.error("Unexpected error in createOrder:", error);
    buildErrorResponse(res, "Error creating order.");
  }
};

// Function to capture payment and finalize order
const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // Find and verify the order
    const order = await Order.findById(orderId);

    if (!order) return buildErrorResponse(res, "Order not found.", 404);

    // Update order status as paid and save payment details
    Object.assign(order, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paymentId,
      payerId,
    });
    await order.save();

    // Add course to student’s purchased list
    const courseDetails = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };
    await addCourseToStudent(order.userId, courseDetails);

    // Add student to course record
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    buildSuccessResponse(res, order, "Payment captured and order finalized!");
  } catch (error) {
    console.error("Unexpected error in capturePaymentAndFinalizeOrder:", error);
    buildErrorResponse(res, "Error capturing payment and finalizing order.");
  }
};

export { createOrder, capturePaymentAndFinalizeOrder };
