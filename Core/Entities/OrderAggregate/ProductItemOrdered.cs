namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int id, string productName, string pictureUrl)
        {
            Id = id;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }

        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string PictureUrl { get; set; }

    }
}