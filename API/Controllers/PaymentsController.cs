using API.Dtos;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private const string whSecret = "whsec_GKwna9rwl2NewYYmZJlJoY8jdWVnVSxT";

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<Cart>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await _paymentService.CreateOrUpdatePaymentIntent(cartId);
            if (cart == null)
            {
                return BadRequest(new ApiResponse(400, "Cart does not exist"));
            }
            else
            {
                return cart;
            }

        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], whSecret);
            PaymentIntent intent;
            Order order;
            _logger.LogInformation("------------------", stripeEvent);

            if (stripeEvent.Type == Events.PaymentIntentSucceeded)
            {

                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment Succeeded: ", intent.Id);
                order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                _logger.LogInformation("Order Updated To Payment Succeeded: ", order.Id);
            }
            else if (stripeEvent.Type == Events.PaymentIntentPaymentFailed)
            {
                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment Failed: ", intent.Id);
                order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                _logger.LogInformation("Order Updated To Payment Failed: ", order.Id);

            }
            else
            {
                _logger.LogInformation(stripeEvent.Type);

            }

            return new EmptyResult();

        }
    }
}