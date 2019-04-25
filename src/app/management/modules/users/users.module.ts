import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UsersListComponent} from './users-list/users-list.component';
import {UsersDetailComponent} from './users-detail/users-detail.component';
import {UsersInsertNewComponent} from './users-insert-new/users-insert-new.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UsersDetailComponent,
    UsersInsertNewComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgZorroAntdModule,
    TranslateModule
  ]
})
export class UsersModule {
}
