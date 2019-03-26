using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController] // when use api controller no need to do [fromBody] in post.
    public class UsersController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private bool claimTypes;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }
        [HttpGet]
        public async Task<IActionResult> GetUsres()
        {
            var users = await _repo.GetUsers();
            var usersToreturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToreturn);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Getuser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailsDto>(user);
            return Ok(userToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser( int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var userFroRepo = await _repo.GetUser(id);
            
            _mapper.Map(userForUpdateDto,userFroRepo);
           if (await _repo.SaveAll())
           return NoContent();

           throw new Exception($"Updating user {id} faild to save");

        }
    }
}