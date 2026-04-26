import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './error-page/error-page.component';


const routes: Routes = [
  { path:'', loadChildren: () => import('./login/login.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "home",
        loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "successful-partner",
        loadChildren: () => import("./home/sucessful-partner/sucessful-partner.module").then((m) => m.SucessfulPartnerModule),
      },
      {
        path: "operating_companies",
        loadChildren: () => import("./home/operating/operating.module").then((m) => m.OperatingModule),
      },
      {
        path: "our-clients",
        loadChildren: () => import("./home/clients/clients.module").then((m) => m.ClientsModule),
      },
      {
        path: "our-testimonial",
        loadChildren: () => import("./home/testimonial/testimonial.module").then((m) => m.TestimonialModule),
      },
      {
        path: "latest-news",
        loadChildren: () => import("./home/latest-news/latest-news.module").then((m) => m.LatestNewsModule),
      },
      {
        path: "header_link",
        loadChildren: () => import("./headers/headers.module").then((m) => m.HeadersModule),
      },
      {
        path: "banners",
        loadChildren: () => import("./banner/banner.module").then((m) => m.BannerModule),
      },
      {
        path: "who-we-are",
        loadChildren: () => import("./who-we-are/who-we-are.module").then((m) => m.WhoWeAreModule),
      },
      {
        path: "investment-strategy",
        loadChildren: () => import("./who-we-are/investment-strategy/investment-strategy.module").then((m) => m.InvestmentStrategyModule),
      },
      {
        path: "operating-companies",
        loadChildren: () => import("./operating-companies/operating-companies.module").then((m) => m.OperatingCompaniesModule),
      },
      {
        path: "board-of-director",
        loadChildren: () => import("./board-director/board-director.module").then((m) => m.BoardDirectorModule),
      },
      {
        path: "gcc-installation",
        loadChildren: () => import("./gcc-installation/gcc-installation.module").then((m) => m.GccInstallationModule),
      },
      {
        path: "gcc-images/:id",
        loadChildren: () => import("./gcc-installation/images-section/images-section.module").then((m) => m.ImagesSectionModule),
      },
      {
        path: "marketplace",
        loadChildren: () => import("./marketplace/marketplace.module").then((m) => m.MarketplaceModule),
      },
      {
        path: "projects",
        loadChildren: () => import("./projects/projects.module").then((m) => m.ProjectsModule),
      },
      {
        path: "project_details/:id",
        loadChildren: () => import("./projects/project-details/project-details.module").then((m) => m.ProjectDetailsModule),
      },
      {
        path: "contact-us",
        loadChildren: () => import("./contact-us/contact-us.module").then((m) => m.ContactUsModule),
      },
      {
        path: "career",
        loadChildren: () => import("./career/career.module").then((m) => m.CareerModule),
      },
      {
        path: "departments",
        loadChildren: () => import("./career/departments/departments.module").then((m) => m.DepartmentsModule),
      },
      {
        path: "footer",
        loadChildren: () => import("./footer/footer.module").then((m) => m.FooterModule),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
