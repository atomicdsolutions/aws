import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UsagePlanComponent } from './components/usage-plan/usage-plan.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavComponent } from './utilities/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { ClientComponent } from './components/client/client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './modules/material.module';

@NgModule({
  declarations: [
    AppComponent,
    UsagePlanComponent,
    ClientListComponent,
    DashboardComponent,
    NavComponent,
    HomeComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
