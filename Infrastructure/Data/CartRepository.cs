using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{
    public class CartRepository : ICartRepository
    {
        private readonly IDatabase _database;
        public CartRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<bool> DeleteBasketAsync(string cartId)
        {
            return await _database.KeyDeleteAsync(cartId);
        }

        public async Task<Cart> GetCartAsync(string cartId)
        {
            var data = await _database.StringGetAsync(cartId);
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<Cart>(data);
        }

        public async Task<Cart> UpdateCartAsync(Cart cart)
        {
            var created = await _database.StringSetAsync(cart.Id,
                         JsonSerializer.Serialize(cart), TimeSpan.FromDays(7));
            if (!created) return null;
            return await GetCartAsync(cart.Id);
        }
    }
}