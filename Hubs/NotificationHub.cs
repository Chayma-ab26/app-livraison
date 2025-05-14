using Microsoft.AspNetCore.SignalR; // AJOUTE CECI
using System.Threading.Tasks;

namespace application_Livraison.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotificationToUser(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }
    }
}
