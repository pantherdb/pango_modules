import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PangoSharedModule } from '@pango/shared.module';
import { AppsModule } from './../apps/apps.module';
import { AboutComponent } from './about/about.component';
import { PangoFooterModule } from 'app/layout/components/footer/footer.module';
import { ContactComponent } from './contact/contact.component';
import { PangoConfirmDialogModule } from '@pango/components/confirm-dialog/confirm-dialog.module';
import { HomeComponent } from './home/home.component';

const routes = [{
  path: '',
  title: 'Home: Annotations',
  component: HomeComponent
}, {
  path: 'contact', component: ContactComponent
}, {
  path: 'about', component: AboutComponent
}];

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    PangoSharedModule,
    PangoFooterModule,
    PangoConfirmDialogModule,
    AppsModule
  ],
  providers: [
  ]
})

export class PagesModule {
}
