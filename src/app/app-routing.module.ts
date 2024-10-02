import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {FormCardsComponent} from "./features/form-cards/form-cards.component";

const routes: Routes = [
  {
    path: '',
    component: FormCardsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
