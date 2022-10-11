using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.Api.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var id = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var name = Context.User.FindFirst(ClaimTypes.Name).Value;

            var isOnline = await _tracker.UserConnected(id, Context.ConnectionId);
            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", name);

            var currentUsers = await _tracker.GetOnlineUsers();
            // await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers); // we need only to send it to the caller.
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var id = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var name = Context.User.FindFirst(ClaimTypes.Name).Value;

            var isOffline = await _tracker.UserDisconnected(id, Context.ConnectionId);
            if (isOffline)
                await Clients.Others.SendAsync("UserIsOffline", name);

            // var currentUsers = await _tracker.GetOnlineUsers();
            // await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
            await base.OnDisconnectedAsync(exception);
        }
    }
}