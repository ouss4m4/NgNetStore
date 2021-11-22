using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        public OrderService(ICartRepository cartRepo, IUnitOfWork unitOfWork, IPaymentService paymentService)
        {
            _cartRepo = cartRepo;
            _unitOfWork = unitOfWork;
            _paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string cartId, Address shippingAddress)
        {
            var cart = await _cartRepo.GetCartAsync(cartId);
            var items = new List<OrderItem>();

            foreach (CartItem item in cart.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, cart.PaymentIntentId);

            // Check if order exists (by PaymentIntentId)
            var spec = new OrderByPaymentIntentIdSpecification(cart.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            // delete old order and replace it with a new one
            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(cart.PaymentIntentId);
            }


            // Create Order (maybe new one)
            _unitOfWork.Repository<Order>().Add(order);
            var result = await _unitOfWork.Complete();
            if (result <= 0)
            {
                return null;
            }
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}