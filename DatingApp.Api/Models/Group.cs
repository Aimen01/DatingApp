using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.Api.Models
{
    public class Group
    {
 
        public Group(string name)
        {
            Name = name;
        }



        [Key]
        public string Name { get; set; }
        public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }
}