import { NgModule } from "@angular/core";
import { ButtonComponent } from "./components/button/button.component";
import { DarkModeComponent } from "./components/dark-mode/dark-mode.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { HeaderComponent } from "./components/header/header.component";
import { LayoutComponent } from "./components/layout-deprecated/layout.component";
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
import { FormStepperComponent } from "./components/form-stepper/form-stepper.component";
import { ImagePickerComponent } from "./components/image-picker/image-picker.component";
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AddEditHeightComponent } from "./modals/add-edit-height/add-edit-height.component";
import { GridCellStatusComponent } from "./components/grid-cell-status/grid-cell-status.component";

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
        DataGridComponent,
        FormStepperComponent,
        ImagePickerComponent,
        SidebarComponent,
        HeaderComponent,
        AddEditHeightComponent,
        GridCellStatusComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        AgGridAngular,
        LoadingBarHttpClientModule,
        // for Router use:
        LoadingBarRouterModule,
        // for Core use:
        LoadingBarModule
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
        DataGridComponent,
        InputComponent,
        FormStepperComponent,
        ImagePickerComponent,
        SidebarComponent,
        HeaderComponent,
        LoadingBarHttpClientModule,
        // for Router use:
        LoadingBarRouterModule,
        // for Core use:
        LoadingBarModule,
        AddEditHeightComponent,
        GridCellStatusComponent,
    ],
    providers: []
})

export class SharedModule { }