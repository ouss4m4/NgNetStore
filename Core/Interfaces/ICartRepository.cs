using Core.Entities;

namespace Core.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart> GetCartAsync(string cartId);
        Task<Cart> UpdateCartAsync(Cart cart);
        Task<bool> DeleteBasketAsync(string cartId);
    }
}