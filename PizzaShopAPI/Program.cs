var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();  // Add Swagger/OpenAPI service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();  // Enables the Swagger UI in development
  // Add this to enable the Swagger UI page
}

app.UseCors("AllowAll");
app.UseRouting();
app.MapControllers();
app.UseHttpsRedirection();

app.Run();
