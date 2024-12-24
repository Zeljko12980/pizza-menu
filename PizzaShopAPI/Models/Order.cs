namespace PizzaShopAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
    public string CustomerFirstName { get; set; }
    public string CustomerLastName { get; set; }
    public string Address { get; set; }
    public List<PizzaOrder> Pizzas { get; set; }
    public decimal Total { get; set; }
    }
}