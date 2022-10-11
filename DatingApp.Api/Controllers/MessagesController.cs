using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    // [Authorize]
    [Route("api/users/{userId}/[controller]")] // the root for this controller to know how to reach it
    [ApiController] // when use api controller no need to do [fromBody] in post.

    public class MessagesController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }
        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            // if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            // return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);
            // var messageToUser = _mapper.Map<MessageToReturnDto>(messageFromRepo);

            if (messageFromRepo == null)
                return NotFound();
            return Ok(messageFromRepo);

        }
        [HttpGet]
        public async Task<IActionResult> GetMessage(int userId, [FromQuery] MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.UserId = userId;

            var messageFromRepo = await _repo.GetMessagesForUser(messageParams);

            var message = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

            Response.AddPagination(messageFromRepo.CurrentPage, messageFromRepo.PageSize,
            messageFromRepo.TotalCount, messageFromRepo.TotalPages);
            return Ok(message);
        }
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await _repo.GetMessageThread(userId, recipientId);
            // var message = _mapper.Map<IEnumerable< MessageToReturnDto>>(messageFromRepo);

            return Ok(message);
        }
 

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = _repo.GetUser(userId);
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreationDto.SenderId = userId;
            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
            if (recipient == null)
                return BadRequest("Could not found user");

            var message = _mapper.Map<Message>(messageForCreationDto);
            _repo.add(message);

            if (await _repo.SaveAll())
            {
                var messageForUser = _mapper.Map<MessageToReturnDto>(message);
                //   return CreatedAtRoute("GetMessage",
                //    new {userId, id = message.Id},messageForUser);
                return Ok(messageForUser);

                // return CreatedAtRoute("GetMessage", new {
                //    id = message.Id},messageForUser);

            }
            throw new Exception("Creating the message faild on save");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                Unauthorized();

            var user = await _repo.GetMessage(id);
            if (user.RecipientId == userId)
                user.RecipinetDeleted = true;
            if (user.SenderId == userId)
                user.SenderDeleted = true;

            if (user.SenderDeleted && user.RecipinetDeleted)
                _repo.Delete(user);

            if (await _repo.SaveAll())
                return NoContent();
            //return BadRequest("the data can not be deleted");
            throw new Exception("Error deleting the message");

        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> readMessage(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessage(id);

            if (message.RecipientId != userId)
                return Unauthorized();

            message.IsRead = true;
            message.DateRead = DateTime.Now;

            await _repo.SaveAll();
            return NoContent();

        }
    }



}