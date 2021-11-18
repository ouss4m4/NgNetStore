namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrdered itemOrder, decimal price, int quantity)
        {
            ItemOrder = itemOrder;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrdered ItemOrder { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

    }
}