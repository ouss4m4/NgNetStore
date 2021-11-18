using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<Order> _orderRepo;
        private readonly IGenericRepository<DeliveryMethod> _deliveryRepo;

        public OrderService(ICartRepository cartRepo,
                            IGenericRepository<Product> productsRepo,
                            IGenericRepository<Order> orderRepo,
                            IGenericRepository<DeliveryMethod> deliveryRepo)
        {
            _cartRepo = cartRepo;
            _productsRepo = productsRepo;
            _orderRepo = orderRepo;
            _deliveryRepo = deliveryRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string cartId, Address shippingAddress)
        {
            var cart = await _cartRepo.GetCartAsync(cartId);
            var items = new List<OrderItem>();

            foreach (CartItem item in cart.Items)
            {
                var productItem = await _productsRepo.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _deliveryRepo.GetByIdAsync(deliveryMethodId);
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);
            // @TODO persist order
            return order;
        }

        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}