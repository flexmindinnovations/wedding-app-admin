import { NgModule } from "@angular/core";
import { ButtonComponent } from "./components/button/button.component";
import { DarkModeComponent } from "./components/dark-mode/dark-mode.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { HeaderComponent } from "./components/header/header.component";
import { SearchComponent } from "./components/search/search.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { UserMenuComponent } from "./components/user-menu/user-menu.component";
import { SearchModalComponent } from "./modals/search-modal/search-modal.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { ThemeDropdownComponent } from "./components/theme-dropdown/theme-dropdown.component";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridAngular } from "ag-grid-angular";
import { GridButtonsComponent } from "./components/grid-buttons/grid-buttons.component";
import { DataGridComponent } from "./components/data-grid/data-grid.component";
import { FormStepperComponent } from "./components/form-stepper/form-stepper.component";
import { ImagePickerComponent } from "./components/image-picker/image-picker.component";
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgHttpLoaderModule } from "ng-http-loader";
import { AddEditHeightComponent } from "./modals/add-edit-height/add-edit-height.component";
import { GridCellStatusComponent } from "./components/grid-cell-status/grid-cell-status.component";
import { MasterDataComponent } from "./components/master-data/master-data.component";
import { AddEditRoleComponent } from "./modals/add-edit-role/add-edit-role.component";
import { AddEditEducationComponent } from "./modals/add-edit-education/add-edit-education.component";
import { AlertComponent } from "./components/alert/alert.component";
import { DeleteConfirmComponent } from "./modals/delete-confirm/delete-confirm.component";
import { TimePickerComponent } from "./components/time-picker/time-picker.component";
import { AddEditCastComponent } from "./modals/add-edit-cast/add-edit-cast.component";
import { AddEditHandycapComponent } from "./modals/add-edit-handycap/add-edit-handycap.component";
import { AddEditUserComponent } from "./modals/add-edit-user/add-edit-user.component";
import { CustomHttpInterceptor } from "./interceptors/http.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
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
        MasterDataComponent,
        AddEditRoleComponent,
        AddEditEducationComponent,
        AddEditCastComponent,
        AlertComponent,
        DeleteConfirmComponent,
        TimePickerComponent,
        AddEditHandycapComponent,
        AddEditUserComponent
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
        // LoadingBarHttpClientModule,
        NgHttpLoaderModule.forRoot(),
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
        // LoadingBarHttpClientModule,
        // for Router use:
        LoadingBarRouterModule,
        // for Core use:
        LoadingBarModule,
        AddEditHeightComponent,
        GridCellStatusComponent,
        MasterDataComponent,
        AddEditRoleComponent,
        AddEditEducationComponent,
        AddEditCastComponent,
        AlertComponent,
        DeleteConfirmComponent,
        TimePickerComponent,
        AddEditHandycapComponent,
        AddEditUserComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomHttpInterceptor,
            multi: true
        }
    ]
})

export class SharedModule { }