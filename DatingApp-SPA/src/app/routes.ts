import { AuthGuard } from './_guards/auth.guard';
import { MassagesComponent } from './massages/massages.component';
import { MemberListComponent } from './member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import {Routes} from '@angular/router';
import { ListsComponent } from './lists/lists.component';

export const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', // here to create global guard to control all access
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        {path: 'members', component: MemberListComponent, canActivate: [AuthGuard]},
        {path: 'messages', component: MassagesComponent},
        {path: 'lists', component: ListsComponent},
    ]
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
