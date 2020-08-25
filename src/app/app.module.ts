import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import {MatNativeDateModule, MatTableModule, MatSortModule, MatCheckboxModule} from '@angular/material';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';

import { AngularFireAuthModule } from 'angularfire2/auth';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CustomMaterialModule } from './material.module';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { AuthGuard } from './auth.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Ng2Timeline } from 'ng2-timeline';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { environment } from 'environments/environment';
import {DobDirective} from './mask';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';
import { VideosComponent } from './videos/videos.component';

export const settings = {timestampsInSnapshots: true};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    CustomMaterialModule,
    RouterModule,
    AppRoutingModule,
    AngularFireAuthModule,     
    MatDialogModule,        
    MatNativeDateModule,  
    MatAutocompleteModule,   
    MatTableModule,   
    MatSortModule,
    MatDatepickerModule,
    AngularFireModule.initializeApp(environment),
    AngularFirestoreModule,
    AngularFireStorageModule,
    Ng2Timeline,
    NgxSpinnerModule,
    MatCheckboxModule,
    NgxImageZoomModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginLayoutComponent,
    DobDirective,
    HomeComponent,
    HomeLayoutComponent,
    NewsComponent,
    AboutComponent,
    EventsComponent,
    VideosComponent,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private af : AngularFirestore){
    af.firestore.settings(settings);
  }
}
