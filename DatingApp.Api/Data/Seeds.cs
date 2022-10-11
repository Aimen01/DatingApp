using System.Collections.Generic;
using System.Linq;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.Api.Data
{
    public class Seeds
    {
        // private readonly DataContext context;

        // public Seeds(DataContext context)
        // {
        //     _context = context;

        // }
        // public static void SeedUsers( DataContext context)
        public static void SeedUsers(UserManager<User> userManger, RoleManager<Role> roleManager  )
        {
           if (!userManger.Users.Any())
           {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json"); // to get the data from the file
                var users = JsonConvert.DeserializeObject<List<User>>(userData); // to convert the json file and save it in object
                //Creat some roles

                var roles = new List<Role> {
                    new Role {Name ="Member"},
                    new Role {Name ="Admin"},
                    new Role {Name ="Moderator"},
                    new Role {Name ="VIP"},
                
                };
                foreach (var role in roles)
                {
                      roleManager.CreateAsync(role).Wait();
                }
                foreach (var user in users)
                {
                    userManger.CreateAsync(user,"password").Wait();
                    userManger.AddToRoleAsync(user, "Member");
                    // byte[] passwordHash, passwordSalt;
                    // createPasswordHash("password", out passwordHash, out passwordSalt);
                    // // user.PasswordHash = passwordHash;
                    // // user.PasswordSalt = passwordSalt;
                    // user.UserName = user.UserName.ToLower(); // we used function to get the password and we set it to the user and we saVE IT IN THE DATABASE

                    // context.Users.Add(user);
                
                    // NOW WE GO TO THE SERVICE TO ADD THIS AS SERVICE

                // create admin user
                var adminUser = new User
                {
                    UserName="Admin",
                };
                var result = userManger.CreateAsync(adminUser,"password").Result;
                if(result.Succeeded)
                {
                    var admin = userManger.FindByNameAsync("Admin").Result;
                    userManger.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
                }

                }
 
//  context.SaveChanges();
}
        }
        private static void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}