using Core.Entities;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<Cart> CreateOrUpdatePaymentIntent(string cartId);
        Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);

        Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);

    }
}