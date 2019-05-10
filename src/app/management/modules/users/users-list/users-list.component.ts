import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user.service';
import {PagedResponse} from '../../../../shared/models/payload/PagedResponse';
import {User} from '../../../../shared/models/user';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  switchValue = false;
  pageIndex = 1;
  pageSize = 17;
  total = 1;
  listOfData = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  searchGenderList: string[] = [];
  selected: string;
  pagedResponse: PagedResponse<User>;
  filterGender = [
    {text: 'male', value: 'male'},
    {text: 'female', value: 'female'}
  ];

  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.checkAll(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 !== 0));
        this.refreshStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 === 0));
        this.refreshStatus();
      }
    }
  ];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};

  clickSwitch(): void {
    if (!this.loading) {
      this.loading = true;
      setTimeout(() => {
        this.switchValue = !this.switchValue;
        this.loading = false;
      }, 3000);
    }
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }


  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolve: any) => {
      this.pagedResponse = resolve.data;
      this.total = this.pagedResponse.totalElements;
      this.pageIndex = 1;
      this.pageSize = this.pagedResponse.size;
      this.listOfData = this.pagedResponse.content;
      this.loading = false;
    });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const filter = {
      page: this.pageIndex - 1,
      size: this.pageSize
    };

    this.userService.getAll(filter).pipe(
      catchError((error: any) => {
        this.loading = false;
        return throwError(error);
      })
    ).subscribe((data: any) => {
        this.listOfData = data.content;
        this.total = data.totalElements;
        this.loading = false;
      },
    );
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.searchData(true);
  }

  userClicked(username: string) {
    this.selected = username;
    this.router.navigate(['management/users', username]);
  }
}
