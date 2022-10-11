using System;
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
            CreateMap<MessageForCreationDto,Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
             .ForMember(des => des.SenderPhotoUrl,opt => opt.MapFrom
                 (ser =>ser.Sender.Photos.FirstOrDefault(e =>e.IsMain).Url))
             .ForMember(des => des.RecipientPhotoUrl,opt => opt.MapFrom
                 (src => src.Recipient.Photos.FirstOrDefault(e =>e.IsMain).Url));

        // CreateMap<DateTime, DateTime>().ConvertUsing(d=>DateTime.SpecifyKind(d,DateTimeKind.Utc));
        }
        
    }
}