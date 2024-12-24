using Microsoft.AspNetCore.Mvc;

namespace PizzaShopAPI.Controllers
{
  [ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    [HttpPost("login")]
    public ActionResult AdminLogin([FromBody] LoginRequest request)
    {
        if (request.Username == "admin" && request.Password == "admin123")
        {
            return Ok("Login successful");
        }
        return Unauthorized("Invalid credentials");
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

}