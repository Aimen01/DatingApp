import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()

export class PreventUnsavedChange implements CanDeactivate<MemberEditComponent> {

canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
       return confirm('do you want to continue?');
    }
    return true;
}
}
