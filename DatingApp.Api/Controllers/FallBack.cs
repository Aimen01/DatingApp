using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    public class FallBack:Controller
    {
        [AllowAnonymous]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine
            (Directory.GetCurrentDirectory(), 
            "wwwroot", "index.html"),"text/html");

        }
    }
}