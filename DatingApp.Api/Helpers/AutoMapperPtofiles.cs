using System.Linq;
using AutoMapper;
using DatingApp.Api.Dtos;
using DatingApp.Api.Models;

namespace DatingApp.Api.Helpers
{
    public class AutoMapperPtofiles : Profile
    {
        public AutoMapperPtofiles(){

            CreateMap<User,UserForListDto>()
            .ForMember(des=>des.PhotoUrl,opt=>opt.MapFrom(ser=>ser.Photos.FirstOrDefault(e=>e.IsMain).Url))
            .ForMember(des=>des.Age,opt=>opt.ResolveUsing(e=>e.DateOfBirth.CalculateAge()));
            CreateMap<User,UserForDetailsDto>()
            .ForMember(des=>des.PhotoUrl,opt=>opt.MapFrom(ser=>ser.Photos.FirstOrDefault(e=>e.IsMain).Url))
            .ForMember(des=>des.Age,opt=>opt.ResolveUsing(e=>e.DateOfBirth.CalculateAge()));
           ;
            CreateMap<Photo,PhotosForDetailsDto>();
            CreateMap<UserForUpdateDto,User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();
            CreateMap<UserForRegisterDto,User>();
        }
        
    }
}