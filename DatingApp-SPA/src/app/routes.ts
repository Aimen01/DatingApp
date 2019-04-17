import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { AuthGuard } from './_guards/auth.guard';
import { MassagesComponent } from './massages/massages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import { Routes, CanActivate, CanDeactivate } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { PreventUnsavedChange } from './_guards/prevent_unsaved_change.guard';
import { ListsResolver } from './_resolvers/lists.resolver';

export const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', // here to create global guard to control all access
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        { path: 'members', component: MemberListComponent, canActivate: [AuthGuard],
            resolve: { users: MemberListResolver }},
        {path: 'members/:id', component: MemberDetailComponent,
            resolve: { user: MemberDetailResolver } },
        { path: 'member/edit', component: MemberEditComponent,
        resolve: { user: MemberEditResolver}, canDeactivate:[PreventUnsavedChange]},
        { path: 'messages', component: MassagesComponent },
        { path: 'lists', component: ListsComponent, resolve: {users: ListsResolver}},
    ]
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
