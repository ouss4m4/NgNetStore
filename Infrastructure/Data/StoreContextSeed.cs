using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            try
            {
                // try seeding Brands
                if (!context.ProductBrands.Any())
                {
                    var brandsData = File.
                       ReadAllText(path + @"/Data/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                    foreach (var item in brands)
                    {
                        context.ProductBrands.Add(item);
                    }
                    await context.SaveChangesAsync();
                }

                // try seeding Types
                if (!context.ProductTypes.Any())
                {
                    var typesData = File.
                       ReadAllText(path + @"/Data/SeedData/types.json");
                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                    foreach (var item in types)
                    {
                        context.ProductTypes.Add(item);
                    }
                    await context.SaveChangesAsync();
                }

                // try seeding products
                if (!context.Products.Any())
                {
                    var productsData = File.
                       ReadAllText(path + @"/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }
                    await context.SaveChangesAsync();
                }

                // try seeding DeliveryMethods
                if (!context.DeliveryMethods.Any())
                {
                    var dlmData = File.
                       ReadAllText(path + @"/Data/SeedData/delivery.json");
                    var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dlmData);
                    foreach (var method in methods)
                    {
                        context.DeliveryMethods.Add(method);
                    }
                    await context.SaveChangesAsync();
                }

            }
            catch (Exception ex)
            {

                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex, "Error Seeding Data");
            }
        }
    }

}