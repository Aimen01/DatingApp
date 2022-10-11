using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.Api.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IDatingRepository _messageRepositrory;
        private readonly IMapper _mapper;
        public MessageHub(IDatingRepository messageRepositrory, IMapper mapper)
        {
            _mapper = mapper;
            _messageRepositrory = messageRepositrory;
        }

        public override async Task OnConnectedAsync()
        {
            var name = Context.User.FindFirst(ClaimTypes.Name).Value;
            var id = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(id, otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await addToGroup(Context, groupName);
            var messages = await _messageRepositrory.GetMessageThread(int.Parse(id), int.Parse(otherUser));
            await Clients.Group(groupName).SendAsync("RecieveMessageThread", messages);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var id = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(id, otherUser);
            await Clients.Group(groupName).SendAsync("UserIsOffline", "userLeave");
            await RemoveFormMessageGroup(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);

        }

        
        public async Task SendMessage(MessageForCreationDto createMessageDto)
        {
            var name = Context.User.FindFirst(ClaimTypes.Name).Value;
            var id = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (id == createMessageDto.RecipientId)
                throw new HubException("You cannot send messages to yourself");

            var sender = await _messageRepositrory.GetUser(id);
            var recipient = await _messageRepositrory.GetUser(createMessageDto.RecipientId);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content,
                MessageSent = DateTime.Now
            };
            var groupName = GetGroupName(sender.Id.ToString(), recipient.Id.ToString());
            var group = await _messageRepositrory.GetMessageGroup(groupName);
            if (group.Connections.Any(e => e.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            _messageRepositrory.add(message);
            if (await _messageRepositrory.SaveAll())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageForCreationDto>(message));
            }

        }

        private string GetGroupName(string caller, string other)
        {

            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";

        }
        private async Task<bool> addToGroup(HubCallerContext context, string groupName)
        {
            var id = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var group = await _messageRepositrory.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, id.ToString());
            if (group == null)
            {
                group = new Group(groupName);
                _messageRepositrory.AddGroup(group);
            }
            group.Connections.Add(connection);
            return await _messageRepositrory.SaveAll();
        }
        private async Task RemoveFormMessageGroup(String connectionId)
        {
            var connection = await _messageRepositrory.GetConnection(connectionId);
            _messageRepositrory.RemoveConnection(connection);
            await _messageRepositrory.SaveAll();
        }

    }
}