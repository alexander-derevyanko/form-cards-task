import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {CardComponent} from "./components/card/card.component";
import {HeaderComponent} from "./components/header/header.component";

export const FormCardsImports = [
  NgClass,
  CardComponent,
  ReactiveFormsModule,
  NgForOf,
  DatePipe,
  HeaderComponent
];
