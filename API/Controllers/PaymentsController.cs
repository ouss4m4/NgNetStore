using API.Dtos;
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
            return await _paymentService.CreateOrUpdatePaymentIntent(cartId);

        }
    }
}