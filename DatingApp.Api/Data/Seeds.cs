using System.Collections.Generic;
using DatingApp.Api.Models;
using Newtonsoft.Json;

namespace DatingApp.Api.Data
{
    public class Seeds
    {
        private readonly DataContext _context;
        public Seeds(DataContext dbContext)
        {
            _context = dbContext;

        }
        public void SeedUsers()
        {
         var userData = System.IO.File.ReadAllText("Data/UserSeedData.json"); // to get the data from the file
         var users = JsonConvert.DeserializeObject<List<User>>(userData); // to convert the json file and save it in object

         foreach (var user in users)
         {
             byte[] passwordHash, passwordSalt;
             createPasswordHash("password", out passwordHash,out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower(); // we used function to get the password and we set it to the user and we saVE IT IN THE DATABASE

                _context.Users.Add(user);
                _context.SaveChanges();
            // NOW WE GO TO THE SERVICE TO ADD THIS AS SERVICE
         }
        }
         private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}