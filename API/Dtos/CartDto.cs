namespace API.Dtos
{
    public class CartDto
    {
        public string Id { get; set; }
        public List<CartItemDto> Items { get; set; }
    }
}