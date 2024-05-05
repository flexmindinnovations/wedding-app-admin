import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
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
import { RegisterCustomerComponent } from "./modals/register-customer/register-customer.component";

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CustomLoaderComponent } from "./components/custom-loader/custom-loader.component";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";
import { StepsModule } from 'primeng/steps';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AddEditSubscriptionPlanComponent } from "./modals/add-edit-subscription-plan/add-edit-subscription-plan.component";



const modules: any = [
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CarouselModule,
    CheckboxModule,
    MessagesModule,
    MenuModule,
    MenubarModule,
    AvatarModule,
    DialogModule,
    PasswordModule,
    SplitterModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    SelectButtonModule,
    ToggleButtonModule,
    ScrollTopModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    BadgeModule,
    ImageModule,
    ToastModule,
    SidebarModule,
    DynamicDialogModule,
    FieldsetModule,
    TableModule,
    ToolbarModule,
    AnimateOnScrollModule,
    DividerModule,
    NgHttpLoaderModule.forRoot(),
    // for Router use:
    LoadingBarRouterModule,
    // for Core use:
    LoadingBarModule,
    StepsModule,
    StepperModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputSwitchModule
];

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
        AddEditUserComponent,
        RegisterCustomerComponent,
        CustomLoaderComponent,
        CheckboxComponent,
        AddEditSubscriptionPlanComponent
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
        LoadingBarModule,
        ...modules
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
        AddEditUserComponent,
        RegisterCustomerComponent,
        CustomLoaderComponent,
        CheckboxComponent,
        AddEditSubscriptionPlanComponent,
        ...modules
    ],
    providers: [
        MessageService,
        DialogService,
        DynamicDialogRef,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomHttpInterceptor,
            multi: true
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SharedModule { }