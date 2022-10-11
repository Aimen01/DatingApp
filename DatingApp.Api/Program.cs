using System;
using DatingApp.Api.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using DatingApp.Api.Models;

namespace DatingApp.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
           // CreateWebHostBuilder(args).Build().Run();

          var host =  CreateHostBuilder(args).Build();
          using( var scope = host.Services.CreateScope())
          {
              var services = scope.ServiceProvider;
              try
              {
                    var context = services.GetRequiredService<DataContext>();
                    var userManger = services.GetRequiredService<UserManager<User>>();
                    var roleManager = services.GetRequiredService<RoleManager<Role>>();
                    context.Database.Migrate();
                    Seeds.SeedUsers(userManger,roleManager);
              }
              catch (Exception ex) {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex,"An error occured during migration");
              }
          }
          host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(WebHostBuilder =>
            {
                WebHostBuilder.UseStartup<Startup>();
            });
                
    }
}
