using System;
using System.Threading.Tasks;
using DatingApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;

        } // inject data context to connect to the database
        public async Task<User> Login(string username, string password)
        {
           var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x=>x.Username ==username);
           if(user == null)
           return null;

           if(!verfypasswordHash(password,user.PasswordHash,user.PasswordSalt))
            return null;

            return user;
        }

        private bool verfypasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            // we copy it from down
             using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
                {
                 
               var ComputedHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
               // because of computehash in byte array>> we have to compare each elemant use for loop>
                for(int i = 0; i < ComputedHash.Length; i++)
                {
                    if (ComputedHash[i] != passwordHash[i]) return false;    

                }
                    return true;            
                }        
            }

        public async Task<User> Register(User user, string password)
        {
          byte[] passwordHash, passwordSalt; // to convert it to passwordhash and passwordSalt
          createPasswordHash(password, out passwordHash, out passwordSalt); //this is method to convert
          // use outkey word to pass reffrence to avariable when the updated will updates here also
          user.PasswordHash = passwordHash; // asign the passwrdHash after encdoing to user.passwordhash
          user.PasswordSalt = passwordSalt;// same
          await _context.Users.AddAsync(user); // to send it to the database 
          await _context.SaveChangesAsync(); //save it 
          return user;
    

        }

        private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            // we check the user is exists or not 
            if(await _context.Users.AnyAsync(x=>x.Username == username))
            return true;

            return false;

        }
    }
}