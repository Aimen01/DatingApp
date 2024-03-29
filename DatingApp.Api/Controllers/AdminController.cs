using System.Linq;
using System.Threading.Tasks;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public AdminController(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;

        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {

            var userList = await _context.Users
            .OrderBy(x => x.UserName)
            .Select(user => new
            {
                Id = user.Id,
                UserName = user.UserName,
                roles = (from userRole in user.UserRoles
                         join role in _context.Roles
                         on userRole.RoleId
                         equals role.Id
                         select role.Name).ToList()
            }).ToListAsync();

            return Ok(userList);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        { 
          
 
                var user =  await _userManager.FindByNameAsync(userName);
                var userRoles = await _userManager.GetRolesAsync(user);

                var selectedRoles  = roleEditDto.RoleNames;
                // seclected = selectedRoles !=null ? selectedRoles: new string[] {};
                selectedRoles = selectedRoles?? new string[]{};
                var reslut = await _userManager.AddToRolesAsync(user,selectedRoles.Except(userRoles));
                if(!reslut.Succeeded)
                return BadRequest("Failed to add to roles");

                reslut = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles) );

                if(!reslut.Succeeded)
                return BadRequest("Failed to remove to roles");

                return Ok(await _userManager.GetRolesAsync(user));

        }


        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");

        }

    }
}