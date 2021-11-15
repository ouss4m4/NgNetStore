using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : BaseApiController
    {
        private readonly ICartRepository _cartRepo;

        public CartController(ICartRepository cartRepo)
        {
            _cartRepo = cartRepo;
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCartById(string id)
        {
            var cart = await _cartRepo.GetCartAsync(id);
            return Ok(cart ?? new Cart(id));
        }

        [HttpPost]
        public async Task<ActionResult<Cart>> UpdateCart([FromBody] Cart cart)
        {
            var newCart = await _cartRepo.UpdateCartAsync(cart);

            return Ok(newCart);

        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCartAsync(string id)
        {
            await _cartRepo.DeleteBasketAsync(id);
            return NoContent();
        }
    }
}