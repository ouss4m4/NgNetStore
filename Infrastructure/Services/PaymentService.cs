using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;
using Order = Core.Entities.OrderAggregate.Order;
namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(ICartRepository cartRepository, IUnitOfWork unitOfWork, IConfiguration config)
        {
            _cartRepository = cartRepository;
            _unitOfWork = unitOfWork;
            _config = config;
        }

        public async Task<Cart> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];

            var cart = await _cartRepository.GetCartAsync(cartId);
            if (cart == null) return null;
            decimal shippingPrice = 0;
            if (cart.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>()
                                                        .GetByIdAsync((int)cart.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }

            foreach (CartItem item in cart.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                item.Price = productItem.Price;
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;
            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };

                intent = await service.CreateAsync(options);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,

                };
                await service.UpdateAsync(cart.PaymentIntentId, options);
            }

            await _cartRepository.UpdateCartAsync(cart);

            return cart;

        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
            if (order == null) return null;
            order.Status = OrderStatus.PaymentFailed;
            _unitOfWork.Repository<Order>().Update(order);
            await _unitOfWork.Complete();
            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
            if (order == null) return null;
            order.Status = OrderStatus.PaymentReceived;
            _unitOfWork.Repository<Order>().Update(order);
            await _unitOfWork.Complete();
            return order;
        }
    }
}