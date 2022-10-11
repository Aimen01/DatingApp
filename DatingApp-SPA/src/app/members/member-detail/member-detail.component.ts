import { User } from './../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { PresenceService } from 'src/app/_services/presence.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { timingSafeEqual } from 'crypto';
import { MessageService } from 'src/app/_services/message.service';
import { AuthService } from 'src/app/_services/Auth.service';
import { take } from 'rxjs/operators';
import { logging } from 'selenium-webdriver';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  user: User;
  userInfo: any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  constructor(private messgeService: MessageService, public presence: PresenceService, private accountService: AuthService,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    console.log('fh', this.activeTab);
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
      this.accountService.currentUserInfo$.pipe(take(1)).subscribe(
        (user) => {
          this.userInfo = user;
          console.log(user);
          this.messgeService.createHubConnection(this.userInfo, this.user.id);

        }
      );
    });
    // this.activeTab = data;


    // this.activatedRoute.queryParams.subscribe(params => {
    //   const selectedTab = params['tabs'];
    //   this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    // });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }
    ];
    this.galleryImages = this.getImages();
  }
  getImages() {
    const imageUrl = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrl.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description

      });
    }
    return imageUrl;

  }
  // selectTab(tabId: number) {
  //   console.log("gu");
  //   this.memberTabs.tabs[tabId].active = true;
  // }
  onTabActivated(data: TabDirective) {
    console.log("sdfdata");

    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messgeService.createHubConnection(this.userInfo, this.user.id);
    } else {
      this.messgeService.stopHunConnection();
    }
  }
  ngOnDestroy(): void {
    this.messgeService.stopHunConnection();
  }
}
