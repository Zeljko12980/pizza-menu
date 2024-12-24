namespace PizzaShopAPI.Controllers
{
    public class CartItem
    {
        public int Id { get; set; }
    public string Name { get; set; }
    public string Ingredients { get; set; }
    public string PhotoName { get; set; }
    public decimal Price { get; set; }
    public bool SoldOut { get; set; }
    }
}