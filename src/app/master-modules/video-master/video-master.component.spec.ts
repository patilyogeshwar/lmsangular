import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMasterComponent } from './video-master.component';

describe('VideoMasterComponent', () => {
  let component: VideoMasterComponent;
  let fixture: ComponentFixture<VideoMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoMasterComponent]
    });
    fixture = TestBed.createComponent(VideoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});
