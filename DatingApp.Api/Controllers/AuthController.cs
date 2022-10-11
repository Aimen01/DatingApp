using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController] // when use api controller no need to do [fromBody] in post.
  [AllowAnonymous]
  public class AuthController : ControllerBase
  {
    // private readonly IAuthRepository _repo;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    public AuthController(IConfiguration config,

    IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _mapper = mapper;
      _config = config;
      // _repo = repo;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
    {
      // userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

      // if (await _repo.UserExists(userForRegisterDto.Username))
      //     return BadRequest("Username already exists"); // if user exists reply

      var userToCreate = _mapper.Map<User>(userForRegisterDto);

      var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);

      // var CreatedUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

      var userToReturn = _mapper.Map<UserForDetailsDto>(userToCreate);
      if (result.Succeeded)
      {
        return CreatedAtRoute("GetUser", new { Controller = "Users", id = userToCreate.Id }, userToReturn);

      }
      return BadRequest(result.Errors);
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
    {
      // var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);//check the username and password are store in the database and match
      var user = await _userManager.FindByNameAsync(userForLoginDto.Username);
      var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);
      if (result.Succeeded)
      {
        var appUser = _mapper.Map<UserForListDto>(user);
        var getToken = GenerateJwtToken(user).Result;
        appUser.token = getToken;
        return Ok(new
        {
          token = getToken,
          user = appUser
        });
      }
      return Unauthorized();

    }

    private async Task<string> GenerateJwtToken(User user)
    {

      var claims = new List<Claim>// token can contain to claims
           {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), //user id
                new Claim(ClaimTypes.Name, user.UserName) // user username
            };
      var roles = await _userManager.GetRolesAsync(user);
      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value)); // to make sure it has valid token
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
      var tokenDescriptor = new SecurityTokenDescriptor // create token descriptor pass in clims as subject and with expaied date
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),// expaired date
        SigningCredentials = creds
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}