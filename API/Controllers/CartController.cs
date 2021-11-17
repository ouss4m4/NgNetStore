using API.Dtos;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public CartController(ICartRepository cartRepo, IMapper mapper)
        {
            _cartRepo = cartRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCartById(string id)
        {
            var cart = await _cartRepo.GetCartAsync(id);
            return Ok(cart ?? new Cart(id));
        }

        [HttpPost]
        public async Task<ActionResult<Cart>> UpdateCart(CartDto cartDto)
        {
            var cart = _mapper.Map<CartDto, Cart>(cartDto);
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