using System;

namespace DatingApp.Api.Helpers
{
    public static class Extentions
    {
      public static int CalculateAge(this DateTime theDateTime)
      {

          var age = DateTime.Today.Year - theDateTime.Year;
          if( theDateTime.AddYears(age) > DateTime.Today)
              age--;
              return age;

      }  
    }
}