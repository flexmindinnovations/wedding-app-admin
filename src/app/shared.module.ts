import { NgModule } from "@angular/core";
import { ButtonComponent } from "./components/button/button.component";
import { DarkModeComponent } from "./components/dark-mode/dark-mode.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { HeaderComponent } from "./components/header/header.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { SearchComponent } from "./components/search/search.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { UserMenuComponent } from "./components/user-menu/user-menu.component";
import { SearchModalComponent } from "./modals/search-modal/search-modal.component";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        LayoutComponent,
        HeaderComponent,
        DropdownComponent,
        UserMenuComponent,
        SearchComponent,
        DarkModeComponent,
        SearchModalComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        IonicModule
    ],
    exports: [],
    providers: []
})

export class SharedModule { }