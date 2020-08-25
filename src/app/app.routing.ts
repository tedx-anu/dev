import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './auth.service';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';

const routes: Routes =[
{
  path: '',
  component: HomeLayoutComponent,
  children: [
    {
      path: '',
      component: HomeComponent
    },{
      path: 'home',
      component: HomeComponent
    },{
      path: 'news',
      component: NewsComponent
    },{
      path: 'events',
      component: EventsComponent
    },{
      path: 'about',
      component: AboutComponent
    }
  ]
},
{
  path: '',
  component: AdminLayoutComponent,
  children: [
    {
      path: '**',
      redirectTo: ''
    }
  ]
},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
