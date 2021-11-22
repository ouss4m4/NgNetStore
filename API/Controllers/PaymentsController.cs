using API.Dtos;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
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
    }
}