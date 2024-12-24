using Microsoft.AspNetCore.Mvc;
using PizzaShopAPI.Models;

namespace PizzaShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PizzaController:ControllerBase
    {
         [HttpGet]
        public IActionResult GetPizzas()
        {
            var pizzaData = new List<Pizza>
            {
                new Pizza
                {
                    Name = "Focaccia",
                    Ingredients = "Bread with italian olive oil and rosemary",
                    Price = 6,
                    PhotoName = "pizzas/focaccia.jpg",
                    SoldOut = false
                },
                new Pizza
                {
                    Name = "Pizza Margherita",
                    Ingredients = "Tomato and mozarella",
                    Price = 10,
                    PhotoName = "pizzas/margherita.jpg",
                    SoldOut = false
                },
                new Pizza
                {
                    Name = "Pizza Spinaci",
                    Ingredients = "Tomato, mozarella, spinach, and ricotta cheese",
                    Price = 12,
                    PhotoName = "pizzas/spinaci.jpg",
                    SoldOut = false
                },
                new Pizza
                {
                    Name = "Pizza Funghi",
                    Ingredients = "Tomato, mozarella, mushrooms, and onion",
                    Price = 12,
                    PhotoName = "pizzas/funghi.jpg",
                    SoldOut = false
                },
                new Pizza
                {
                    Name = "Pizza Salamino",
                    Ingredients = "Tomato, mozarella, and pepperoni",
                    Price = 15,
                    PhotoName = "pizzas/salamino.jpg",
                    SoldOut = true
                },
                new Pizza
                {
                    Name = "Pizza Prosciutto",
                    Ingredients = "Tomato, mozarella, ham, aragula, and burrata cheese",
                    Price = 18,
                    PhotoName = "pizzas/prosciutto.jpg",
                    SoldOut = false
                }
            };

            return Ok(pizzaData);
        }
    }
}