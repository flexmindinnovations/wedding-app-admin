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
import { ThemeDropdownComponent } from "./components/theme-dropdown/theme-dropdown.component";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridAngular } from "ag-grid-angular";
// import { AgGridModule } from 'ag-grid-angular-legacy';
import { GridButtonsComponent } from "./components/grid-buttons/grid-buttons.component";
import { DataGridComponent } from "./components/data-grid/data-grid.component";

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        LayoutComponent,
        HeaderComponent,
        ThemeDropdownComponent,
        UserMenuComponent,
        SearchComponent,
        DarkModeComponent,
        SearchModalComponent,
        DropdownComponent,
        ButtonComponent,
        InputComponent,
        GridButtonsComponent,
        DataGridComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        AgGridAngular,
        // AgGridModule.withComponents([ButtonRendererComponent])
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ButtonComponent,
        DropdownComponent,
        InputComponent,
        CommonModule,
        HttpClientModule,
        IonicModule,
        AgGridAngular,
        // AgGridModule,
        GridButtonsComponent,
        DataGridComponent
    ],
    providers: []
})

export class SharedModule { }