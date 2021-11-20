using Core.Entities;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<Cart> CreateOrUpdatePaymentIntent(string cartId);
    }
}