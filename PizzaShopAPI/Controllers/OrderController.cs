using Microsoft.AspNetCore.Mvc;
using PizzaShopAPI.Models;

namespace PizzaShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController:ControllerBase
    {
         private static List<Order> orders = new List<Order>();

    [HttpGet]
    public ActionResult<IEnumerable<Order>> GetOrders()
    {
        return Ok(orders);
    }

    [HttpPost]
        public IActionResult PlaceOrder([FromBody] OrderRequest orderRequest)
    {
        if (orderRequest == null)
        {
            return BadRequest("Order data is invalid.");
        }

        // Process the order here, e.g., saving to the database
        // For now, we will simply return the received data as confirmation
        var orderConfirmation = new
        {
            message = "Order successfully placed!",
            orderDetails = new
            {
                customerData = orderRequest.CustomerData,
                cart = orderRequest.Cart,
                totalPrice = orderRequest.TotalPrice
            }
        };

        // For example, save the order to the database here
        // _orderService.SaveOrder(orderRequest);

        return Ok(orderConfirmation);
    }
    }
}