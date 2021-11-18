using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod,
                                     string cartId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();


    }
}