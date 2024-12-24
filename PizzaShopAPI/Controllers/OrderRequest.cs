namespace PizzaShopAPI.Controllers
{
    public class OrderRequest
    {
          public CustomerData CustomerData { get; set; }
    public List<CartItem> Cart { get; set; }
    public decimal TotalPrice { get; set; }
    }
}