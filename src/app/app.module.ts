import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { FuseSampleModule } from './main/content/sample/sample.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContactLoginComponent } from './main/content/login/contact-login.component';
import { MessageDialogComponent } from './main/content/message-box/message.component';

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'login'
    },
	{   path: '', 
	    redirectTo: 'login', 
        pathMatch: 'full' },
    {   path: 'sample', 
	    redirectTo: 'sample'},
    {   path: 'login', 
	    component: ContactLoginComponent}
];

@NgModule({
    declarations: [
        AppComponent,
		ContactLoginComponent,
		MessageDialogComponent
    ],
    imports     : [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        FuseSampleModule
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService
    ],
    bootstrap   : [
        AppComponent
    ],
	entryComponents: [MessageDialogComponent]
})
export class AppModule
{
}
