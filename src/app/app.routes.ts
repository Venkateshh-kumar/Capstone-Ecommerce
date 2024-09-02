import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './products/products.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component'; 
import { OrderComponent } from './order/order.component';
import { AdminGuard } from './admin.guard';
import { ProfileComponent } from './profile/profile.component';


export const routes: Routes = [
  // { path: '**', redirectTo: '', pathMatch: 'full'},
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductComponent , canActivate: [AdminGuard]},
  { path: 'contactus', component: ContactusComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'order', component: OrderComponent },
  { path: 'profile', component: ProfileComponent },
];