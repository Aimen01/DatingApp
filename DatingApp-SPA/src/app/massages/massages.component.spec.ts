/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MassagesComponent } from './massages.component';

describe('MassagesComponent', () => {
  let component: MassagesComponent;
  let fixture: ComponentFixture<MassagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
